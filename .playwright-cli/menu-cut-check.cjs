async page => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://localhost:3000/projects');
  await page.waitForTimeout(4000);
  const sample = (ms) => page.evaluate((ms) => new Promise(res => {
    const t0 = performance.now(); const rows = [];
    const tick = () => {
      const t = Math.round(performance.now() - t0);
      const m = document.getElementById(document.querySelector('[aria-controls]').getAttribute('aria-controls'));
      if (m) {
        const lis = [...m.querySelectorAll('li')].map(li => (+getComputedStyle(li).opacity).toFixed(1)).join(',');
        const lead = m.querySelector('[aria-current] span');
        rows.push(`${t} cut=${getComputedStyle(m).getPropertyValue('--cut')} rows=${lis} lead=${lead ? getComputedStyle(lead).transform : '-'}`);
      } else rows.push(`${t} gone`);
      if (t < ms) requestAnimationFrame(tick); else res(rows.filter((_, i) => i % 3 === 0));
    };
    requestAnimationFrame(tick);
  }), ms);
  const btn = page.getByRole('button', { name: 'Open menu' });
  const out = {};
  let p = sample(1100); await btn.click();
  await page.waitForTimeout(180);
  await page.screenshot({ path: '.playwright-cli/menu-mid.png' });
  out.open = await p;
  await page.screenshot({ path: '.playwright-cli/menu-open.png' });
  out.origin = await page.evaluate(() => document.getElementById(document.querySelector('[aria-controls]').getAttribute('aria-controls')).style.getPropertyValue('--menu-origin'));
  p = sample(400); await page.keyboard.press('Escape'); out.close = await p;
  out.focus = await page.evaluate(() => document.activeElement?.getAttribute('aria-label'));
  return out;
}
