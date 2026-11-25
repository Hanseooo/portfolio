async page => {
  const out = {};
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://localhost:3000/');
  await page.waitForTimeout(4000);
  const btn = page.getByRole('button', { name: 'Back to top' });
  const state = () => btn.evaluate(b => `${b.inert ? 'hidden' : 'shown'} y=${Math.round(scrollY)}`);
  for (let i = 0; i < 12; i++) { await page.mouse.wheel(0, 400); await page.waitForTimeout(120); }
  await page.waitForTimeout(800);
  out.scrollingDown = await state();
  await page.mouse.wheel(0, -300);
  await page.waitForTimeout(800);
  out.scrolledUp = await state();
  await page.screenshot({ path: '.playwright-cli/top-v3-up.png' });
  for (let i = 0; i < 40; i++) { await page.mouse.wheel(0, 600); await page.waitForTimeout(60); }
  await page.waitForTimeout(1200);
  out.atEnd = await state();
  await page.screenshot({ path: '.playwright-cli/top-v3-end.png', clip: { x: 230, y: 724, width: 160, height: 120 } });
  await btn.click({ timeout: 3000 }).catch(e => out.clickErr = String(e).slice(0, 60));
  await page.waitForTimeout(2000);
  out.afterClick = await state();
  const hb = await page.getByRole('button', { name: 'Open menu' }).boundingBox();
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page.waitForTimeout(1000);
  const cb = await page.getByRole('dialog').getByLabel('Close menu').boundingBox();
  out.menuButton = [hb.x, hb.y, cb.x, cb.y];
  await page.screenshot({ path: '.playwright-cli/m-menu-home2.png' });
  return out;
}
