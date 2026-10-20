import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import ts from "typescript";
const fixture = JSON.parse(fs.readFileSync(new URL("./github-calendar-fixture.json", import.meta.url), "utf8"));

// Exercise the public provider functions with an empty environment or a captured
// public calendar. Only the network and clock are replaced, never provider logic.
function loadProvider(name, env = {}, fetch = async () => { throw Error("Unexpected network"); }) {
  const cache = new Map();
  class Clock extends Date {
    constructor(...args) { super(...(args.length ? args : ["2026-10-20T18:00:00Z"])); }
  }
  function load(filename) {
    if (cache.has(filename)) return cache.get(filename).exports;
    const loadedModule = { exports: {} };
    cache.set(filename, loadedModule);
    const source = fs.readFileSync(filename, "utf8");
    const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
    vm.runInNewContext(compiled, {
      module: loadedModule, exports: loadedModule.exports, Date: Clock, Intl, fetch,
      process: { env },
      require: (id) => load(path.resolve(id.replace("@/", "") + ".ts")),
    }, { filename });
    return loadedModule.exports;
  }
  return load(path.resolve(`lib/activity/${name}.ts`));
}

async function checkMissingConfig() {
  for (const [name, publicName] of [["github", "GitHub"], ["spotify", "Spotify"], ["discord", "Discord"]]) {
    const provider = loadProvider(name);
    const result = await provider[`get${publicName}Activity`]();
    assert.equal(result.ok, false);
    assert.equal(result.error.code, "missing_config");
    assert.equal(result.error.message, `${publicName} activity is unavailable right now.`);
    assert.doesNotMatch(JSON.stringify(result), /GITHUB_|SPOTIFY_|DISCORD_/);
  }
  console.log("PASS: all three public providers retain missing_config without configuration names");
}

async function checkCalendar() {
  const weeks = [];
  for (const day of fixture.days) {
    if (!weeks.length || day.weekday === 0) weeks.push({ contributionDays: [] });
    weeks.at(-1).contributionDays.push(day);
  }
  const provider = loadProvider("github", { GITHUB_TOKEN: "fixture-only", GITHUB_USERNAME: "fixture" }, async (_url, options) => {
    const { query } = JSON.parse(options.body);
    return { ok: true, json: async () => query.includes("GitHubActivityStats")
      ? { data: { user: { contributionsCollection: { contributionCalendar: { totalContributions: 0, weeks } } } } }
      : { data: { user: { repositories: { nodes: [] } } } } };
  });
  const result = await provider.getGitHubActivity();
  assert.equal(result.ok, true);
  const calendar = JSON.parse(JSON.stringify(result.data.calendar));
  assert.equal(calendar.length, 53, "Keep 53 Sunday-aligned weeks, including the current partial week");
  assert.equal(calendar[0].start, "2025-10-19");
  assert.deepEqual(calendar[0].days, [null, null, null, null, null, null, null], "Days outside the captured range stay null");
  assert.deepEqual(calendar[33].days[0], { date: "2026-06-07", count: 47, level: 4 });
  assert.deepEqual(calendar[52], { start: "2026-10-18", days: [
    { date: "2026-10-18", count: 3, level: 2 },
    { date: "2026-10-19", count: 38, level: 4 },
    { date: "2026-10-20", count: 26, level: 4 },
    { date: "2026-10-21", count: 0, level: 0 }, null, null, null,
  ] });
  assert(calendar.every((week) => week.days.length === 7));
  console.log("PASS: captured calendar starts Sunday, keeps Manila today, and pads future slots");
}

(async () => {
  const checks = process.argv[2] === "calendar" ? [checkCalendar] : process.argv[2] === "config" ? [checkMissingConfig] : [checkCalendar, checkMissingConfig];
  for (const check of checks) await check();
})().catch((error) => { console.error(error); process.exitCode = 1; });
