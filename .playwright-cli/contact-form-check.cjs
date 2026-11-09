// eslint-disable-next-line @typescript-eslint/no-unused-expressions -- Playwright CLI evaluates this function.
async page => {
  // Contact form check (issue #22). The form lives in a modal opened by "Write a message".
  // Run against `pnpm dev -p 3123` (or `next start -p 3123`) started with Cloudflare's
  // always-pass Turnstile test keys and CONTACT_TO_EMAIL=delivered@resend.dev.
  // Scenario 2 reports UNVERIFIED, not PASS, when the send fails: that is expected when the dev
  // server has no RESEND_API_KEY. With a key set, UNVERIFIED means the send failed.
  // Run: playwright-cli -s=contact open, then
  //      playwright-cli -s=contact run-code --filename=.playwright-cli/contact-form-check.cjs
  const BASE = "http://localhost:3123";
  const VISITOR = "check@example.com";
  const assert = (ok, message) => { if (!ok) throw new Error(message); };
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  const results = [];

  const openScene = async reducedMotion => {
    await page.emulateMedia({ reducedMotion });
    await page.setViewportSize({ width: 1440, height: 1000 });
    // Leave first: a goto that only changes the hash would keep the previous scenario's state.
    await page.goto("about:blank");
    await page.goto(`${BASE}/#contact`);
    const opener = page.getByRole("button", { name: "Write a message", exact: true });
    await opener.click();
    const form = page.getByRole("dialog", { name: "Write a message" }).getByRole("form", { name: "Contact form", exact: true });
    await form.waitFor();
    return form;
  };

  const run = async (name, scenario) => {
    errors.length = 0;
    try {
      const outcome = await scenario();
      assert(errors.length === 0, `Console errors: ${errors.join(" | ")}`);
      results.push(`${name}: ${outcome ?? "PASS"}`);
    } catch (error) {
      results.push(`${name}: FAIL - ${error.message}`);
    }
  };

  await run("1 empty submit", async () => {
    const form = await openScene("reduce");
    await form.getByRole("button", { name: "Send", exact: true }).click();
    const name = form.getByRole("textbox", { name: "Name", exact: true });
    await page.waitForFunction(() => document.activeElement?.getAttribute("name") === "name", null, { timeout: 5000 }).catch(() => {});
    const focused = await page.evaluate(() => document.activeElement?.getAttribute("name"));
    assert(focused === "name", `Focus must land on Name, got ${focused}`);
    assert(await name.getAttribute("aria-invalid") === "true", "Name must be aria-invalid");
    for (const copy of ["Add your name.", "Enter an email I can reply to.", "Write a message."]) {
      assert(await form.getByText(copy, { exact: true }).isVisible(), `Missing error: ${copy}`);
    }
  });

  await run("2 valid send", async () => {
    const form = await openScene("no-preference");
    // The native radio is visually hidden: a visitor clicks the chip label.
    await form.locator("label").filter({ hasText: /^Project$/ }).click();
    assert(await form.getByRole("radio", { name: "Project", exact: true }).isChecked(), "Project chip must check its radio");
    await form.getByRole("textbox", { name: "Name", exact: true }).fill("Contact Check");
    await form.getByRole("textbox", { name: "Email", exact: true }).fill(VISITOR);
    await form.getByRole("textbox", { name: "Message", exact: true }).fill("Playwright contact form check. Safe to ignore.");
    // The server drops anything submitted under 3s after render as a bot.
    await page.waitForTimeout(3200);
    await page.waitForFunction(() => {
      const token = document.querySelector('form[aria-label="Contact form"] input[name="cf-turnstile-response"]');
      return Boolean(token?.value);
    }, null, { timeout: 15000 });
    await form.getByRole("button", { name: "Send", exact: true }).click();
    const status = form.locator('p[tabindex="-1"]').filter({ hasText: `Sent · I'll reply to ${VISITOR}` });
    const alert = form.getByRole("alert");
    await Promise.race([status.waitFor({ timeout: 20000 }), alert.waitFor({ timeout: 20000 })]);
    if (await alert.isVisible()) {
      const text = await alert.innerText();
      assert(text.includes("Couldn't send"), `Unexpected alert: ${text}`);
      return "UNVERIFIED - the send failed (expected with no RESEND_API_KEY on the dev server)";
    }
    assert(await status.isVisible(), "Sent status line must be visible");
    assert(await status.evaluate(el => el === document.activeElement), "Sent status line must have focus");
  });

  await run("3 keyboard", async () => {
    const form = await openScene("reduce");
    await page.keyboard.press("Escape");
    // Start from the last tab stop before the scene, then Tab through it.
    await page.evaluate(() => {
      const scene = document.getElementById("contact");
      const tabbable = [...document.querySelectorAll("a[href], button, input, textarea, select, [tabindex]")]
        .filter(el => el.tabIndex >= 0 && !el.disabled && el.getClientRects().length > 0);
      const before = tabbable.filter(el => !scene.contains(el) && (el.compareDocumentPosition(scene) & Node.DOCUMENT_POSITION_FOLLOWING));
      before.at(-1).focus();
    });
    const tabThrough = async within => {
      const visited = [];
      for (let i = 0; i < 40; i++) {
        await page.keyboard.press("Tab");
        const stop = await page.evaluate(selector => {
          const el = document.activeElement;
          const scope = document.querySelector(selector);
          if (!el || !scope?.contains(el) || (selector === "#contact" && el.closest("dialog"))) return null;
          // A visually hidden radio draws its outline on the chip label around it.
          const target = el.type === "radio" ? el.closest("label") : el;
          const style = getComputedStyle(target);
          return {
            label: [el.tagName.toLowerCase(), el.getAttribute("href"), el.getAttribute("aria-label") || el.textContent.trim() || el.name || el.type].filter(Boolean).join(" "),
            outline: style.outlineStyle !== "none" && parseFloat(style.outlineWidth) > 0,
          };
        }, within);
        // A modal dialog wraps focus: stop once a stop repeats.
        if (!stop || visited.includes(stop.label)) break;
        visited.push(stop.label);
        assert(stop.outline, `No focus outline on: ${stop.label}`);
      }
      return visited;
    };
    const sceneStops = await tabThrough("#contact");
    for (const expected of ["Write a message", "mailto", "LinkedIn", "GitHub", "Resume"]) {
      assert(sceneStops.some(label => label.includes(expected)), `Tab never reached ${expected}. Visited: ${sceneStops.join(", ")}`);
    }
    assert(!sceneStops.some(label => label.includes("Copy")), "No copy-email control in the scene");
    const opener = page.getByRole("button", { name: "Write a message", exact: true });
    await opener.focus();
    await page.keyboard.press("Enter");
    const first = await page.evaluate(() => document.activeElement?.closest("dialog[open]") ? document.activeElement.textContent.trim() : null);
    assert(first === "Close", `Opening must move focus into the dialog, onto Close; got ${first}`);
    const dialogStops = await tabThrough("dialog[open]");
    for (const expected of ["input reason", "input name", "input email", "textarea", "Send"]) {
      assert(dialogStops.some(label => label.includes(expected)), `Tab never reached ${expected} in the dialog. Visited: ${dialogStops.join(", ")}`);
    }
    const hiring = form.getByRole("radio", { name: "Hiring", exact: true });
    await hiring.focus();
    await page.keyboard.press("ArrowRight");
    const moved = await page.evaluate(() => document.activeElement?.value);
    assert(moved === "Project", `ArrowRight must move from Hiring to Project, got ${moved}`);
    assert(await form.getByRole("radio", { name: "Project", exact: true }).isChecked(), "Arrowed radio must be checked");
    await page.keyboard.press("ArrowLeft");
    assert(await page.evaluate(() => document.activeElement?.value) === "Hiring", "ArrowLeft must move back to Hiring");
  });

  await run("4 submit before token, then retry", async () => {
    // Hold the Turnstile script back so Send is pressed before any token exists.
    const TURNSTILE_SCRIPT = "**/turnstile/v0/api.js*";
    await page.route(TURNSTILE_SCRIPT, async route => {
      await page.waitForTimeout(5000);
      await route.continue();
    });
    try {
      const form = await openScene("reduce");
      await form.getByRole("textbox", { name: "Name", exact: true }).fill("Contact Check");
      await form.getByRole("textbox", { name: "Email", exact: true }).fill(VISITOR);
      await form.getByRole("textbox", { name: "Message", exact: true }).fill("Playwright contact form check. Safe to ignore.");
      await page.waitForTimeout(3200);
      const tokenEmpty = await page.evaluate(() => !document.querySelector('form[aria-label="Contact form"] input[name="cf-turnstile-response"]')?.value);
      assert(tokenEmpty, "Precondition: no token yet when Send is pressed");
      await form.getByRole("button", { name: "Send", exact: true }).click();
      const verifyingShown = await form.getByRole("button", { name: "Verifying", exact: true }).isVisible();
      const verifyingAnnounced = await form.getByRole("status").filter({ hasText: "Verifying you're human" }).count() === 1;

      const settle = async () => {
        const status = form.locator('p[tabindex="-1"]').filter({ hasText: "Sent ·" });
        const alert = form.getByRole("alert");
        await Promise.race([status.waitFor({ timeout: 20000 }), alert.waitFor({ timeout: 20000 })]);
        if (await alert.isVisible()) {
          const text = await alert.innerText();
          assert(!text.includes("Couldn't confirm you're human"), `Posted without a token: ${text}`);
          return text;
        }
        return "sent";
      };
      const first = await settle();
      assert(verifyingShown, "Send must show Verifying while it waits for the token");
      assert(verifyingAnnounced, "Waiting must be announced in a status region");
      if (first === "sent") return "PASS (sent, retry not exercised)";
      // Retry at once: the widget has just reset, so there is no token yet.
      const send = form.getByRole("button", { name: "Send", exact: true });
      await send.click();
      // The old alert stays up while the retry runs: wait for Send to come back before reading it.
      await send.waitFor({ state: "detached", timeout: 2000 }).catch(() => {});
      await send.waitFor({ timeout: 20000 });
      await page.waitForTimeout(1000);
      await settle();
    } finally {
      await page.unroute(TURNSTILE_SCRIPT);
    }
  });

  await run("5 Escape closes, focus returns, draft survives", async () => {
    const form = await openScene("reduce");
    const dialog = page.getByRole("dialog", { name: "Write a message" });
    await form.getByRole("textbox", { name: "Name", exact: true }).fill("Draft Check");
    await page.keyboard.press("Escape");
    await dialog.waitFor({ state: "hidden", timeout: 2000 }).catch(() => {});
    assert(!(await dialog.isVisible()), "Escape must close the dialog");
    const focused = await page.evaluate(() => {
      const el = document.activeElement;
      return el === document.body ? "<body>" : `${el?.tagName.toLowerCase()} ${el?.textContent.trim().slice(0, 40)}`;
    });
    assert(focused === "button Write a message", `Focus must return to the opener, got ${focused}`);
    await page.getByRole("button", { name: "Write a message", exact: true }).click();
    const name = await form.getByRole("textbox", { name: "Name", exact: true }).inputValue();
    assert(name === "Draft Check", `Draft must survive close and reopen, got "${name}"`);
    await dialog.getByRole("button", { name: "Close", exact: true }).click();
    assert(!(await dialog.isVisible()), "Close must close the dialog");
  });

  if (results.some(line => line.includes(": FAIL"))) throw new Error(results.join("\n"));
  return results.join("\n");
}
