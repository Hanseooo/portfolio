# UI/UX + Performance Refactor Plan (AI-Friendly)

## Metadata

- Plan ID: `plan-uiux-perf-2026-03-01`
- Repository: `portfolio` (Next.js 16 + React 19 + TypeScript)
- Authoring date: `2026-03-01`
- Status: `proposed`
- Priority model: `P0 (critical) -> P1 (high) -> P2 (medium) -> P3 (low)`
- Expected execution style: incremental PRs by phase

## Why This Plan Exists

This repository has strong visual direction and interaction design, but there are correctness bugs, accessibility gaps, and performance opportunities that should be resolved before further feature work.

This plan defines:
- what to fix,
- why it matters,
- which files are in scope,
- edge cases to protect,
- and how to validate completion.

## Baseline Audit Summary

1. Critical route correctness issue in certificate detail page (hook-order + missing 404 behavior).
2. Overuse of client components at the app root increases hydration/JS cost.
3. Navigation/menu semantics and keyboard handling are incomplete.
4. Animation lifecycle has potential leak risk (Lenis RAF cleanup).
5. Responsive and accessibility risks in horizontally pinned About section.
6. Global scrollbar hiding harms usability/accessibility.
7. Theming tokens are inconsistent between light/dark branding.
8. Image optimization (`sizes`, `priority`) can be improved for LCP and bandwidth.
9. Duplication and lint debt reduce maintainability.

## Outcomes To Achieve

- Reliable route behavior (invalid dynamic slugs always render intentional 404 UX).
- Better UX accessibility (keyboard + screen reader + focus-safe interactions).
- Lower client-side runtime overhead and more server-first rendering where possible.
- Predictable animation lifecycle without orphaned loops.
- Consistent theme/token behavior and responsive integrity.
- Cleaner codebase with less duplication and stronger typing.

## Non-Goals

- Full visual redesign of the portfolio.
- Replacing GSAP/Lenis/Framer architecture wholesale.
- Introducing a new design system or CSS framework.
- Migrating content source to CMS/API in this phase.

## Constraints

- Keep changes incremental and reversible.
- Preserve current visual language unless a change fixes a UX/a11y/perf issue.
- Maintain Next.js App Router conventions.
- Avoid broad refactors without acceptance criteria.

---

## Phase Roadmap

## Phase 0 - Correctness + Fast Wins (P0/P1)

### Spec 0.1 - Fix certificate route correctness
- Priority: `P0`
- Objective: remove hook-order risk and enforce proper missing-resource behavior.
- Scope:
  - `app/certificates/[slug]/page.tsx`
- Required changes:
  - Replace missing certificate fallback (`return null`) with `notFound()`.
  - Ensure hook calls are not conditional.
  - Keep route transition behavior intact.
- Edge cases:
  - Direct navigation to unknown slug.
  - Browser back/forward after unknown slug.
- Acceptance criteria:
  - Invalid slug renders 404 page.
  - No lint rule violations for hooks in this file.

### Spec 0.2 - Accessibility quick pass for nav/menu controls
- Priority: `P1`
- Objective: make top-level navigation keyboard and screen-reader safe.
- Scope:
  - `components/layout/Navbar.tsx`
  - `components/layout/MenuToggle.tsx`
  - `components/layout/FullScreenMenu.tsx`
- Required changes:
  - Replace non-semantic home anchor (`href="#"`) with semantic navigation target.
  - Add/verify `aria-expanded`, `aria-controls`, and descriptive labels.
  - Add Escape-to-close and focus restoration behavior.
- Edge cases:
  - Route change while menu is open.
  - Keyboard-only navigation.
- Acceptance criteria:
  - All menu actions operable via keyboard only.
  - No critical accessibility findings in nav/menu flow.

### Spec 0.3 - Remove global scrollbar suppression
- Priority: `P1`
- Objective: restore scroll affordance and prevent hidden overflow confusion.
- Scope:
  - `app/globals.css`
- Required changes:
  - Remove global scrollbar hiding rules from universal selectors.
  - If needed, apply scoped styling only to non-essential decorative containers.
- Edge cases:
  - Windows visible scrollbar behavior.
  - Embedded webview behavior.
- Acceptance criteria:
  - Main document scrollbars are visible and usable.

### Spec 0.4 - Stabilize About drag-hint/env logic
- Priority: `P1`
- Objective: ensure one-time hint and predictable drag behavior by environment.
- Scope:
  - `components/sections/About.tsx`
- Required changes:
  - Resolve sessionStorage key mismatch.
  - Correct environment readiness checks.
  - Prevent unintended drag setup on unsupported contexts.
- Edge cases:
  - First session vs returning session.
  - iOS/Android webview detection.
- Acceptance criteria:
  - Hint shows according to intended rules.
  - No regressions in mobile/webview behavior.

## Phase 1 - Platform and Performance Foundations (P1)

### Spec 1.1 - Restore server-first root layout
- Priority: `P1`
- Objective: reduce hydration overhead and align with Next.js best practices.
- Scope:
  - `app/layout.tsx`
  - new provider wrapper (example: `components/providers/AppProviders.tsx`)
- Required changes:
  - Make `app/layout.tsx` a server component.
  - Move client-only providers to a dedicated client wrapper.
  - Add route metadata baseline at layout level.
- Edge cases:
  - Theme hydration with `next-themes`.
  - Transition/Lenis startup timing.
- Acceptance criteria:
  - Root layout no longer requires `"use client"`.
  - No new hydration warnings.

### Spec 1.2 - Animation lifecycle hardening
- Priority: `P1`
- Objective: prevent lingering RAF loops and animation memory leaks.
- Scope:
  - `components/providers/LenisProvider.tsx`
  - other animation hooks/providers as needed
- Required changes:
  - Track and cancel RAF on cleanup.
  - Clear global Lenis reference on destroy.
  - Keep ScrollTrigger refresh behavior deterministic.
- Edge cases:
  - Fast route transitions.
  - HMR in development.
- Acceptance criteria:
  - No persistent RAF loop after unmount.
  - Stable route transition animation behavior.

### Spec 1.3 - Image delivery optimization
- Priority: `P1`
- Objective: reduce over-fetching and improve LCP.
- Scope:
  - `components/projects/ProjectHero.tsx`
  - `components/cards/ProjectCard.tsx`
  - `app/certificates/[slug]/page.tsx`
- Required changes:
  - Add accurate `sizes` for all `fill` images.
  - Restrict `priority` to true LCP images.
- Edge cases:
  - Different viewport widths and card grids.
- Acceptance criteria:
  - Improved Lighthouse image diagnostics.
  - No layout regressions.

## Phase 2 - UX/A11y Depth and Consistency (P2)

### Spec 2.1 - Interactive card semantics
- Priority: `P2`
- Objective: ensure cards are fully accessible and do not depend on hover.
- Scope:
  - `components/cards/ProjectCard.tsx`
- Required changes:
  - Use semantic interactive container strategy (`Link`/button semantics).
  - Preserve nested external action links with explicit labels.
- Edge cases:
  - Nested click targets.
  - Touch devices with no hover.
- Acceptance criteria:
  - Full keyboard parity with pointer interactions.

### Spec 2.2 - Dark/light token consistency
- Priority: `P2`
- Objective: align brand color and text contrast behavior across themes.
- Scope:
  - `app/globals.css`
  - `app/layout.tsx` (font token compatibility)
- Required changes:
  - Audit primary token across modes and document intentional differences.
  - Resolve undefined font CSS variable usage or remove dead references.
- Edge cases:
  - `system` theme startup.
- Acceptance criteria:
  - Theme behavior is visually consistent and accessible.

### Spec 2.3 - SVG id collision prevention
- Priority: `P2`
- Objective: avoid duplicate `id` collisions in repeated SVG usage.
- Scope:
  - `components/ui/shadcn-io/grid-pattern/index.tsx`
  - `lib/svgMap.tsx`
- Required changes:
  - Namespace SVG defs/clipPath/gradient ids per instance.
- Edge cases:
  - Multiple same-icon renders on one page.
- Acceptance criteria:
  - No rendering anomalies from duplicate SVG ids.

## Phase 3 - Maintainability and Scalability (P3)

### Spec 3.1 - Consolidate duplicated scroll reset logic
- Priority: `P3`
- Objective: reduce repeated imperative scroll code and unify behavior.
- Scope:
  - `app/page.tsx`
  - `app/projects/[slug]/page.tsx`
  - `app/certificates/[slug]/page.tsx`
  - possible shared utility/hook
- Required changes:
  - Centralize route-entry scroll reset policy.
  - Replace `any` global access with typed global declaration.
- Acceptance criteria:
  - Single source of truth for scroll reset behavior.

### Spec 3.2 - Add route resilience affordances
- Priority: `P3`
- Objective: improve perceived quality for future async routes.
- Scope:
  - `app/**` route boundaries (`loading.tsx`, `error.tsx` where needed)
  - route metadata generation
- Required changes:
  - Add route-level loading/error handling patterns as needed.
  - Add metadata strategy for dynamic route pages.
- Acceptance criteria:
  - Route UX is explicit under loading/failure conditions.

---

## Cross-Cutting Verification Protocol

Run after each phase:

1. `npm run lint`
2. `npx tsc --noEmit`
3. `npm run build`
4. Manual checks:
   - Keyboard-only nav/menu/card interactions
   - Invalid slug behavior for projects/certificates
   - Mobile viewports: `320`, `375`, `768`, `1024`, `1440`
   - Short-height viewport sanity for pinned/horizontal sections
   - Light/dark/system theme consistency
5. Performance spot checks:
   - Lighthouse mobile + desktop (track LCP/CLS/INP trend)
   - Browser Performance panel to confirm no RAF leaks

## Risk Register

- Layout server/client refactor may introduce hydration mismatch if providers are reordered.
- Menu accessibility changes may impact current animation choreography.
- About section behavior differs by runtime; webview checks must be validated on real devices when possible.
- SVG id namespacing must be tested visually across all icon usages.

## Suggested Execution Order (PR Sequence)

1. PR-1: Phase 0 specs (`0.1 -> 0.4`)
2. PR-2: Phase 1 specs (`1.1 -> 1.3`)
3. PR-3: Phase 2 specs (`2.1 -> 2.3`)
4. PR-4: Phase 3 specs (`3.1 -> 3.2`)

## Done Definition (Global)

This plan is complete when:

- All P0/P1 items are shipped with passing lint/type/build checks.
- Accessibility critical issues are resolved for nav/menu/core interactions.
- No known route correctness bugs remain in dynamic pages.
- Animation lifecycle is leak-safe under route transitions.
- Image and hydration strategy aligns with Next.js and React performance best practices.
