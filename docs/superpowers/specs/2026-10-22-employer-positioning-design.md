# Employer positioning — design

**Date:** 2026-10-22
**Status:** APPROVED (decisions settled in a grilling session on 2026-10-22). Not implemented.
**Issue:** [#13 Improve portfolio positioning for AI and full-stack roles](https://github.com/Hanseooo/portfolio/issues/13)
**Base commit:** `34cba48` (merge of PR #12)

## Purpose

Make the portfolio easier to evaluate for employers hiring for AI and full-stack roles, and
leave a door open for freelance clients. Keep the chapter-based story and the Constructed
Signal visual direction.

Issue #13 asks for: a Services section with an availability indicator, "View all projects"
under Selected Work, Live Activity between Experience and About, current Eskwelabs certificate
details, and more StoryBuddy detail. It also asks for documented decisions before building on:
section order, an expanded About, and a theme transition. This spec records those decisions
and adds one mobile defect found during the audit (the heatmap, PR 1).

## Out of scope

- **StoryBuddy page text.** The owner writes it directly in `lib/projects.ts`. Text only, no
  schema change.
- **`/about` content.** Deferred until the owner supplies it (see PR 4).
- **Drift found during the audit.** Recorded here, not fixed by this work:
  - `AGENTS.md` says there is no root README and points at `components/layout/ChapterNav.tsx`,
    which does not exist. Last reviewed 2026-08-05.
  - `.env.example` still lists `ACTIVITY_GITHUB_REVALIDATE_SECONDS`, which `lib/activity/config.ts`
    no longer reads (removed in `828edec`).
  - `components/sections/TechStackSection.tsx` uses shadcn tokens (`border-border`,
    `text-primary`, `bg-background`) where every other scene uses `--cs-*` tokens, and it is the
    only scene not rendered through `HomepageSceneFrame`. It renders correctly today.
  - `getHomepageProjections()` in `lib/content/homepage-projections.ts` has no consumers.

## Verification contract

No test runner is configured (`AGENTS.md`). Every PR passes `pnpm lint && pnpm build`, and every
UI change is driven in a real browser with `playwright-cli` against `pnpm dev`, with a clean
console. Checks that guard a fix live in `.playwright-cli/*.cjs`, which `.gitignore` keeps. Each
must go red before the fix and green after.

Every visual change must work at 360px, 390px, 768px, 1024px and 1440px, support keyboard access
and `prefers-reduced-motion`, and keep Lenis smooth scrolling and GSAP/Framer reveals intact
(issue #13 acceptance criteria).

## Delivery

One branch and PR per row, in this order. PR 1 is unrelated to the rest and fixes a live bug, so
it goes first.

| PR | Scope | Status |
|---|---|---|
| 1 | GitHub heatmap WebKit fix | Ready |
| 2 | Homepage restructure | Done (on `main`) |
| 3 | Capabilities row, client strip, availability badge | Ready |
| 4 | `/about` page, nav swap, entry links | **Blocked on owner content** |
| 5 | Theme transition | Done (on `feat/employer-about`) |
| 6 | Eskwelabs certificate text | Ready (investigation step first) |

---

## PR 1 · GitHub heatmap rows clipped in WebKit

**Seen:** on mobile (owner's screenshot, 2026-10-22), the contribution heatmap shows about 4 of 7
day rows. The gaps between rows are about 3× the cell size, and the last visible row is cut off.

**Cause (measured):** WebKit only. All iOS browsers and desktop Safari are affected, at every
width. In `app/globals.css`, `.hm-weeks` uses `grid-template-rows: auto repeat(7, auto)`, and each
`.hm-week` is a `subgrid` whose `.hm-cell` children size themselves with `aspect-ratio: 1`. WebKit
resolves every day row to `32px`, the width of the `2rem` weekday-label column, instead of the
cell width. The grid box still gets the correct height, so the extra rows overflow the
`overflow-hidden` wrapper in `GitHubHeatmap` (`components/sections/live-activity/WeeklyActivityBars.tsx`)
and get clipped.

Measured with `playwright-cli` on `pnpm dev`, live GitHub data:

| Engine | Width | Day row track | Cell | Grid height |
|---|---|---|---|---|
| WebKit | 390 | 32px | 12.4px | 117px (rows need ~240px) |
| WebKit | 1440 | 32px | 18.3px | 172px (Fri and Sat clipped) |
| Chromium | 390 | 12.45px | 12.4px | 117px |
| Firefox | 390 | 12.45px | 12.5px | 117px |

**Decision:** give the day rows an explicit size computed from the container width, so row
height no longer depends on `aspect-ratio` resolution inside a subgrid.

```css
/* the wrapper div around .hm-weeks gets a class, e.g. hm-frame */
.hm-frame { container-type: inline-size; }

.hm-weeks {
  --hm-cell: calc((100cqw - 2rem - var(--hm-weeks) * var(--hm-gap)) / var(--hm-weeks));
  grid-template-rows: auto repeat(7, var(--hm-cell));
}
```

`100cqw` is the container's content box, so the wrapper's `px-1` padding is already excluded.
Don't subtract it again: a first probe that did came out about 0.4px short per row and clipped
the last row. The formula repeats the `2rem` label column from `grid-template-columns`, and
`.hm-dimension` repeats it too. Pull it into one `--hm-label` variable so the three can't drift.

**Options considered:**
- **A. Explicit rows from container width (chosen).** About 4 lines of CSS plus a class. Keeps
  the subgrid and the per-week `hm-rise` stagger animation.
- **B. Rebuild without subgrid** (`grid-auto-flow: column`). No engine quirks at all, but it
  rewrites the component and removes the `.hm-week` wrappers the reveal animation runs on.

**Probe result (CSS injected, before any code change):** in WebKit, Firefox and Chromium at 360,
390, 640, 1024 and 1440px, the row track equals the cell width (for example 12.44px track vs
12.5px cell at 390), the last cell of the newest week sits inside the clip box, and there's no
horizontal scroll.

**Check (`.playwright-cli/heatmap-rows-check.cjs`, run with a WebKit session):** for each width
above, scroll `#provider-github-calendar` into view and wait for
`.hm-cell[data-date]` (`state: "attached"`, because old weeks are `display: none` on narrow
screens). Assert that the second `grid-template-rows` track is within 1px of the first visible
cell's width, and that the last cell of the newest week has `bottom <= wrapper.bottom`.
Red today in WebKit: track `32px`. Green: within 1px at every width. Also run it in Chromium,
which must stay green.

Open the session with `playwright-cli -s=webkit open --browser webkit http://localhost:3000/`.

---

## PR 2 · Homepage restructure

### Decisions

**Order.** Before:

> 01 Identity → 02 Flagships → 03 Tech Stack → 04 Experience → 05 More Work → 06 Presence (About, then Live Activity) → 07 Contact

After:

> 01 Identity → 02 Selected Work (+ View All Projects) → 03 Capabilities → 04 Experience → 05 Presence (Live Activity, then About) → 06 Contact

1. **Remove More Work from the homepage.** Reason: keep the homepage short. The supporting
   projects stay on `/projects`. The full-width "View All Projects" block moves from the end of
   `SceneMoreWork` to the end of `SceneFlagships`, with its markup and styling unchanged.
   - Rejected: keeping More Work after Experience (the literal reading of the issue). The work
     would then be split around Experience, with the catalogue link above the list it summarizes.
2. **Selected Work stays before Experience.** The flagships (StoryBuddy, Clarift and others) are
   the strongest AI proof, and employers check proof first. Experience is one four-month
   internship plus volunteering. It still comes before the personal sections.
3. **Live Activity above About, inside Presence.** The owner values GitHub activity more than
   the About copy. Presence is already directly after Experience once More Work is gone, so
   this is a reorder inside `ScenePresence`, not a new scene.
   - Rejected: splitting Presence into two scenes. That adds a scene, a section ID and a nav
     entry for a change the reorder already achieves.
   - The polling comment in `ScenePresenceClient.tsx` ("Scene 05 sits near the bottom of a
     six-scene page") still holds. Polling stays gated on `inView`.
4. **Rename chapter labels to match on-page headings:** "02 Flagships" → "02 Selected Work"
   (the section heading already says "Selected work") and "03 Tech Stack" → "03 Capabilities"
   (the section `h2` already says "Capabilities"). Section IDs `flagships` and `stack` stay, so
   existing `#` links keep working.

### Places that change

Chapter numbers and labels are stated in more than one place. Update every one in the same PR.

| What | Where |
|---|---|
| Scene render order, drop `SceneMoreWork` and `getHomepageMoreWork` | `app/page.tsx` |
| Scene number props: Presence `06`→`05`, Contact `07`→`06` | `components/homepage/ScenePresence.tsx`, `SceneContact.tsx` |
| Labels, accessible names, remove `scene-more-work`, sequence | `lib/destinations.ts` (`DESTINATIONS`, `DestinationId`, `HOMEPAGE_CHAPTER_SEQUENCE`) |
| `OBSERVED_IDS`, `CHAPTER_NUMBERS` (7 → 6 entries) | `components/homepage/HomepageChapterNav.tsx` |
| `SECTION_IDS.moreWork` | `lib/anchor-navigation.ts` |
| Homepage chapter anchors in the mobile menu | `components/shell/MobileMenu.tsx` (maps `HOMEPAGE_CHAPTER_SEQUENCE`, so it follows; verify) |
| "View All" block moves in; it needs the catalogue route | `components/homepage/SceneFlagships.tsx`, `getHomepageFlagships()` in `lib/content/homepage-projections.ts` |
| Orphans created by this PR: `SceneMoreWork.tsx`, its export, `HomepageMoreWorkProjection`, `getHomepageMoreWork`, `MORE_WORK_SLUGS` (only used there), the `moreWork` key in `getHomepageProjections()` | `components/homepage/`, `lib/content/homepage-projections.ts` |
| Live Activity block moved above the About block | `components/homepage/ScenePresence.tsx` |

Grep for `more-work`, `moreWork`, `MoreWork`, `Flagships"` and `Tech Stack` before calling the
PR done. Docs under `docs/` and the root README also name the old order. Update the README
chapter list in the same PR.

### Checks

- The chapter nav shows six entries, 01–06, and the active marker follows scroll through all
  six (desktop, `full-desktop` tier).
- `/#more-work` no longer resolves. `/#flagships`, `/#stack` and `/#presence` still do.
- "View All Projects" is the last element of Selected Work and links to `/projects`.
- In Presence, the GitHub band renders above the "About" heading. `EvidenceDepthEffect` and the
  `presence-static` reveal still fire.

### Implementation notes (2026-10-22)

Implemented on `main`, no separate branch. Check: `.playwright-cli/homepage-restructure-check.cjs`
(red before the change on section order, green after, clean console).

- **Dev server port.** `localhost:3000` on this machine served a different app (sections
  `how-it-works`, `safe-by-design`). This repo's `next dev` was already running on `3123`; a
  second `pnpm dev` refuses to start and prints the running port. Check what `/` serves before
  trusting any `.playwright-cli` script that hard-codes `3000`.
- **Chapter rail is hidden below wide desktop.** At 1440px the rail buttons have count 0; drive
  rail assertions at 1920px, as `confirmed-defects-check.cjs` does.
- **Also changed, beyond the table:** the scene frame's sr-only heading (`heading="Selected Work"`
  in `SceneFlagships`), the `01–07` comment in `HomepageSceneFrame.tsx`, and the now-unreachable
  `simply-note`, `the-podium`, `hcdc-lfms` entries in `projectEditorial`. `getHomepageFlagships()`
  now returns `catalogueRoute`.
- **Presence spacing.** The Live Activity block's separator moved from `border-t` + top margin
  to `border-b` + bottom margin so it still divides the two blocks.
- **Older checks updated for new labels, but stale elsewhere.** `confirmed-defects-check.cjs`
  waits for `.hm-grid`, which no longer exists. `navigation-touch-check.cjs` fails on the
  certificate page title in dev while the built HTML has the right title. Both pass the chapter
  assertions PR 2 affects.
- **Check scripts are tracked.** `.gitignore` ignores `.playwright-cli/*` but un-ignores
  `*.cjs` and `*.mjs`, so check scripts are committed; screenshots and logs are not.
- **Drift.** `docs/` files (e.g. `03-information-architecture.md`) still name the old
  seven-chapter order; only the README was updated.

---

## PR 3 · Capabilities row, client strip, availability badge

### "What I build": a new top row in Capabilities

**Decision:** add a four-cell row at the top of the existing bordered grid in
`TechStackSection.tsx`, above Build / Tools / Deploy. The section `h2` stays "Capabilities".

- Rejected: a new chapter between Identity and Selected Work (claims before proof, and it makes
  the homepage longer, which works against removing More Work).
- Rejected: numbered record rows like the old More Work list (brings a second visual language
  into one section).

**Visual rules (match the section, don't invent):** same `border` grid and cell dividers as the
existing bento; a mono `text-[10px] tracking-[0.2em] uppercase` label per cell, as the Build,
Tools and Deploy cells use; capability name in the section's display weight and scale; one line
of description; proof links with the `ArrowUpRight` icon and `h-11` hit target used across the
site. Reveal with an existing `lib/motion.ts` recipe (`fadeUpReveal`), which already handles
reduced motion. Four columns at `lg`, two at `md`, one on mobile.

**Content.** Every capability links to proof. Claims without proof go against the site's
evidence-led design, which is why "CRM solutions" from the issue became "Business & ops systems".

| Capability | Proof |
|---|---|
| AI products & RAG | Clarift, StoryBuddy |
| Workflow automation | Eskwelabs: recruitment automation, Slide Deck Generator → `/experience` |
| Full-stack web apps | SimplyNote, Lost and Found Management System |
| Business & ops systems (ordering, admin, CRM-style records) | Le Doux, The Podium |

Proof links resolve to project detail routes (`/projects/[slug]`) and `/experience`. Take slugs
from `lib/projects.ts`, never hand-typed.

### Client strip

**Decision:** one compact strip under the grid, styled like the dark Tools cell
(`bg-zinc-900 dark:bg-zinc-800 text-white`):

> Also taking freelance work: AI/RAG features · workflow automation · custom web apps · business systems → **Start a project** (links to `/#contact`)

- Rejected: four engagement cards, or a `/services` page. There's no freelance track record yet
  to fill them, and empty service cards hurt more than one line. Revisit once a client project
  can be cited.

### Availability badge

**Copy:** `Open to work · Full-time & freelance · Davao, PH · Remote-friendly`. No date, at
the owner's request.

**One source of truth:** a single exported constant in `lib/` (for example in
`lib/content/homepage-projections.ts`, or wherever the identity projection reads it), rendered in:
1. the hero (`SceneIdentity`), near the role statement, and
2. Contact (`SceneContact`).

There's no date on it, so the constant is the only thing to edit when availability changes.
Keep the text in the DOM, not decorative only. If a status dot is used, mark it
`aria-hidden="true"`.

### Checks

- At 360px the four capability cells stack without horizontal scroll, and every proof link is
  keyboard-reachable with a visible focus ring.
- Under `reducedMotion: 'reduce'` no element in `#stack` stays at opacity 0 (same check as
  `2026-10-20-verified-defects-design.md` D1, scoped to `#stack`).
- The badge text appears exactly twice on `/` and both copies match the constant.

---

## PR 4 · `/about` page (blocked on content)

**Blocked:** the owner will supply bio content. Ask them for it when this PR starts, and don't
draft biography facts.

### Decisions

- **Home stays as-is.** The homepage keeps the full About and Live Activity in Presence.
  `/about` is an additional, more detailed page and does not replace either.
- **Page structure:** a `CompactMasthead` with `parentLabel="Home"` and `parentHref="/"` (the
  same "← Home" link every route page has) → portrait header → bio sections → Live Activity
  (reuse `ScenePresenceClient`) → contact call to action. Suggested sections, pending owner
  input: background and education, how I work, what I'm learning now, outside of work. Reuse
  `getHomepagePersonal()` for the shared portrait and handle, so a fact isn't stated twice.
- **Route conventions:** add `app/about/page.tsx` and `app/about/opengraph-image.tsx`, matching
  `/experience` and `/resources`. Add an `about` destination to `lib/destinations.ts` and an
  entry in `app/sitemap.ts`.

### Navigation (nav must not grow)

- **Desktop top bar:** "About" replaces "Home" in `GLOBAL_NAV_SEQUENCE`, so the item count stays
  the same. The wordmark already links home (`aria-label="Hans Amoguis — Home"`).
- **Ways back home:**
  1. the wordmark on every page;
  2. the "← Home" parent link in every route masthead, `/about` included;
  3. "Home" stays in the mobile menu. Only the desktop top bar drops it. `MobileMenu.tsx`
     renders `GLOBAL_NAV_SEQUENCE`, so it needs its own sequence (Home + About), or Home added
     explicitly.
- **Footer:** `FooterFrame.tsx` lists Projects, Experience and Certificates. It has never had
  Home. Leave it unchanged unless the owner asks for an About entry.
- **Entry points from the homepage:**
  1. a "More about me ↗" text link under the hero introduction (`SceneIdentity`), and
  2. a "Read the full story ↗" button at the end of the home About block (`ScenePresence`).

  Use the `ArrowUpRight` icon, matching the site's other route links.
- **Rejected: a down chevron under the hero text that opens `/about`.** A down chevron reads as
  "scroll this page". Sending it to another route breaks that expectation, and making it
  scroll to About would skip Selected Work, the proof employers came for.

All of the above ships in this PR, not earlier, so no link points at a page that doesn't exist yet.

---

## PR 5 · Theme transition

**Current:** `next-themes` with `disableTransitionOnChange` (`components/providers/ThemeProvider.tsx`).
The switch is instant. There is one `ThemeControl`, rendered in `GlobalNavClient.tsx`.

**Decision:** a circle that grows out of the toggle, using the View Transitions API.

- In `ThemeControl`, on click, if `document.startViewTransition` exists and motion is allowed,
  call it, run `setTheme` inside the callback, and animate `::view-transition-new(root)` with a
  `clip-path: circle()` that grows from the toggle's center to the farthest viewport corner.
  Duration about 400ms, easing `cubic-bezier(0.16, 1, 0.3, 1)` (the site's standard curve).
- **Instant fallback** when any of these is true: `prefers-reduced-motion: reduce`; capability
  tier `webview-constrained` (`useCapability()`); `startViewTransition` unsupported.
- Keep `disableTransitionOnChange`. It stops per-element CSS transitions from fighting the
  snapshot.
- Rejected: a hard-edged vertical wipe (fits the visual language but has no tie to the toggle);
  a crossfade (easy to miss); CSS color transitions on every element (whole-page repaint, and
  out of sync with GSAP-driven layers).

**Verify before building:** View Transitions support in current Safari and Firefox. The
expectation that Chromium and Safari 18+ support it is unverified. The fallback makes the
feature safe either way, but record the real support matrix in this spec.

**Checks:** toggling under `reducedMotion: 'reduce'` changes the `dark` class with no
`::view-transition` pseudo-elements present. Toggling during a Lenis scroll causes no scroll
jump. Toggle focus stays on the button after the switch. Console clean.

### Implementation notes (2026-10-22)

Check: `.playwright-cli/theme-transition-check.cjs` (port `3123`). Red before the change (no
`::view-transition-new(root)` animation), green after in all three engines below.

**Support matrix.** Measured: `typeof document.startViewTransition === "function"` and the check
passes in Playwright's Chromium 155, WebKit (Safari 26.4 UA) and Firefox 151. First versions
with same-document support (Chrome 111, Safari 18, Firefox 144) are *inferred*, not checked.
Real iOS Safari and Android webviews are unverified.

- **`flushSync` around `setTheme`.** next-themes 0.4.6 applies the class in a `useEffect`, so
  without it the new snapshot captured the old theme. The check wraps `startViewTransition` and
  reads the class when the update callback returns; it went red with `flushSync` removed.
- **Default root crossfade disabled** in `app/globals.css` (`::view-transition-old/new(root)`,
  `animation: none`) so only the circle shows. No other view transitions exist in the repo.
- **Fallback** uses the capability `tier`: `reduced-motion` (also the default before the
  provider resolves) and `webview-constrained` switch instantly. The webview path isn't driven
  by the check. It's the same branch as reduced motion.
- **Focus is asserted via keyboard** (focus + Enter). WebKit does not focus a button on mouse
  click, so a click-based focus assertion tests the engine, not the code.

---

## PR 6 · Eskwelabs certificate text

**Where:** `lib/certificates.ts`, entry `eskwelabs-ai-solution-development-track`. Title, date
(`May 9, 2026`) and image are unchanged. `credentialUrl` stays `null` (no credential link exists).

**Goal:** match the certificate description to the Experience entry (`lib/experience.ts`,
id `eskwelabs`) and give the Slide Deck Generator more weight, including its Google Slides
integration. Treat "recruitment automation" and the social post generator as **one project**.

**Investigation step (do this first):** gather more context about the Slide Deck Generator
with `gh` before writing the final text. Look for the repository (it may sit under an
organization, not the owner's account), its README, and merged PRs for v1.1 (generation
history, speaker notes with retry, single-slide regeneration, Slides API backoff, and how the
Google Slides template and placeholder replacement work). The deployed app is
`eskwelabs-instructor-slides.vercel.app`. **Ask the owner before running broad repo or org
searches.** If nothing is accessible, write from `lib/experience.ts` alone. Record which source
was used in this section.

**Starting draft** (refine with what the investigation finds):

> Completed Eskwelabs' AI Solution Development Track as an AI Solutions Development Intern
> (Feb–May 2026). Took over the instructor Slide Deck Generator and shipped v1.1, which turns a
> PRD into a Google Slides lecture deck through the Slides API: template-driven slide ordering,
> placeholder replacement, speaker notes with retry, single-slide regeneration, and generation
> history. Also built a recruitment automation system whose LangChain workflows draft job
> descriptions and LinkedIn/Facebook posts.

Every claim must trace to `lib/experience.ts` or to a source the investigation found. Don't add
metrics that aren't in a source.

**Check:** the `/certificates/eskwelabs-ai-solution-development-track` page and its OG image
build (`pnpm build`), and the description renders in full on `/certificates`.

### Implementation sources (2026-10-22)

Investigated the exact repository identified by the earlier content-alignment spec,
`aremis9/esk-lecture-materials-gen`, using `gh`. No broad repository or organization search
was needed. Sources used for the final description:

- `lib/experience.ts`, record `eskwelabs`: internship role and dates, taking over v1,
  collaborating with a fellow intern on v1.1, and the recruitment automation prototype with
  LangChain workflows for job descriptions and LinkedIn/Facebook posts.
- [Repository README](https://github.com/aremis9/esk-lecture-materials-gen/blob/main/README.md):
  class PRD input, Google Slides API output, master-template duplication, slide ordering,
  placeholder replacement, and speaker notes written to the notes panel.
- [Merged PR #24](https://github.com/aremis9/esk-lecture-materials-gen/pull/24): persistent
  generation history.
- [Merged PR #20](https://github.com/aremis9/esk-lecture-materials-gen/pull/20): targeted
  single-slide regeneration during quality checks.
- [Merged PR #25](https://github.com/aremis9/esk-lecture-materials-gen/pull/25) and
  [merged PR #32](https://github.com/aremis9/esk-lecture-materials-gen/pull/32): speaker-notes
  generation and completion, reliable template ordering and placeholder bindings, and Slides
  retry/batching resilience. Retry and backoff are also recorded in `lib/experience.ts`.

The owner approved the final wording in this session. It preserves shared v1.1 credit,
foregrounds Google Slides integration, and treats recruitment automation and social posts as
one project. No performance metrics were added.

---

## Decision log

| # | Question | Decision | Main reason |
|---|---|---|---|
| 1 | Selected Work vs Experience order | Selected Work first | Strongest AI proof; employers check proof first |
| 2 | More Work on home | Removed; View All under Selected Work | Shorter homepage; `/projects` holds the rest |
| 3 | Live Activity vs About | Reorder inside Presence | Owner prioritizes GitHub activity; no new scene needed |
| 4 | Services framing | "What I build" capabilities with proof | Serves employers and clients; fits evidence-led design |
| 5 | Services placement | Top row of Capabilities (chapter 03) | No new chapter; capability and stack answer one question |
| 6 | Freelance surface | One-line client strip | No freelance track record yet to fill more |
| 7 | Availability | One constant, hero + Contact, no date | One place to update |
| 8 | Expanded About | `/about` in addition to home About | Detail without lengthening home |
| 9 | About nav | Replace "Home" in desktop bar; hero link + About button | Nav doesn't grow; wordmark and masthead cover home |
| 10 | Hero chevron | Rejected | Down chevron promises scroll, not navigation |
| 11 | Theme transition | View Transitions circle from toggle | Cause and effect visible; snapshot-based, instant fallbacks |
| 12 | Heatmap fix | Explicit row size from `cqw` | Tested in 3 engines; keeps animation |
| 13 | Chapter labels | "Selected Work", "Capabilities" | Nav uses the words on the page |
| 14 | Delivery | Six PRs, heatmap first | Each reversible alone; live bug first |
