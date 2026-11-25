async page => {
  const out = {};
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('http://localhost:3000/projects/story-buddy#project-screenshots');
  await page.waitForTimeout(4000);
  const t = page.getByRole('button', { name: /Open screenshot 3 of/ });
  await t.scrollIntoViewIfNeeded(); await page.waitForTimeout(600);
  await t.click(); await page.waitForTimeout(1000);
  await page.screenshot({ path: '.playwright-cli/viewer-mobile-dark.png' });
  await page.getByRole('button', { name: 'Close' }).click(); await page.waitForTimeout(500);
  out.closed = await page.evaluate(() => !document.querySelector('dialog.shot-viewer').open);
  await page.emulateMedia({ colorScheme: null, reducedMotion: 'reduce' });
  await page.reload(); await page.waitForTimeout(2500);
  await t.scrollIntoViewIfNeeded();
  await t.click(); await page.waitForTimeout(20);
  out.rmAnims = await page.evaluate(() => document.querySelector('dialog.shot-viewer').getAnimations({ subtree: true }).length);
  out.rmMark = await page.evaluate(() => getComputedStyle(document.querySelector('dialog.shot-viewer [data-draw="settle"] > *')).opacity);
  await page.keyboard.press('Escape'); await page.waitForTimeout(20);
  out.rmClosedNow = await page.evaluate(() => !document.querySelector('dialog.shot-viewer').open);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  return out;
}
