// R2-5: skeleton height vs loaded height for every live region, at three widths.
async (page) => {
  await page.unrouteAll({ behavior: "ignoreErrors" });
  const ids = ["github-calendar", "github", "discord"];
  const out = [];
  for (const [w, h] of [[1440, 900], [768, 1024], [375, 812]]) {
    await page.setViewportSize({ width: w, height: h });
    let release;
    const gate = new Promise((r) => (release = r));
    await page.route("**/api/activity/**", async (route) => { await gate; await route.continue(); });
    await page.goto("http://localhost:3123/", { waitUntil: "domcontentloaded" });
    await page.locator("#provider-github-calendar").scrollIntoViewIfNeeded();
    for (const id of ids) await page.waitForSelector(`#provider-${id} [aria-busy=true]`);
    const box = (id) => page.$eval(`#provider-${id} > *`, (el) => Math.round(el.getBoundingClientRect().height));
    const skel = {}; for (const id of ids) skel[id] = await box(id);
    release();
    for (const id of ids) await page.waitForFunction((sel) => !document.querySelector(sel), `#provider-${id} [aria-busy=true]`, { timeout: 15000 });
    await page.waitForTimeout(500);
    const diff = {}; for (const id of ids) diff[id] = (await box(id)) - skel[id];
    await page.unrouteAll({ behavior: "ignoreErrors" });
    out.push({ w, skel, diff });
  }
  return JSON.stringify(out);
}
