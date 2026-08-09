# Performance & Smoothness Audit — Design Spec

- Date: 2026-08-09
- Scope: whole repo, homepage-first
- Priorities (in order): **scroll smoothness / frame rate**, **initial load (LCP/TBT)**, **code health / dead weight**
- Binding constraint: **optimize the existing motion stack in place.** framer-motion + GSAP/ScrollTrigger + Lenis all stay. No consolidation, no rewrites of animated sections.

## Status

| Phase | State | Commits |
|---|---|---|
| 0 — baseline | **done** | measured 2026-08-09; see §0 |
| 1 — free wins | **done** | `bf17c5e` |
| 2 — deletion | **done** | `e811842` `d5bbb2b` `1d09d37` `a9e5940` `15ca291` `0dc52cc` `4a8df3e` |
| 3 — frame rate | **done** | `61dd989` |
| 4 — load | not started | L1 dropped (falsified) |
| 5 — correctness | not started | |

Result so far: 71 files / 5,935 lines deleted, 0 unreachable files remaining. Chunks 1,296,577 → 1,253,628 bytes.

---

## 0. Evidence base

Measured on the repo at `93d6410` plus the uncommitted working tree.

| Measure | Value | How |
|---|---|---|
| Source TS/TSX | 15,498 lines | `wc -l` over `app/ components/ lib/` |
| **Unreachable from `app/`** | **72 files / 5,926 lines (38%)** | transitive import graph from every `app/**` entrypoint |
| Client components | 83 of 121 `.tsx` | `grep -l '"use client"'` |
| Built JS chunks (raw) | 1.2 MB | `.next/static/chunks` after `pnpm build` |
| Tracked image assets | ~7.5 MB | `app/assets` + `public` |
| `next.config.ts` | **empty** | no `images`, no `optimizePackageImports` |
| Build / typecheck | passing | `pnpm build` exit 0 |

**Phase 0 browser baseline (2026-08-09, local, homepage):** LCP **0.53 s** (element: the `Amoguis` name span), CLS **0.02** (worst cluster 2 shifts), INP **8 ms**. All three in Chrome's "good" band before any change. This is a local run, not throttled — it is a regression guard, not a field measurement. `ScrollTrigger.getAll()` is unavailable from the console (bundled, not global); use `lib/performance-checks.ts` for instance counts.

Two known limits of the reachability scan: it follows `@/` and relative specifiers only, and it treats every file under `app/` as live. Anything the deletion phase touches gets an independent `grep` before removal.

---

## 1. Findings

Ranked by cost. `P0` = do first.

### Scroll smoothness

**S1 — `createHeroParallax` creates one ScrollTrigger per layer.** `lib/gsap-effects.ts:58-70`
`layers.map(...)` builds an independent `gsap.to` **with its own `scrollTrigger`** for every `[data-parallax-speed]` node. `SceneIdentity` marks six: the grid backdrop (`0.45`), both name spans (`1.5`, `0.8`), the portrait slot (`-1.2`), the geometry wrap (`-1.1`), the image drift box (`-0.8`). Every one has an identical `trigger`/`start`/`end`, so this is six ScrollTrigger instances, six scrub tweens, and six `refresh()` measurement passes doing what one can do. It also directly violates the project's own `DENSITY_BUDGET.maxConcurrentScrollEffects: 3` (`lib/motion-budget.ts`).
**Fix:** one ScrollTrigger, one timeline, layers added as parallel tweens at position `0`. Same visual result, 1/6 the per-frame bookkeeping.
**P0.**

**S2 — Parallax is applied to a masked layer and a blurred layer.** `components/homepage/SceneIdentity.tsx:40-53`, `:125`
The grid backdrop carries `maskImage: radial-gradient(...)` and moves at `0.45`; the orb carries `blur-2xl` and sits inside the `-1.1` layer. Masks and filters force the compositor to re-rasterize the layer as it moves rather than just re-position it. This is the most likely source of hero-scroll jank on mid-tier GPUs and mobile.
**Fix:** move `data-parallax-speed` off the masked/filtered nodes onto a plain wrapper `div`, so the transform lands on an unfiltered element and the mask/blur rides along as static child paint.
**P0.**

**S3 — Context values rebuilt every render.** `components/motion/ScrollEnhancementController.tsx:109-115`, `components/motion/RouteHandoffController.tsx:154-158`
Both providers construct `const api = {...}` inline. Any render of either provider hands consumers a new object identity, re-rendering **every** `useScrollEnhancement`/`useRouteHandoff` consumer. `RouteHandoffProvider` re-renders on each `phase` transition (4 per navigation) and wraps the entire app.
**Fix:** `useMemo` on the dependencies already listed in the callbacks.
**P0** — one-line each.

**S4 — Capability resolution forces a full-tree re-render after hydration.** `components/providers/CapabilityProvider.tsx:33-47`
`CapabilityProvider` mounts with the reduced-motion defaults, then resolves real facts in `useEffect` and `setValue`. Because the provider sits above everything, the first commit after hydration re-renders the whole tree, and every `StructuredReveal`/`HeroDepthEffect`/`BrandedArrival` flips behaviour at that moment. That is a guaranteed second full render + style recalc landing exactly when the main thread is busiest.
**Fix:** resolve facts in `useState`'s lazy initializer (client-only, runs during the first client render instead of after it), keeping the SSR default for the server pass. Keep the `matchMedia` listener for later changes. Net effect: one commit instead of two.
**P1** — behaviourally sensitive; verify no hydration mismatch warning appears.

**S5 — Capability tier never updates on resize or orientation change.** `components/providers/CapabilityProvider.tsx:44`
Only `prefers-reduced-motion` is listened to. `viewportHeight`/`viewportWidth` feed `short-height` and `mobile-touch` tiers, so rotating a phone or resizing a window leaves the site on a stale tier — a short-height laptop that gets maximised never regains full-desktop motion, and vice versa.
**Fix:** add a debounced `resize`/`orientationchange` listener that re-runs `resolve` and bails when the resulting decisions are deep-equal, so it doesn't re-render on every pixel.
**P1.**

**S6 — Two live Lenis implementations.** `components/motion/ScrollEnhancementController.tsx` (live) and `components/providers/LenisProvider.tsx` (unreachable, via unreachable `AppProviders.tsx`)
The orphan sets `window.__lenis`, calls `ScrollTrigger.clearScrollMemory()`, and forces `history.scrollRestoration = "manual"`. It is dead today, but it is a loaded gun: any re-introduction of `AppProviders` yields two Lenis instances both driving `gsap.ticker`.
**Fix:** delete with the rest of §2. **P1.**

**S7 — Ticker marquees animate forever, offscreen included.** `app/globals.css:389-400`
`.ticker-track` / `.ticker-track-reverse` are `animation: … linear infinite` with no `content-visibility` or intersection gating. They keep a compositor layer alive and ticking for the life of the page even when scrolled far away.
**Fix:** `content-visibility: auto` + `contain-intrinsic-size` on the ticker row, or pause via `IntersectionObserver`. Under `prefers-reduced-motion` they are only `paused`, not removed — the layer still exists; consider `animation: none`.
**P2.** — **done in `61dd989`**, applied to `.ticker-fade` (the real wrapper). Note the `.ticker-row:hover` pause rules at `app/globals.css:397-400` target a class **no component uses**; they are dead selectors, left in place.

**S8 — Uncommitted WIP introduces two frame-hostile recipes.** `lib/motion.ts` (working tree), `components/motion/SplitText.tsx` (untracked)
- `maskReveal` animates `clipPath: polygon(...)` — animated `clip-path` on an arbitrary polygon is not compositor-accelerated in Chromium and repaints the element every frame.
- `peelReveal` animates four properties including `rotateX`, forcing a 3D context per element.
- `SplitText` wraps **every character** in its own `motion.span` with `rotateX` and `transformOrigin`. A 40-character heading becomes 40 animating layers plus 40 React components. `key={index}` on top.

These are not shipped yet — none of the three has an importer. Decide before wiring them in.
**Fix:** for `maskReveal`, use `inset()` clip-path (compositable in Chromium) or a `translateY` inside an `overflow:hidden` wrapper — visually equivalent and free. For `SplitText`, split on **words**, not characters, and drop `rotateX`. Cap it to headings under ~8 words.
**P1** (before merge, not after).

**S9 — `StructuredReveal` recomputes variants every render.** `components/motion/StructuredReveal.tsx:45-46`
`recipeData.getVariants(tier)` runs on every render and returns a fresh object, so framer-motion re-diffs variants it already has. Cheap individually, but this component wraps most of the page.
**Fix:** `useMemo` on `[recipe, tier]`. **P2.**

**S10 — Hero LCP image has a hover transform inside a parallax layer.** `components/homepage/SceneIdentity.tsx:142`
`transition-transform duration-700 hover:scale-105` on the `<Image>` whose ancestor is transformed every scroll frame by GSAP. Nested transform animation on the largest painted element.
**Fix:** move the hover scale to a wrapper that is not a parallax target, or drop it — the portrait already has a static offset-block treatment.
**P2.**

### Initial load

**L1 — ~~`BrandedArrival` blocks first meaningful paint~~ — FALSIFIED, do not action.** `components/motion/BrandedArrival.tsx:88-172`

> **Measured 2026-08-09: LCP = 0.53 s, CLS = 0.02, INP = 8 ms — all green.** LCP fires *earlier* than the 900 ms arrival hold. The original claim below assumed Chrome withholds LCP until the element is unoccluded; it does not — LCP ignores occlusion by an overlay. `ARRIVAL_HOLD_MS` therefore does not gate the metric, and shortening it will not improve LCP.
>
> The arrival is still a real perceived wait, but that is a **feel** decision that was tuned deliberately. It is out of scope for a performance pass. Leave `ARRIVAL_HOLD_MS = 900` alone.
>
> Secondary items 2 and 3 below stand on their own merits (main-thread cost during hydration), independent of LCP.

~~Original claim:~~ `visible` initialises to `true` and the overlay renders from the **server pass onward**, so an opaque `--cs-foundation` plane covers the viewport from the first paint. It stays for `ARRIVAL_HOLD_MS = 900` and then takes `0.6 s` to slide away. ~~LCP cannot be reported until the hero is actually visible, so this is a hard ~1.5 s floor on LCP for every first-time visitor.~~

Two secondary costs in the same component:
- `document.body.style.overflow = "hidden"` during arrival (`:131`) — scroll input in the first 900 ms is swallowed.
- A `MutationObserver` on `document.body` with `subtree: true` (`:138-139`) runs for the whole arrival window, i.e. across the entire hydration mutation storm, purely to detect an error page.

**Fix, in order:**
1. ~~Reduce `ARRIVAL_HOLD_MS`~~ — **dropped.** Falsified by measurement; see above.
2. Replace the `subtree` MutationObserver with a single check on the `schedule`-completion tick, or have the error/not-found routes dispatch an event instead of being polled for.
3. Consider gating the arrival to first-visit-per-session via `sessionStorage`, so repeat navigations within a session skip it entirely.

**P2**, downgraded from P0 — only item 2 has a measurable main-thread cost left.

**L2 — `next.config.ts` is empty.** `next.config.ts`
No `images` config (no AVIF, default device sizes, default 60 s minimumCacheTTL), no `experimental.optimizePackageImports`. `lucide-react` is imported by name in at least a dozen files; `framer-motion` and `gsap` are both full-package imports.
**Fix:**
```ts
const nextConfig: NextConfig = {
  images: { formats: ["image/avif", "image/webp"], minimumCacheTTL: 31536000 },
  experimental: { optimizePackageImports: ["lucide-react", "framer-motion"] },
};
```
Cheapest win in the whole document. **P0.**

**L3 — `lib/projects.ts` (390 lines, ~50 static image imports) is pulled into client bundles.** `components/projects/{ProjectHero,ProjectBrief,ProjectFeatures,ProjectNextPrev,ProjectTechnicalDecisions}.tsx`, `components/cards/ProjectCard.tsx`, `components/sections/{Projects,FeaturedProjectsSection}.tsx`
Every one of these is `"use client"` **and** imports `@/lib/projects` directly. That ships the full project registry — every project's copy, every `StaticImageData` descriptor for all ~50 screenshots — into the client bundle of any page that renders one, rather than passing the one projection the component needs as a prop.

Six of the eight are unreachable and die in §2. The live path is the `app/projects/[slug]` tree, which already has a correct pattern to copy: `app/page.tsx` calls `lib/content/homepage-projections.ts` on the server and passes plain projections down, and `SceneFlagships` is a **server** component that renders client islands.
**Fix:** whichever of these survive §2 must receive projections as props from a server component instead of importing `@/lib/projects`. **P1.**

**L4 — `SceneIdentity` is `"use client"` for two `motion.div`s.** `components/homepage/SceneIdentity.tsx:1`
The entire hero — ~200 lines of static markup, the `hp-grid` layout, both CTAs, the geometry, the telemetry strip — is a client component. The only client-requiring parts are the two `staggerItem` proof cards and the already-islanded `StructuredReveal` / `HeroDepthEffect`.

The sibling `SceneFlagships.tsx` is a **server** component doing exactly the same job with the same island primitives, which proves the pattern works here. `SceneIdentity` is the odd one out.
**Fix:** drop `"use client"`, move the two `motion.div` proof cards into a small `HeroProofCards` client child. **P1.**

**L5 — Unreferenced heavyweight source images tracked and shipped.** `app/assets/`
`hans2.jpg` (1,230 KB), `hans.jpg` (875 KB), `hans2.webp` (621 KB), `pythonEssentials1.png` (582 KB), `intro-to-modern-ai.png` (522 KB), `national-programming-challenge-2024.png` (360 KB), `eskwelabs-cert.jpg` (103 KB) all sit alongside `.webp` twins that are the ones actually imported. `hans.webp` itself is 496 KB for a portrait rendered in a 404 px-tall frame.
**Fix:** delete the unimported `.jpg`/`.png` twins after confirming each has no importer; re-encode `hans.webp` to the largest size the layout can request (`sizes` caps it at 400 px wide on desktop, 100vw on mobile — a 900 px-wide source is ample).
**P1.**

**L6 — Live-activity polling never stops.** `components/homepage/ScenePresenceClient.tsx:94-96`
Spotify and Discord poll every **20 s**, GitHub every 5 min, for the whole session. The visibility check only skips background tabs — a visible tab scrolled to the hero still fires two requests every 20 s against `/api/activity/*`, each waking three separate `useState` setters and re-rendering the presence tree. Scene 05 is near the bottom of a six-scene page.
**Fix:** gate polling on an `IntersectionObserver` for the presence section — poll only while it is on or near screen; do one fetch on mount for the initial paint and then idle. **P1.**

**L7 — Three Google font families loaded on every route.** `app/fonts.ts`
Inter (all weights), JetBrains Mono (all weights), Bricolage Grotesque (800). `display: swap` and `next/font` self-hosting are already correct. Inter and JetBrains Mono are loaded without a `weight` array, so the full variable range ships.
**Fix:** audit which weights are actually used and pin `weight` arrays. Lower confidence than the rest of this section — verify against the built CSS before acting. **P2.**

### Code health

**H1 — 72 unreachable files, 5,926 lines (38% of source).** See §2 for the list and the removal protocol.
This is the largest single item in the audit and it compounds every other one: it is why "is this component live?" costs a grep, and why two Lenis providers and two design-token systems can coexist unnoticed.
**P0** (as a standalone, mechanical phase).

**H2 — Two parallel design-token systems.** `app/globals.css:47-121` defines both the shadcn set (`--primary`, `--card`, `--muted`, …) and the Constructed Signal set (`--cs-*`). `lib/design-tokens/semantic.ts` (184 lines) is a **third** representation and is unreachable.
**Fix:** delete `lib/design-tokens/` in §2. Then determine whether any live component still reads a shadcn token — the shadcn UI primitives that consumed them (`components/ui/button.tsx`, `card.tsx`, `kbd.tsx`) are all unreachable. If nothing reads them, the `:root` shadcn block and the `@theme inline` mappings for it go too.
**P2** — do it after §2, when the answer is a clean grep.

**H3 — Universal-selector base rule.** `app/globals.css:138-140` — `* { @apply border-border outline-ring/50 }` sets two properties on every element in the document. It is the stock shadcn/Tailwind-v4 preamble and it is only worth removing as part of H2, if the shadcn token layer goes.
**P3.**

**H4 — `MobileMenu` documents a focus trap it does not implement.** `components/shell/MobileMenu.tsx:34` claims "Focus trapped while open". The implementation has focus-first (`:48-56`), Escape-to-close (`:59-66`), and body-scroll lock (`:69-74`) — but **no Tab handling**. Tabbing out of the last link lands on the page behind the `aria-modal="true"` overlay.
This is out of the three stated priorities, but it is a real defect in a live component, the comment actively misleads, and the fix is ~15 lines.
**Fix:** implement the trap, or correct the comment. Prefer the trap. **P1.**

---

## 2. Deletion phase

72 files, 5,926 lines unreachable from every `app/**` entrypoint. Confirmed dead by explicit grep: `AppProviders`, `LenisProvider`, `Navbar`, `PageTransition`, `HeroSection`, `LiveActivity`, `PhilosophySection`, `FeaturedProjectsSection`, `ExperienceSnapshotSection`, `FeaturedCertificatesSection`.

Removal protocol, per commit:
1. `grep -rn "<Basename>" app components lib` — must return only the file itself and its own directory's barrel.
2. Delete the file. Remove its line from any `index.ts` barrel.
3. `pnpm lint && pnpm build` must stay green.

Suggested commit split, so any revert is surgical:

| Commit | Contents | Lines |
|---|---|---|
| 1 | Legacy providers: `AppProviders`, `LenisProvider`, `GestureScrollProvider`, `MotionProvider`, `TransitionProvider`, `PageOverlay`, `PageTransition` | ~281 |
| 2 | Legacy homepage sections: `Hero`, `HeroSection`, `Projects`, `Certificates`, `Experience`, `About`, `LiveActivity`, `PhilosophySection`, `FeaturedProjectsSection`, `ExperienceSnapshotSection`, `FeaturedCertificatesSection` | ~1,860 |
| 3 | `components/sections/about/**` (12 files) | ~1,155 |
| 4 | Legacy layout + UI: `Navbar`, `Footer`, `FullScreenMenu`, `MenuToggle`, `ThemeToggle`, `Preloader`, `SectionDivider`, `button`, `card`, `kbd`, `grid-pattern` | ~684 |
| 5 | Legacy route bodies: `components/projects/**`, `components/certificates/**`, `components/cards/**`, `components/dialogs/**` — **verify against `app/projects/[slug]` and `app/certificates/[slug]` first**, this is the group most likely to contain a false positive | ~840 |
| 6 | Orphan utils + libs: `components/utils/*` (8 files), `lib/about.ts`, `lib/design-tokens/{index,semantic}.ts`, `lib/svgMap.tsx`, dead barrels | ~1,050 |

> **Correction (applied):** this row originally read `lib/design-tokens/**`. That is wrong — `lib/design-tokens/patterns.ts` is imported by `lib/anchor-navigation.ts:23` and `canonical.ts` is also live. Only `index.ts` and `semantic.ts` are dead. `lib/performance-checks.ts` was originally listed here too; it is **kept** — it is the only way to read ScrollTrigger instance counts, which §4 requires.

Two notes on judgment calls:
- **`lib/performance-checks.ts`** is a dev instrumentation module (ScrollTrigger counting, rAF FPS sampling). It is genuinely useful for verifying this very spec. Keep it and wire it into a dev-only path, or delete it — but decide deliberately rather than letting it sit unreferenced.
- **Commit 5** is the risky one. `app/projects/[slug]/page.tsx` and `app/certificates/[slug]/page.tsx` render `components/routes/*`, which is why `components/projects/*` reads as dead — but confirm by reading both page files before deleting.

---

## 3. Execution order

Sequenced so that measurement is possible and each phase lands on a smaller surface than the last.

**Phase 0 — baseline.** Record LCP, TBT, CLS, and a hero-scroll frame trace on a throttled profile (4× CPU, Fast 3G) before touching anything. Without this number, L1 is unarguable in either direction. Also record `.next/static/chunks` total.

**Phase 1 — free wins.** L2 (`next.config.ts`), S3 (memoize both context values), S9 (memoize variants). Three small diffs, zero behavioural risk.

**Phase 2 — deletion.** §2, six commits, `pnpm lint && pnpm build` green after each.

**Phase 3 — frame rate.** S1 (single ScrollTrigger + timeline), S2 (move parallax off masked/filtered nodes), S10, S7. Re-trace hero scroll against the Phase-0 baseline.

**Phase 4 — load.** ~~L1~~ (dropped — falsified), L5 (image cleanup), L4 (`SceneIdentity` → server), L3 (projection props), L6 (gate polling). Re-measure LCP/TBT. Note L3 mostly resolved itself: six of its eight files died in Phase 2, leaving only the live `app/projects/[slug]` path to check.

**Phase 5 — correctness follow-ups.** S4, S5, H4, then H2/H3 once §2 makes the token question answerable.

**Decide separately, before merge:** S8 — the uncommitted `maskReveal` / `peelReveal` / `SplitText` work. None of it has an importer yet, so it costs nothing today and it is cheaper to reshape now than to optimize after it is wired into sections.

---

## 4. Success criteria

Every one of these is a command or a measurement, not a judgment:

- `pnpm lint && pnpm build` green after **every** commit.
- Source tree down by ≥ 5,000 lines; `.next/static/chunks` total strictly smaller than the Phase-0 figure.
- Hero scroll on a 4×-throttled profile holds a **higher** median FPS than the Phase-0 trace, with fewer long tasks.
- ScrollTrigger instance count on the homepage drops from ~7 to ≤ 3, matching `DENSITY_BUDGET.maxConcurrentScrollEffects`. Measurable via `ScrollTrigger.getAll().length`.
- LCP does not **regress** past the 0.53 s Phase-0 baseline. (Originally "LCP improves" — with the baseline already green and L1 falsified, there is no headroom to claim; this is now a guard, not a target.)
- No new hydration mismatch warnings in the console (specifically after S4).
- Tab from the last `MobileMenu` link stays inside the dialog (H4).

## 5. Out of scope

Deliberately excluded, recorded so they don't get rediscovered as gaps:

- Consolidating framer-motion / GSAP / Lenis onto one library. Explicitly ruled out; the coordination cost is real but a rewrite of every animated section is not a performance fix.
- Visual or layout redesign of any scene.
- The `app/api/activity/*` provider implementations (`lib/activity/*`, 1,143 lines) beyond the client polling cadence in L6.
- Test infrastructure. The repo has none configured; this spec's checks are build, grep, and browser measurement.
