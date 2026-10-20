# Visual language refresh: expressive zones, real geometry, less mono — design

**Date:** 2026-10-20
**Status:** DRAFT
**Docket:** `docs/dockets/portfolio-refresh-docket.md` · R3
**Scope:** homepage scenes, `components/sections/TechStackSection.tsx`, shared geometry, type roles, `app/globals.css` tokens, `docs/05-design-system.md`.
**Inherits:** S2 Constructed Signal and S6 architecture, except the two rows the docket supersedes (red budget, geometry clarification).

## Purpose

Hans likes the light mode and the architect line work. The slop sits in three places:

1. invented labels
2. mono used as decoration
3. a red field in nearly every scene, with no rule behind it

This spec keeps the identity and makes it bolder in a planned way: expressive zones where red, ink and display scale can play,
geometry drawn as real constructions, and type that lets the content speak.

## 1. What the audit found

| Problem | Evidence |
|---|---|
| Invented labels | `SceneExperience.tsx:150,167,180` "Directory / 01", "Directory / 02", "End of Section 03". `TechStackSection.tsx:91,138` "FIG.1A", "EL.02". `SceneExperience.tsx:78` "Corroborated track record in full-stack architecture & AI engineering." |
| Mono everywhere | `font-mono` appears in 15+ components, e.g. 17 uses in `GitHubActivityCard.tsx`, 8 in `SceneExperience.tsx`, 7 in `SceneFlagships.tsx`. It is used for bullets and CTAs, not only metadata (S2 limits mono to indexing and metadata) |
| Red without a rule | Red fields in Identity (`SceneIdentity.tsx:51`), every flagship (`SceneFlagships.tsx:88`), the Experience pillar (`SceneExperience.tsx:137`), and the More Work CTA (`SceneMoreWork.tsx:115`). Contact, the S3 red anchor, is not red |
| Stack chapter outside the rail | `app/page.tsx:33` renders `TechStackSection` as a seventh chapter, but `SECTION_IDS` and the chapter rail know only six. S1 said stack is not a standalone chapter. Hans likes this section, so the docket now makes it a chapter (see §6) |
| Marquee words | The two tilted marquees ("PLAN · DESIGN · DEVELOP…", "BRAINSTORM · SPEC · PLAN…") describe Hans's real workflow and stay. Under reduced motion they must render static (R4 D1) |
| Token drift | `TechStackSection` uses shadcn `bg-primary`/`text-primary`. Dark variants use `dark:bg-zinc-800` instead of S2's black depth and ice accent |
| Geometry built from divs | No `<svg>` in `components/homepage`. Lines and circles are positioned divs, so arcs and curves are impossible and each scene hand-places its own |

## 2. Type roles

| Role | Font | Use | Never |
|---|---|---|---|
| Display | Anton | Name, scene titles, project names, proof values. ≤ 6 words | Paragraphs, buttons |
| Reading | Inter | Everything a visitor reads: summaries, bullets, buttons, nav, eyebrows | — |
| Index | JetBrains Mono | Real indexes and data: `01`, dates, counts, PR refs (`#41`), timestamps | Bullets, CTAs, headings, labels that are plain words |

Eyebrows become Inter 12px, uppercase, `tracking-[0.08em]`, weight 600. Test for mono: if
you replace the text with a word and it still makes sense, it is not an index, so don't set it
in mono.

## 3. Expressive and reading zones

Every scene is one of two kinds. The split, not a color quota, decides where boldness goes.

- **Expressive zones** are moments meant to grab attention: the hero, the tech stack chapter,
  flagship title moments, the contact close, and the resources rail. The hero and the tech
  stack are the reference for this zone. They may use a red field, an ink (black) field, or
  plain ivory with geometry, overlap, and display scale. Black is one option among these, not a
  requirement. Pick whatever the composition needs.
- **Reading zones** are where formality serves reading: experience bullets, case-study bodies,
  live data, and resource lists. Ivory surface, Inter text, rules and indexes only. No dominant
  field competes with the text.

Rules:
- At most one dominant field per scene, and never two red fields adjacent.
- Red text on ivory only at ≥ 24px bold (S2 contrast rule).

| Scene | Zone | Direction |
|---|---|---|
| 01 Identity | Expressive | Red field kept. Name and portrait overlap. Proof strip below on ivory |
| 02 Flagships | Mixed | The title moment for each project is expressive: a field or bold geometry, about 5 of 12 columns, alternating sides, with the screenshot overlapping its edge. Bullets are reading zone |
| 03 Experience | Reading | Ledger with large red display indexes and a red hairline per record. The red pillar sidebar is deleted |
| 04 More work | Reading, with one expressive action | Numbered register on ivory. The catalogue action may stay a strong red bar |
| 05 Presence | Reading | Live data stays neutral. Portrait and philosophy may carry one geometry mark |
| 06 Contact | Expressive | Red field restored. "Let's connect." with resume, email, LinkedIn, and GitHub |

**Tokens and dark mode.** Add no new colors. Dark mode keeps using the existing `--cs-*`
values under `.dark` in `app/globals.css`. The maintainability fix is to stop scenes from
restating theme logic inline:

- `globals.css` already defines `.hp-signal-field` (red in light, black depth in dark), but
  no component uses it. Scenes write `bg-[color:var(--cs-signal)] dark:bg-zinc-800` instead.
  Switch every field to the pattern class.
- Add one sibling, `.hp-ink-field`, built only from existing tokens:
  - light: background `--cs-text-primary`, text `--cs-foundation`
  - dark: background `--cs-reading-surface`, text `--cs-text-primary`
- Field theming then lives in a single file, and `dark:bg-zinc-*` disappears from components.

## 4. Geometry vocabulary

Build one small SVG module and use it everywhere: `components/geometry/`.

| Mark | Drawing | Typical anchor |
|---|---|---|
| `Arc` | A compass arc of 30–120° with a center tick and radius line | Swings from the portrait frame corner across the hero title |
| `Circle` | A registration circle with an optional crosshair | Centered on a real point: the portrait eye line, a heatmap's busiest day |
| `Dimension` | A line with end ticks and a centered label carrying a **real** value | Spans a flagship screenshot, labeled with the project year, or spans the heatmap, labeled "20 weeks" |
| `Curve` | A cubic Bézier between two content edges | Connects an Experience record to its credential, or a flagship to its "Read case study" link |

Rules:

- Every mark attaches to a content edge. It frames, divides, connects, or focuses (S2). A mark
  floating in empty space is decoration, so cut it.
- At most two marks per scene. Marks are removed before content at narrow breakpoints (S3).
- `stroke-width="1"`, `vector-effect="non-scaling-stroke"`, and `aria-hidden="true"`. Stroke
  colors come from `--cs-structural-line-strong`. On a field, use `currentColor` at about 40%
  opacity so the mark follows the field's text color in both themes.
- Labels on marks are real values only. No "FIG", "EL", or section codes.
- Motion: the stroke draws on once, on reveal (CSS `stroke-dashoffset`, 600ms). CSS owns it per
  S5. Under reduced motion it renders fully drawn.
- The API takes geometry props in a `viewBox` space. No preset variants. Each scene composes its
  own marks, so the module stays small and the compositions stay local (S6).

## 5. Asymmetry moves

Take these from the Red Signal prototype, which already does them well:

- **Hero:** keep the overlapping display name. The portrait frame gets the prototype's hard
  offset (`7px 7px 0 var(--cs-text-primary)`, the S2 "rare hard-offset emphasis") and one
  `Arc`.
- **Flagships:** split 7/5 and alternate the side per project. The screenshot crosses the
  plate edge. That overlap is the controlled grid break.
- **Experience:** records indent by index (0, 1, 2 columns on desktop) so the ledger steps down
  like a drawing schedule. A `Curve` ties the Eskwelabs record to its certificate.
- **Contact:** the title is set large and bleeds off the right edge. Actions sit in a left
  column.

## 6. Stack and capabilities

Hans likes `TechStackSection`. Its tilted marquees, asymmetric bento, crop marks, and routing
lines are the model for the expressive zone. Keep the composition and fix what's underneath:

- **Make it a chapter.** Add `stack` to `SECTION_IDS`, the destinations, and the chapter rail
  between Flagships and Experience, giving seven stages. The docket supersedes S1 line 51 and S3
  line 81 for this.
- **Real content.** The Build, Tools, and Deploy lists come from a new `lib/skills.ts`, built
  from the resume's skills section: AI engineering, backend and data, frontend, tools. AWS S3
  stays out. The JSON-LD `knowsAbout` reads the same module (R6). The lists stop being typed in
  the component.
- **Labels.** Delete "FIG.1A" and "EL.02". Crop marks, the surveyor mark, and routing lines stay,
  since they are geometry. Where they move to SVG, they use the §4 module.
- **Tokens.** Replace shadcn `bg-primary`/`text-primary` and `bg-zinc-900` with the
  `.hp-signal-field` / `.hp-ink-field` pattern classes and `--cs-*` tokens.
- **Reduced motion.** The marquees render static and the bento cells render visible. The cells
  being invisible today is R4 D1.

## 7. Shell fixes that are visual

These live in R4 with their failing checks: the header background, the chapter rail overlap at
1440px, and focus rings.

## 8. Docs

Rewrite `docs/05-design-system.md` from this spec plus S2. It still describes the old black,
Inter/Roobert, and Ice Blue system. Fix the `AGENTS.md` drift (stale paths, "No README") in
the same change.

## Tickets

| Id | Ticket | Done when |
|---|---|---|
| R3-1 | Type roles: strip mono from bullets, CTAs, and word labels | `rg "font-mono" components` hits only index, date, count, or ref text (manual review of each hit, listed in the PR) |
| R3-2 | Delete invented labels and jargon copy | `rg "Directory /|End of Section|FIG\.|EL\.0|Corroborated" components` returns nothing |
| R3-3 | `components/geometry/` with `Arc`, `Circle`, `Dimension`, `Curve` | Each renders in both themes. Reduced motion shows the final stroke. No mark without an anchor in the scenes |
| R3-4 | Apply expressive/reading zones through `.hp-signal-field` and `.hp-ink-field` | `rg "bg-zinc-|bg-black|bg-primary|dark:bg-" components/homepage` returns nothing. Reading zones have no dominant field. Light and dark screenshots reviewed at 1440px |
| R3-5 | Asymmetry moves per §5 | Desktop and 375px screenshots reviewed. Mobile keeps the order: evidence, then decoration |
| R3-6 | Tech stack as a chapter: `lib/skills.ts` lists, labels removed, `--cs-*` tokens | The rail shows seven stages including Stack. `rg "FIG\.|EL\.0|bg-primary|text-primary|bg-zinc" components/sections/TechStackSection.tsx` returns nothing. Reduced motion: the marquees don't move and every cell has opacity 1 |
| R3-7 | Rewrite `docs/05-design-system.md`, fix AGENTS.md drift | The docs name the current tokens and fonts. The AGENTS.md paths exist |
