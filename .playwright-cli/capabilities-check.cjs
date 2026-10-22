// eslint-disable-next-line @typescript-eslint/no-unused-expressions -- Playwright CLI expects a function expression.
async page => {
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("http://localhost:3123/");
  await page.locator('div[aria-hidden="true"][class*="z-[10000]"]').waitFor({ state: "hidden" });
  const names = ["AI products & RAG", "Workflow automation", "Full-stack web apps", "Business & ops systems"];
  const proofs = [
    ["Clarift", "/projects/clarift"], ["StoryBuddy", "/projects/story-buddy"],
    ["Eskwelabs", "/experience"], ["SimplyNote", "/projects/simply-note"],
    ["Lost and Found Management System", "/projects/hcdc-lfms"],
    ["Le Doux", "/projects/le-doux"], ["The Podium", "/projects/the-podium"],
  ];
  for (const name of names) assert(await page.locator("#stack").getByRole("heading", { name, exact: true }).count() === 1, `Missing capability: ${name}`);
  const report = [];
  for (const width of [360, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    const cells = await page.locator("#stack h3").evaluateAll(headings => headings.map(h => {
      const box = h.parentElement.getBoundingClientRect();
      return { x: Math.round(box.x), y: Math.round(box.y), right: box.right };
    }));
    const columns = new Set(cells.map(cell => cell.x)).size;
    assert(columns === (width >= 1024 ? 4 : width >= 768 ? 2 : 1), `Wrong columns at ${width}: ${columns}`);
    assert(cells.every(cell => cell.x >= 0 && cell.right <= width), `Capability overflow at ${width}`);
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Horizontal scroll at ${width}`);
    for (const [label, href] of proofs) {
      const link = page.locator("#stack").getByRole("link", { name: label, exact: true });
      assert(await link.getAttribute("href") === href, `Wrong proof route: ${label}`);
      assert(await link.evaluate(a => a.getBoundingClientRect().height >= 44), `Small hit target: ${label}`);
      await link.focus();
      await page.keyboard.press("Tab");
      await page.keyboard.press("Shift+Tab");
      assert(await link.evaluate(a => a === document.activeElement && a.matches(":focus-visible") && getComputedStyle(a).outlineStyle !== "none"), `Missing keyboard focus ring: ${label}`);
    }
    const hidden = await page.locator("#stack").evaluate(section => [...section.querySelectorAll("*")].filter(el => getComputedStyle(el).opacity === "0").map(el => el.tagName));
    assert(hidden.length === 0, `Reduced-motion content hidden at ${width}: ${hidden}`);
    report.push({ width, columns });
  }
  assert(errors.length === 0, `Console errors: ${errors.join(" | ")}`);
  const strip = page.locator("#stack").getByText(/Also taking freelance work:/);
  assert(await strip.count() === 1, "Missing freelance strip");
  const startProject = page.locator("#stack").getByRole("link", { name: "Start a project", exact: true });
  assert(await startProject.getAttribute("href") === "/#contact", "Freelance CTA must link to /#contact");
  const availability = "Open to work · Full-time & freelance · Davao, PH · Remote-friendly";
  assert(await page.getByText(availability, { exact: true }).count() === 2, "Availability must appear exactly twice");
  for (const id of ["identity", "contact"]) assert(await page.locator(`#${id}`).getByText(availability, { exact: true }).count() === 1, `Missing availability in ${id}`);
  await startProject.focus();
  await page.keyboard.press("Enter");
  await page.waitForFunction(() => location.hash === "#contact");
  assert(await page.locator("#contact").evaluate(el => Math.abs(el.getBoundingClientRect().top) < 200), "Contact CTA did not scroll to Contact");

  // Drive ordinary scrolling too, so reveal and Lenis regressions are visible.
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("http://localhost:3123/");
  await page.locator('div[aria-hidden="true"][class*="z-[10000]"]').waitFor({ state: "hidden" });
  for (const theme of ["light", "dark"]) {
    await page.evaluate(theme => {
      document.documentElement.classList.toggle("dark", theme === "dark");
      document.documentElement.classList.toggle("light", theme === "light");
    }, theme);
    for (const width of [360, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const name of names) {
        const heading = page.locator("#stack").getByRole("heading", { name, exact: true });
        await heading.scrollIntoViewIfNeeded();
        await page.waitForFunction(name => {
          const heading = [...document.querySelectorAll("#stack h3")].find(h => h.textContent === name);
          return getComputedStyle(heading.parentElement).opacity === "1";
        }, name);
      }
      await page.locator("#stack h3").first().scrollIntoViewIfNeeded();
      await page.screenshot({ path: `.playwright-cli/pr3-${theme}-${width}.png` });
    }
  }
  await page.locator("#stack h3").first().scrollIntoViewIfNeeded();
  const beforeWheel = await page.evaluate(() => scrollY);
  await page.mouse.wheel(0, 500);
  await page.waitForFunction(before => scrollY > before + 100, beforeWheel);
  assert(errors.length === 0, `Console errors: ${errors.join(" | ")}`);
  return { report, availabilityCopies: 2, themes: ["light", "dark"], errors };
}
