// About portrait follows the theme: light mode shows hans, dark shows hans2,
// on the homepage About section and /about. Run: playwright-cli run-code "$(cat file)"
async (page) => {
  const assert = (ok, msg) => { if (!ok) throw new Error(msg); };
  const base = "http://localhost:3100";
  // The image a viewer sees: topmost element at the portrait's center.
  const shown = (scope) => page.evaluate((sel) => {
    const box = document.querySelector(sel).querySelector("img").getBoundingClientRect();
    const top = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
    return top instanceof HTMLImageElement && getComputedStyle(top).visibility === "visible"
      ? [decodeURIComponent(top.currentSrc || top.src)] : [String(top && top.outerHTML.slice(0, 80))];
  }, scope);
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const [path, scope] of [["/", "[data-motion-target='presence-portrait']"], ["/about", "figure"]]) {
    for (const theme of ["light", "dark"]) {
      await page.goto(base + path);
      await page.evaluate((t) => { localStorage.setItem("theme", t); }, theme);
      await page.reload();
      await page.waitForTimeout(300);
      await page.waitForFunction(() => !document.querySelector('[class*="z-[10000]"]'), null, { timeout: 8000 });
      await page.evaluate((sel) => document.querySelector(sel).scrollIntoView({ block: "center" }), scope);
      await page.waitForTimeout(600);
      const srcs = await shown(scope);
      const want = theme === "dark" ? "hans2" : "hans.";
      assert(srcs.length === 1 && srcs[0].includes(want), `${path} ${theme}: expected visible ${want}, got ${JSON.stringify(srcs)}`);
    }
  }
  await page.evaluate(() => localStorage.removeItem("theme"));
  return "theme portrait ok";
}
