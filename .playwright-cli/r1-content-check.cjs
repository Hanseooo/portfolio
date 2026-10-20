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
    await page.goto("http://localhost:3000/");
    const flagshipSlugs = await page.locator('[data-motion-target^="flagship-record-"]').evaluateAll(
      (nodes) => nodes.map((node) => node.dataset.motionTarget.replace("flagship-record-", ""))
    );
    assert(JSON.stringify(flagshipSlugs) === '["story-buddy","clarift","le-doux"]', "Flagships must be StoryBuddy, Clarift, Le Doux");
    assert(await page.locator('[data-motion-target="flagship-record-story-buddy"] h3').evaluate((node) => node.scrollWidth <= node.clientWidth), "StoryBuddy title must wrap without clipping");
    const supportingSlugs = await page.locator('[data-motion-target^="supporting-record-"]').evaluateAll(
      (nodes) => nodes.map((node) => node.dataset.motionTarget.replace("supporting-record-", ""))
    );
    assert(JSON.stringify(supportingSlugs) === '["simply-note","the-podium","hcdc-lfms"]', "Supporting projects must keep their curated order");
    const proof = page.getByRole("region", { name: "Hans Amoguis", exact: true });
    const proofText = await proof.textContent();
    for (const value of ["75%", "5", "11", "Client-reported, Le Doux"]) {
      assert(proofText.includes(value), `Hero proof missing ${value}`);
    }
    const supportingText = await page.locator('[data-motion-target^="supporting-record-"]').allTextContents();
    assert(supportingText.every((text, index) => text.trim().startsWith(["04", "05", "06"][index])), "Supporting numbering must continue after three flagships");
    assert(await page.locator('[data-motion-target^="experience-record-"]').count() === 3, "Homepage must show all three experience records");
    const companies = await page.locator('[data-motion-target^="experience-record-"]').evaluateAll((nodes) => nodes.map((node) => node.dataset.motionTarget));
    assert(JSON.stringify(companies) === '["experience-record-eskwelabs","experience-record-durianpy","experience-record-freelance"]', "Homepage experience must resolve the correct records by ID");
    assert(!(await page.locator("main").innerText()).includes("80%"), "Homepage must not publish the recruitment target");
    const evidence = page.getByRole("link", { name: "5 merged PRs", exact: true });
    assert(await evidence.getAttribute("href") === "/experience#durianpy", "DurianPy proof must link to the full evidence");
    await evidence.click();
    await page.waitForURL("**/experience#durianpy");
    assert(await page.locator("h2").count() === 3, "Experience must show three records");
    assert(await page.locator('#durianpy a[href*="/pull/"]').count() === 5, "DurianPy must expose all five merged PRs");
    assert(await page.locator("#eskwelabs figure").count() === 4, "Eskwelabs must show four screenshots");
    assert(!(await page.locator("#freelance").innerText()).includes("2026"), "Freelance must omit the unknown period");
    assert(!(await page.locator("main").innerText()).match(/80%|inneficient/), "Experience must omit unsupported copy and the typo");
    await page.goto("http://localhost:3000/projects/story-buddy");
    assert(await page.getByRole("heading", { name: "StoryBuddy", exact: true }).count() === 1, "StoryBuddy detail must render");
    assert((await page.locator("main").innerText()).includes("11-node deterministic LangGraph"), "StoryBuddy must explain the verified pipeline");
    assert(await page.locator("#project-screenshots img").count() === 1, "StoryBuddy must show the public research screenshot without duplicating its hero");
    const sitemap = await page.request.get("http://localhost:3000/sitemap.xml");
    assert(sitemap.ok() && (await sitemap.text()).includes("/projects/story-buddy"), "StoryBuddy must appear in the sitemap");
    await page.goto("http://localhost:3000/projects/the-podium");
    assert(await page.getByRole("link", { name: "Source Code" }).getAttribute("href") === "https://github.com/Hanseooo/the-podium", "Podium must point to the renamed repository");
    assert(errors.length === 0, `Browser errors: ${errors.join("\n")}`);
    return "PASS: R1 homepage, experience evidence, StoryBuddy route/gallery/sitemap, Podium URL, clean console";
  } finally {
    page.off("pageerror", onError);
    page.off("console", onConsole);
  }
}
