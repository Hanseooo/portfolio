async (page) => {
  const out = [];
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push(String(e)));
  await page.setViewportSize({ width: 1280, height: 800 });

  // 1. Project local nav marker: placed on load, slides to a later section.
  await page.goto('http://localhost:3000/projects/story-buddy');
  await page.waitForTimeout(1500);
  const marker = async () => page.evaluate(() => {
    const m = document.querySelector('.local-nav-marker');
    const cur = document.querySelector('[aria-current="true"]');
    return { ready: m && 'ready' in m.dataset, transform: m && m.style.transform, current: cur && cur.textContent, curLeft: cur && cur.offsetLeft, curW: cur && cur.offsetWidth };
  });
  out.push(['marker on load', await marker()]);
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight * 0.6));
  await page.waitForTimeout(1200);
  out.push(['marker after scroll', await marker()]);
  await page.setViewportSize({ width: 900, height: 800 });
  await page.waitForTimeout(600);
  out.push(['marker after resize', await marker()]);

  // 2. Hero compass strokes resolve to white.
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('http://localhost:3000/');
  await page.waitForTimeout(1500);
  out.push(['compass stroke', await page.evaluate(() => {
    const p = document.querySelector('svg[data-draw="compass"] path');
    return p && getComputedStyle(p).stroke;
  })]);

  // 3. Back to top under reduced motion: instant.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('http://localhost:3000/');
  await page.waitForTimeout(1000);
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight - 900));
  await page.waitForTimeout(300);
  await page.evaluate(() => window.scrollBy(0, -200));
  await page.waitForTimeout(300);
  const btn = page.getByLabel('Back to top');
  await btn.click({ timeout: 3000 }).catch(e => out.push(['click failed', String(e).slice(0, 80)]));
  await page.waitForTimeout(60);
  out.push(['scrollY 60ms after click (reduced)', await page.evaluate(() => window.scrollY)]);
  out.push(['focused', await page.evaluate(() => document.activeElement && document.activeElement.id)]);

  out.push(['console errors', errors]);
  return JSON.stringify(out, null, 1);
}
