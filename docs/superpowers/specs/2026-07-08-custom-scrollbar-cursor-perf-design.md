# Custom Scrollbar, Cursor Polish & Animation Perf — Design Spec

Date: 2026-07-08
Status: Approved, ready for implementation planning

## Goal

Three related UI-polish items on top of the existing GSAP/Lenis/Framer Motion setup:

1. Fix a real bug: dragging the native scrollbar thumb (e.g. inside the Spotify/GitHub/Stack dialogs) freezes the custom cursor, because native scrollbar thumbs sit outside the DOM's hit-testing area and never fire `mousemove` on `document`.
2. Make the custom cursor (`components/ui/CustomCursor.tsx`) feel richer, without turning it into a stateful per-element system.
3. General animation performance pass across GSAP/Framer Motion usage.

Navbar restyling was considered and dropped — out of scope for this pass.

---

## Section 1: Custom scrollbar (site-wide, fully functional)

**Root cause of the bug:** the OS-native scrollbar thumb is rendered by the browser outside the document's content box. Dragging it moves the real cursor but never dispatches `mousemove`/`pointermove` to `document`/`window`, so `CustomCursor`'s position (driven entirely by those events via `gsap.quickSetter`) freezes at its last known coordinate until the drag ends and the mouse moves again over real content.

**Fix — replace the native scrollbar with a real DOM element:** a `Scrollbar` component (`components/ui/Scrollbar.tsx`) rendering a track + draggable thumb as plain `div`s, positioned with `gsap.quickSetter` (consistent with `CustomCursor`'s existing pattern) and driven by pointer events (`pointerdown`/`pointermove`/`pointerup` with `setPointerCapture`). Because the thumb is a normal DOM node, dragging it fires real pointer events — `CustomCursor` keeps tracking, and the bug disappears as a side effect of the fix rather than needing a separate patch.

**Two mount modes, one component:**
- **Page mode** (no `containerRef` prop): tracks scroll via the existing `window.__lenis` global (already set by `LenisProvider` and consumed the same way by `ChapterNav`). Reads `scroll`/`limit` off Lenis's `scroll` event for thumb size/position; drag calls `lenis.scrollTo(targetPx, { immediate: true })`. Mounted once in `app/layout.tsx`, near `CustomCursor`.
- **Container mode** (`containerRef` prop pointing at a scrollable div): tracks `scrollTop`/`scrollHeight`/`clientHeight` via a `scroll` listener on that element; drag sets `container.scrollTop` directly. Replaces the current `scrollbar-live` CSS class usage in `GitHubActivityCard.tsx`, `SpotifyActivityCard.tsx`, and `TechStackSection.tsx` (the last one gains scrollbar styling for the first time — currently plain unstyled overflow).

**Touch/coarse-pointer devices:** disabled entirely, reusing the same `"ontouchstart" in window || navigator.maxTouchPoints > 0 || matchMedia("(pointer: coarse)")` check already in `CustomCursor.tsx`. Native scrollbar and native touch-scroll behavior stay untouched on mobile — no thumb rendered, nothing hidden.

**Hiding the native scrollbar (desktop only):** a small CSS utility class (e.g. `.no-native-scrollbar`) using `scrollbar-width: none` + `::-webkit-scrollbar { display: none }`, applied to `html`/`body` for page mode and to the three container elements for container mode. Only applied when the custom scrollbar is actually mounted (i.e., not applied unconditionally, so touch devices keep their native scrollbar).

**Visuals:** track transparent, thumb styled to match the existing `scrollbar-live` look (`var(--border)` fill, `var(--muted-foreground)` on hover/drag, pill-shaped, ~8px wide) so the page-level scrollbar and the dialog-level ones look identical.

---

## Section 2: Custom cursor — two additions only

Kept deliberately small per explicit ask ("richer but not too many so we don't make it complex"). No new per-element states, no cursor-text labels, no icon swapping.

1. **Trailing ring:** a second fixed-position ring element that follows the main dot with a slight spring/eased lag (GSAP `quickTo` with a duration/ease, sampling the dot's target position each frame rather than the raw mouse event). Pure motion polish — same event listeners already in place, just a second target.
2. **Magnetic pull on interactive elements:** while hovering an element matching the existing `interactiveSelector` (`a, button, input, textarea, select, [role='button']`), the cursor offsets slightly toward the pointer's position within that element's bounding box (clamped to a small max offset, e.g. 8–12px), reusing the `onMouseOver`/`onMouseOut` handlers already there — just adding a `mousemove`-driven offset calculation while the hover state is active.

Both are motion-only additions to the existing single component; no new state machine, no new markup on consuming components.

**Reduced motion:** per project convention, check `matchMedia("(prefers-reduced-motion: reduce)")` once on mount (same style of check as the existing touch-device gate) and, if set, skip the trailing ring's lag/spring (snap it directly to the dot's position) and skip the magnetic offset (cursor just centers normally). The base dot + hover scale/border stays either way — those aren't the kind of motion the preference targets.

---

## Section 3: Animation performance pass

A quick scan before writing this spec found no obvious anti-patterns already in the codebase: no Framer Motion `animate` blocks or GSAP tweens targeting layout-triggering properties (`width`/`height`/`top`/`left`), `will-change` already used in a few spots (`Hero.tsx`, `About.tsx`, `PageOverlay.tsx`, `ProjectGallery.tsx`), and `gsap.quickSetter`/`quickTo` already used for the highest-frequency updates (cursor). So this is a verification + cleanup pass, not a rewrite. During implementation, check for and fix:

- Duplicate or leaked `ScrollTrigger` instances across route/pathname changes (multiple components create triggers keyed off `useEffect`; confirm all are killed on unmount/pathname change, matching the pattern already used in `ChapterNav.tsx` and `useScrollManager.ts`).
- Any Framer Motion `layout` / `layoutId` usage that could be replaced with a transform-only animation.
- Any remaining raw (non-Lenis, non-rAF-throttled) `scroll` or `resize` listeners.
- `will-change` applied permanently instead of only during active animation (unnecessary standing compositing layers).

Report findings even if the answer is "nothing needed changing" for a given check — no invented changes to pad the pass.

---

## Definition of Done

- [ ] `components/ui/Scrollbar.tsx` exists, handles both page mode (Lenis-driven) and container mode (`containerRef`-driven).
- [ ] Page-level scrollbar mounted in `app/layout.tsx`; native page scrollbar hidden on desktop.
- [ ] `GitHubActivityCard.tsx`, `SpotifyActivityCard.tsx`, `TechStackSection.tsx` dialogs use the container-mode scrollbar in place of `scrollbar-live`; native scrollbar hidden in those containers.
- [ ] On a desktop/mouse browser: dragging any of the four custom scrollbar thumbs (page + 3 dialogs) keeps the custom cursor tracking correctly, no freeze.
- [ ] On a touch/coarse-pointer device (or emulated in devtools): native scroll behavior unaffected, no custom thumb rendered.
- [ ] `CustomCursor.tsx` has a trailing ring and magnetic-pull-on-hover effect; existing hover scale/border behavior unchanged.
- [ ] Animation perf checklist (ScrollTrigger leaks, Framer `layout` usage, unthrottled listeners, stray `will-change`) reviewed with findings reported; any real issues found are fixed.
- [ ] `npm run lint && npm run build` both exit 0.
- [ ] Manual verification in browser: scroll on homepage, project detail page, and each of the three dialogs; verify cursor states (default, hover, magnetic, trailing ring) and scrollbar drag behavior; confirm `prefers-reduced-motion` still suppresses the trailing-ring lag and magnetic offset (snap directly instead).

## Out of scope (flagged, not built)

- Navbar/ChapterNav restyling (dropped mid-brainstorm).
- Any new cursor states beyond trailing ring + magnetic pull (no cursor-text labels, no icon swaps).
- Horizontal scrollbar support (no horizontally-scrolling containers currently exist in the codebase).
