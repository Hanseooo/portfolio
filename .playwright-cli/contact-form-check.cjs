// eslint-disable-next-line @typescript-eslint/no-unused-expressions -- Playwright CLI evaluates this function.
async page => {
  // Contact form check (issue #22). Run against `pnpm dev -p 3123` started with Cloudflare's
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
    const form = page.getByRole("form", { name: "Contact form", exact: true });
    await form.scrollIntoViewIfNeeded();
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
    // Start from the last tab stop before the scene, then Tab through it.
    await page.evaluate(() => {
      const scene = document.getElementById("contact");
      const tabbable = [...document.querySelectorAll("a[href], button, input, textarea, select, [tabindex]")]
        .filter(el => el.tabIndex >= 0 && !el.disabled && el.getClientRects().length > 0);
      const before = tabbable.filter(el => !scene.contains(el) && (el.compareDocumentPosition(scene) & Node.DOCUMENT_POSITION_FOLLOWING));
      before.at(-1).focus();
    });
    const visited = [];
    for (let i = 0; i < 40; i++) {
      await page.keyboard.press("Tab");
      const stop = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || !document.getElementById("contact").contains(el)) return null;
        // A visually hidden radio draws its outline on the chip label around it.
        const target = el.type === "radio" ? el.closest("label") : el;
        const style = getComputedStyle(target);
        return {
          label: [el.tagName.toLowerCase(), el.getAttribute("href"), el.getAttribute("aria-label") || el.textContent.trim() || el.name || el.type].filter(Boolean).join(" "),
          outline: style.outlineStyle !== "none" && parseFloat(style.outlineWidth) > 0,
        };
      });
      if (!stop) break;
      visited.push(stop.label);
      assert(stop.outline, `No focus outline on: ${stop.label}`);
    }
    for (const expected of ["mailto", "Copy", "LinkedIn", "GitHub", "Resume", "input reason", "input name", "input email", "textarea", "Send"]) {
      assert(visited.some(label => label.includes(expected)), `Tab never reached ${expected}. Visited: ${visited.join(", ")}`);
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

  if (results.some(line => line.includes(": FAIL"))) throw new Error(results.join("\n"));
  return results.join("\n");
}
