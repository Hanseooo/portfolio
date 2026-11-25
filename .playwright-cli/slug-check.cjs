async (page) => {
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error' && !m.text().includes('_vercel')) errors.push('console: ' + m.text()); });
  const out = [];
  for (const [list, slug] of [['/projects', '/projects/story-buddy'], ['/certificates', '/certificates/python-essentials-1']]) {
    await page.goto('http://localhost:3001' + list);
    await page.locator(`a[href="${slug}"]`).first().click();
    await page.waitForURL('**' + slug);
    await page.waitForTimeout(1500);
    out.push(`${slug} via click -> h1: ${await page.locator('h1').first().innerText()}`);
    const r = await page.goto('http://localhost:3001' + slug);
    out.push(`${slug} direct -> ${r.status()}`);
  }
  for (const s of ['/projects/le-doux', '/projects/clarift', '/certificates/eskwelabs-ai-solution-development-track', '/certificates/introduction-to-modern-ai', '/certificates/national-programming-challenge-2024']) {
    const r = await page.goto('http://localhost:3001' + s); await page.waitForTimeout(800);
    out.push(`${s} -> ${r.status()}`);
  }
  return out.concat(errors.length ? errors : ['no console errors']).join('\n');
}
