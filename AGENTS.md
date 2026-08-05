# Project Agents Configuration

## Metadata
- Owner: `Hanseooo (amoguishans@gmail.com)`
- Last reviewed: `2026-08-05`
- Review cadence: `monthly`

## Baseline Rules
> Inlined from `~/.claude/CLAUDE.md` for agents that cannot read the user's global config.
> Re-run `/project-init` whenever the global config changes.

### 1. Think Before Coding
- State assumptions explicitly. Uncertain → ask, don't guess and run.
- Claiming something is unused, dead, or deprecated? Grep the whole repo first. One file is not evidence.
- Multiple valid interpretations → present them. Never pick silently.
- Confused → stop, name what's confusing, ask one focused question.

### 2. Architectural Decisions
Don't decide these alone. Ask before implementing:
- New dependency, service, or datastore
- Schema, API contract, or public interface change
- Auth, billing, or infra
- A change spanning more than ~3 modules, or one that's hard to reverse

Ask at the moment you notice, not after writing the code.

**This gate is for decisions, not for permission to work.** Bugs, failing tests, and clearly-scoped fixes: just fix them.

If the decision needs more exploration than the remaining context supports, say so and offer to run `/handoff` and continue in a fresh session. Never start a handoff without approval.

### 3. Surgical Changes
- Don't improve adjacent code, comments, or formatting.
- Match existing style, even if you'd do it differently.
- Notice unrelated dead code → mention it, don't delete it.
- Remove orphans **your** change created (imports, vars, functions). Nothing else.

Test: every changed line traces to the request.

### 4. Verification
- State success criteria before starting.
- Work that skips the plan chain still starts with a failing test (`superpowers:test-driven-development`).
- TDD scope: anything with a branch, loop, parser, or money/security path. One-liners, config, and pure renames are exempt — ponytail wins there.
- Never claim done without running the check and showing its output.
- Report faithfully: tests failed → say so, with output. Step skipped → say so.

### 5. Security
- Never read `.env` or secret files. Ask for sanitized inputs.
- Never log or echo credentials, tokens, or keys.
- Flag auth/billing/infra changes before implementing (see Architectural Decisions).

---

## Project Context
- Stack: `Next.js 16 + React 19 + TypeScript + Tailwind CSS v4 + Framer Motion + GSAP + Lenis + @use-gesture/react + Radix UI + shadcn/ui` (evidence: `package.json`)
- Architecture: Single-page portfolio (`app/` router) with chapter-based storytelling sections. Components live in `components/sections/`, `components/layout/`, `components/ui/`, `components/providers/`, `components/transitions/`, `components/dialogs/`, `components/projects/`, `components/certificates/`, `components/cards/`, `components/seo/`, and `components/utils/`. Animation utilities in `lib/motion.ts` and `lib/gsap.ts`. Lenis drives smooth scroll; @use-gesture/react handles gesture input. No backend — static site targeting Vercel deployment.
- Critical paths: Animation smoothness and scroll behavior are the highest-risk regression areas. No auth/billing/infra.

## Documentation Map
- Always read: `docs/01-project-brief.md`, `docs/05-design-system.md`
- Read when:
  - Active multi-session design work → `docs/dockets/portfolio-redesign-docket.md` (governs session scope and binding constraints)
  - UI/section work → `docs/04-visual-direction.md`, `docs/06-ux-interactions.md`
  - Layout/structure → `docs/03-information-architecture.md`
  - Responsive work → `docs/07-responsive-behavior.md`
  - Accessibility → `docs/08-accessibility-performance.md`
  - Implementation planning → `docs/09-implementation-plan.md`
  - Active feature specs → `docs/superpowers/specs/` (most recent by date)
  - Active feature plans → `docs/superpowers/plans/` (most recent by date)

## Commands (Use Exactly)
- Install: `pnpm install` (evidence: `pnpm-lock.yaml`)
- Lint: `pnpm lint` (evidence: `package.json` scripts)
- Build/Typecheck: `pnpm build` (evidence: `package.json` scripts — Next.js build includes tsc)
- Dev server: `pnpm dev` (evidence: `package.json` scripts)
- Unit tests: none configured
- Integration/E2E: none configured
- Pre-merge verify: `pnpm lint && pnpm build`

## Tooling Lock
- Canonical package manager: `pnpm` (evidence: `pnpm-lock.yaml`)
- Never use: `npm`, `yarn`, `bun`

## Testing Contract
- No test runner configured. "Passing" means: `npx eslint` exits 0, `pnpm build` exits 0, and the feature works visually in the browser via `pnpm dev`.
- Visual verification required for every UI change — check scroll behavior and animation smoothness after any layout change.
- No known flaky tests.

## Project Invariants
- Color palette: deep black base + Ice Blue accents (dark theme); light ivory + red signal (light theme). Do not introduce other accent colors without explicit approval.
- Chapter-based layout: sections are numbered/themed (01 Identity, 02 Approach, etc.) — maintain this structure.
- Animation rule: Framer Motion for React component animations; GSAP for scroll-trigger sequences. Never mix both on the same element.
- `prefers-reduced-motion` must be respected in all animation code.
- Tailwind v4: no `tailwind.config.js`; config lives in CSS / `postcss.config.mjs`. Use v4 utility classes only.
- shadcn/ui components live in `components/ui/` — extend these before writing from scratch.

## Critical Paths & Extra Review Triggers
- Scroll/animation code (`lib/gsap.ts`, `lib/motion.ts`, `components/transitions/PageOverlay.tsx`, `components/providers/LenisProvider.tsx`) — jank or layout shift breaks the cinematic feel.
- `app/layout.tsx` — root layout; changes here affect all pages.
- `components/layout/ChapterNav.tsx` — global nav; test across all scroll positions.

## Definition of Done
- Completion report includes: commands run, key results, what was verified vs not, residual risks.
- Never mark complete without proof (passing lint/build output shown, visual browser verification done).

## Validation Notes
- No test suite exists — all verification is manual (`pnpm lint && pnpm build` + visual browser check).
- No README.md at repo root — `docs/01-project-brief.md` serves as the project intent document.
