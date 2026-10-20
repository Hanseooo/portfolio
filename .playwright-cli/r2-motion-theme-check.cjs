// R2-5: no pulse under reduced motion. Plus dark-mode screenshot of the presence scene.
async (page) => {
  await page.unrouteAll({ behavior: "ignoreErrors" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  let release; const gate = new Promise((r) => (release = r));
  await page.route("**/api/activity/**", async (route) => { await gate; await route.continue(); });
  await page.goto("http://localhost:3123/", { waitUntil: "domcontentloaded" });
  await page.locator("#provider-github").scrollIntoViewIfNeeded();
  await page.waitForSelector("#provider-github article[aria-busy=true]");
  const reduced = await page.$eval("#provider-github article", (el) => getComputedStyle(el).animationName);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const normal = await page.$eval("#provider-github article", (el) => getComputedStyle(el).animationName);
  release(); await page.unrouteAll({ behavior: "ignoreErrors" });
  await page.waitForSelector("#provider-github article:not([aria-busy])");
  await page.evaluate(() => { document.documentElement.classList.add("dark"); });
  await page.waitForTimeout(600);
  await page.locator("#provider-github").screenshot({ path: ".playwright-cli/r2-presence-dark.png" });
  await page.evaluate(() => { document.documentElement.classList.remove("dark"); });
  await page.waitForTimeout(600);
  await page.locator("#provider-discord").screenshot({ path: ".playwright-cli/r2-discord-light.png" });
  return JSON.stringify({ reduced, normal });
}
