# Project CLAUDE.md

> Global behavioral rules (Karpathy principles, workflow, task management) are in `~/.claude/CLAUDE.md`.
> This file records project-specific overrides and additions only.

## Stack & Context
- Next.js 16 + React 19 + TypeScript + Tailwind CSS v4 + Framer Motion + GSAP + Radix UI
- Read `AGENTS.md` for commands, critical paths, and doc map.

## Project-Specific Rules
- Package manager is `npm` — never use pnpm/yarn/bun
- Tailwind v4: no `tailwind.config.js`; config lives in CSS/postcss. Use v4 utility classes only
- Animations: Framer Motion for React component animations, GSAP for scroll-trigger sequences. Never mix on the same element
- Always respect `prefers-reduced-motion` in any animation added
- Ice Blue + deep black palette only — no new accent colors without explicit approval
- shadcn/ui components live in `components/ui/` — prefer extending these over writing from scratch

## Testing Contract
- No test runner configured. "Passing" means: `npm run lint` exits 0, `npm run build` exits 0, and the feature works visually in browser
- No known flaky tests

## PR / Merge Requirements
- Run `npm run lint && npm run build` before marking any task complete
- Visual verification in browser (dev server) required for any UI change
- Check scroll behavior and animation smoothness after any layout change
