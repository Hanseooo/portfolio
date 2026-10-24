// eslint-disable-next-line @typescript-eslint/no-unused-expressions -- Playwright CLI evaluates this function.
async page => {
  // Experience and certificate records must reveal at the same point:
  // once a record's top edge is 80% down the viewport, whatever its height.
  const assert = (ok, message) => { if (!ok) throw new Error(message); };
  const base = "http://localhost:3100";
  const recordSelector = '[data-motion-target="career-record"],[data-motion-target="register-record"],[data-motion-target="catalogue-record"]';
  for (const viewport of [{ width: 1440, height: 700 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    for (const path of ["/experience", "/certificates", "/projects"]) {
      await page.goto(base + path);
      await page.waitForTimeout(2200); // arrival cover
      const count = await page.locator(recordSelector).count();
      for (let i = 0; i < count; i++) {
        const record = page.locator(recordSelector).nth(i);
        const wrapperTop = await record.evaluate(el => el.parentElement.getBoundingClientRect().top + scrollY);
        await page.evaluate(y => scrollTo(0, y), Math.max(0, wrapperTop - viewport.height * 0.8));
        await page.waitForTimeout(900);
        const opacity = await record.evaluate(el => Number(getComputedStyle(el.parentElement).opacity));
        assert(opacity > 0.95, `${path} record ${i + 1} at ${viewport.width}x${viewport.height} must be revealed when its top is 80% down the viewport, opacity ${opacity}`);
      }
    }
  }
  return "reveal thresholds ok";
}
