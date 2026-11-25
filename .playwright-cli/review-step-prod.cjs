async (page) => {
  const out = [], missing = [];
  page.on('response', r => { if (r.status() === 404) missing.push(r.url()); });
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('http://localhost:3001/certificates/introduction-to-modern-ai');
  await page.waitForTimeout(1200);
  await page.locator('a', { hasText: /next/i }).last().click();
  await page.waitForURL('**/national-programming-challenge-2024');
  await page.waitForTimeout(80);
  out.push(['slide animations after plain Next', await page.evaluate(() =>
    document.getAnimations().filter(a => a.effect && a.effect.getKeyframes().some(k => String(k.transform).includes('translateX(24px)'))).length)]);
  out.push(['404s', missing]);
  return JSON.stringify(out);
}
