# Project Agents Configuration

## Metadata
- Owner: `Hanseooo (amoguishans@gmail.com)`
- Last reviewed: `2026-06-23`
- Review cadence: `monthly`

## Scope & Precedence
- This file records repo-specific deltas only.
- Global behavioral rules in `~/.claude/CLAUDE.md` remain primary (Karpathy principles, workflow orchestration, task management).
- Conflict order: Safety > Security > User intent > Workflow > Style.

## Project Context
- Stack: `Next.js 16 + React 19 + TypeScript + Tailwind CSS v4 + Framer Motion + GSAP + Radix UI + shadcn/ui`
- Architecture: Single-page portfolio (`app/` router) with chapter-based storytelling sections. Components live in `components/sections/`, `components/layout/`, `components/ui/`, `components/motion/`, `components/transitions/`, and `components/dialogs/`. Animation utilities in `lib/motion.ts` and `lib/gsap.ts`. No backend — static site with Vercel deployment target.
- Critical paths: None (no auth/billing/infra). Animation smoothness and scroll behavior are the highest-risk areas for regressions.

## Documentation Context Map
- Always read: `docs/01-project-brief.md`, `docs/05-design-system.md`
- Read when:
  - UI/section work → `docs/04-visual-direction.md`, `docs/06-ux-interactions.md`
  - Layout/structure → `docs/03-information-architecture.md`
  - Responsive work → `docs/07-responsive-behavior.md`
  - Accessibility → `docs/08-accessibility-performance.md`
  - Implementation planning → `docs/09-implementation-plan.md`
  - Active feature specs → `docs/superpowers/specs/` (most recent by date)
  - Active feature plans → `docs/superpowers/plans/` (most recent by date)

## Commands (Use Exactly)
- Install: `npm install` (evidence: `package-lock.json`)
- Lint: `npx eslint` (evidence: `package.json` scripts)
- Build/Typecheck: `npm run build` (evidence: `package.json` scripts — Next.js build includes tsc)
- Dev server: `npm run dev` (evidence: `package.json` scripts)
- Unit tests: none configured
- Integration/E2E: none configured
- Pre-merge verify: `npm run lint && npm run build`

### Granular Testing
- No test runner configured. Verify visually via `npm run dev` and browser inspection.

## Critical Paths & Extra Review Triggers
- Scroll/animation code (`lib/gsap.ts`, `lib/motion.ts`, `components/transitions/PageOverlay.tsx`, `components/motion/`) — jank or layout shift breaks the cinematic feel
- `app/layout.tsx` — root layout; changes here affect all pages
- `components/layout/ChapterNav.tsx` — global nav; test across all scroll positions

## Definition of Done
- Completion report includes: commands run, key results, what was verified vs not, residual risks.
- Never mark complete without proof (passing lint/build, visual verification in browser).
- Ask: "Would a staff engineer approve this?"

## Security
- Never read `.env` files or secrets. Request sanitized inputs from the user instead.

## Tooling Lock
- Canonical package manager: `npm` (evidence: `package-lock.json`)
- Forbidden alternatives: `pnpm`, `yarn`, `bun`

## Project-Specific Invariants
- Color palette: deep black base + "Ice Blue" accents — do not introduce other accent colors
- Chapter-based layout: sections are numbered/themed (01 Identity, 02 Approach, etc.) — maintain this structure
- Animation: prefer Framer Motion for React component animations; GSAP for scroll-trigger sequences; never mix both on the same element
- `prefers-reduced-motion` must be respected in all animation code
- Tailwind v4 is in use — use the v4 API (no `tailwind.config.js`, config is in CSS or `postcss.config.mjs`)

## Validation Notes
- No test suite exists — all verification is manual (lint + build + visual browser check)
- No README.md at repo root — `docs/01-project-brief.md` serves as project intent doc
