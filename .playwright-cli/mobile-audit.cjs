async page => {
  await page.setViewportSize({ width: 390, height: 844 });
  const shots = [];
  const snap = async (name) => { await page.screenshot({ path: `.playwright-cli/m-${name}.png` }); shots.push(name); };
  await page.goto('http://localhost:3000/');
  await page.waitForTimeout(4500);
  await snap('home-top');
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page.waitForTimeout(1000);
  await snap('menu-home');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (const f of [0.2, 0.4, 0.6, 0.8, 0.97]) {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), h * f);
    await page.waitForTimeout(900);
    await snap('home-' + Math.round(f * 100));
  }
  await page.goto('http://localhost:3000/projects');
  await page.waitForTimeout(3000);
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page.waitForTimeout(1000);
  await snap('menu-route');
  const overflow = await page.evaluate(() => { const m = document.getElementById('portfolio-mobile-menu'); const s = m.firstElementChild?.nextElementSibling; return { inner: s?.scrollHeight, client: s?.clientHeight }; });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  await snap('projects-top');
  await page.goto('http://localhost:3000/about');
  await page.waitForTimeout(3000);
  await snap('about-top');
  // Small phone
  await page.setViewportSize({ width: 360, height: 640 });
  await page.goto('http://localhost:3000/');
  await page.waitForTimeout(3500);
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page.waitForTimeout(1000);
  await snap('menu-small');
  const small = await page.evaluate(() => { const s = document.querySelector('#portfolio-mobile-menu > div:last-child'); return { inner: s?.scrollHeight, client: s?.clientHeight }; });
  return { shots, overflow, small };
}
