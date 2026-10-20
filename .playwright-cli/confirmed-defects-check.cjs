// eslint-disable-next-line @typescript-eslint/no-unused-expressions -- Playwright CLI expects a function expression.
async page => {
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  const base = "http://localhost:3000";
  const errors = [];
  const onError = (error) => errors.push(error.message);
  const onConsole = (message) => { if (message.type() === "error") errors.push(message.text()); };
  page.on("pageerror", onError);
  page.on("console", onConsole);
  const measurements = [];
  async function ready(url) {
    await page.goto(url);
    // The SSR arrival cover clears only after capability initialization has replaced static wrappers.
    await page.locator('div[aria-hidden="true"][class*="z-[10000]"]').waitFor({ state: "hidden" });
  }
  async function visible(selector) {
    const target = page.locator(selector).first();
    await target.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1200);
    assert(await target.evaluate((element) => {
      for (let current = element; current; current = current.parentElement) {
        if (Number(getComputedStyle(current).opacity) < 0.99) return false;
      }
      return element.getBoundingClientRect().height > 0;
    }), `Evidence remains hidden: ${selector}`);
  }
  try {
    await page.setViewportSize({ width: 1920, height: 1000 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.addInitScript(() => {
      window.revealCompletions = [];
      window.addEventListener("portfolio:reveal-complete", (event) => window.revealCompletions.push(event.detail.revealId));
    });
    await ready(base);
    await visible('[data-reveal-id="hero-proof"]');
    await visible('[data-reveal-id="flagship-story-buddy"]');
    await page.screenshot({ path: ".playwright-cli/fixes-flagship-normal.png" });
    await visible('#contact [data-motion-target="contact-close"]');
    assert(await page.locator('#contact a[href^="mailto:"]').count() === 1, "Contact email must remain reachable");
    await page.screenshot({ path: ".playwright-cli/fixes-contact-normal.png" });
    const completions = await page.evaluate(() => window.revealCompletions);
    assert(completions.includes("hero-proof") && completions.includes("flagship-story-buddy"), "Named reveal completion events must reach nested effects");

    const nav = page.getByRole("navigation", { name: "Homepage sections", exact: true });
    const chapters = ["01 Identity", "02 Flagships", "03 Tech Stack", "04 Experience", "05 More Work", "06 Presence", "07 Contact"];
    assert(await nav.getByRole("button").count() === 7, "Chapter rail must contain all seven chapters");
    for (const chapter of chapters) {
      await nav.getByRole("button", { name: `Go to section ${chapter}`, exact: true }).click();
      await page.waitForTimeout(1100);
      assert(await nav.getByRole("button", { name: `Go to section ${chapter}`, exact: true }).getAttribute("aria-current") === "true", `Wrong active chapter: ${chapter}`);
      assert(await page.evaluate(() => document.activeElement?.id === location.hash.slice(1)), `Chapter focus did not reach its target: ${chapter}`);
    }

    for (const theme of ["light", "dark"]) {
      await page.evaluate((value) => { localStorage.setItem("theme", value); document.documentElement.classList.toggle("dark", value === "dark"); document.documentElement.classList.toggle("light", value === "light"); }, theme);
      for (const width of [1440, 768, 375]) {
        await page.setViewportSize({ width, height: 1000 });
        await page.locator("#presence").scrollIntoViewIfNeeded();
        await page.locator(".hm-grid").waitFor();
        await page.locator(".hm-grid").scrollIntoViewIfNeeded();
        const size = await page.locator(".hm-grid").evaluate((grid) => {
          const a = grid.children[0].getBoundingClientRect();
          const b = grid.children[7].getBoundingClientRect();
          return { cell: a.width, height: a.height, gap: b.left - a.right, slots: grid.children.length, right: grid.getBoundingClientRect().right, viewport: innerWidth };
        });
        assert(size.cell === (width < 640 ? 9 : 11) && size.height === size.cell && size.gap === (width < 640 ? 2 : 3), `Heatmap geometry wrong at ${width}: ${JSON.stringify(size)}`);
        assert(size.slots === 140 && size.right <= size.viewport, "Heatmap must fit all 140 slots without overflow");
        measurements.push({ theme, width, cell: size.cell, gap: size.gap });
      }
    }
    await page.locator('.hm-grid [data-date]').first().hover();
    await page.getByRole("tooltip").waitFor();
    assert(await page.getByRole("tooltip").count() === 1, "Use one shared tooltip");
    await page.keyboard.press("Escape");
    await page.getByRole("tooltip").waitFor({ state: "hidden" });
    await page.screenshot({ path: ".playwright-cli/fixes-heatmap-mobile-dark.png" });

    await ready(`${base}/projects/clarift`);
    assert(await page.title() === "Clarift | Hans Amoguis", "Project title must contain the owner once");
    assert(await page.locator('meta[property="og:title"]').getAttribute("content") === "Clarift | Hans Amoguis", "OG title must retain owner");
    assert(await page.locator('meta[name="twitter:title"]').getAttribute("content") === "Clarift | Hans Amoguis", "Twitter title must retain owner");
    await visible("#project-brief");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await ready(base);
    await visible('#identity .grid.grid-cols-1.md\\:grid-cols-3');
    await visible('[data-motion-target="flagship-record-story-buddy"]');
    await visible('#contact [data-motion-target="contact-close"]');
    await ready(`${base}/projects/clarift`);
    await visible("#project-brief");
    assert(errors.length === 0, `Browser errors: ${errors.join("\n")}`);
    return { result: "PASS: normal/reduced reveals, completion events, 7 chapter anchors/focus/active state, heatmap geometry/themes/tooltip, project metadata, clean console", measurements };
  } finally {
    page.off("pageerror", onError);
    page.off("console", onConsole);
  }
}
