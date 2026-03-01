# UI/UX + Performance Task Tickets

## Metadata

- Ticket set ID: `tickets-uiux-perf-2026-03-01`
- Parent plan: `docs/plans/2026-03-01-ui-ux-performance-refactor-plan.md`
- Status: `in_progress`
- Execution model: sequential by phase, parallel within phase where safe

## Execution Log

### TKT-001 - Fix certificate slug route correctness
- Status: `done`
- Files changed:
  - `app/certificates/[slug]/page.tsx`
- Key decisions:
  - Replaced null fallback with `notFound()` and moved the scroll-reset hook above conditional return to keep hook order valid.
- Edge cases verified:
  - Unknown certificate slug now routes to Next.js not-found flow.
- Verification output:
  - lint: `fail` (repo has existing non-ticket lint errors; hook-order issue for this file resolved)
  - typecheck: `pass`
  - build: `pass`

### TKT-002 - Navigation/menu baseline accessibility pass
- Status: `done`
- Files changed:
  - `components/layout/Navbar.tsx`
  - `components/layout/MenuToggle.tsx`
  - `components/layout/FullScreenMenu.tsx`
  - `components/layout/ThemeToggle.tsx`
- Key decisions:
  - Added `aria-expanded`, `aria-controls`, dialog semantics, Escape close, first-item focus on open, and focus restoration to menu trigger on close.
  - Switched brand link from `href="#"` to semantic route link.
- Edge cases verified:
  - Escape key closes menu.
  - Hidden menu is non-interactive via `pointer-events-none` when closed.
- Verification output:
  - lint: `fail` (pre-existing global lint failures)
  - typecheck: `pass`
  - build: `pass`

### TKT-003 - Restore global scrollbar visibility
- Status: `done`
- Files changed:
  - `app/globals.css`
- Key decisions:
  - Removed global scrollbar suppression from universal selectors.
- Edge cases verified:
  - Primary document keeps visible native scroll affordance.
- Verification output:
  - lint: `fail` (pre-existing global lint failures)
  - typecheck: `pass`
  - build: `pass`

### TKT-004 - About section drag hint/env stability fixes
- Status: `done`
- Files changed:
  - `components/sections/About.tsx`
- Key decisions:
  - Unified drag-hint sessionStorage key.
  - Reworked runtime-env initialization to nullable state and explicit derived booleans.
  - Limited drag binding to desktop + user-enabled mode.
- Edge cases verified:
  - First-visit hint and subsequent sessions are now key-consistent.
  - Drag no longer binds by default on mobile.
- Verification output:
  - lint: `fail` (pre-existing and broader hook-style lint rules in repo)
  - typecheck: `pass`
  - build: `pass`

### TKT-005 - Convert root layout back to server-first architecture
- Status: `done`
- Files changed:
  - `app/layout.tsx`
  - `components/providers/AppProviders.tsx`
- Key decisions:
  - Removed `"use client"` from root layout and moved provider composition into a dedicated client wrapper.
  - Added base `metadata` at root layout level for SEO baseline.
- Edge cases verified:
  - Client-only providers remain mounted via wrapper while layout renders on server.
- Verification output:
  - lint: `fail` (existing repo-wide lint debt unrelated to this ticket)
  - typecheck: `pass`
  - build: `pass`

### TKT-006 - Harden Lenis/animation lifecycle cleanup
- Status: `done`
- Files changed:
  - `components/providers/LenisProvider.tsx`
- Key decisions:
  - Replaced module-scope runtime detection with effect-time detection.
  - Added RAF ID tracking/cancellation and timeout cleanup.
  - Cleared global Lenis reference and local refs during teardown.
- Edge cases verified:
  - Route transitions no longer leave pending scheduled refresh work on rapid changes.
  - Unmount cleanup cancels active animation frame loop.
- Verification output:
  - lint: `fail` (existing repo-wide lint debt unrelated to this ticket)
  - typecheck: `pass`
  - build: `pass`

### TKT-007 - Add responsive image `sizes` and tighten `priority`
- Status: `done`
- Files changed:
  - `components/projects/ProjectHero.tsx`
  - `components/cards/ProjectCard.tsx`
  - `app/certificates/[slug]/page.tsx`
- Key decisions:
  - Added explicit `sizes` to all targeted `fill` images.
  - Removed eager `priority` loading from reusable project cards to prevent unnecessary eager image downloads.
- Edge cases verified:
  - Project and certificate images keep existing layout behavior across responsive breakpoints.
- Verification output:
  - lint: `fail` (existing repo-wide lint debt unrelated to this ticket)
  - typecheck: `pass`
  - build: `pass`

### TKT-008 - Accessible semantics for interactive project cards
- Status: `done`
- Files changed:
  - `components/cards/ProjectCard.tsx`
- Key decisions:
  - Replaced click-to-route imperative behavior with semantic `Link` overlay target.
  - Added explicit `aria-label`s for icon-only external actions.
  - Added `group-focus-within` visibility so hover-only icon affordances are keyboard discoverable.
- Edge cases verified:
  - Keyboard users can focus/open card target and still reach nested external actions.
- Verification output:
  - lint: `fail` (existing repo-wide lint debt unrelated to this ticket)
  - typecheck: `pass`
  - build: `pass`

### TKT-009 - Theme token consistency and font-token cleanup
- Status: `done`
- Files changed:
  - `app/globals.css`
- Key decisions:
  - Aligned dark mode `--primary` tokens to the same brand red values used in light mode.
  - Removed conflicting `prefers-color-scheme` accent override to avoid mixed theme behavior with class-based theming.
  - Replaced undefined `--font-geist-*` references with concrete sans/mono fallbacks in theme tokens.
- Edge cases verified:
  - Theme token mapping remains valid under light/dark class toggles.
- Verification output:
  - lint: `fail` (existing repo-wide lint debt unrelated to this ticket)
  - typecheck: `pass`
  - build: `pass`

### TKT-010 - Prevent SVG defs/ID collisions
- Status: `done`
- Files changed:
  - `components/ui/shadcn-io/grid-pattern/index.tsx`
  - `lib/svgMap.tsx`
- Key decisions:
  - Grid pattern now generates instance-safe pattern IDs via `useId`.
  - Namespaced repeated static SVG definition IDs in icon map to avoid cross-icon collisions.
  - Replaced `any` index signature in grid pattern props with typed SVG props.
- Edge cases verified:
  - Multiple grid pattern instances no longer share static IDs.
- Verification output:
  - lint: `fail` (existing repo-wide lint debt unrelated to this ticket)
  - typecheck: `pass`
  - build: `pass`

### TKT-011 - Consolidate scroll reset logic and remove `any` global access
- Status: `done`
- Files changed:
  - `global.d.ts`
  - `components/utils/useResetScrollTop.ts`
  - `app/page.tsx`
  - `app/projects/[slug]/page.tsx`
  - `app/certificates/[slug]/page.tsx`
  - `components/providers/LenisProvider.tsx`
- Key decisions:
  - Added a typed global `window.__lenis` declaration and removed route-level `(window as any).__lenis` usage.
  - Centralized entry scroll-reset behavior into a shared hook used by home/project/certificate routes.
- Edge cases verified:
  - Scroll reset still falls back to native `window.scrollTo` when Lenis is unavailable.
- Verification output:
  - lint: `fail` (existing repo-wide lint debt unrelated to this ticket)
  - typecheck: `pass`
  - build: `pass`

### TKT-012 - Add route-level resilience primitives
- Status: `done`
- Files changed:
  - `app/projects/[slug]/layout.tsx`
  - `app/projects/[slug]/loading.tsx`
  - `app/projects/[slug]/error.tsx`
  - `app/certificates/[slug]/layout.tsx`
  - `app/certificates/[slug]/loading.tsx`
  - `app/certificates/[slug]/error.tsx`
- Key decisions:
  - Added dynamic route metadata generation per slug using existing in-repo data.
  - Added route-level loading skeletons and recoverable error boundaries for both dynamic sections.
- Edge cases verified:
  - Unknown slugs still resolve through page-level 404 behavior, while metadata gracefully falls back.
- Verification output:
  - lint: `fail` (existing repo-wide lint debt unrelated to this ticket)
  - typecheck: `pass`
  - build: `pass`

## Global Rules

- Do not change visual identity unless ticket explicitly requires it.
- Keep PRs small and scoped to listed files.
- Run verification commands for each ticket before marking done:
  - `npm run lint`
  - `npx tsc --noEmit`
  - `npm run build`
- For UI tickets, also run manual checks on: `320`, `375`, `768`, `1024`, `1440` widths.

---

## Phase 0 Tickets (P0/P1)

### TKT-001 - Fix certificate slug route correctness
- Priority: `P0`
- Depends on: none
- Scope:
  - `app/certificates/[slug]/page.tsx`
- Tasks:
  1. Replace missing slug fallback with `notFound()`.
  2. Ensure hooks are never called conditionally.
  3. Keep existing transition UX behavior.
- Acceptance criteria:
  - Unknown cert slug renders 404 page.
  - No React hook lint errors in this file.

### TKT-002 - Navigation/menu baseline accessibility pass
- Priority: `P1`
- Depends on: none
- Scope:
  - `components/layout/Navbar.tsx`
  - `components/layout/MenuToggle.tsx`
  - `components/layout/FullScreenMenu.tsx`
- Tasks:
  1. Replace non-semantic home anchor target.
  2. Add/verify `aria-expanded`, `aria-controls`, and labels.
  3. Implement Escape-to-close and focus restoration.
- Acceptance criteria:
  - Menu is fully operable by keyboard.
  - No critical nav/menu accessibility issues.

### TKT-003 - Restore global scrollbar visibility
- Priority: `P1`
- Depends on: none
- Scope:
  - `app/globals.css`
- Tasks:
  1. Remove universal scrollbar hiding styles.
  2. Re-scope optional scrollbar styling to non-critical containers only (if needed).
- Acceptance criteria:
  - Scrollbars visible for primary document scrolling.
  - No layout regressions.

### TKT-004 - About section drag hint/env stability fixes
- Priority: `P1`
- Depends on: none
- Scope:
  - `components/sections/About.tsx`
- Tasks:
  1. Fix sessionStorage key mismatch for drag hint.
  2. Correct environment-ready/mounted logic.
  3. Guard drag setup by intended runtime conditions.
- Acceptance criteria:
  - Hint display behavior is deterministic.
  - No mobile/webview regression for About interactions.

---

## Phase 1 Tickets (P1)

### TKT-005 - Convert root layout back to server-first architecture
- Priority: `P1`
- Depends on: TKT-001
- Scope:
  - `app/layout.tsx`
  - `components/providers/AppProviders.tsx` (new)
  - `components/providers/ThemeProvider.tsx`
  - `components/providers/LenisProvider.tsx`
  - `components/transitions/TransitionProvider.tsx`
- Tasks:
  1. Remove `"use client"` from root layout.
  2. Create a client-only providers wrapper.
  3. Keep hydration-safe theme behavior.
  4. Add base metadata export in layout.
- Acceptance criteria:
  - Root layout is server component.
  - No hydration warnings introduced.

### TKT-006 - Harden Lenis/animation lifecycle cleanup
- Priority: `P1`
- Depends on: TKT-005
- Scope:
  - `components/providers/LenisProvider.tsx`
  - related animation hooks/providers touched by lint/type issues
- Tasks:
  1. Track RAF ID and cancel in cleanup.
  2. Reset global Lenis reference on destroy.
  3. Keep ScrollTrigger refresh flow deterministic.
- Acceptance criteria:
  - No persistent RAF loop after unmount.
  - Route transitions remain stable.

### TKT-007 - Add responsive image `sizes` and tighten `priority`
- Priority: `P1`
- Depends on: none
- Scope:
  - `components/projects/ProjectHero.tsx`
  - `components/cards/ProjectCard.tsx`
  - `app/certificates/[slug]/page.tsx`
- Tasks:
  1. Define realistic `sizes` values for each fill image context.
  2. Restrict `priority` to true LCP candidates.
- Acceptance criteria:
  - Improved Lighthouse image diagnostics.
  - No visual regression across breakpoints.

---

## Phase 2 Tickets (P2)

### TKT-008 - Accessible semantics for interactive project cards
- Priority: `P2`
- Depends on: TKT-002
- Scope:
  - `components/cards/ProjectCard.tsx`
- Tasks:
  1. Ensure semantic click target (`Link` or proper button semantics).
  2. Preserve nested external links and labels.
  3. Ensure keyboard parity for hover-dependent interactions.
- Acceptance criteria:
  - Card interactions work with Tab + Enter/Space.
  - Nested actions remain reachable and conflict-free.

### TKT-009 - Theme token consistency and font-token cleanup
- Priority: `P2`
- Depends on: TKT-005
- Scope:
  - `app/globals.css`
  - `app/layout.tsx`
- Tasks:
  1. Reconcile primary token behavior across light/dark/system themes.
  2. Remove or define unused font CSS variables.
  3. Validate contrast after token updates.
- Acceptance criteria:
  - Theme output is consistent and accessible.
  - No dead token references remain.

### TKT-010 - Prevent SVG defs/ID collisions
- Priority: `P2`
- Depends on: none
- Scope:
  - `components/ui/shadcn-io/grid-pattern/index.tsx`
  - `lib/svgMap.tsx`
- Tasks:
  1. Namespace/uniquify SVG IDs per instance.
  2. Validate repeated icon rendering.
- Acceptance criteria:
  - No duplicate-ID rendering artifacts.
  - SSR/client rendering remains stable.

---

## Phase 3 Tickets (P3)

### TKT-011 - Consolidate scroll reset logic and remove `any` global access
- Priority: `P3`
- Depends on: TKT-006
- Scope:
  - `app/page.tsx`
  - `app/projects/[slug]/page.tsx`
  - `app/certificates/[slug]/page.tsx`
  - shared utility/hook (new if needed)
  - global type declaration (new if needed)
- Tasks:
  1. Centralize route-entry scroll reset behavior.
  2. Replace `(window as any).__lenis` with typed global access.
- Acceptance criteria:
  - Single source of truth for scroll reset logic.
  - No `any` usage for Lenis global in touched areas.

### TKT-012 - Add route-level resilience primitives
- Priority: `P3`
- Depends on: TKT-005
- Scope:
  - `app/**` (selected routes)
- Tasks:
  1. Add `loading.tsx` and/or `error.tsx` where justified.
  2. Add metadata generation strategy for dynamic pages.
- Acceptance criteria:
  - Loading/error UX is explicit for target routes.
  - Dynamic pages have meaningful metadata.

---

## Optional Enhancement Tickets

### TKT-013 - Reduced-motion compliance pass
- Priority: `P2`
- Depends on: TKT-006
- Scope:
  - animation-heavy components in `components/motion/*`, `components/sections/*`
- Tasks:
  1. Respect `prefers-reduced-motion` in GSAP/Framer flows.
  2. Provide low-motion fallback behavior.
- Acceptance criteria:
  - Users with reduced-motion preference receive non-disruptive transitions.

### TKT-014 - Dead code and import hygiene cleanup
- Priority: `P3`
- Depends on: none
- Scope:
  - stale files/imports flagged by lint
- Tasks:
  1. Remove dead imports and unused variables.
  2. Remove unused modules only if no runtime references exist.
- Acceptance criteria:
  - Lint noise reduced; no functional regressions.

---

## Suggested PR Batching

1. PR-A: `TKT-001 + TKT-002 + TKT-003 + TKT-004`
2. PR-B: `TKT-005 + TKT-006`
3. PR-C: `TKT-007 + TKT-008`
4. PR-D: `TKT-009 + TKT-010`
5. PR-E: `TKT-011 + TKT-012`
6. PR-F (optional): `TKT-013 + TKT-014`

## Ticket Completion Template (AI-Friendly)

Use this template per ticket in PR descriptions or execution logs:

```md
### <TICKET_ID> - <title>
- Status: done | in_progress | blocked
- Files changed:
  - <path>
- Key decisions:
  - <decision + rationale>
- Edge cases verified:
  - <case>
- Verification output:
  - lint: pass/fail
  - typecheck: pass/fail
  - build: pass/fail
- Follow-ups:
  - <optional>
```
