// eslint-disable-next-line @typescript-eslint/no-unused-expressions -- Playwright CLI expects a function expression.
async page => {
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.addInitScript(() => {
    window.revealCompletions = [];
    window.addEventListener("portfolio:reveal-complete", (event) => window.revealCompletions.push(event.detail.revealId));
  });
  await page.goto("http://localhost:3123/");
  await page.locator('div[aria-hidden="true"][class*="z-[10000]"]').waitFor({ state: "hidden" });

  // Section order and removed scene
  const order = await page.evaluate(() => [...document.querySelectorAll("main section[id]")].map((s) => s.id).filter((id) => ["identity", "flagships", "stack", "experience", "more-work", "presence", "contact"].includes(id)));
  assert(JSON.stringify(order) === JSON.stringify(["identity", "flagships", "stack", "experience", "presence", "contact"]), `Wrong section order: ${order}`);
  assert(await page.locator("#more-work").count() === 0, "#more-work must no longer exist");

  // View All Projects is the last element of Selected Work
  const lastLink = await page.locator("#flagships a").last().evaluate((a) => ({ href: a.getAttribute("href"), text: a.textContent.replace(/\s+/g, " ").trim() }));
  assert(lastLink.href === "/projects" && /View All\s*Projects/i.test(lastLink.text), `Last Selected Work link: ${JSON.stringify(lastLink)}`);

  // Live Activity above About inside Presence
  const presence = await page.locator("#presence").evaluate((section) => {
    const providers = section.querySelector('[data-motion-target="presence-providers"]');
    const about = [...section.querySelectorAll("h3")].find((h) => h.textContent.trim() === "About");
    return Boolean(providers && about && (providers.compareDocumentPosition(about) & Node.DOCUMENT_POSITION_FOLLOWING));
  });
  assert(presence, "GitHub band must render above the About heading");

  // Chapter rail: six entries, active marker follows scroll (rail shows at wide desktop)
  await page.setViewportSize({ width: 1920, height: 1000 });
  const nav = page.getByRole("navigation", { name: "Homepage sections", exact: true });
  const chapters = ["01 Identity", "02 Selected Work", "03 Capabilities", "04 Experience", "05 Presence", "06 Contact"];
  assert(await nav.getByRole("button").count() === 6, `Chapter rail must have six entries, has ${await nav.getByRole("button").count()}`);
  for (const chapter of chapters) {
    await nav.getByRole("button", { name: `Go to section ${chapter}`, exact: true }).click();
    await page.waitForTimeout(1100);
    assert(await nav.getByRole("button", { name: `Go to section ${chapter}`, exact: true }).getAttribute("aria-current") === "true", `Wrong active chapter: ${chapter}`);
  }

  // Reveals inside Presence still fire
  await page.locator("#presence").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  const completions = await page.evaluate(() => window.revealCompletions);
  assert(completions.includes("presence-static"), `presence-static reveal did not fire: ${completions}`);

  // Fragments still resolve
  for (const id of ["flagships", "stack", "presence"]) assert(await page.locator(`#${id}`).count() === 1, `#${id} must resolve`);

  assert(errors.length === 0, `Console errors: ${errors.join(" | ")}`);
  console.log(JSON.stringify({ order, lastLink, completions }));
}
