async page => {
  const results = [];
  for (const motion of ['no-preference', 'reduce']) {
    await page.emulateMedia({ reducedMotion: motion });
    for (const width of [360, 390, 640, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.locator('#provider-github-calendar').scrollIntoViewIfNeeded();
      await page.locator('.hm-cell[data-date]').first().waitFor({ state: 'attached' });
      await page.waitForTimeout(1600);
      const result = await page.locator('.hm-weeks').first().evaluate(grid => {
        const weeks = [...grid.querySelectorAll('.hm-week:not(.hm-weekday-col)')].filter(el => getComputedStyle(el).display !== 'none');
        const first = weeks[0].querySelector('.hm-cell').getBoundingClientRect();
        const last = weeks.at(-1).querySelector('.hm-cell:last-child').getBoundingClientRect();
        return { track: parseFloat(getComputedStyle(grid).gridTemplateRows.split(' ')[1]), cell: first.width, bottom: last.bottom, clip: grid.parentElement.getBoundingClientRect().bottom, overflow: document.documentElement.scrollWidth > innerWidth };
      });
      results.push({ motion, width, ...result });
      if (Math.abs(result.track - result.cell) > 1 || result.bottom > result.clip + 1 || result.overflow) throw new Error(JSON.stringify(results));
    }
  }
  console.log(JSON.stringify(results));
}
