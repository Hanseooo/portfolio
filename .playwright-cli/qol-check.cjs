async page => {
  const out = {};
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://localhost:3000/');
  await page.waitForTimeout(4000);
  // Duplicate heading id and the contact heading's accessible text
  out.contactHeadingIds = await page.evaluate(() => document.querySelectorAll('[id="contact-heading"]').length);
  out.contactName = await page.evaluate(() => { const h = document.getElementById('contact-heading'); return h && h.innerText.length ? (document.querySelector('#contact').getAttribute('aria-labelledby') + ' -> ' + h.querySelector('.sr-only')?.textContent) : null; });
  out.dupIds = await page.evaluate(() => { const c = {}; document.querySelectorAll('[id]').forEach(e => c[e.id] = (c[e.id] || 0) + 1); return Object.entries(c).filter(([, n]) => n > 1); });
  // Menu: when does each row start (first frame opacity > 0)?
  const starts = page.evaluate(() => new Promise(res => {
    const t0 = performance.now(); const first = {};
    const tick = () => {
      const t = Math.round(performance.now() - t0);
      const m = document.getElementById('portfolio-mobile-menu');
      if (m) [...m.querySelectorAll('nav > ul > li, nav > div')].forEach((el, i) => { if (first[i] == null && +getComputedStyle(el).opacity > 0) first[i] = t; });
      if (t < 1200) requestAnimationFrame(tick); else res(first);
    };
    requestAnimationFrame(tick);
  }));
  await page.getByRole('button', { name: 'Open menu' }).click();
  out.menuRowStarts = await starts;
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  // Back to top
  const btn = page.getByRole('button', { name: 'Back to top' });
  out.topHiddenAtStart = await btn.evaluate(b => b.inert && getComputedStyle(b).opacity);
  await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight * 0.5, behavior: 'instant' }));
  await page.waitForTimeout(600);
  out.topShownMid = await btn.evaluate(b => [b.inert, getComputedStyle(b).opacity]);
  await page.screenshot({ path: '.playwright-cli/top-mid.png' });
  await btn.click();
  await page.waitForTimeout(2000);
  out.afterClick = await page.evaluate(() => [Math.round(scrollY), document.activeElement?.id]);
  // Dark + desktop
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('http://localhost:3000/projects');
  await page.waitForTimeout(3000);
  await page.evaluate(() => window.scrollTo({ top: 99999, behavior: 'instant' }));
  await page.waitForTimeout(600);
  await page.screenshot({ path: '.playwright-cli/top-dark-footer.png' });
  return out;
}
