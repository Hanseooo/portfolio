// eslint-disable-next-line @typescript-eslint/no-unused-expressions -- Playwright CLI expects a function expression.
async page => {
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  const errors = [];
  const onError = (error) => errors.push(error.message);
  const onConsole = (message) => { if (message.type() === "error") errors.push(message.text()); };
  page.on("pageerror", onError);
  page.on("console", onConsole);
  try {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("http://localhost:3000/#stack");
    await page.waitForTimeout(1600);
    await page.locator("#stack").scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    assert((await page.locator(".hp-stage-marker").innerText()).replace(/\s+/g, " ") === "03 Tech Stack", "Compact marker must identify Stack 03");
    await page.goto("http://localhost:3000/certificates/python-essentials-1");
    assert(await page.title() === "Python Essentials 1 | Hans Amoguis", "Certificate browser title must include owner once");
    assert(await page.locator('meta[property="og:title"]').getAttribute("content") === "Python Essentials 1 | Hans Amoguis", "Certificate OG metadata must keep owner");
    assert(await page.locator('meta[name="twitter:title"]').getAttribute("content") === "Python Essentials 1 | Hans Amoguis", "Certificate Twitter metadata must keep owner");

    const context = await page.context().browser().newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true, reducedMotion: "no-preference" });
    try {
      const mobile = await context.newPage();
      mobile.on("pageerror", onError);
      mobile.on("console", onConsole);
      await mobile.goto("http://localhost:3000/");
      await mobile.waitForTimeout(1500);
      assert(await mobile.locator("#stack-heading").count() === 1 && (await mobile.locator("#stack").innerText()).includes("03 · TECH STACK"), "Mobile must retain numbered Stack heading");
      await mobile.getByRole("button", { name: "Open menu", exact: true }).click();
      await mobile.keyboard.press("Escape");
      await mobile.waitForTimeout(300);
      assert(await mobile.evaluate(() => document.activeElement.getAttribute("aria-label") === "Open menu"), "Escape must restore the menu trigger");
      await mobile.getByRole("button", { name: "Open menu", exact: true }).click();
      await mobile.getByRole("dialog", { name: "Navigation menu" }).getByRole("button", { name: "Close menu", exact: true }).click();
      await mobile.waitForTimeout(300);
      assert(await mobile.evaluate(() => document.activeElement.getAttribute("aria-label") === "Open menu"), "Dismiss must restore the menu trigger");
      await mobile.getByRole("button", { name: "Open menu", exact: true }).click();
      await mobile.getByRole("button", { name: "Go to section 03 Tech Stack", exact: true }).click();
      await mobile.waitForTimeout(700);
      const destination = await mobile.evaluate(() => ({ hash: location.hash, id: document.activeElement.id, tag: document.activeElement.tagName, name: document.activeElement.getAttribute("aria-label") }));
      assert(destination.hash === "#stack" && destination.id === "stack", `Mobile menu Stack action must update fragment and focus: ${JSON.stringify(destination)}`);
      await mobile.locator("#presence").scrollIntoViewIfNeeded();
      await mobile.locator(".hm-grid").waitFor();
      const cell = mobile.locator('.hm-grid [data-date]').first();
      await cell.tap();
      await mobile.getByRole("tooltip").waitFor();
      assert(await mobile.getByRole("tooltip").count() === 1, "Touch must show one shared contribution tooltip");
      await mobile.screenshot({ path: ".playwright-cli/fixes-tooltip-touch.png" });
      await mobile.locator(".github-heatmap figcaption").tap();
      await mobile.getByRole("tooltip").waitFor({ state: "hidden" });
    } finally { await context.close(); }
    assert(errors.length === 0, `Browser errors: ${errors.join("\n")}`);
    return "PASS: compact Stack marker, mobile numbered heading/menu anchor/focus, touch tooltip open/outside dismissal, certificate browser/OG/Twitter titles, clean console";
  } finally {
    page.off("pageerror", onError);
    page.off("console", onConsole);
  }
}
