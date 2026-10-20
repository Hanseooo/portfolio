// eslint-disable-next-line @typescript-eslint/no-unused-expressions -- Playwright CLI expects a function expression.
async page => {
  const BASE = "http://localhost:3123";
  const NAME = "Resume (PDF, opens in new tab)";
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  const results = [];

  const clickOpensPdf = async (link, label) => {
    assert(await link.getAttribute("href") === "/AMOGUIS_RESUME.pdf", `${label}: href`);
    assert(await link.getAttribute("target") === "_blank", `${label}: target`);
    const before = page.url();
    const [popup, request] = await Promise.all([
      page.context().waitForEvent("page"),
      page.context().waitForEvent("request", (r) => r.url().endsWith("/AMOGUIS_RESUME.pdf")),
      link.click(),
    ]);
    assert(popup !== page, `${label}: opened in a new tab`);
    assert((await request.response())?.status() === 200, `${label}: pdf status`);
    await popup.close().catch(() => {});
    await page.waitForTimeout(800);
    assert(page.url() === before, `${label}: original tab navigated to ${page.url()}`);
    results.push(`${label}: PASS`);
  };

  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(`${BASE}/`);
  await page.waitForTimeout(2500);

  const navLinks = page.getByRole("navigation", { name: "Site navigation" }).getByRole("link", { name: NAME });
  assert(await navLinks.count() === 1, "desktop nav: one resume link");
  await clickOpensPdf(navLinks, "desktop nav");

  const heroLink = page.locator(`main a[aria-label="${NAME}"]`).first();
  await clickOpensPdf(heroLink, "hero action");
  await page.screenshot({ path: ".playwright-cli/r6-hero-1440.png" });

  await page.locator("#contact").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  const contactLink = page.locator(`#contact a[aria-label="${NAME}"]`);
  assert(await contactLink.count() === 1, "contact: one resume channel");
  await clickOpensPdf(contactLink, "contact channel");
  await page.locator("#contact").screenshot({ path: ".playwright-cli/r6-contact-1440.png" });

  for (const width of [375, 640, 768]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`${BASE}/`);
    await page.waitForTimeout(2000);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    assert(overflow <= 0, `${width}px: horizontal overflow ${overflow}px`);
    await page.screenshot({ path: `.playwright-cli/r6-hero-${width}.png`, fullPage: false });
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(400);
    await page.screenshot({ path: `.playwright-cli/r6-hero-actions-${width}.png` });
    results.push(`${width}px no overflow: PASS`);
  }

  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto(`${BASE}/projects`);
  await page.waitForTimeout(2000);
  await page.getByRole("button", { name: "Open menu" }).click();
  const menu = page.getByRole("dialog", { name: "Navigation menu" });
  await menu.waitFor();
  const menuItems = await menu.getByRole("list").first().getByRole("link").allInnerTexts();
  assert(menuItems[menuItems.length - 1].trim().toLowerCase() === "resume", `mobile menu: resume last, got ${menuItems.join("|")}`);
  await page.screenshot({ path: ".playwright-cli/r6-menu-375.png" });
  await clickOpensPdf(menu.getByRole("link", { name: NAME }), "mobile menu");
  assert(await menu.count() === 0, "mobile menu: closes after opening resume");

  assert(errors.length === 0, `console errors: ${errors.join(" | ")}`);
  return results.join("\n") + "\nconsole: clean";
}
