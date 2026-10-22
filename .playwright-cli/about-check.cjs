// eslint-disable-next-line @typescript-eslint/no-unused-expressions -- Playwright CLI evaluates this function.
async page => {
  const assert = (ok, message) => { if (!ok) throw new Error(message); };
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("http://localhost:3123/");
  await page.getByRole("link", { name: "More about me", exact: true }).waitFor();
  await page.getByRole("link", { name: "More about me", exact: true }).click();
  await page.waitForURL("**/about");
  await page.getByRole("heading", { name: "About", exact: true, level: 1 }).waitFor();
  const article = page.locator("article").first();
  assert((await article.innerText()).includes("National Programming Challenge 2024, organized by CodeChum"), "Bio must name the competition and organizer precisely");
  for (const href of ["/certificates/national-programming-challenge-2024", "/projects/story-buddy", "/projects/le-doux", "/experience#durianpy"]) {
    assert(await article.locator(`a[href="${href}"]`).count() === 1, `Missing supporting link: ${href}`);
  }
  const portrait = page.locator("article figure").first();
  await page.evaluate(() => scrollTo(0, 450));
  await page.waitForFunction(() => scrollY >= 440);
  const stickyTop = await portrait.evaluate(el => el.getBoundingClientRect().top);
  assert(stickyTop >= 100 && stickyTop <= 140, `Desktop portrait must stay below the header, got ${stickyTop}`);
  await page.evaluate(() => scrollTo(0, 580));
  await page.waitForFunction(() => scrollY >= 570);
  assert(Math.abs(await portrait.evaluate(el => el.getBoundingClientRect().top) - stickyTop) < 2, "Portrait must remain sticky while the bio scrolls");
  await page.getByRole("heading", { name: "Live activity", exact: true }).evaluate(el => el.scrollIntoView({ block: "start" }));
  await page.waitForFunction(() => document.querySelector("article figure").getBoundingClientRect().top < 100);
  const nav = page.getByRole("navigation", { name: "Site navigation", exact: true });
  assert(await nav.getByRole("link", { name: "About", exact: true }).getAttribute("aria-current") === "page", "About must be the current desktop destination");
  assert(await nav.getByRole("link", { name: "Home", exact: true }).count() === 0, "Desktop Home must be replaced");
  assert(await nav.locator("ul > li").count() === 6, "Desktop navigation must not grow");
  for (const theme of ["light", "dark"]) {
    await page.evaluate(theme => {
      document.documentElement.classList.toggle("dark", theme === "dark");
      document.documentElement.classList.toggle("light", theme === "light");
    }, theme);
    for (const width of [360, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Overflow: ${theme} ${width}`);
      await page.getByRole("heading", { name: "How I work", exact: true }).scrollIntoViewIfNeeded();
      assert(await page.getByRole("heading", { name: "How I work", exact: true }).isVisible(), "Bio must remain readable");
      await page.screenshot({ path: `.playwright-cli/pr4-${theme}-${width}.png`, fullPage: true });
    }
  }
  await page.setViewportSize({ width: 390, height: 1000 });
  assert(await portrait.evaluate(el => getComputedStyle(el).position !== "sticky"), "Portrait must scroll normally on mobile");
  await page.getByRole("button", { name: "Open menu", exact: true }).click();
  const menu = page.getByRole("dialog", { name: "Navigation menu" });
  assert(await menu.getByRole("link", { name: "Home", exact: true }).count() === 1, "Mobile must retain Home");
  assert(await menu.getByRole("link", { name: "About", exact: true }).count() === 1, "Mobile must include About");
  await page.keyboard.press("Escape");
  await menu.waitFor({ state: "hidden" });
  assert(await page.getByRole("button", { name: "Open menu", exact: true }).evaluate(el => el === document.activeElement), "Escape must restore focus");
  await page.getByRole("navigation", { name: "Parent route", exact: true }).getByRole("link").click();
  await page.waitForURL("http://localhost:3123/");
  const story = page.getByRole("link", { name: "Read the full story", exact: true });
  await story.scrollIntoViewIfNeeded();
  await story.focus();
  await page.keyboard.press("Enter");
  await page.waitForURL("**/about");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.reload();
  for (const width of [360, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const name of ["Learning by building.", "How I work", "Beyond the build"]) {
      const heading = page.getByRole("heading", { name, exact: true });
      await heading.scrollIntoViewIfNeeded();
      await page.waitForFunction(name => {
        let el = [...document.querySelectorAll("h2")].find(el => el.textContent === name);
        while (el) {
          if (Number(getComputedStyle(el).opacity) < 0.99) return false;
          el = el.parentElement;
        }
        return true;
      }, name);
    }
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Animated layout overflow at ${width}`);
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.evaluate(() => scrollTo(0, 0));
  await page.screenshot({ path: ".playwright-cli/pr4-polished-desktop.png" });
  await page.mouse.wheel(0, 450);
  await page.waitForFunction(() => scrollY > 200);
  await page.screenshot({ path: ".playwright-cli/pr4-polished-sticky.png" });
  assert(errors.length === 0, `Page errors: ${errors.join(" | ")}`);
  console.log("PASS: entry links, desktop/mobile navigation, Escape, responsive themes, reduced motion, sticky portrait and release, reveals, scroll, clean console");
}
