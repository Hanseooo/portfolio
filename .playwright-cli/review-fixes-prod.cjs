async (page) => {
  const out = [], errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  const marker = () => page.evaluate(() => {
    const m = document.querySelector('.local-nav-marker');
    const cur = document.querySelector('[aria-current="true"]');
    return { ready: !!m && 'ready' in m.dataset, transform: m && m.style.transform, current: cur && cur.textContent, left: cur && cur.offsetLeft, width: cur && cur.offsetWidth };
  });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('http://localhost:3001/projects/story-buddy');
  await page.waitForTimeout(1500);
  out.push(['load', await marker()]);
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight * 0.6));
  await page.waitForTimeout(1500);
  out.push(['scrolled', await marker()]);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(800);
  out.push(['phone', await marker()]);

  // Record step: plain Next click slides; ctrl-click must not arm a slide.
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('http://localhost:3001/certificates/introduction-to-modern-ai');
  await page.waitForTimeout(1200);
  const next = page.locator('a', { hasText: /next/i }).last();
  out.push(['next href', await next.getAttribute('href')]);
  await next.click({ modifiers: ['Control'] }).catch(() => {});
  await page.waitForTimeout(300);
  out.push(['pages after ctrl-click', page.context().pages().length]);
  return JSON.stringify(out) + ' ERR ' + JSON.stringify(errors);
}
