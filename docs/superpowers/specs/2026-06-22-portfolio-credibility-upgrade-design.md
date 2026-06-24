# Portfolio Credibility Upgrade — Design Spec

**Date:** 2026-06-22
**Scope:** Homepage gaps + project case study depth + UX continuity

---

## Problem

The portfolio has strong visual execution but three credibility gaps:

1. **Homepage never shows the tech stack.** A recruiter who doesn't click into a project leaves without knowing the stack.
2. **Philosophy section is sparse for its footprint.** Full viewport, 2 principles — no AI/product thinking dimension despite it being the core differentiator.
3. **Project pages read like READMEs, not case studies.** No problem framing, no architectural reasoning, no next-project continuity.

---

## Decisions Log

| Topic | Decision |
|---|---|
| Tech stack section visual | Tickers (md+), badge grid (mobile) |
| Tech stack categories | Build / Augment / Deploy |
| Philosophy 3rd principle | AI as system concern (C) |
| Case study depth | Problem field + Technical Decisions section (B) |
| Next/prev navigation | Card preview with hero thumbnail (B) |
| Dead fields | Remove `heroSubtitleColor`, `heroTextPosition` |

---

## 1. Homepage — Tech Stack Section

### Placement
New section between `PhilosophySection` and `FeaturedProjectsSection` in `app/page.tsx`. ChapterNav gets a new entry: `{ id: "stack", label: "Stack" }`.

### Categories and Content

**Build** — Core languages, frameworks, and libraries:
React, Next.js, TypeScript, Python, Django REST Framework, PostgreSQL, Tailwind CSS, Shadcn/ui, Zustand, Tanstack Query, Tanstack Router

**Augment** — AI tools and developer tooling:
Claude Code, Codex, Gemini CLI, OpenCode, Playwright, Cursor

**Deploy** — Cloud platforms and services:
Vercel, Supabase, Firebase, Cloudinary, Brevo

### Desktop (md+) — Scrolling Tickers
- Three horizontal ticker rows, one per category
- Each row preceded by a small uppercase category label (`font-mono text-[10px] tracking-[0.2em] text-muted-foreground/60`)
- Rows scroll at slightly different speeds (e.g. 30s / 40s / 25s) via CSS `animation-duration`
- Items separated by a `/` divider or `·` bullet
- Items styled: `font-bold text-sm uppercase tracking-[0.15em] text-foreground/70`
- Rows use `overflow-hidden` with a duplicate set of items for seamless loop

**Reduced motion / `prefers-reduced-motion`:** tickers become static flex-wrap rows (same badge pill style as mobile). No JS needed — handle via `@media (prefers-reduced-motion: reduce)` pausing the animation.

### Mobile (below md) — Badge Grid
- Three stacked groups
- Category label above each group
- Items rendered as bordered pills: `rounded-none border border-border px-3 py-1 font-bold text-[10px] uppercase tracking-[0.2em] text-foreground/80`
- Reuses exact pattern from `ProjectBrief.tsx:67`

### Component
New file: `components/sections/TechStackSection.tsx`
Data is hardcoded in the component — it's not project-specific and never needs to be dynamic.

### Edge Cases
- **Ticker overflow on very wide screens:** use `min-w-max` on the inner track so items never wrap mid-ticker.
- **Category label alignment:** label sits above the ticker row, not inline with it, so it stays readable while the row scrolls.
- **Ticker gap between loop repetitions:** duplicate the item list inside the same track element so the loop is seamless.

---

## 2. Homepage — Philosophy Section Update

### Change
Add a 3rd principle ref and extend the GSAP timeline to animate it in after `principle02`.

### Updated Content

```
01 / Architecture
"I design the system before I write the code. Clear structure upfront means less firefighting later."

02 / Execution
"I build interfaces that work on any device, backed by APIs that hold up under real usage."

03 / Intelligence
"I treat AI as a system concern. Quota management, usage windows, and evaluation logic are designed in from the start — not added when things break."
```

### Animation
Current timeline: `0 → 0.35 → 0.55` (principle01, divider01, principle02).
Extended: `0.55 → 0.75 → 0.90` (divider02, principle03).
`end: "+=300vh"` extends to `"+=450vh"` to give the 3rd item enough scroll room.

> Note: The current `end: "+=300vh"` gives ~150vh of perceived scroll per principle. Adding a 3rd principle at the same density → 450vh. This is a rough starting value; adjust if the scrub feels too slow or fast on real hardware.

### Refs added
`principle03Ref`, `divider02Ref` — same pattern as existing refs.

### Edge Cases
- Mobile guard (`window.innerWidth < 1024`) already skips the pin — no change needed; all 3 principles render visibly stacked on mobile.
- `reducedMotion` path already shows all content by default CSS — the 3rd principle will also be visible with no extra work.

---

## 3. Project Data — `lib/projects.ts`

### Type Changes

```ts
// Remove (never consumed by any component)
heroSubtitleColor: string   // ← delete
heroTextPosition: string    // ← delete

// Add
year: string                // "2025" | "2024" | "2023"
problem: string             // 1-2 sentences: what was broken/missing before this existed
technicalDecisions: string[] // 2-3 bullets of architectural choices with rationale
```

### Data Values

**SimplyNote** (`year: "2025"`)
- `problem`: "Students studying with raw notes had no fast way to turn them into structured study material. Existing tools either required manual reformatting or didn't work with your own content."
- `technicalDecisions`:
  - "Rolling-window AI quota system: tracks usage per user over a sliding 24h window rather than a hard daily reset — fairer distribution and harder to game than a midnight cutoff."
  - "Django REST over Next.js API routes: the quota logic, PDF parsing, and AI orchestration needed a persistent process with proper task isolation — serverless functions would hit timeout limits."
  - "Zustand over Redux: the client state surface (auth, quota display, note draft) is small enough that a store factory pattern would have been over-engineering for 3 slices."

**The Podium** (`year: "2024"`)
- `problem`: "HCDC's VPAA managed seminar attendance and certificate distribution manually — spreadsheets, printed sign-in sheets, and emailed certificates sent one by one."
- `technicalDecisions`:
  - "QR codes generated server-side and validated on scan: avoids the race condition where a client-generated code could be shared or reused before the server invalidates it."
  - "Certificate rendering via canvas/PNG rather than PDF: gives admins live preview of font and position changes, and Cloudinary can serve the PNG directly without a PDF renderer on the client."
  - "Brevo for transactional email: the free tier covers the organization's volume and the template editor reduces the need to maintain HTML email strings in code."

**HCDC LFMS** (`year: "2023"`)
- `problem`: "Lost and found items at HCDC were reported informally — word of mouth, group chats, bulletin boards. No central record meant items went unclaimed and disputes had no audit trail."
- `technicalDecisions`:
  - "Role-based access at the API layer, not just the UI: admin-only endpoints validate the role on every request so a user who inspects the frontend can't call moderation routes directly."
  - "Cloudinary for image uploads: offloads resizing and storage from the Django server, keeping the API layer stateless and the server footprint small."
  - "Real-time notifications via polling rather than WebSockets: the notification surface (claim updates, report status) doesn't need sub-second latency, and polling avoids maintaining a persistent connection on a shared hosting environment."

### Removing Dead Fields from Data Objects
When `heroSubtitleColor` and `heroTextPosition` are removed from the `Project` type, they must also be removed from all three project data objects in the array — TypeScript will error on excess properties otherwise.

### Year on the Projects Grid (`/projects/page.tsx`)
The audit calls out missing dates. The ProjectHero fix addresses the case study page, but the grid card at `/projects` should also show the year for consistency. Add it to the subtitle line in the grid card:
```
01 // 2025 — An AI-Powered Learning Productivity Web Application...
```
Prepend `{project.year} — ` before `{project.subtitle}` in `app/projects/page.tsx`. One-line change.

### Edge Cases
- `integrations: []` on SimplyNote is already unused in the UI (guarded by `length > 0`). Leave it — removing it is a separate cleanup, not part of this spec.

---

## 4. Project Pages — `ProjectBrief.tsx`

### Change
Split the overview column into two labeled blocks: **Problem** and **Solution** (what `overview` currently is).

```
[ Problem label ]
project.problem paragraph

[ Solution label ]
project.overview paragraph
```

Labels use existing style: `font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80`

The `md:col-span-7` overview column grows to accommodate both paragraphs. No layout change needed — it's a flex column by default.

### Year in ProjectHero
Add year to the meta line in `ProjectHero.tsx` alongside the role badge:
```
Case Study  ─  [Client Project]  ─  Solo Developer  ─  2025
```
Same style as the existing `<span>` elements in that row.

### Edge Cases
- If `project.problem` is empty string, render nothing (guard with `{project.problem && ...}`). This prevents a broken label with no content if a future project is added without the field.
- Year display: render as plain text, not a link. Don't overthink it.

---

## 5. New Component — `ProjectTechnicalDecisions.tsx`

### Placement
In `[slug]/page.tsx`: after `<ProjectFeatures>`, before `<ProjectGallery>`. Wrapped with `<SectionDivider />` on each side (already the pattern).

### Structure
```
[ 03 / Technical Decisions ]   ← monospace label, uppercase

─────────────────────────────  ← thin border-b, same as section header pattern

Three items, each:
  [ number ]  [ decision text ]
```

Number: `font-mono text-primary`. Text: `text-lg text-muted-foreground leading-relaxed`.

Animation: `whileInView` fade-up, same Framer Motion pattern as `ProjectBrief`.

### Edge Cases
- If `technicalDecisions` is empty or undefined, render `null` (skip the section). Enables adding new projects without the field being required.
- Numbering: render as `01 /`, `02 /`, `03 /` — derived from array index, not hardcoded.

---

## 6. New Component — `ProjectNextPrev.tsx`

### Placement
In `[slug]/page.tsx`: after the last `<SectionDivider />`, before `<BackButton>`.

### Structure
Two cards side by side (prev left, next right). Each card:
- Hero image as background (using `next/image` with `fill`, same as `ProjectGallery`)
- Gradient overlay: `bg-linear-to-t from-black/80 to-transparent`
- Project number label: `font-mono text-[10px] uppercase tracking-[0.2em] text-primary`
- Project title: `text-xl font-black text-white`
- Arrow indicator: `←` for prev, `→` for next

**Wrapping logic:** if on last project, "next" wraps to index 0. If on first project, "prev" wraps to last. Always show both cards.

**Mobile:** cards stack vertically. Next on top, prev below (more likely to continue forward than go back).

### Edge Cases
- **Only one project:** hide the component entirely (`if (projects.length < 2) return null`). Not relevant now but future-proofs against the array being reduced.
- **Two projects:** both cards always visible (prev = next, next = prev). This is fine at 2 projects; wrapping makes the navigation circular.
- **Image loading:** use `sizes="50vw"` on desktop, `"100vw"` on mobile since each card occupies half the viewport width.
- **Hover state:** subtle scale on the image (`group-hover:scale-105 transition-transform duration-700`) — same as the projects grid card pattern.

---

## 7. Experience Section — Freelance Entry

### Change
In `ExperienceSnapshotSection.tsx`, update the Freelance entry:

```
Title: Full-Stack Web Developer
Period: Freelance // 2023 – 2024

Body (current): "Built full-stack web applications using Next.js, React, PostgreSQL, and Django with a focus on robust architecture and scalable features."

Body (updated): "Built The Podium for HCDC's VPAA — a seminar tracking platform with QR attendance, certificate generation, and email notifications. Also built HCDC LFMS, a lost and found platform with real-time claims, moderation, and role-based access control."
```

This names the actual projects, links purpose to outcome, and gives a recruiter something to search for.

---

## What's Out of Scope

- Certificates section on homepage (content work, separate initiative)
- `/certificates` link from homepage nav (separate)
- Full "Challenges & Learnings" section on case studies (second pass, after content is written)
- Availability line in footer (5-min win, but not part of this initiative)
- LiveActivity wiring into ChapterNav (separate)

---

## File Change Summary

| File | Change |
|---|---|
| `app/projects/page.tsx` | Prepend year to subtitle in grid card |
| `app/page.tsx` | Add `<TechStackSection id="stack" />` between Philosophy and Projects |
| `components/layout/ChapterNav.tsx` | Add `stack` chapter entry |
| `components/sections/TechStackSection.tsx` | **New file** |
| `components/sections/PhilosophySection.tsx` | Add 3rd principle + extend GSAP timeline |
| `components/sections/ExperienceSnapshotSection.tsx` | Update freelance entry body |
| `lib/projects.ts` | Add `year`, `problem`, `technicalDecisions`; remove dead fields; populate data |
| `components/projects/ProjectHero.tsx` | Add year to meta line |
| `components/projects/ProjectBrief.tsx` | Split overview into Problem + Solution |
| `components/projects/ProjectTechnicalDecisions.tsx` | **New file** |
| `components/projects/ProjectNextPrev.tsx` | **New file** |
| `app/projects/[slug]/page.tsx` | Add `ProjectTechnicalDecisions` and `ProjectNextPrev` |
