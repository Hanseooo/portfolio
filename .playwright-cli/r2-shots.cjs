async (page) => {
  await page.unrouteAll({ behavior: "ignoreErrors" });
  const shots = [];
  for (const [w, h, theme] of [[1440, 900, "light"], [1440, 900, "dark"], [768, 1024, "light"], [375, 812, "light"]]) {
    await page.setViewportSize({ width: w, height: h });
    await page.goto("http://localhost:3123/", { waitUntil: "networkidle" });
    await page.evaluate((t) => document.documentElement.classList.toggle("dark", t === "dark"), theme);
    const region = page.locator("#provider-github-calendar");
    await region.scrollIntoViewIfNeeded();
    await page.waitForSelector("#provider-github-calendar figure", { timeout: 15000 });
    await page.waitForTimeout(3500);
    const file = `.playwright-cli/r2-band-${w}-${theme}.png`;
    await page.locator("[data-motion-target=presence-providers]").screenshot({ path: file });
    const m = await page.$eval(".hm-weeks", (el) => {
      const weeks = [...el.querySelectorAll(".hm-week:not(.hm-weekday-col)")].filter((x) => getComputedStyle(x).display !== "none");
      const cell = weeks[0].querySelector(".hm-cell").getBoundingClientRect();
      return { visibleWeeks: weeks.length, cell: Math.round(cell.width * 10) / 10, gridW: Math.round(el.getBoundingClientRect().width), overflowX: document.documentElement.scrollWidth > innerWidth };
    });
    shots.push({ w, theme, ...m });
  }
  return JSON.stringify(shots);
}
