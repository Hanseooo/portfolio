# Custom Scrollbar, Cursor Polish & Animation Perf — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the native scrollbar with a custom DOM scrollbar (site-wide + 3 dialogs) to fix the cursor-freeze-on-drag bug, add a trailing ring + magnetic pull to `CustomCursor`, and fix permanently-applied `will-change` across 4 files.

**Architecture:** One new component (`components/ui/Scrollbar.tsx`) with two modes (page via `window.__lenis`, container via a `containerRef` prop), mounted once for the page and once per dialog. `CustomCursor.tsx` gains a second ring element driven by `gsap.quickTo`. Perf fixes convert 4 static `will-change-transform` classes into GSAP/Framer lifecycle-driven toggles.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind v4 (no config file — CSS-only), GSAP 3.14 (+ ScrollTrigger), Framer Motion 12 (`framer-motion` package), Lenis 1.3.16, Radix Dialog.

## Global Constraints

- Package manager is `npm` — never pnpm/yarn/bun.
- Tailwind v4: no `tailwind.config.js`; utility classes only, custom CSS goes in `app/globals.css`.
- Animations: GSAP for scroll-trigger sequences, Framer Motion for React component animations — never mixed on the same element. (`Scrollbar.tsx` and `CustomCursor.tsx` are GSAP-only, consistent with the existing cursor code; `ProjectGallery.tsx` stays Framer-only.)
- Every animation addition must respect `prefers-reduced-motion` — use `usePrefersReducedMotion()` (`components/utils/usePrefersReducedMotion.ts`) inside React components, or the imperative `prefersReducedMotion()` (`lib/motion.ts`) inside non-React/effect code — matching whichever idiom the file already uses.
- Ice Blue + deep black palette only — no new colors. Reuse `var(--border)` / `var(--muted-foreground)` (already theme-aware light/dark via `app/globals.css`).
- shadcn/ui components live in `components/ui/` — the new `Scrollbar.tsx` goes there, matching `CustomCursor.tsx`'s sibling location.
- **No test runner configured.** "Passing" = `npm run lint` exits 0, `npm run build` exits 0, and manual browser verification (dev server) confirms the behavior. Every task's steps reflect this — there is no unit-test step to write.

## Scope Note (spec discrepancy, resolved)

The spec's "Out of scope" section claims "no horizontally-scrolling containers currently exist in the codebase" and excludes horizontal scrollbar support. This is incorrect: `SpotifyActivityCard.tsx`'s `HorizontalRail` helper (Top Tracks / Top Artists rows, lines 36-45) is a horizontally-scrolling `overflow-x-auto` container using the `scrollbar-live` class. Per the spec's explicit scope exclusion, **this plan leaves `HorizontalRail` untouched** — it keeps using the native-scrollbar `scrollbar-live` styling. Only the main vertical dialog scroller in `SpotifyActivityCard.tsx` (the one wrapping Recent Tracks / Top Tracks / Top Artists sections) gets the new `Scrollbar` component. This means the cursor-freeze bug could theoretically still reproduce if a user drags the native horizontal scrollbar thumb inside Top Tracks/Top Artists — accepted as out of scope per spec, not silently dropped. Flag this to the user after the plan is approved if they want it covered.

---

### Task 1: `Scrollbar` component + CSS

**Files:**
- Create: `components/ui/Scrollbar.tsx`
- Modify: `app/globals.css:123` (insert after the `.scrollbar-live` block, before `@keyframes ticker`)

**Interfaces:**
- Produces: `export default function Scrollbar({ containerRef }: { containerRef?: React.RefObject<HTMLDivElement | null> })`. No `containerRef` = page mode (drives via `window.__lenis`). With `containerRef` = container mode (drives via the ref's `scrollTop`/`scroll` listener). Later tasks import this as `import Scrollbar from "@/components/ui/Scrollbar";`.
- Consumes: `window.__lenis` (typed in `global.d.ts` as `Lenis | undefined`, from the `lenis` package — confirmed API: `lenis.scroll: number` (getter), `lenis.on('scroll', (lenis: Lenis) => void): () => void` (returns an unsubscribe function), `lenis.scrollTo(target, { immediate?: boolean })`).

- [ ] **Step 1: Create the component**

```tsx
"use client";

import { useEffect, useRef, type RefObject } from "react";
import gsap from "gsap";

interface ScrollbarProps {
  containerRef?: RefObject<HTMLDivElement | null>;
}

const MIN_THUMB_PX = 24;

function isTouchDevice() {
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia("(pointer: coarse)").matches
  );
}

export default function Scrollbar({ containerRef }: ScrollbarProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const thumb = thumbRef.current;
    if (!track || !thumb) return;

    if (isTouchDevice()) {
      track.style.display = "none";
      return;
    }

    const container = containerRef ? containerRef.current : null;
    if (containerRef && !container) {
      track.style.display = "none";
      return;
    }

    const hideTarget: HTMLElement = container ?? document.documentElement;
    hideTarget.classList.add("no-native-scrollbar");

    const setThumbY = gsap.quickSetter(thumb, "y", "px");

    let maxScroll = 0;
    let trackLen = 0;
    let thumbLen = 0;

    const getScroll = (): number => {
      if (container) return container.scrollTop;
      return window.__lenis?.scroll ?? window.scrollY;
    };

    const setScroll = (value: number) => {
      const clamped = Math.max(0, Math.min(maxScroll, value));
      if (container) {
        container.scrollTop = clamped;
      } else if (window.__lenis) {
        window.__lenis.scrollTo(clamped, { immediate: true });
      } else {
        window.scrollTo(0, clamped);
      }
    };

    const render = () => {
      const scroll = getScroll();
      const ratio = maxScroll > 0 ? scroll / maxScroll : 0;
      setThumbY(ratio * (trackLen - thumbLen));
    };

    const measure = () => {
      trackLen = track.clientHeight;
      const viewportLen = container ? container.clientHeight : window.innerHeight;
      const contentLen = container ? container.scrollHeight : document.documentElement.scrollHeight;
      maxScroll = Math.max(0, contentLen - viewportLen);
      thumbLen =
        maxScroll > 0
          ? Math.max(MIN_THUMB_PX, (viewportLen / contentLen) * trackLen)
          : trackLen;
      thumb.style.height = `${thumbLen}px`;
      track.style.opacity = maxScroll > 0 ? "1" : "0";
      track.style.pointerEvents = maxScroll > 0 ? "auto" : "none";
      render();
    };

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(container ?? document.documentElement);
    resizeObserver.observe(track);

    let stopScrollSource: () => void;

    if (container) {
      const onScroll = () => measure();
      container.addEventListener("scroll", onScroll);
      measure();
      stopScrollSource = () => container.removeEventListener("scroll", onScroll);
    } else {
      let rafId = 0;
      let unsubscribe: (() => void) | undefined;

      const attach = () => {
        const lenis = window.__lenis;
        if (!lenis) {
          rafId = requestAnimationFrame(attach);
          return;
        }
        unsubscribe = lenis.on("scroll", () => measure());
        measure();
      };
      attach();

      stopScrollSource = () => {
        cancelAnimationFrame(rafId);
        unsubscribe?.();
      };
    }

    let dragging = false;
    let dragStartY = 0;
    let dragStartScroll = 0;

    const onPointerDown = (e: PointerEvent) => {
      dragging = true;
      dragStartY = e.clientY;
      dragStartScroll = getScroll();
      thumb.setPointerCapture(e.pointerId);
      thumb.classList.add("is-dragging");
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      const range = trackLen - thumbLen;
      if (range <= 0) return;
      const deltaScroll = ((e.clientY - dragStartY) / range) * maxScroll;
      setScroll(dragStartScroll + deltaScroll);
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      thumb.releasePointerCapture(e.pointerId);
      thumb.classList.remove("is-dragging");
    };

    thumb.addEventListener("pointerdown", onPointerDown);
    thumb.addEventListener("pointermove", onPointerMove);
    thumb.addEventListener("pointerup", onPointerUp);

    return () => {
      hideTarget.classList.remove("no-native-scrollbar");
      resizeObserver.disconnect();
      stopScrollSource();
      thumb.removeEventListener("pointerdown", onPointerDown);
      thumb.removeEventListener("pointermove", onPointerMove);
      thumb.removeEventListener("pointerup", onPointerUp);
    };
  }, [containerRef]);

  return (
    <div
      ref={trackRef}
      className={containerRef ? "scrollbar-track" : "scrollbar-track scrollbar-track--page"}
    >
      <div ref={thumbRef} className="scrollbar-thumb" />
    </div>
  );
}
```

- [ ] **Step 2: Add the CSS**

In `app/globals.css`, insert immediately after line 123 (the closing `}` of `.scrollbar-live::-webkit-scrollbar-thumb:hover`, before the `@keyframes ticker` block):

```css
.no-native-scrollbar {
  scrollbar-width: none;
}

.no-native-scrollbar::-webkit-scrollbar {
  display: none;
}

.scrollbar-track {
  position: absolute;
  top: 0;
  right: 2px;
  bottom: 0;
  width: 8px;
  z-index: 20;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
}

.scrollbar-track--page {
  position: fixed;
  z-index: 90;
}

.scrollbar-thumb {
  position: absolute;
  top: 0;
  left: 0;
  width: 8px;
  border-radius: 9999px;
  background: var(--border);
  cursor: grab;
  touch-action: none;
}

.scrollbar-thumb:hover,
.scrollbar-thumb.is-dragging {
  background: var(--muted-foreground);
}

.scrollbar-thumb.is-dragging {
  cursor: grabbing;
}
```

- [ ] **Step 3: Lint and typecheck**

Run: `npm run lint`
Expected: exits 0 (no errors on the new file).

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: exits 0. `Scrollbar` isn't mounted anywhere yet, so this only proves the component itself compiles — full behavior is verified once Task 2 mounts it.

- [ ] **Step 5: Commit**

```bash
git add components/ui/Scrollbar.tsx app/globals.css
git commit -m "feat: add Scrollbar component (page + container mode)"
```

---

### Task 2: Mount page-mode Scrollbar in `app/layout.tsx`

**Files:**
- Modify: `app/layout.tsx:8-9` (imports), `app/layout.tsx:109` (mount point)

**Interfaces:**
- Consumes: `Scrollbar` default export from Task 1, called as `<Scrollbar />` (no props = page mode).

- [ ] **Step 1: Add the import**

In `app/layout.tsx`, after line 8 (`import CustomCursor from "@/components/ui/CustomCursor";`):

```tsx
import CustomCursor from "@/components/ui/CustomCursor";
import Scrollbar from "@/components/ui/Scrollbar";
```

- [ ] **Step 2: Mount it next to `CustomCursor`**

Change line 109 from:

```tsx
        <CustomCursor />
```

to:

```tsx
        <CustomCursor />
        <Scrollbar />
```

- [ ] **Step 3: Lint and build**

Run: `npm run lint && npm run build`
Expected: both exit 0.

- [ ] **Step 4: Manual browser verification**

Run: `npm run dev`, open the homepage in a desktop/mouse browser.
- Confirm the native page scrollbar is gone and a thin pill-shaped thumb appears on the right edge.
- Scroll the page with the mouse wheel — thumb should move in sync.
- Drag the thumb — page should scroll; drag past the top/bottom of the track — scroll should clamp instead of erroring.
- While dragging the thumb, move the mouse — confirm the custom cursor (dot) keeps tracking the real cursor position with no freeze (this is the bug the whole feature exists to fix).
- Open devtools, toggle a touch/coarse-pointer emulation (or resize to a mobile viewport with touch simulation on) — reload — confirm the native scrollbar returns and no custom thumb renders.

- [ ] **Step 5: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: mount page-mode Scrollbar in layout"
```

---

### Task 3: Container-mode Scrollbar in `GitHubActivityCard.tsx`

**Files:**
- Modify: `components/sections/live-activity/GitHubActivityCard.tsx:1-8` (imports), `:42-46` (component body, add ref), `:140` (scroll div open), `:231-233` (scroll div close)

**Interfaces:**
- Consumes: `Scrollbar` from Task 1, mounted as `<Scrollbar containerRef={scrollRef} />`.

- [ ] **Step 1: Update imports**

Change line 3 from:

```tsx
import { memo, useState } from "react";
```

to:

```tsx
import { memo, useRef, useState } from "react";
```

Add after line 5 (`import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";`):

```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Scrollbar from "@/components/ui/Scrollbar";
```

- [ ] **Step 2: Add the ref**

Change line 46 from:

```tsx
  const [detailsOpen, setDetailsOpen] = useState(false);
```

to:

```tsx
  const [detailsOpen, setDetailsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
```

- [ ] **Step 3: Wrap the scroll container's opening tag**

Change line 140 from:

```tsx
                <div data-lenis-prevent className="scrollbar-live min-h-0 flex-1 space-y-8 overflow-y-auto px-6 pb-6 pt-1">
```

to:

```tsx
                <div className="relative min-h-0 flex-1">
                <div ref={scrollRef} data-lenis-prevent className="no-native-scrollbar h-full space-y-8 overflow-y-auto px-6 pb-6 pt-1">
```

- [ ] **Step 4: Close the wrapper and mount the Scrollbar**

Change lines 231-233 from:

```tsx
                  </div>
                </div>
              </DialogContent>
```

to:

```tsx
                  </div>
                </div>
                <Scrollbar containerRef={scrollRef} />
                </div>
              </DialogContent>
```

- [ ] **Step 5: Lint and build**

Run: `npm run lint && npm run build`
Expected: both exit 0.

- [ ] **Step 6: Manual browser verification**

Run: `npm run dev`, scroll to the GitHub Activity card, click "View details."
- Confirm a custom scrollbar thumb appears on the right edge of the dialog's scrollable body (not the native one).
- Scroll with the wheel and by dragging the thumb — both should move the content.
- While dragging the thumb, move the mouse — confirm the custom cursor keeps tracking (no freeze).
- Resize the dialog content shorter than viewport isn't directly testable, but confirm the thumb height looks roughly proportional to content length (long commit list = short thumb).

- [ ] **Step 7: Commit**

```bash
git add components/sections/live-activity/GitHubActivityCard.tsx
git commit -m "feat: use container-mode Scrollbar in GitHubActivityCard dialog"
```

---

### Task 4: Container-mode Scrollbar in `SpotifyActivityCard.tsx`

**Files:**
- Modify: `components/sections/live-activity/SpotifyActivityCard.tsx:1-4` (imports), `:47-51` (component body, add ref), `:249` (scroll div open), `:366-368` (scroll div close)

**Interfaces:**
- Consumes: `Scrollbar` from Task 1, mounted as `<Scrollbar containerRef={scrollRef} />`.
- Does NOT touch the `HorizontalRail` helper (lines 36-45) — see "Scope Note" above.

- [ ] **Step 1: Update imports**

Change line 3 from:

```tsx
import { memo, useState } from "react";
```

to:

```tsx
import { memo, useRef, useState } from "react";
```

Add after line 4 (`import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";`):

```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Scrollbar from "@/components/ui/Scrollbar";
```

- [ ] **Step 2: Add the ref**

Change line 51 from:

```tsx
  const [detailsOpen, setDetailsOpen] = useState(false);
```

to:

```tsx
  const [detailsOpen, setDetailsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
```

- [ ] **Step 3: Wrap the scroll container's opening tag**

Change line 249 from:

```tsx
              <div data-lenis-prevent className="scrollbar-live min-h-0 flex-1 space-y-8 overflow-y-auto px-6 pb-6 pt-1">
```

to:

```tsx
              <div className="relative min-h-0 flex-1">
              <div ref={scrollRef} data-lenis-prevent className="no-native-scrollbar h-full space-y-8 overflow-y-auto px-6 pb-6 pt-1">
```

- [ ] **Step 4: Close the wrapper and mount the Scrollbar**

Change lines 366-368 from:

```tsx
                </HorizontalRail>
              </div>
            </DialogContent>
```

to:

```tsx
                </HorizontalRail>
              </div>
              <Scrollbar containerRef={scrollRef} />
              </div>
            </DialogContent>
```

- [ ] **Step 5: Lint and build**

Run: `npm run lint && npm run build`
Expected: both exit 0.

- [ ] **Step 6: Manual browser verification**

Run: `npm run dev`, scroll to the Spotify Now Playing card, click "View details."
- Confirm a custom scrollbar thumb appears for the main vertical dialog body (Recent Tracks / Top Tracks / Top Artists sections).
- Scroll and drag-thumb behavior works, cursor doesn't freeze while dragging it.
- Confirm the Top Tracks / Top Artists horizontal rails still scroll normally with their existing native (unstyled-by-this-change) scrollbar — this is the accepted out-of-scope gap from the Scope Note.

- [ ] **Step 7: Commit**

```bash
git add components/sections/live-activity/SpotifyActivityCard.tsx
git commit -m "feat: use container-mode Scrollbar in SpotifyActivityCard dialog"
```

---

### Task 5: Container-mode Scrollbar in `TechStackSection.tsx`

**Files:**
- Modify: `components/sections/TechStackSection.tsx:1-12` (imports), `:64-83` (dialog content block)

**Interfaces:**
- Consumes: `Scrollbar` from Task 1, mounted as `<Scrollbar containerRef={stackScrollRef} />`.

- [ ] **Step 1: Update imports**

Change line 1-12 from:

```tsx
"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/components/utils/usePrefersReducedMotion";
import { motionTokens, clipReveal, fadeUpReveal } from "@/lib/motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
```

to:

```tsx
"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/components/utils/usePrefersReducedMotion";
import { motionTokens, clipReveal, fadeUpReveal } from "@/lib/motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Scrollbar from "@/components/ui/Scrollbar";
```

- [ ] **Step 2: Add the ref and wrap the dialog's scroll container**

Change lines 44-83 (the whole `TechStackSection` function through the closing `</DialogContent>`) from:

```tsx
export default function TechStackSection({ id }: { id: string }) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section id={id} className="relative py-24 overflow-hidden border-y border-border">
      <div className="mx-auto w-full max-w-[1400px] px-6 mb-16 flex items-end justify-between">
        <motion.h2
          {...clipReveal(reducedMotion)}
          className="text-[clamp(2.5rem,5vw,4rem)] font-black leading-none tracking-tighter text-foreground"
        >
          Stack
        </motion.h2>

        <motion.div {...fadeUpReveal(reducedMotion, 0.15)}>
        <Dialog>
          <DialogTrigger asChild>
            <button className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60 hover:text-foreground transition-colors border-b border-muted-foreground/30 hover:border-foreground/50 pb-px">
              View all
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-[calc(100%-0.75rem)] sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-black tracking-tighter text-xl">Stack</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-6 mt-2 overflow-y-auto max-h-[60vh] pr-1">
              {categories.map((cat) => (
                <div key={cat.label}>
                  <p className="mb-2 font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60">
                    {cat.label}
                  </p>
                  <div className="h-px bg-border mb-3" />
                  <ul className="flex flex-wrap gap-2">
                    {cat.items.map((item) => (
                      <StackBadge key={item} item={item} />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
        </motion.div>
      </div>
```

to:

```tsx
export default function TechStackSection({ id }: { id: string }) {
  const reducedMotion = usePrefersReducedMotion();
  const stackScrollRef = useRef<HTMLDivElement>(null);

  return (
    <section id={id} className="relative py-24 overflow-hidden border-y border-border">
      <div className="mx-auto w-full max-w-[1400px] px-6 mb-16 flex items-end justify-between">
        <motion.h2
          {...clipReveal(reducedMotion)}
          className="text-[clamp(2.5rem,5vw,4rem)] font-black leading-none tracking-tighter text-foreground"
        >
          Stack
        </motion.h2>

        <motion.div {...fadeUpReveal(reducedMotion, 0.15)}>
        <Dialog>
          <DialogTrigger asChild>
            <button className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60 hover:text-foreground transition-colors border-b border-muted-foreground/30 hover:border-foreground/50 pb-px">
              View all
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-[calc(100%-0.75rem)] sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-black tracking-tighter text-xl">Stack</DialogTitle>
            </DialogHeader>
            <div className="relative mt-2 max-h-[60vh]">
            <div ref={stackScrollRef} data-lenis-prevent className="flex h-full flex-col gap-6 overflow-y-auto pr-1">
              {categories.map((cat) => (
                <div key={cat.label}>
                  <p className="mb-2 font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60">
                    {cat.label}
                  </p>
                  <div className="h-px bg-border mb-3" />
                  <ul className="flex flex-wrap gap-2">
                    {cat.items.map((item) => (
                      <StackBadge key={item} item={item} />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <Scrollbar containerRef={stackScrollRef} />
            </div>
          </DialogContent>
        </Dialog>
        </motion.div>
      </div>
```

- [ ] **Step 3: Lint and build**

Run: `npm run lint && npm run build`
Expected: both exit 0.

- [ ] **Step 4: Manual browser verification**

Run: `npm run dev`, scroll to the Stack section, click "View all."
- Confirm the previously-unstyled native scrollbar is replaced with the matching custom thumb (same look as the GitHub/Spotify dialogs).
- Scroll and drag-thumb behavior works; cursor doesn't freeze while dragging.
- Check the thumb doesn't visually overlap the badge text at the tight `pr-1` right padding — if it looks cramped, this is a known tight-spacing risk called out during planning; widen `pr-1` to `pr-3` on the inner scroll div if needed.

- [ ] **Step 5: Commit**

```bash
git add components/sections/TechStackSection.tsx
git commit -m "feat: use container-mode Scrollbar in TechStackSection dialog"
```

---

### Task 6: `CustomCursor` — trailing ring, magnetic pull, reduced motion

**Files:**
- Modify: `components/ui/CustomCursor.tsx` (full rewrite, 76 → ~115 lines)

**Interfaces:**
- Consumes: `prefersReducedMotion` from `@/lib/motion` (imperative one-shot check, matching the file's non-React effect context).
- No change to consuming components — `CustomCursor` is mounted once in `app/layout.tsx` with no props, unchanged.

- [ ] **Step 1: Replace the file**

```tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/motion";

const MAGNETIC_MAX_OFFSET = 10;

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    if (!cursor || !ring) return;

    const isTouchDevice =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(pointer: coarse)").matches;

    if (isTouchDevice) {
      cursor.style.display = "none";
      ring.style.display = "none";
      return;
    }

    const reducedMotion = prefersReducedMotion();

    const setX = gsap.quickSetter(cursor, "x", "px");
    const setY = gsap.quickSetter(cursor, "y", "px");
    const ringSetX = gsap.quickTo(ring, "x", { duration: 0.35, ease: "power3.out" });
    const ringSetY = gsap.quickTo(ring, "y", { duration: 0.35, ease: "power3.out" });

    const interactiveSelector = "a, button, input, textarea, select, [role='button']";

    let hoveredEl: Element | null = null;

    const onMouseMove = (e: MouseEvent) => {
      let targetX = e.clientX;
      let targetY = e.clientY;

      if (hoveredEl && !reducedMotion) {
        const rect = hoveredEl.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        targetX = centerX + clamp(e.clientX - centerX, -MAGNETIC_MAX_OFFSET, MAGNETIC_MAX_OFFSET);
        targetY = centerY + clamp(e.clientY - centerY, -MAGNETIC_MAX_OFFSET, MAGNETIC_MAX_OFFSET);
      }

      setX(targetX);
      setY(targetY);

      if (reducedMotion) {
        gsap.set(ring, { x: targetX, y: targetY });
      } else {
        ringSetX(targetX);
        ringSetY(targetY);
      }
    };

    const onMouseOver = (e: MouseEvent) => {
      // Only fire when crossing INTO an interactive element from a non-interactive one
      const el = (e.target as Element).closest?.(interactiveSelector);
      if (!el) return;
      if ((e.relatedTarget as Element | null)?.closest?.(interactiveSelector)) return;
      hoveredEl = el;
      gsap.to(cursor, {
        scale: 2.5,
        backgroundColor: "transparent",
        border: "1px solid var(--primary)",
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const onMouseOut = (e: MouseEvent) => {
      // Only fire when crossing OUT OF an interactive element to a non-interactive one
      if (!(e.target as Element).closest?.(interactiveSelector)) return;
      if ((e.relatedTarget as Element | null)?.closest?.(interactiveSelector)) return;
      hoveredEl = null;
      gsap.to(cursor, {
        scale: 1,
        backgroundColor: "var(--primary)",
        border: "none",
        duration: 0.3,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[9998] h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/40"
      />
      <div
        ref={cursorRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_10px_var(--primary-glow)]"
      />
    </>
  );
}
```

- [ ] **Step 2: Lint and build**

Run: `npm run lint && npm run build`
Expected: both exit 0.

- [ ] **Step 3: Manual browser verification**

Run: `npm run dev`.
- Move the mouse around the page — confirm a faint ring trails the dot with a short spring lag.
- Hover a button/link — confirm the dot still scales up with the primary-color border (unchanged behavior) and now also drifts slightly toward wherever the pointer is within the element's bounds, capped at ~10px from the element's center.
- In devtools, enable "Emulate CSS prefers-reduced-motion: reduce," reload — confirm the ring snaps directly to the cursor position (no visible lag) and hovering a button no longer produces the magnetic offset (cursor centers on the raw pointer position, scale/border hover state still works).
- Confirm on a touch/coarse-pointer emulated device, both the dot and ring are hidden and normal touch scrolling/tapping works.

- [ ] **Step 4: Commit**

```bash
git add components/ui/CustomCursor.tsx
git commit -m "feat: add trailing ring and magnetic pull to CustomCursor"
```

---

### Task 7: Perf — conditional `will-change` (Hero, About, PageOverlay, ProjectGallery)

**Files:**
- Modify: `components/sections/Hero.tsx:75-133,148,158`
- Modify: `components/sections/About.tsx:148-169,218`
- Modify: `components/transitions/PageOverlay.tsx:35-43,57-64,73`
- Modify: `components/projects/ProjectGallery.tsx:30-44`

**Interfaces:** None — purely internal perf changes, no prop/signature changes.

- [ ] **Step 1: Hero.tsx — remove static classes, add lifecycle-scoped will-change**

Change line 148 from:

```tsx
      className={`relative flex flex-col items-center justify-center overflow-hidden text-center will-change-transform ${
```

to:

```tsx
      className={`relative flex flex-col items-center justify-center overflow-hidden text-center ${
```

Change line 158 from:

```tsx
        className={`tracking-tight text-primary will-change-transform ${
```

to:

```tsx
        className={`tracking-tight text-primary ${
```

Change the `gsap.context` callback body (lines 75-130) from:

```tsx
    const ctx = gsap.context(() => {
      const start = "top top";
      const end = "bottom top";

      // First name — slow
      gsap.to(firstNameRef.current, {
        yPercent: -90,
        scrollTrigger: {
          trigger: rootRef.current,
          start,
          end,
          scrub: true,
        },
      });

      // Last name — faster
      gsap.to(lastNameRef.current, {
        yPercent: -150,
        scrollTrigger: {
          trigger: rootRef.current,
          start,
          end,
          scrub: true,
        },
      });

      gsap.to(roleRef.current, {
        y: -effectiveParallaxDistance * 0.4,
        scrollTrigger: {
          trigger: rootRef.current,
          start,
          end,
          scrub: true,
        },
      });

      gsap.to(buttonsRef.current, {
        y: -effectiveParallaxDistance * 0.75,
        scrollTrigger: {
          trigger: rootRef.current,
          start,
          end,
          scrub: true,
        },
      });

      gsap.to(scrollHintRef.current, {
        y: -effectiveParallaxDistance,
        scrollTrigger: {
          trigger: rootRef.current,
          start,
          end,
          scrub: true,
        },
      });
    }, rootRef);
```

to:

```tsx
    const ctx = gsap.context(() => {
      const start = "top top";
      const end = "bottom top";

      const parallaxTargets = [
        firstNameRef.current,
        lastNameRef.current,
        roleRef.current,
        buttonsRef.current,
        scrollHintRef.current,
      ].filter((el): el is HTMLElement => el !== null);

      const setParallaxWillChange = (value: string) => {
        parallaxTargets.forEach((el) => {
          el.style.willChange = value;
        });
      };

      // First name — slow
      gsap.to(firstNameRef.current, {
        yPercent: -90,
        scrollTrigger: {
          trigger: rootRef.current,
          start,
          end,
          scrub: true,
          onEnter: () => setParallaxWillChange("transform"),
          onEnterBack: () => setParallaxWillChange("transform"),
          onLeave: () => setParallaxWillChange("auto"),
          onLeaveBack: () => setParallaxWillChange("auto"),
        },
      });

      // Last name — faster
      gsap.to(lastNameRef.current, {
        yPercent: -150,
        scrollTrigger: {
          trigger: rootRef.current,
          start,
          end,
          scrub: true,
        },
      });

      gsap.to(roleRef.current, {
        y: -effectiveParallaxDistance * 0.4,
        scrollTrigger: {
          trigger: rootRef.current,
          start,
          end,
          scrub: true,
        },
      });

      gsap.to(buttonsRef.current, {
        y: -effectiveParallaxDistance * 0.75,
        scrollTrigger: {
          trigger: rootRef.current,
          start,
          end,
          scrub: true,
        },
      });

      gsap.to(scrollHintRef.current, {
        y: -effectiveParallaxDistance,
        scrollTrigger: {
          trigger: rootRef.current,
          start,
          end,
          scrub: true,
        },
      });
    }, rootRef);
```

- [ ] **Step 2: About.tsx — remove static class, add lifecycle-scoped will-change**

Change line 218 from:

```tsx
            className={`flex h-screen w-max will-change-transform ${
```

to:

```tsx
            className={`flex h-screen w-max ${
```

Change the "about-horizontal" `gsap.to(panels, ...)` call (lines 148-169) from:

```tsx
      gsap.to(panels, {
        xPercent: -100 * (panels.length - 1),
        ease: "none",
        scrollTrigger: {
          id: "about-horizontal",
          trigger: sectionRef.current,
          pin: true,
          scrub: getIsShortHeight() ? 1.55 : 1.18,
          invalidateOnRefresh: true,
          anticipatePin: isDesktop ? 1.2 : 0,
          snap: getIsShortHeight()
            ? undefined
            : {
                snapTo: 1 / (panels.length - 1),
                duration: { min: 0.18, max: 0.42 },
                delay: 0.05,
                ease: "power2.inOut",
                directional: true,
              },
          end: () => `+=${horizontalDistance()}`,
        },
      });
```

to:

```tsx
      gsap.to(panels, {
        xPercent: -100 * (panels.length - 1),
        ease: "none",
        scrollTrigger: {
          id: "about-horizontal",
          trigger: sectionRef.current,
          pin: true,
          scrub: getIsShortHeight() ? 1.55 : 1.18,
          invalidateOnRefresh: true,
          anticipatePin: isDesktop ? 1.2 : 0,
          snap: getIsShortHeight()
            ? undefined
            : {
                snapTo: 1 / (panels.length - 1),
                duration: { min: 0.18, max: 0.42 },
                delay: 0.05,
                ease: "power2.inOut",
                directional: true,
              },
          end: () => `+=${horizontalDistance()}`,
          onEnter: () => {
            if (trackRef.current) trackRef.current.style.willChange = "transform";
          },
          onEnterBack: () => {
            if (trackRef.current) trackRef.current.style.willChange = "transform";
          },
          onLeave: () => {
            if (trackRef.current) trackRef.current.style.willChange = "auto";
          },
          onLeaveBack: () => {
            if (trackRef.current) trackRef.current.style.willChange = "auto";
          },
        },
      });
```

- [ ] **Step 3: PageOverlay.tsx — remove static class, toggle will-change around each timeline**

Change line 73 from:

```tsx
      className="pointer-events-none will-change-transform fixed inset-0 z-200 flex items-center justify-center bg-background overflow-hidden"
```

to:

```tsx
      className="pointer-events-none fixed inset-0 z-200 flex items-center justify-center bg-background overflow-hidden"
```

Change the enter-branch timeline (lines 35-43) from:

```tsx
      gsap.timeline()
        .to(overlay, { y: "0%", duration: 0.75, ease: "power4.out" })
        .to(scan, { y: "100vh", duration: 0.5, ease: "power3.out" }, "-=0.4")
        .to(letters, {
          clipPath: "inset(0 0 0% 0)",
          duration: 0.5,
          ease: "power3.out",
          stagger: 0.06,
        }, "-=0.4");
```

to:

```tsx
      overlay.style.willChange = "transform";
      gsap.timeline({ onComplete: () => { overlay.style.willChange = "auto"; } })
        .to(overlay, { y: "0%", duration: 0.75, ease: "power4.out" })
        .to(scan, { y: "100vh", duration: 0.5, ease: "power3.out" }, "-=0.4")
        .to(letters, {
          clipPath: "inset(0 0 0% 0)",
          duration: 0.5,
          ease: "power3.out",
          stagger: 0.06,
        }, "-=0.4");
```

Change the exit-branch timeline (lines 57-64) from:

```tsx
      gsap.timeline()
        .to(letters, {
          clipPath: "inset(0 0 100% 0)",
          duration: 0.3,
          ease: "power3.in",
          stagger: { each: 0.04, from: "end" },
        })
        .to(overlay, { y: "-100%", duration: 0.75, ease: "power4.inOut" }, "-=0.1");
```

to:

```tsx
      overlay.style.willChange = "transform";
      gsap.timeline({ onComplete: () => { overlay.style.willChange = "auto"; } })
        .to(letters, {
          clipPath: "inset(0 0 100% 0)",
          duration: 0.3,
          ease: "power3.in",
          stagger: { each: 0.04, from: "end" },
        })
        .to(overlay, { y: "-100%", duration: 0.75, ease: "power4.inOut" }, "-=0.1");
```

- [ ] **Step 4: ProjectGallery.tsx — remove static class, toggle will-change via Framer callbacks**

Change lines 30-44 from:

```tsx
      {images.map((img, i) => (
        <motion.div
          key={i}
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="
            relative overflow-hidden rounded-md
            border border-foreground/10
            transition-colors duration-300
            hover:border-primary
            will-change-transform
          "
        >
```

to:

```tsx
      {images.map((img, i) => {
        let itemEl: HTMLDivElement | null = null;
        return (
        <motion.div
          key={i}
          ref={(el) => { itemEl = el; }}
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          onViewportEnter={() => {
            if (itemEl) itemEl.style.willChange = "transform, opacity";
          }}
          onAnimationComplete={() => {
            if (itemEl) itemEl.style.willChange = "auto";
          }}
          className="
            relative overflow-hidden rounded-md
            border border-foreground/10
            transition-colors duration-300
            hover:border-primary
          "
        >
```

The map's closing needs to match the new block structure. Change the end of the `.map()` (lines 45-57 originally) from:

```tsx
          {/* Aspect ratio lock = no flashing */}
          <div className="relative w-full aspect-video">
            <Image
              src={img}
              alt={`Project image ${i + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 900px"
              className="object-contain"
              priority={i === 0}
            />
          </div>
        </motion.div>
      ))}
```

to:

```tsx
          {/* Aspect ratio lock = no flashing */}
          <div className="relative w-full aspect-video">
            <Image
              src={img}
              alt={`Project image ${i + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 900px"
              className="object-contain"
              priority={i === 0}
            />
          </div>
        </motion.div>
        );
      })}
```

- [ ] **Step 5: Lint and build**

Run: `npm run lint && npm run build`
Expected: both exit 0.

- [ ] **Step 6: Manual browser verification**

Run: `npm run dev`.
- On the homepage, open devtools' Rendering tab → "Layer borders." Scroll through the Hero — confirm the name/role/buttons/scroll-hint layer only while the hero is being scrolled past (not permanently highlighted before/after).
- Scroll into the About section's horizontal-pin area (desktop viewport large enough to trigger it) — confirm it still animates smoothly with no visible jank versus before the change.
- Navigate between two pages (trigger `PageOverlay`) — confirm the transition animation still looks identical to before.
- Scroll to a project detail page's screenshot gallery — confirm images still fade/scale in on scroll into view, unchanged visually.

- [ ] **Step 7: Commit**

```bash
git add components/sections/Hero.tsx components/sections/About.tsx components/transitions/PageOverlay.tsx components/projects/ProjectGallery.tsx
git commit -m "perf: scope will-change to active animation windows"
```

---

### Task 8: Perf checklist verification + full Definition-of-Done pass

**Files:** None (verification only — no code changes expected; this task documents findings per the spec's "report findings even if nothing needed changing" instruction).

- [ ] **Step 1: Verify no ScrollTrigger leaks**

Already confirmed during planning research — record the finding, no action needed:
- `ExperienceSnapshotSection.tsx`, `FeaturedProjectsSection.tsx`, `HeroSection.tsx`, `PhilosophySection.tsx`: create triggers inside `gsap.context()`, clean up via `ctx.revert()` in the `useEffect` return.
- `ChapterNav.tsx`: manual array of triggers, killed and rebuilt on GSAP's `"refresh"` event, killed on unmount.
- `About.tsx` (Task 7): same `gsap.context()` + `ctx.revert()` pattern.
- `Hero.tsx` (Task 7): same `gsap.context()` + `ctx.revert()` pattern.
- `AboutProgress.tsx`: explicit `ScrollTrigger.create()` assigned to a variable, explicit `.kill()` in cleanup.
- No leaks found. No fix needed.

- [ ] **Step 2: Verify no Framer Motion `layout`/`layoutId` usage**

Run: `grep -rn "layout=\|layoutId=" components app --include="*.tsx"`
Expected: no matches (confirmed during planning). No fix needed.

- [ ] **Step 3: Verify no raw/unthrottled scroll or resize listeners**

Run: `grep -rn "addEventListener(\"scroll\"\|addEventListener('scroll'" components app --include="*.tsx" --include="*.ts"`
Expected: no matches (Lenis owns page scroll; `Scrollbar.tsx` and the dialog containers use native container `scroll` events, which is expected and correct — they're not page-level Lenis-bypass listeners).

Run: `grep -rn "addEventListener(\"resize\"\|addEventListener('resize'" components app --include="*.tsx" --include="*.ts"`
Expected: matches in `Hero.tsx`, `About.tsx`, `FeaturedProjectsSection.tsx` — confirm each wraps its handler in a `requestAnimationFrame`-cancel-then-schedule pattern (already confirmed during planning). No fix needed.

- [ ] **Step 4: Full Definition of Done pass**

Run: `npm run lint && npm run build`
Expected: both exit 0.

In a desktop/mouse browser with `npm run dev` running, walk through:
- [ ] Homepage: page-mode scrollbar drag works, cursor doesn't freeze.
- [ ] A project detail page: page-mode scrollbar still works there too (confirm `Scrollbar`'s Lenis-attach retry logic handles the `LenisProvider`'s pathname-driven scroll-restoration correctly).
- [ ] GitHub Activity dialog: container-mode scrollbar works, cursor doesn't freeze.
- [ ] Spotify Activity dialog: container-mode scrollbar works on the main vertical scroller; horizontal rails still scroll (native, unchanged).
- [ ] Stack dialog: container-mode scrollbar works, matches the other two dialogs visually.
- [ ] Touch/coarse-pointer emulation: no custom scrollbar renders anywhere, native scroll/touch behavior intact.
- [ ] `CustomCursor`: default state, hover state (scale + border), magnetic pull on hover, trailing ring all behave as expected.
- [ ] `prefers-reduced-motion` emulated: trailing ring snaps instantly, magnetic pull is disabled, base cursor dot + hover scale/border still work.

- [ ] **Step 5: Commit (if any fixes were needed)**

If Steps 1-3 found no issues (expected outcome), there is nothing to commit for this task — it's a verification pass. If a real issue surfaced during Step 4's manual walkthrough, fix it, then:

```bash
git add -A
git commit -m "fix: address issue found during perf/DoD verification pass"
```

---

## Post-plan note for the user

Flag the Scope Note above (SpotifyActivityCard's `HorizontalRail` horizontal scrollbar) once this plan is executed — the spec said it was out of scope, but it does exist in the codebase and was deliberately left on native scrollbar styling. If full parity with the "cursor never freezes anywhere" goal is wanted, that would need a follow-up task extending `Scrollbar.tsx` (or a variant) to horizontal container mode.
