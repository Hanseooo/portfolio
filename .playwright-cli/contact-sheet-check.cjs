async page => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/#contact');
  await page.waitForTimeout(4000);
  const btn = page.getByRole('button', { name: 'Write a message' });
  await btn.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  const sample = () => page.evaluate(() => new Promise(res => {
    const d = document.querySelector('dialog.contact-dialog');
    const sheet = d.querySelector('.contact-sheet');
    const mark = d.querySelector('[data-draw="settle"] > *');
    const t0 = performance.now(); const rows = [];
    const tick = () => {
      const t = Math.round(performance.now() - t0);
      const s = getComputedStyle(sheet), m = getComputedStyle(mark), b = getComputedStyle(d, '::backdrop');
      rows.push([t, d.open, getComputedStyle(d).display, (+s.opacity).toFixed(2), s.translate, (+m.opacity).toFixed(2), m.translate, (+b.opacity).toFixed(2)].join(' '));
      if (t < 700) requestAnimationFrame(tick); else res(rows.filter((_, i) => i % 4 === 0));
    };
    requestAnimationFrame(tick);
  }));
  const out = {};
  let p = sample(); await btn.click(); out.open1 = await p;
  await page.waitForTimeout(300);
  await page.screenshot({ path: '.playwright-cli/contact-open.png' });
  p = sample(); await page.keyboard.press('Escape'); out.close = await p;
  out.focusAfterClose = await page.evaluate(() => document.activeElement?.textContent);
  p = sample(); await btn.click(); out.open2 = await p;
  await page.getByRole('button', { name: 'Close' }).click();
  await page.waitForTimeout(400);
  return out;
}
