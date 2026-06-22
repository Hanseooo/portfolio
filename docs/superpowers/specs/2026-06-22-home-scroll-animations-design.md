# Home Page Scroll Animations — Design Spec

**Date:** 2026-06-22  
**Scope:** Home page (`app/page.tsx`) — desktop only, mobile untouched  
**Stack:** GSAP 3.14 + ScrollTrigger, Lenis (already wired), Framer Motion (kept where not replaced)

---

## Goal

Elevate the home page from basic Framer Motion `whileInView` fades into a high-end editorial scroll experience using GSAP ScrollTrigger. Four targeted enhancements:

1. **Hero** — SplitText char-by-char reveal + scroll parallax on portrait
2. **FeaturedProjects** — Horizontal scroll pinned section (3 cards)
3. **Philosophy** — Pinned section with scroll-scrubbed principle reveal
4. **Experience** — Single animated timeline line + per-entry dot activation

---

## 1. Hero — SplitText Reveal + Parallax

### Animation

- On mount, `gsap.SplitText` splits the `<h1>` ("Building / With Intent.") into individual characters.
- A GSAP timeline animates chars from `{ y: 60, opacity: 0, rotationX: -90 }` to `{ y: 0, opacity: 1, rotationX: 0 }` with `stagger: 0.025`, `duration: 0.6`, `ease: "back.out(1.4)"`.
- The sub-paragraph fades in (`opacity: 0 → 1, y: 20 → 0`) after the headline timeline completes (added to the same timeline with a label offset).
- After animation completes, `splitText.revert()` is called to restore the DOM to a single text node (clean up extra spans).

### Parallax

- A `ScrollTrigger` scrub ties the portrait column's `y` to scroll: as the user scrolls down through the hero, the image moves upward at 40% of scroll speed (`y: 0 → -80` over the hero's full height).
- The portrait container must NOT have `overflow: hidden` clipping the translated image (currently the section has `overflow-hidden` — the parallax target is the inner column `div`, not the section).

### Preloader Coordination

- On mount, check `sessionStorage.getItem("hasVisited")`:
  - **First visit:** delay the GSAP timeline by `3.5s` (covers preloader 2.5s + 0.8s fade + buffer).
  - **Returning visit:** fire immediately (delay `0.2s`).
- This avoids replaying the animation under the preloader.

### Font Loading

- Wrap the entire GSAP setup in `document.fonts.ready.then(() => { ... })` to ensure Inter is loaded before SplitText measures character widths.

### Resize Handling

- A debounced `resize` listener calls `splitText.revert()` then re-runs the split + animation. Use `requestAnimationFrame` debounce.
- Since animation has already played, the re-split can be instantaneous (no stagger on resize, just set final state).

### Accessibility

- Add `aria-label="Building With Intent."` to the `<h1>`.
- The split container (or the chars wrapper) gets `aria-hidden="true"` so screen readers use the `aria-label` instead of individual letter spans.

### Reduced Motion

- If `usePrefersReducedMotion()` returns `true`, skip the GSAP timeline entirely. Run a simple `gsap.set(heading, { opacity: 1 })` and `gsap.set(subtext, { opacity: 1 })` to make content visible without animation.

### Files Touched

- `components/sections/HeroSection.tsx` — add GSAP logic, aria attributes, parallax

---

## 2. FeaturedProjects — Horizontal Scroll Pin

### Layout

- **Desktop (width ≥ 1240px):** Section becomes a pinned horizontal scroll container.
  - The "Projects / View All" header sits **above** the horizontal track, pinned within the section (not part of the scrolling track). It remains visible throughout.
  - Three project cards are laid out in a `flex` row. Each card is `85vw` wide and `100vh` tall.
  - Total horizontal travel: `(cards.length - 1) × 85vw` (two full card-widths of scroll).
  - Snapping: `snapTo: 1 / (cards.length - 1)` between cards.
- **Below 1240px:** Falls back to the current vertical `grid grid-cols-1 lg:grid-cols-3` layout, no changes.

### Card Layout (horizontal mode)

Each card in horizontal mode:
- Full section height (`h-screen`), `85vw` wide.
- Top ~65%: `Image` with `object-cover`, fills the image area.
- Bottom ~35%: project metadata — index number, subtitle, title, hover arrow.
- Image has a subtle hover scale (`scale-105`, same as current).

### ScrollTrigger Config

```
id: "projects-horizontal"
trigger: sectionRef
pin: true
scrub: 1.2
invalidateOnRefresh: true
anticipatePin: 1
snap: { snapTo: 1/2, duration: { min: 0.18, max: 0.42 }, delay: 0.05, ease: "power2.inOut" }
end: () => `+=${(cards.length - 1) * window.innerWidth * 0.85}`
```

Short-height guard: if `window.innerHeight < 860`, disable snapping (same pattern as About section).

### Keyboard / Accessibility

- Track `activeCardIndex` state (updated via ScrollTrigger `onUpdate`).
- Cards not at `activeCardIndex` get `aria-hidden="true"` and `tabIndex={-1}` on their inner `<Link>`.
- Active card gets `aria-hidden="false"` and `tabIndex={0}`.

### Section Header

The "Projects" heading row is rendered outside/above the `trackRef` div, inside the pinned section container. It stays fixed at the top of the viewport while the cards scroll.

### ScrollTrigger ID

Uses `id: "projects-horizontal"` — unique, does not conflict with `"about-horizontal"`.

### Files Touched

- `components/sections/FeaturedProjectsSection.tsx` — full rewrite for horizontal mode + vertical fallback

---

## 3. Philosophy — Pinned Statement Reveal

### Layout (desktop ≥ 1024px)

Section pins for `300vh` of scroll distance (comfortable reading pace for 2 principles).

Layout within the pinned section:
- **Left column (5/12):** Heading `"Design Systems, Then Ship Them."` — static, doesn't animate. Acts as anchor.
- **Right column (6/12, offset 7):** Two principles stacked. Each principle (heading + paragraph) animates independently via scrub.

### Animation Sequence (scroll-scrubbed)

- **Principle 01 (Architecture):**  
  - Enters at `0%` of the pin's scroll progress, fully visible by `35%`.  
  - `y: 40 → 0`, `opacity: 0 → 1`, scrub tied to scroll.
- **Divider line:**  
  - Animates `scaleX: 0 → 1` (left-to-right draw) between `35%` and `55%` of scroll progress.
  - Replace the existing Framer `motion.div animate-[grow_...]` with a plain `div` whose transform is GSAP-owned.
- **Principle 02 (Execution):**  
  - Enters at `55%`, fully visible by `90%`.
  - Same `y: 40 → 0`, `opacity: 0 → 1` scrub.

### Removing Framer Conflicts

- Remove `containerVariants` / `itemVariants` and all `motion.div` / `whileInView` wrappers from this section.
- The section itself becomes a plain `div` (not `motion.div`).
- The divider's existing CSS animation class (`animate-[grow_1s_ease-out_forwards]`) is removed; GSAP owns it.

### Fallback (< 1024px)

Reverts to the current layout. The plain `div` structure still renders fine without the GSAP pin applied. All elements must have their final visible state as CSS defaults (`opacity: 1`, `transform: none`) — GSAP sets initial hidden state only after the animation guard confirms it will run. This ensures content is never invisible if JS is slow or the viewport check fails.

### Reduced Motion

Skip the pin and scrub; show all content visible immediately.

### Files Touched

- `components/sections/PhilosophySection.tsx` — remove Framer, add GSAP pin + scrub

---

## 4. Experience — Timeline Draw

### New DOM Structure

Add a wrapper `div` with `position: relative` around the timeline entries. Inside it:

1. **Animated line:** An absolutely-positioned `<div>` — `left: 0`, `top: 0`, `width: 1px`, `height: 100%`, background `hsl(var(--border))`, `transformOrigin: "top"`, `scaleY: 0` initially.
2. **Entry dots:** Each entry's `span.absolute.-left-[5px]` becomes a GSAP target. Currently `h-2 w-2 rounded-full bg-border`.

Remove `border-l border-border` from each `.group` div (replaced by the single animated line).

### Animation

- **Line draw:** Single `ScrollTrigger` on the timeline container.
  - `start: "top 70%"`, `end: "bottom 70%"`, `scrub: true`.
  - Animates `scaleY: 0 → 1`.
- **Dot activation:** Per-entry `ScrollTrigger`.
  - `start: "top 65%"` relative to each entry element.
  - Animates dot: `scale: 0.5 → 1`, `backgroundColor: border-color → primary-color`.
  - One-shot (not scrubbed) — `toggleActions: "play none none reverse"`.
- **Entry text:** Each entry animates `x: -20 → 0`, `opacity: 0 → 1` on the same dot trigger (slight delay after dot activates).

### Removing Framer Conflicts

- Remove `containerVariants` / `itemVariants` and `motion.div` / `whileInView` from this section.
- Each entry becomes a plain `div`.

### Dynamic Entry Count

Use `gsap.utils.toArray(".experience-entry")` — works regardless of how many entries exist.

### Files Touched

- `components/sections/ExperienceSnapshotSection.tsx` — restructure DOM, remove Framer, add GSAP

---

## 5. ChapterNav Fix

### Problem

ChapterNav uses a raw `scroll` event + `getBoundingClientRect()` to detect the active section. With two pinned sections (Philosophy, FeaturedProjects), GSAP inserts "pin spacer" divs and keeps the original elements fixed — `getBoundingClientRect()` does not update while scrolling through the pinned duration. Chapters "02 Approach" and "03 Selected Work" will not register as active correctly.

### Fix

Replace the raw scroll listener with GSAP `ScrollTrigger.create()` per chapter. Each ScrollTrigger uses `onEnter` and `onEnterBack` to call `setActiveId(chapter.id)`.

```
ScrollTrigger.create({
  trigger: document.getElementById(chapter.id),
  start: "top 50%",
  end: "bottom 50%",
  onEnter: () => setActiveId(chapter.id),
  onEnterBack: () => setActiveId(chapter.id),
})
```

The `scrollIntoView` on click remains unchanged.

### Files Touched

- `components/layout/ChapterNav.tsx`

---

## 6. Global Coordination

### ScrollTrigger.refresh() After Hydration

In `app/page.tsx`, add a `useEffect` with a `setTimeout(ScrollTrigger.refresh, 200)` to run after all section effects have mounted and calculated their pin spacers. This ensures correct positions when multiple pins exist.

### Lenis Compatibility

No changes needed. The LenisProvider already calls `ScrollTrigger.update()` in the RAF loop. GSAP pinning + Lenis smooth scroll is a proven combination.

### Reduced Motion — Global Rule

Every GSAP `useEffect` in every touched component checks `usePrefersReducedMotion()` at the top. If `true`, skip all GSAP setup (don't register any ScrollTriggers). Content must be visible in its final state by default (no `opacity: 0` applied before the animation guard runs).

### Cleanup

Every GSAP `useEffect` returns `() => ctx.revert()`. This ensures ScrollTrigger instances are killed on unmount (navigation away from home page) without leaking.

---

## Files Changed Summary

| File | Change |
|------|--------|
| `components/sections/HeroSection.tsx` | Add GSAP SplitText, parallax, preloader delay, font-ready guard |
| `components/sections/FeaturedProjectsSection.tsx` | Horizontal scroll pin (desktop), vertical fallback |
| `components/sections/PhilosophySection.tsx` | Remove Framer, add GSAP pin + scrub reveal |
| `components/sections/ExperienceSnapshotSection.tsx` | Remove Framer, new DOM structure, GSAP timeline draw |
| `components/layout/ChapterNav.tsx` | Replace scroll listener with ScrollTrigger per chapter |
| `app/page.tsx` | Add `ScrollTrigger.refresh()` coordination effect |

No new dependencies. No new files. Uses GSAP + Framer already installed.

---

## Non-Goals

- Mobile: no changes anywhere (guarded by `isMobile` checks already in place)
- Pages other than home (`/projects`, `/experience`, `/certificates`): untouched
- The About section: already has GSAP horizontal scroll, no changes
- New packages: none added
