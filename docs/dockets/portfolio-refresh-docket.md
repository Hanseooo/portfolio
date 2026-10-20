> **Agent: read this before anything else.**
> This docket governs the October 2026 refresh. It follows `portfolio-redesign-docket.md`
> (S1–S6, all DONE). Those constraints still bind unless this docket's
> **Superseded constraints** table names them.
> - Work one ticket at a time. Each spec ends in a ticket list with acceptance checks.
> - A spec marked DRAFT is not approved. Do not implement from it until its status says APPROVED.
> - Facts enter copy only from the fact register in R1. A new claim needs Hans's explicit okay.
> - Something real but out of scope: one line under `## Found & parked`. Never fix it in passing.

# Portfolio refresh — docket

**Goal:** bring hanseo.tech up to date with Hans's current work (Eskwelabs v1.1, DurianPy,
StoryBuddy) and cut the AI-slop layer: fake telemetry labels, mono overuse, jargon copy. Keep
the light ivory/red identity and the architect line work, push it bolder in red and ink where creativity fits,
and add a resume link and a lean `/resources` page.

**Source brief:** the 2026-10-20 audit conversation. Hans's own words for the design direction:
"consistent ui/ux, be creative where possible, driving inspiration from what we currently have
and the prototypes, where we can express asymmetric stuff and be bold with black and red (for
light mode) and have the architect/engineer vibe like the graph or curve lines or circle with
the svg stuff. make sure the codebase architecture is good and is maintainable."

**Spec path convention:** `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md`

## Superseded constraints

The previous docket's rule is to challenge a DONE constraint in a new session, never by
editing it. This docket is that new session. Each row below replaces the cited line. Every
other S1–S6 constraint still binds.

| Old | Was | Now | Why |
|---|---|---|---|
| S1 line 46, S3 line 83 | Hero shows the source-backed `75%` and `~80%` | Hero proof is `75%` (client-reported, Le Doux) plus non-numeric proof (see R1). No `~80%` anywhere | The ~80% was Hans's estimate. The recruitment PRD v1.1 lists "≥ 80% reduction" only as a target, and no measurement exists |
| S1 line 48, S3 line 87 | Flagships Le Doux + Clarift. Supporting SimplyNote, The Podium, HCDC LFMS. Cap of five | Flagships StoryBuddy, Clarift, Le Doux. More work SimplyNote, The Podium, HCDC LFMS. Cap of six. StoryBuddy is the only new project record | Hans chose 3 + 3 on 2026-10-20, then ruled out ClinicalScribe and any other new project |
| S1 line 49, S3 line 86 | Both existing experience records (Eskwelabs, freelance) | Three records: Eskwelabs, DurianPy (volunteer), freelance | DurianPy work is verified through five merged PRs |
| S3 line 85 | One shared flagship dossier for two projects, at most three evidence statements each | One shared dossier for three projects, same three-statement cap | Follows the 3 + 3 choice |
| S3 line 91 | Light mode uses two broad red anchors, hero and Contact | Scenes are **expressive** (hero, tech stack, flagship title moments, contact, resources rail) or **reading** (bullets, case-study bodies, live data, lists). Expressive zones may use red, ink, or ivory with geometry, never a black quota. Reading zones stay neutral. At most one dominant field per scene. See R3 §3 | Hans wants room for creativity where formality isn't needed, without competing with reading. The code had drifted to red in every scene without a rule |
| S1 line 51, S3 line 81 | Stack is not a standalone homepage chapter. Six scenes | Seven scenes: Tech Stack is a chapter between Flagships and Experience, and in the rail | Hans likes the section as the reference for expressive, asymmetric work |
| S2 line 60 | Geometry must frame real content. Fabricated schematics and decorative telemetry are excluded | Kept, and clarified: constructed geometry (arcs, circles, dimension lines, curves, registration marks) is allowed as composition. Fake labels are banned ("FIG.1A", "EL.02", "Directory / 01", "End of Section 03") | Hans likes the SVG line work. The slop is in the invented text, not the lines |

## Sessions

Statuses: DRAFT (spec written, awaiting Hans) · APPROVED · DONE (shipped and verified)

| Id | Topic | Spec | Status | Blocked on |
|---|---|---|---|---|
| R1 | Content alignment and fact register | `docs/superpowers/specs/2026-10-20-content-alignment-design.md` | DONE | — |
| R2 | Live activity polish | `docs/superpowers/specs/2026-10-20-live-activity-polish-design.md` | DONE | Spotify ticket checks wait on blocker 3 |
| R3 | Visual language refresh (de-slop, expressive zones) | `docs/superpowers/specs/2026-10-20-visual-language-refresh-design.md` | DRAFT | — |
| R4 | Verified defects | `docs/superpowers/specs/2026-10-20-verified-defects-design.md` | DONE | — |
| R5 | `/resources` page | `docs/superpowers/specs/2026-10-20-resources-page-design.md` | DRAFT | Approval of the draft one-line notes |
| R6 | Resume access and SEO refresh | `docs/superpowers/specs/2026-10-20-resume-seo-refresh-design.md` | DRAFT | Phone-free PDF export |

**Order:** R4 first, since the fixes are small, verified, and unblock clean checks for the rest.
Then R1, because content feeds every surface. R3 and R2 can run in parallel after R1. R5 and R6
come last because they build on R3 tokens and R1 facts.

## Decisions (2026-10-20)

- **Headline:** match the resume. `SITE_HEADLINE = "AI Engineer · Full-Stack Developer"`. "Applied AI" goes in descriptions and the intro.
- **Resume:** publish a web copy without the phone number.
- **Python Essentials 1:** Credly says issued December 05, 2025. The site is already correct.
- **Eskwelabs screenshots:** allowed. The interns have ownership and the lead approved display. Four are chosen and stored in `app/assets/experience/eskwelabs/` (R1 §8).
- **Tech stack section:** kept as a chapter and as the reference for expressive zones, alongside the hero.
- **Dark mode:** no new palette. Existing `--cs-*` tokens, applied through pattern classes.
- **Black:** optional, never mandatory. Expressive vs reading zones (R3 §3).

## Blockers for Hans

1. **Phone-free resume.** Export the web copy from the resume source and replace `public/AMOGUIS_RESUME.pdf`.
2. **StoryBuddy authenticated screens.** Log in directly in the agent's browser session and say when. See R1 §8.
3. **Spotify.** Mint a new refresh token with the authorization-code flow for your Spotify account, set `SPOTIFY_REFRESH_TOKEN` in Vercel, then redeploy. Until then the card is commented out in `components/homepage/ScenePresenceClient.tsx` (import, poll, and region). Uncomment all three to restore it before the R2 Spotify tickets.
4. **Draft copy approval.** The R1 v1.1 bullet and StoryBuddy copy, the R5 notes.

## Found & parked

- Production build warns about broad file tracing through lib/og-image.tsx. Outside R4's workspace-root fix.

- `C:\Users\Admin\package-lock.json` makes Next infer the wrong workspace root (R4 covers the
  in-repo fix; deleting the stray file is Hans's call).
- Impeccable v4.7.0 is available (`npx impeccable update`).
- `app/opengraph-image.png` is a hero screenshot that still shows the old "Full-stack engineer focused on AI product engineering" line. Recapture it after R6 ships.
- Mobile menu fade (0.2s) takes 1.5–4s to reach opacity 1 in headless Chromium at 375px. Links are clickable while invisible. Not checked on a real device.
- No test runner exists. R4 checks are scripted browser evals, not unit tests.

## Amendments

- 2026-10-21: Hans authorized six confirmed fixes independently of the remaining DRAFT designs: shared reveal visibility, Contributions labeling, aligned compact heatmap, safe public provider errors, seven-chapter navigation, and detail-title duplication. R1/R2/R3 approval statuses remain unchanged.
- 2026-10-21: R2 done. At Hans's request the heatmap became a full-width 53-week band (18 / 30 / 53 weeks at base / sm / lg), and the GitHub query now covers a rolling 365 days instead of the calendar year. See the R2 amendment.

- 2026-10-21: R6 implemented at Hans's request. `lib/skills.ts` didn't exist (R3 not shipped), so the existing Tech Stack lists moved there verbatim and `knowsAbout` reads the Build list. No project has `updated` set yet, so each falls back to `CONTENT_UPDATED`. Blocker 1 closed later on 2026-10-21: the PDF was replaced with a copy that has no phone line. R6-3 still needs the manual Rich Results test. Check: `.playwright-cli/r6-resume-check.cjs`.

## Verification — confirmed fixes, 2026-10-21

- `pnpm.cmd lint`: exit 0, two existing unused-variable warnings (`weekDayMap`, `weekOrder`). Output: `.playwright-cli/fixes-lint.log`.
- `pnpm.cmd build`: exit 0, 39 static pages generated, existing `lib/og-image.tsx` tracing warning retained. Output: `.playwright-cli/fixes-build.log`.
- `.playwright-cli/confirmed-defects-check.cjs`: PASS, clean browser console. Normal/reduced reveals, completion events, all seven chapter anchors/focus/active states, Contact at page end, project metadata, and heatmap measured in both themes at 1440/768/375px. Cells/gaps: 11/3px, 11/3px, 9/2px.
- An independent browser rerun caught a harness race: hydration replaced the static Clarift brief node while Playwright was scrolling it. The harness now waits for the existing arrival cover to finish before locating evidence. All assertions remain unchanged and the fresh full scenario passes with a clean console. Red evidence and diagnosis: `.playwright-cli/fixes-hydration.log`. No application change was needed.
- `.playwright-cli/navigation-touch-check.cjs`: PASS, clean console. Compact Stack marker, mobile Stack chapter/menu/focus, Escape/dismiss focus restoration, touch tooltip and outside dismissal, and certificate browser/OG/Twitter titles.
- `.playwright-cli/r1-content-check.cjs`: PASS, clean console. Existing R1 curation, proof, experience evidence, StoryBuddy route/gallery/sitemap, and Podium source link remain intact.
- `node .playwright-cli/activity-check.mjs`: PASS. Captured public contribution dates/counts verify Sunday alignment, Manila today and future padding through the actual provider function. An isolated empty environment verifies all three providers retain `missing_config` without exposing configuration names. Real configuration was neither read nor changed.
- Production browser smoke: PASS for normal-motion hero proof, flagship, Contact, untouched Clarift brief, and corrected browser title. Pending copy approval, authenticated StoryBuddy captures, and Spotify restoration remain Hans's tasks.
