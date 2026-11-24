async page => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://localhost:3000/projects');
  await page.waitForTimeout(2500);
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page.waitForTimeout(30);
  const r = await page.evaluate(() => { const m = document.querySelector('[aria-label="Navigation menu"][role="dialog"]'); return { cls: m.className.includes('menu-cut'), rows: [...m.querySelectorAll('li')].map(l => getComputedStyle(l).opacity).join(','), lead: getComputedStyle(m.querySelector('[aria-current] span')).transform }; });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(30);
  r.goneAfterEsc = !(await page.$('[aria-label="Navigation menu"][role="dialog"]'));
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  return r;
}
