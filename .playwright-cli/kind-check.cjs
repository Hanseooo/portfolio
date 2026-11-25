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
  const expected = { "story-buddy": "Capstone", clarift: "Personal", "le-doux": "Client" };
  page.on("pageerror", onError);
  page.on("console", onConsole);
  try {
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("http://localhost:3000/");
      for (const [slug, kind] of Object.entries(expected)) {
        const tag = page.locator(`[data-motion-target="flagship-record-${slug}"] [data-project-kind]`);
        assert(await tag.count() === 1, `Selected Work plate for ${slug} must carry one kind tag`);
        assert((await tag.innerText()).trim().toLowerCase() === kind.toLowerCase(), `${slug} plate tag must read ${kind}`);
      }
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `No horizontal scroll on / at ${width}px`);
    }
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("http://localhost:3000/projects/le-doux");
    const meta = (await page.locator("main").first().innerText());
    assert(/client · le doux/i.test(meta), "Le Doux masthead must read Client · Le Doux");
    assert(!/client: le doux/i.test(meta), "Le Doux masthead must drop the old Client: line");
    await page.goto("http://localhost:3000/projects/story-buddy");
    assert(/capstone/i.test(await page.locator("main").first().innerText()), "StoryBuddy masthead must say Capstone");
    await page.goto("http://localhost:3000/projects");
    const list = await page.locator("main").first().innerText();
    for (const word of ["Capstone", "Client · Le Doux", "Academic", "Personal"]) {
      assert(list.toLowerCase().includes(word.toLowerCase()), `/projects must show ${word}`);
    }
    assert(errors.length === 0, `Browser errors: ${errors.join("\n")}`);
    return "PASS: kind tags on Selected Work plates (1440/390), masthead and /projects lead with kind, Client · Le Doux, clean console";
  } finally {
    page.off("pageerror", onError);
    page.off("console", onConsole);
  }
}
