// eslint-disable-next-line @typescript-eslint/no-unused-expressions -- Playwright CLI evaluates this function.
async page => {
  const assert = (ok, message) => { if (!ok) throw new Error(message); };
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  const toggle = page.getByRole("button", { name: /^Switch to (light|dark) theme$/ });
  const isDark = () => page.evaluate(() => document.documentElement.classList.contains("dark"));
  const vtAnimations = () => page.evaluate(() => document.getAnimations()
    .filter(a => (a.effect?.pseudoElement ?? "").startsWith("::view-transition"))
    .map(a => ({ pseudo: a.effect.pseudoElement, frames: a.effect.getKeyframes().map(k => k.clipPath ?? "") })));
  const focusOnToggle = () => toggle.evaluate(el => el === document.activeElement);

  // Motion allowed: a circle grows from the toggle's centre.
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("http://localhost:3123/");
  await page.evaluate(() => localStorage.removeItem("theme"));
  await page.reload();
  await toggle.waitFor();
  await page.waitForTimeout(500);
  const box = await toggle.boundingBox();
  const before = await isDark();
  // Record the class the moment the update callback returns: that is the state the new snapshot captures.
  await page.evaluate(() => {
    const start = document.startViewTransition.bind(document);
    document.startViewTransition = update => start(async () => {
      await update();
      window.__snapshotDark = document.documentElement.classList.contains("dark");
    });
  });
  await toggle.focus();
  await page.keyboard.press("Enter");
  await page.waitForFunction(() => document.getAnimations().some(a => (a.effect?.pseudoElement ?? "").startsWith("::view-transition-new")), null, { timeout: 2000 }).catch(() => {});
  assert(await page.evaluate(() => window.__snapshotDark) === !before, "New theme must be applied when the update callback returns");
  const animated = await vtAnimations();
  const circle = animated.find(a => a.pseudo === "::view-transition-new(root)");
  assert(circle, `Expected a ::view-transition-new(root) animation, got ${JSON.stringify(animated)}`);
  const cx = Math.round(box.x + box.width / 2), cy = Math.round(box.y + box.height / 2);
  assert(/^circle\(0px at /.test(circle.frames[0]), `Circle must start at radius 0: ${circle.frames[0]}`);
  const [, fx, fy] = circle.frames[0].match(/at ([\d.]+)px ([\d.]+)px/) ?? [];
  assert(Math.abs(fx - cx) <= 1 && Math.abs(fy - cy) <= 1, `Circle must grow from toggle centre ${cx},${cy}: ${circle.frames[0]}`);
  await page.waitForFunction(() => !document.getAnimations().some(a => (a.effect?.pseudoElement ?? "").startsWith("::view-transition")), null, { timeout: 2000 });
  assert(await isDark() !== before, "Theme must change after the transition");
  assert(await focusOnToggle(), "Focus must stay on the toggle");

  // Toggle mid Lenis scroll: no jump back.
  await page.mouse.move(720, 450);
  for (let i = 0; i < 6; i++) await page.mouse.wheel(0, 400);
  await page.waitForTimeout(150);
  const midScroll = await page.evaluate(() => scrollY);
  assert(midScroll > 200, `Wheel must scroll the page, got ${midScroll}`);
  await toggle.click();
  const samples = [];
  for (let i = 0; i < 12; i++) { samples.push(await page.evaluate(() => scrollY)); await page.waitForTimeout(60); }
  assert(samples.every((y, i) => y >= (samples[i - 1] ?? midScroll) - 2), `Scroll must not jump during the transition: ${midScroll} → ${samples.join(",")}`);

  // Reduced motion: instant switch, no view-transition pseudo-elements.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForTimeout(200);
  const reducedBefore = await isDark();
  await toggle.focus();
  await page.keyboard.press("Enter");
  const reducedAnimations = await vtAnimations();
  assert(reducedAnimations.length === 0, `Reduced motion must not run a view transition: ${JSON.stringify(reducedAnimations)}`);
  await page.waitForFunction(was => document.documentElement.classList.contains("dark") !== was, reducedBefore, { timeout: 1000 });
  assert(await focusOnToggle(), "Focus must stay on the toggle under reduced motion");

  assert(errors.length === 0, `Console errors: ${errors.join(" | ")}`);
  return "theme-transition-check: green";
}
