# Verified defects — design

**Date:** 2026-10-20
**Status:** DONE (implemented and verified 2026-10-20)
**Docket:** `docs/dockets/portfolio-refresh-docket.md` · R4

## Purpose

These defects were seen on localhost:3000 and on production on 2026-10-20. Each comes with a check
that fails today. A fix is done when that check passes. The project has no test runner, so
checks are `playwright-cli` evals or shell one-liners. They live here, not in the repo.

Run the browser checks against `pnpm dev` on `http://localhost:3000`.

## D1 · Content invisible under reduced motion (high)

**Seen:** with `reducedMotion: 'reduce'`, every Capabilities cell stays at opacity 0, shifted by
`translateY`. With `no-preference` they reach opacity 1.

**Cause (measured):** SSR renders the Framer `initial` state (opacity 0). On the client,
`usePrefersReducedMotion` turns true, and `fadeUpReveal`, `clipReveal`, `maskReveal`, and
`peelReveal` in `lib/motion.ts` return `{}`. That drops `whileInView`/`animate`, so nothing
animates out of the SSR inline style.

**Fix:** under reduced motion every recipe returns an explicit visible end state:
`{ initial: false }` together with the recipe's visible target. Do not return an empty object.
The shared fix is in `lib/motion.ts`, and every caller benefits. S5 already requires "a
complete static mode", so this restores it.

**Check:**
```bash
playwright-cli run-code "async page => { await page.emulateMedia({ reducedMotion: 'reduce' }); await page.goto('http://localhost:3000/'); await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); await page.waitForTimeout(800); return page.evaluate(() => [...document.querySelectorAll('main *')].filter(el => el.getBoundingClientRect().height > 0 && getComputedStyle(el).opacity === '0' && !el.closest('[aria-hidden=true], nav')).length); }"
```
Red today: > 0. Green: `0`.

## D2 · Hydration mismatch in the hero proof (medium)

**Seen:** the dev console reports a hydration mismatch on `data-reveal-id="hero-proof"`, with
inline `opacity` and `transform` that differ.

**Candidate causes. Test both before fixing:**
1. Same root as D1. The reduced-motion and capability hooks give a different value on the
   server than on the first client render, so the motion props differ.
2. `HeroProofCards` reads a client-only value (`useClientReady`, window size) during render
   instead of after mount.

**Check:** load `/` with a fresh dev server, then `playwright-cli console error`. Red: a message
contains "hydrat". Green: none.

## D3 · Fixed header has no background (high)

**Seen:** `components/shell/GlobalNav.tsx` renders `<header className="fixed top-0 z-50 w-full">`
with no background. Nav text runs over case-study screenshots and cards while scrolling.

**Fix:** a solid `--cs-foundation` background with a `--cs-structural-line` bottom rule once
`scrollY > 0`. Use a data attribute set by the existing client nav, and let CSS own the
transition (S5). No blur, since S2 bans glass.

**Check:**
```bash
playwright-cli run-code "async page => { await page.goto('http://localhost:3000/projects/le-doux'); await page.evaluate(() => window.scrollTo(0, 900)); await page.waitForTimeout(300); return page.evaluate(() => getComputedStyle(document.querySelector('header')).backgroundColor); }"
```
Red: `rgba(0, 0, 0, 0)`. Green: an opaque color.

## D4 · Chapter rail overlaps content at 1440px (medium)

**Seen:** at 1440×900 the rail label "05 PRESENCE" sits on top of the GitHub stat "287".

**Fix:** the rail reserves its column in the `hp-grid` gutter at `xl`. Below the width where it
fits, it falls back to S3's compact stage marker. Do not shrink content to make room.

**Check:**
```bash
playwright-cli resize 1440 900
playwright-cli run-code "async page => { await page.goto('http://localhost:3000/#presence'); await page.waitForTimeout(600); return page.evaluate(() => { const rail = document.querySelector('.hp-chapter-nav'); if (!rail) return 'no rail'; const r = rail.getBoundingClientRect(); return [...document.querySelectorAll('#presence p, #presence span, #presence h2, #presence h3')].filter(el => { const b = el.getBoundingClientRect(); return b.width && !(b.right < r.left || b.left > r.right || b.bottom < r.top || b.top > r.bottom); }).length; }); }"
```
Red: > 0. Green: `0`. Adjust the rail selector to the real `aria-label` in
`HomepageChapterNav.tsx` before the first run.

## D5 · Next infers the wrong workspace root (low)

**Seen:** `pnpm dev` and `pnpm build` warn that the workspace root was inferred from
`C:\Users\Admin\package-lock.json`.

**Fix:** set `turbopack: { root: __dirname }` in `next.config.ts`. The option is checked in the
installed `next/dist/server/config-shared.d.ts`. Deleting the stray lockfile in the home folder
is Hans's call, outside the repo.

**Check:** `pnpm build 2>&1 | grep -ci "workspace root"`. Red: ≥ 1. Green: `0`.

## D6 · Repo hygiene (low)

- `cert-slug-{top,mid,bottom,next}.png` are tracked at the repo root and referenced nowhere
  (`rg cert-slug` finds no hits). Remove them with `git rm`.
- `pnpm-workspace.yaml` (pnpm `allowBuilds` for `sharp` and `unrs-resolver`) is untracked.
  Commit it, since installs on other machines need it.

**Check:** `git ls-files 'cert-slug-*' | wc -l`. Red: 4. Green: 0.

## Covered elsewhere

- Env var names in public error text, the Spotify focus ring, and the "Commits" label are in R2.
- Experience typos and the Le Doux "multi-tenant" wording are in R1.
- Spotify auth failure in production is Hans's job: regenerate the refresh token in Vercel.

## Tickets

| Id | Ticket | Done when |
|---|---|---|
| R4-1 | D1 reduced-motion recipes | D1 check returns 0 |
| R4-2 | D2 hydration | No "hydrat" console errors on `/` |
| R4-3 | D3 header background | D3 check returns an opaque color, in light and dark |
| R4-4 | D4 rail overlap | D4 check returns 0 at 1440×900 and 1280×800 |
| R4-5 | D5 workspace root | The build output has no workspace-root warning |
| R4-6 | D6 hygiene | No stray PNGs. `pnpm-workspace.yaml` committed |

## Implementation and verification (2026-10-20)

- R4-1: zero hidden content elements before scrolling, at the bottom, and after changing
  motion preferences at runtime. Exclude intentionally hidden navigation labels from D1.
  Presence and Contact had independent hidden variants, so they also need immediate visible
  states. The shared recipes reset all animated properties with zero duration.
- R4-2: the module-level capability default resolved browser facts on the client, causing
  different SSR and initial client output. A fixed static default fixes the mismatch.
  HeroProofCards has no client-only render inputs. Fresh browser loads have no console errors.
- R4-3: at scrollY 900, header backgrounds are rgb(243, 240, 233) in light mode and
  rgb(8, 9, 9) in dark mode, with the theme structural bottom rule.
- R4-4: the original #presence check missed the collision lower in the scene. Also scroll
  the GitHub card to the middle of the viewport. This reproduced five overlaps before the
  fix and zero afterward at 1280x800, 1440x900, 1680x900, and 1920x900.
  Full rail starts at 1680px, where its column fits before the unchanged hp-grid content.
  Narrower desktop widths use a current-stage marker in the header. Its Enter action focuses
  the current section at 80px, below the header. It clears header links at 1024px as well.
- R4-5: installed Next types confirm turbopack.root. Dev startup and production build have
  no workspace-root warning.
- R4-6: no cert-slug references outside this spec. All four tracked PNGs removed and
  pnpm-workspace.yaml included in the R4 commit.
- Commands: pnpm.cmd lint, pnpm.cmd build, and playwright-cli.cmd browser checks on
  http://localhost:3000/. The .cmd shims avoid PowerShell's script execution policy.
- Lint: exit 0, three existing unused-variable warnings. Build: exit 0, 37 generated pages.
  Build still warns about broad file tracing from lib/og-image.tsx. That separate warning
  is outside R4. No test runner or dependency was added.
