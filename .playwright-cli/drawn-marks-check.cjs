// Drawn geometry: with motion, marks in view finish drawing (data-drawn="done",
// mask dropped) after the arrival and after a route handoff; with reduced
// motion they are never armed or masked. Run: playwright-cli run-code "$(cat file)"
async (page) => {
  const assert = (ok, msg) => { if (!ok) throw new Error(msg); };
  const base = "http://localhost:3100";
  const inView = () => page.evaluate(() => [...document.querySelectorAll("[data-draw]")]
    .filter((el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.bottom > 0 && r.top < innerHeight * 0.85; })
    .map((el) => ({ draw: el.dataset.draw, drawn: el.dataset.drawn ?? "unset", mask: getComputedStyle(el).maskImage, opacity: getComputedStyle(el.dataset.draw === "settle" ? el.firstElementChild : el).opacity })));
  await page.setViewportSize({ width: 1440, height: 900 });

  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto(base + "/");
  await page.waitForFunction(() => document.documentElement.dataset.arrival === "done", null, { timeout: 8000 });
  await page.waitForTimeout(1800);
  let marks = await inView();
  assert(marks.length >= 3, `hero: expected marks in view, got ${marks.length}`);
  assert(marks.every((m) => m.drawn === "done" && m.mask === "none"), `hero marks unfinished: ${JSON.stringify(marks)}`);

  await page.getByRole("link", { name: "Certificates", exact: true }).first().click();
  await page.waitForURL("**/certificates");
  await page.waitForTimeout(2500);
  marks = await inView();
  assert(marks.some((m) => m.draw === "compass") && marks.some((m) => m.draw === "settle"), `certificates: missing compass/settle marks: ${JSON.stringify(marks)}`);
  assert(marks.every((m) => m.drawn === "done" && m.mask === "none" && m.opacity === "1"), `certificates marks unfinished: ${JSON.stringify(marks)}`);

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(base + "/certificates");
  await page.waitForTimeout(1500);
  assert(await page.evaluate(() => !("drawArmed" in document.documentElement.dataset)), "reduced motion must not arm drawing");
  marks = await inView();
  assert(marks.length > 0 && marks.every((m) => m.mask === "none" && m.opacity === "1"), `reduced-motion marks hidden: ${JSON.stringify(marks)}`);
  await page.emulateMedia({ reducedMotion: null });
  return "drawn marks ok";
}
