async page => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('http://localhost:3000/#contact');
  await page.waitForTimeout(2500);
  const btn = page.getByRole('button', { name: 'Write a message' });
  await btn.scrollIntoViewIfNeeded();
  await btn.click();
  await page.waitForTimeout(16);
  const opened = await page.evaluate(() => { const d = document.querySelector('dialog.contact-dialog'); return [getComputedStyle(d.querySelector('.contact-sheet')).opacity, getComputedStyle(d.querySelector('[data-draw="settle"] > *')).opacity]; });
  await page.keyboard.press('Escape');
  const closed = await page.evaluate(() => getComputedStyle(document.querySelector('dialog.contact-dialog')).display);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  return { opened, closedDisplayImmediately: closed };
}
