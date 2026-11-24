async page => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/#contact');
  await page.waitForTimeout(3500);
  await page.getByRole('button', { name: 'Write a message' }).click();
  await page.waitForTimeout(1500);
  const p = page.evaluate(() => new Promise(res => {
    const t0 = performance.now(); const rows = [];
    const tick = () => {
      const t = Math.round(performance.now() - t0);
      const lines = [...document.querySelectorAll('dialog.contact-dialog input, dialog.contact-dialog textarea')].filter(i => i.nextElementSibling).map(i => { const c = getComputedStyle(i.nextElementSibling); return `${i.getAttribute('aria-invalid') ? 'INV' : 'ok'}:${c.scale}:${c.backgroundColor}`; });
      rows.push(`${t} ${lines.join(' | ')}`);
      if (t < 500) requestAnimationFrame(tick); else res(rows.filter((_, i) => i % 3 === 0));
    };
    requestAnimationFrame(tick);
  }));
  await page.getByRole('button', { name: /^Send/ }).click();
  const rows = await p;
  await page.waitForTimeout(300);
  await page.screenshot({ path: '.playwright-cli/field-invalid.png', clip: { x: 380, y: 130, width: 680, height: 520 } });
  const border = await page.evaluate(() => getComputedStyle(document.querySelector('dialog.contact-dialog input[aria-invalid]')).borderBottomColor);
  return { rows, border };
}
