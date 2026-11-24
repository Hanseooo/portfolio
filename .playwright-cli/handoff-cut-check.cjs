async (page) => {
  // Records the route handoff at real speed with a CDP screencast and logs the cover's phase
  // and cut per frame, so the close cut, the open cut and the unmount can all be inspected.
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await page.waitForFunction(() => document.documentElement.dataset.arrival !== "covering", null, { timeout: 8000 });
  await page.waitForTimeout(800);
  await page.evaluate(() => {
    window.__cuts = [];
    const t0 = performance.now();
    const tick = () => {
      const el = document.querySelector(".handoff-cover");
      window.__cuts.push([Math.round(performance.now() - t0), el ? el.dataset.phase + " " + getComputedStyle(el).getPropertyValue("--cut") : "gone", location.pathname]);
      if (performance.now() - t0 < 1400) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  const cdp = await page.context().newCDPSession(page);
  const frames = [];
  let n = 0;
  cdp.on("Page.screencastFrame", async (f) => {
    frames.push(f.data); n++;
    await cdp.send("Page.screencastFrameAck", { sessionId: f.sessionId }).catch(() => {});
  });
  await cdp.send("Page.startScreencast", { format: "jpeg", quality: 60, maxWidth: 720, everyNthFrame: 1 });
  await page.locator('header a[href="/projects"]').first().click();
  await page.waitForTimeout(1500);
  await cdp.send("Page.stopScreencast");
  const cuts = await page.evaluate(() => window.__cuts.filter((_, i, a) => i === 0 || a[i - 1][1] !== a[i][1] || i % 4 === 0));
  // No fs in run-code: write frames by screenshotting each one on a blank page.
  const viewer = await page.context().newPage();
  await viewer.setViewportSize({ width: 720, height: 450 });
  for (let i = 0; i < frames.length; i++) {
    await viewer.setContent('<body style="margin:0"><img src="data:image/jpeg;base64,' + frames[i] + '">');
    await viewer.screenshot({ path: ".playwright-cli/handoff-" + String(i).padStart(2, "0") + ".png" });
  }
  await viewer.close();
  return JSON.stringify({ frames: n, cuts, url: page.url(), errors });
}
