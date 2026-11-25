// eslint-disable-next-line @typescript-eslint/no-unused-expressions -- Playwright CLI expects a function expression.
async (page) => {
  const errors = [];
  const onError = (error) => errors.push(error.message);
  const onConsole = (message) => {
    if (message.type() === "error") errors.push(message.text());
  };
  const assert = (condition, message) => {
    if (!condition) throw new Error(message);
  };
  page.on("pageerror", onError);
  page.on("console", onConsole);
  try {
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("http://localhost:3000/projects/story-buddy");
      const section = page.locator("#project-pipeline");
      assert(await section.count() === 1, "StoryBuddy must have a Pipeline section");
      const steps = await section.locator("ol > li").allInnerTexts();
      assert(steps.length === 7, `Pipeline must list 7 steps, got ${steps.length}`);
      assert(steps[0].includes("Input gate") && steps[6].includes("Compose"), "Pipeline must run from Input gate to Compose");
      assert(steps[5].includes("up to 2 retries"), "The consistency check must carry its regeneration loop");
      assert(/grouped from the 14-node graph/i.test(await section.innerText()), "Pipeline must say the drawn steps summarize the 14-node graph");
      const [numberColor, bracketColor] = await section.evaluate((s) => [
        getComputedStyle(s.querySelector("ol > li:first-child .border > span:first-child")).color,
        getComputedStyle(s.querySelector("[data-draw='extend-x']")).borderBottomColor,
      ]);
      assert(numberColor !== bracketColor, `Step numbers must not use the retry bracket's signal color (${numberColor})`);
      assert(await page.locator('nav a[href="#project-pipeline"]').count() === 1, "Section nav must link to Pipeline");
      const order = await page.locator("section[id^='project-']").evaluateAll((nodes) => nodes.map((node) => node.id));
      assert(order.indexOf("project-pipeline") === order.indexOf("project-decisions") + 1, "Pipeline must follow Decisions");
      for (const path of ["/research/pipeline", "/research/architecture"]) {
        assert(await section.locator(`a[href="https://storybuddy.hanseo.tech${path}"]`).count() === 1, `Pipeline must link to ${path}`);
      }
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `No horizontal scroll at ${width}px`);
    }
    await page.goto("http://localhost:3000/projects/le-doux");
    assert(await page.locator("#project-pipeline").count() === 0, "Projects without a pipeline must omit the section");
    assert(await page.locator('nav a[href="#project-pipeline"]').count() === 0, "Projects without a pipeline must omit the nav link");
    assert(errors.length === 0, `Browser errors: ${errors.join("\n")}`);
    return "PASS: StoryBuddy pipeline section, order, nav, links, no overflow at 1440/390, omitted on Le Doux, clean console";
  } finally {
    page.off("pageerror", onError);
    page.off("console", onConsole);
  }
}
