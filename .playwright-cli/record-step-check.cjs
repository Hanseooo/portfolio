async page => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/certificates');
  await page.waitForTimeout(3500);
  const first = await page.evaluate(() => [...document.querySelectorAll('a[href^="/certificates/"]')].map(a => a.getAttribute('href'))[0]);
  await page.goto('http://localhost:3000' + first);
  await page.waitForTimeout(3000);
  const watch = () => page.evaluate(() => new Promise(res => {
    const t0 = performance.now(); const rows = []; let lastPath = location.pathname;
    const tick = () => {
      const t = Math.round(performance.now() - t0);
      const el = document.querySelector('[data-motion-target="certificate-detail"]')?.parentElement;
      const cs = el && getComputedStyle(el);
      rows.push(`${t} ${location.pathname.split('/').pop().slice(0, 18)} ${cs ? cs.transform + ' ' + (+cs.opacity).toFixed(2) : '-'}`);
      if (t < 900) requestAnimationFrame(tick); else res(rows.filter((_, i) => i % 4 === 0));
    };
    requestAnimationFrame(tick);
  }));
  const out = { first };
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); await page.waitForTimeout(600);
  let p = watch(); await page.getByRole('link', { name: /^Next:/ }).click(); out.next = await p;
  await page.waitForTimeout(1500);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); await page.waitForTimeout(600);
  p = watch(); await page.getByRole('link', { name: /^Previous:/ }).click(); out.prev = await p;
  return out;
}
