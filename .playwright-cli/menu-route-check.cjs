async page => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://localhost:3000/projects');
  await page.waitForTimeout(4000);
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page.waitForTimeout(1000);
  const p = page.evaluate(() => new Promise(res => {
    const t0 = performance.now(); const rows = [];
    const tick = () => {
      const t = Math.round(performance.now() - t0);
      const m = document.querySelector('[role="dialog"][aria-label="Navigation menu"]');
      const c = document.querySelector('.handoff-cover');
      rows.push(`${t} menu=${m ? getComputedStyle(m).getPropertyValue('--cut') : 'gone'} cover=${c ? c.dataset.phase + ':' + getComputedStyle(c).getPropertyValue('--cut') : '-'}`);
      if (t < 500) requestAnimationFrame(tick); else res(rows.filter((_, i) => i % 3 === 0));
    };
    requestAnimationFrame(tick);
  }));
  await page.getByRole('dialog', { name: 'Navigation menu' }).getByRole('link', { name: /experience/i }).first().click();
  const rows = await p;
  await page.waitForTimeout(1500);
  return { rows, url: page.url() };
}
