# Content alignment and fact register — design

**Date:** 2026-10-20
**Status:** DRAFT
**Docket:** `docs/dockets/portfolio-refresh-docket.md` · R1
**Scope:** `lib/experience.ts`, `lib/projects.ts`, `lib/certificates.ts`, `lib/content/homepage-projections.ts`, the homepage scenes that read them, `/experience`, `/projects/story-buddy`.

## Purpose

The site lists two jobs and five older projects. It also states one number (~80%) that is only a
target. This spec brings the content in line with `public/AMOGUIS_RESUME.pdf` and the verified
sources below. It also removes the index-based coupling that makes every content change touch
presentation code.

## Out of scope

- Visual treatment of any scene (R3).
- New projects other than StoryBuddy. ClinicalScribe is ruled out.
- Résumé styling. The PDF is ATS-plain on purpose and does not set the site's look.

## 1. Evidence labels

Every fact in copy carries one of these labels in the register below. The labels stay in the
docs, not in the UI.

| Label | Meaning | Allowed phrasing |
|---|---|---|
| VERIFIED | Inspected code, merged PR, live site, or public doc | State plainly, link where useful |
| HANS | Hans said it in conversation or wrote it in the resume | State as Hans's experience |
| CLIENT | An outcome the client reported | Keep the attribution: "the client reported…" |
| TARGET | A goal in a planning doc, never measured | Do not publish as a result |

## 2. Fact register

| Fact | Label | Source |
|---|---|---|
| Eskwelabs AI Solutions Development Intern, Feb–May 2026 | HANS | Resume |
| Recruitment automation: Next.js 16, LangChain.js (GPT-4o), Drizzle + Supabase, Google APIs | VERIFIED | `eskwelabs-pd2/recruitment-automation` |
| Hans wrote all 33 issues and 15 PRs in the recruitment repo, 63 commits | VERIFIED | gh, same repo |
| "≥ 80% reduction in time per JD", "< 5 minutes vs 1–2 days" | TARGET | Recruitment PRD v1.1, success metrics |
| Slide Deck Generator v1 was handed to Hans, who built v1.1 with a fellow intern | HANS | Conversation 2026-10-20 |
| v1.1 added Supabase history, speaker notes with retry, image placeholders, overflow checks, single-slide regeneration, Slides API backoff, dashboard | VERIFIED | `aremis9/esk-lecture-materials-gen`, branch `release/v1.1` |
| Hans: 39 of 64 commits, all 19 issues, 17 of 18 PRs in the slide repo | VERIFIED | gh, same repo |
| v1 "86.67% time savings" | Pre-Hans | Do not attribute to Hans |
| Slide generator is live at `eskwelabs-instructor-slides.vercel.app` | VERIFIED | HTTP 200, 2026-10-20 |
| DurianPy Volunteer Software Developer, engineering committee, Aug 2026–present | HANS | Resume + conversation |
| PyCon Davao 2026 responsive hero, merged 2026-08-19 | VERIFIED | `DurianPy-Davao-Python-User-Group/pycon-davao-2026-website#11` |
| PyCon Davao 2026 travel guide, merged 2026-10-03 | VERIFIED | same repo `#41` |
| Venue info fix, merged 2026-10-10 | VERIFIED | same repo `#46` (small, do not feature) |
| TechTix 2026 registration step, merged 2026-09-03 | VERIFIED | `…/TechTix#112` |
| FastAPI presigned badge-artwork upload endpoint, merged 2026-10-03 | VERIFIED | `…/durianpy-badge-service-backend#10` |
| Le Doux: Next.js + Supabase, replaces Google Forms | VERIFIED | Live site, `lib/projects.ts` |
| Le Doux: 75% faster order processing | CLIENT | Existing site copy, resume |
| Le Doux: server-side total recalculation, row-level security, order snapshots | HANS | Resume. Replaces the "multi-tenant isolation" wording, which a single-business app does not support |
| Le Doux period | — | Left blank on the site by Hans's choice (the resume says 2026) |
| StoryBuddy: capstone, Hans is the solo developer with 3 researchers | HANS | Conversation |
| StoryBuddy: AI picture-book generation for Grade 5–6 learners, SDG 4 | VERIFIED | `Hanseooo/story-buddy` `docs/product/PRD_v2.md` |
| StoryBuddy: 11-node deterministic LangGraph pipeline, open-weight models only | VERIFIED | storybuddy.hanseo.tech/research |
| StoryBuddy models: Qwen-Image(-Edit) on fal.ai, Mistral Small 3.2, Gemma-3-27B; safety via Llama Guard 4 12B, gpt-oss-safeguard, Presidio | VERIFIED | PRD v2 + research page |
| StoryBuddy: VLM consistency checks, targeted scene regeneration, annotation tooling with P/R/F1 | HANS | Resume |
| StoryBuddy judge fine-tuning (Qwen3.5-9B QLoRA) | VERIFIED | PRD v2. Context only. Not a skill claim |
| StoryBuddy stories collected at Matina Aplaya ES, developed at HCDC | VERIFIED | PRD v2 |
| The Podium repo is now `Hanseooo/the-podium` | VERIFIED | gh (old name redirects) |

## 3. Copy rule

Each bullet is **action + responsibility + result**. A result is something observable:
shipped, merged, live, adopted, or client-reported. A result is never an invented
percentage. No "passionate", "cutting-edge", "seamless", or "leveraged". A bullet with no
observable result ends at the responsibility. Don't pad it.

## 4. Experience records

`lib/experience.ts` gets an `id` and optional `links` per record, and points keep the resume
wording. Order: Eskwelabs, DurianPy, Freelance.

```ts
type ExperienceRecord = {
  id: "eskwelabs" | "durianpy" | "freelance";
  role: string;
  company: string;
  period: string;           // "" means unknown, rendered as nothing
  points: string[];
  links?: { label: string; href: string }[];
};
```

**Eskwelabs.** The resume's three bullets, plus one proposed v1.1 bullet (needs Hans's okay):

> "Took over the Slide Deck Generator from v1 and built v1.1 with a fellow intern, adding
> generation history, speaker notes with retry, single-slide regeneration, and Slides API
> backoff; it runs for instructors at eskwelabs-instructor-slides.vercel.app."

Delete the ~80% bullet. The "Owned the UI layer" bullet is replaced by the resume's frontend
and GitHub-issues bullet.

**DurianPy.** Role "Volunteer Software Developer", company "DurianPy" (engineering committee),
period "Aug 2026 — Present", and the three resume bullets. `links` holds PR #11, #41, #46, TechTix
#112, and badge-service #10. PR links are the result evidence, so they render beside the
bullets on `/experience`. On the homepage they render as a single "5 merged PRs" link group.

**Freelance.** The three resume Le Doux bullets. Period stays blank. This fixes the
"inneficient" and "google forms" typos by replacing the sentence.

## 5. Projects

**StoryBuddy** is a new `lib/projects.ts` record, slug `story-buddy`, first in the array:

- `subtitle`: "AI picture books for young storytellers" (proposed)
- `role`: "Solo developer, 3-person research team"
- `live`: `https://storybuddy.hanseo.tech`, `github`: `https://github.com/Hanseooo/story-buddy`
- `year`: "2026"
- `problem`, `overview`, `technicalDecisions`, `features`, and `stack` are drafted from the
  register rows marked VERIFIED or HANS, then sent to Hans for approval before merge
- `gallery`: mock-data screenshots only (see §7)

**The Podium**: change `github` to `https://github.com/Hanseooo/the-podium`.

No other project records change.

## 6. Homepage projections

Today the projections hardcode `experience[0]`, `experience[1]`, a two-item flagship tuple,
and a three-item supporting tuple, and the scenes read `data.flagships[0]` / `[1]`. Every
curation change touches presentation.

Replace it with the following:

- `requireExperience(id)`, a lookup by id like the existing `requireProject` and
  `requireCertificate`.
- Two curated slug lists at the top of `homepage-projections.ts`. They are the only place homepage
  curation lives:
  ```ts
  const FLAGSHIP_SLUGS = ["story-buddy", "clarift", "le-doux"] as const;
  const MORE_WORK_SLUGS = ["simply-note", "the-podium", "hcdc-lfms"] as const;
  ```
- `flagships` and `supporting` become `ProjectCardProjection[]`. `SceneFlagships` and
  `SceneMoreWork` map over the arrays. Numbering comes from the index, not literals.
- The editorial summaries stay in the projection with their `source` provenance (S6).

## 7. Hero proof

Three items replace the current two, each traceable to the register:

| Value | Label | Source row |
|---|---|---|
| `75%` | faster order processing, client-reported (Le Doux) | CLIENT |
| `5` | merged PRs across PyCon Davao 2026, TechTix, and the DurianPy badge service | VERIFIED |
| `11` | node LangGraph pipeline behind StoryBuddy | VERIFIED |

`lib/content/types.ts` keeps its proof type. Only the example in its comment changes.

## 8. StoryBuddy screenshots

The public landing and `/research` pages are captured as candidates:
`C:\Users\Admin\AppData\Local\Temp\claude\C--Users-Admin-Desktop-portfolio\c385846a-104d-453a-961e-3fead3ad82d9\scratchpad\sb\sb-landing.png`
and `…\sb\sb-research.png`. Authenticated views (student book reader, teacher class, research
dashboard) need a login. Per the login-wall rule, Hans logs in directly in the agent's
browser session. Then the agent captures mock-data screens only, never pages that show
tokens. Hans captures the adjudicator page, since it is a real account.

Eskwelabs UI screenshots are approved for display (the interns have ownership and the lead
agreed). Hans supplied 7. Four are kept in `app/assets/experience/eskwelabs/`:

| File | Shows | Why it's kept |
|---|---|---|
| `slide-deck-01-generate.webp` | Sign in, upload PRD, generate flow | Explains the product in one frame |
| `slide-deck-02-history.webp` | Generation history with status, slide count, cost | The v1.1 Supabase history |
| `slide-deck-03-deck-preview.webp` | Deck preview, slide 1 of 31 | Output review UI |
| `slide-deck-04-slides-output.webp` | Generated Google Slide with an image placeholder and speaker notes | The real artifact. Cropped to remove browser chrome, bookmarks, and the doc URL |

Dropped: the dashboard (generic cards), the decks grid (repeats history), and the
speaker-notes scroll (covered by 04). The originals are in
`C:\Users\Admin\AppData\Local\Temp\claude\C--Users-Admin-Desktop-portfolio\c385846a-104d-453a-961e-3fead3ad82d9\scratchpad\eskwelabs-originals`, not in the repo.

Display: experience records get an optional `gallery?: { image: StaticImageData; alt: string; caption: string }[]`.
`/experience` shows the Eskwelabs gallery under its bullets, using the existing `ScreenshotFrame`.
The homepage shows none, since S1 keeps the homepage concise.

Export StoryBuddy screenshots as `.webp` into `app/assets/projects/story-buddy/` to match the existing
project assets.

## 9. Certificates

- Python Essentials 1 date: Credly says December 05, 2025, which matches the site. No change.
- Eskwelabs certificate description: keep. It doesn't claim a metric.

## Tickets

### Implementation review — 2026-10-20

- R1-1, R1-3, R1-4, and R1-5 are implemented locally. R1-2 renders through the existing project route and sitemap, with draft copy in the first record of `lib/projects.ts` and its homepage summary in `lib/content/homepage-projections.ts`.
- Copy approval remains pending for that StoryBuddy record/summary and the proposed Eskwelabs v1.1 bullet in §4. This spec remains DRAFT until Hans approves the copy. No merge or publish has been performed.
- StoryBuddy uses the supplied public landing and research captures, exported to WebP. Authenticated mock-data captures still require Hans's login, and the adjudicator capture remains Hans's task.
- Corrected the same unsupported Le Doux multi-tenant claim in its existing case-study sentence as well as the homepage evidence, following the fact register.
- The blanket `rg "80%"` acceptance check also matches unrelated CSS percentages and a GSAP threshold. Those values stay unchanged. The recruitment target is absent from rendered copy and content records.
- Browser checks are retained in `.playwright-cli/r1-content-check.cjs`. Run with `playwright-cli -s=r1 run-code --filename=.playwright-cli/r1-content-check.cjs` against `pnpm dev` on port 3000.
- Verification refreshed 2026-10-21: `pnpm.cmd lint` exits 0 with two existing unused-variable warnings. `pnpm.cmd build` exits 0, generates 39 static pages including StoryBuddy and its share image, and retains the previously parked file-tracing warning. `.playwright-cli/r1-content-check.cjs` passes with no console errors. The title-clipping check failed before the word-wrap fix and passed afterward.
- The shared reveal blocker is resolved. Normal-motion hero proof, flagship content, Contact, and the existing Clarift brief pass after scrolling in both dev and production. Reduced-motion content remains visible. Light/dark and desktop/mobile browser checks pass. This verification does not approve the pending R1 draft copy or authenticated screenshots.

| Id | Ticket | Done when |
|---|---|---|
| R1-1 | Add `id`/`links` to experience records, rewrite points per §4, add DurianPy | `/experience` shows three records. `rg "80%" lib components app` returns nothing. No "inneficient" |
| R1-2 | Add the StoryBuddy project record with approved copy and assets | `/projects/story-buddy` renders and is in the sitemap. Hans approved the copy |
| R1-3 | Update the Podium repo URL | The link resolves to `Hanseooo/the-podium` |
| R1-4 | Replace index/tuple coupling with id lookups and slug lists (§6) | `rg "experience\[|flagships\[" components lib` returns nothing. Homepage shows 3 + 3 |
| R1-5 | Replace hero proof per §7 | The hero shows 75% / 5 / 11 with labels. `pnpm build` passes |
