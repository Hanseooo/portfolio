async page => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/projects/' + 'story-buddy' + '#project-screenshots');
  await page.waitForTimeout(4000);
  const thumbs = page.getByRole('button', { name: /Open screenshot/ });
  const n = await thumbs.count();
  const t2 = thumbs.nth(Math.min(1, n - 1));
  await t2.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  const sample = (ms) => page.evaluate((ms) => new Promise(res => {
    const t0 = performance.now(); const rows = [];
    const tick = () => {
      const t = Math.round(performance.now() - t0);
      const d = document.querySelector('dialog.shot-viewer');
      const s = d.querySelector('[data-viewer-shot]');
      const m = d.querySelector('[data-draw="settle"] > *');
      const r = s.getBoundingClientRect();
      rows.push(`${t} open=${d.open} shot=${Math.round(r.left)},${Math.round(r.top)} ${Math.round(r.width)}x${Math.round(r.height)} mark=${(+getComputedStyle(m).opacity).toFixed(2)}`);
      if (t < ms) requestAnimationFrame(tick); else res(rows.filter((_, i) => i % 4 === 0));
    };
    requestAnimationFrame(tick);
  }), ms);
  const out = { n, thumbRect: await t2.boundingBox() };
  let p = sample(800); await t2.click(); out.open = await p;
  out.focus = await page.evaluate(() => document.activeElement?.textContent);
  out.counter = await page.locator('dialog.shot-viewer [aria-live]').textContent();
  await page.screenshot({ path: '.playwright-cli/viewer-open.png' });
  await page.keyboard.press('ArrowRight'); await page.waitForTimeout(900);
  out.counterAfterRight = await page.locator('dialog.shot-viewer [aria-live]').textContent();
  await page.keyboard.press('ArrowLeft'); await page.waitForTimeout(300);
  out.prevDisabledAt1 = await page.evaluate(() => { const b = document.querySelector('[aria-label="Previous screenshot"]'); return b?.disabled; });
  p = sample(500); await page.keyboard.press('Escape'); out.close = await p;
  out.focusAfter = await page.evaluate(() => document.activeElement?.getAttribute('aria-label'));
  // backdrop click
  await t2.click(); await page.waitForTimeout(700);
  await page.mouse.click(30, 450); await page.waitForTimeout(600);
  out.closedByBackdrop = await page.evaluate(() => !document.querySelector('dialog.shot-viewer').open);
  return out;
}
