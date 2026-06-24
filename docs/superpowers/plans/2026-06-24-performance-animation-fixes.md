# Performance & Animation Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix 5 performance and animation correctness issues found in the June 2026 audit without touching unrelated code.

**Architecture:** All fixes are surgical and independent — each targets exactly one file or one dependency. No new abstractions are introduced. Tasks are ordered by ascending complexity so the build stays green after every commit.

**Tech Stack:** Next.js 16, React 19, TypeScript, GSAP, Lenis (`window.__lenis`), Next.js `<Image>`

## Global Constraints

- Package manager: `npm` only — never pnpm/yarn/bun
- Tailwind v4: no `tailwind.config.js`; utility classes only
- Animations: Framer Motion for React component animations, GSAP for scroll-trigger sequences — never mix on the same element
- Always respect `prefers-reduced-motion` in any animation added
- Ice Blue + deep black palette only — no new accent colors
- Passing = `npm run lint` exits 0 + `npm run build` exits 0 + visual check in browser

---

### Task 1: Remove dead `@studio-freight/lenis` dependency

**Files:**
- Modify: `package.json` and `package-lock.json` (via npm uninstall)

**Interfaces:**
- Consumes: nothing
- Produces: nothing (dependency removal only)

- [ ] **Step 1: Confirm no imports exist**

```bash
grep -r "@studio-freight/lenis" .
```

Expected: no output (zero matches).

- [ ] **Step 2: Uninstall the package**

```bash
npm uninstall @studio-freight/lenis
```

Expected: exits 0, `@studio-freight/lenis` line gone from `package.json`.

- [ ] **Step 3: Verify build still passes**

```bash
npm run lint && npm run build
```

Expected: both exit 0.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: remove deprecated @studio-freight/lenis dead dependency"
```

---

### Task 2: Delete dead `ScrollReveal.tsx`

**Files:**
- Delete: `components/motion/ScrollReveal.tsx`

**Interfaces:**
- Consumes: nothing
- Produces: nothing (file deletion)

- [ ] **Step 1: Confirm no imports of this file exist**

```bash
grep -r "ScrollReveal\|from.*motion/ScrollReveal" . --include="*.tsx" --include="*.ts"
```

Expected: only `components/motion/ScrollReveal.tsx` itself matches (the `FadeIn` export inside it). If any other file imports it, stop and report — do not delete.

- [ ] **Step 2: Delete the file**

```bash
rm components/motion/ScrollReveal.tsx
```

- [ ] **Step 3: Verify build still passes**

```bash
npm run lint && npm run build
```

Expected: both exit 0.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: delete dead ScrollReveal.tsx (broken component signature, zero imports)"
```

---

### Task 3: Add `priority` to first card image in FeaturedProjectsSection

**Files:**
- Modify: `components/sections/FeaturedProjectsSection.tsx` (~line 180)

**Interfaces:**
- Consumes: `idx` (loop variable already in scope)
- Produces: nothing (attribute addition)

**Context:** In the `FEATURED.map((project, idx) => ...)` callback, the `<Image>` for the left panel has no `priority` prop. The first card (`idx === 0`) is in the viewport immediately on desktop horizontal mode — it is the LCP candidate and should be priority-loaded.

- [ ] **Step 1: Find and update the Image**

In `components/sections/FeaturedProjectsSection.tsx`, locate the `<Image>` inside the map callback (around line 180):

```tsx
<Image
  src={project.heroImage}
  alt={project.title}
  fill
  className="object-cover transition-transform duration-700 group-hover:scale-105"
/>
```

Replace it with:

```tsx
<Image
  src={project.heroImage}
  alt={project.title}
  fill
  priority={idx === 0}
  className="object-cover transition-transform duration-700 group-hover:scale-105"
/>
```

- [ ] **Step 2: Verify build passes**

```bash
npm run lint && npm run build
```

Expected: both exit 0.

- [ ] **Step 3: Commit**

```bash
git add components/sections/FeaturedProjectsSection.tsx
git commit -m "perf: add priority to first FeaturedProjects card image for faster LCP"
```

---

### Task 4: Fix ChapterNav to use Lenis `scrollTo` instead of native `scrollIntoView`

**Files:**
- Modify: `components/layout/ChapterNav.tsx` (~line 58–60)

**Interfaces:**
- Consumes: `window.__lenis` — type `Lenis | undefined`, declared in `global.d.ts`. The `scrollTo` method accepts an `HTMLElement` as its first argument.
- Produces: nothing (behavior fix)

**Context:** Native `scrollIntoView` bypasses Lenis entirely, producing a jarring instant-jump vs. the smooth Lenis feel everywhere else on the site. `LenisProvider` stores the active instance at `window.__lenis`. On mobile, Lenis is not initialized, so `window.__lenis` is `undefined` — fall back to native in that case.

- [ ] **Step 1: Update the onClick handler**

In `components/layout/ChapterNav.tsx`, find the button's `onClick` (around line 58):

```tsx
onClick={() => {
  document.getElementById(chapter.id)?.scrollIntoView({ behavior: "smooth" });
}}
```

Replace with:

```tsx
onClick={() => {
  const el = document.getElementById(chapter.id);
  if (!el) return;
  if (window.__lenis) {
    window.__lenis.scrollTo(el);
  } else {
    el.scrollIntoView({ behavior: "smooth" });
  }
}}
```

- [ ] **Step 2: Verify build passes**

```bash
npm run lint && npm run build
```

Expected: both exit 0.

- [ ] **Step 3: Visual check**

`npm run dev`, open the home page on a desktop browser (viewport ≥ 1280px so ChapterNav is visible). Click each nav item. The scroll should feel smooth and match the Lenis wheel-scroll feel — no hard jump or sudden stop.

- [ ] **Step 4: Commit**

```bash
git add components/layout/ChapterNav.tsx
git commit -m "fix: use Lenis scrollTo in ChapterNav to match site scroll feel"
```

---

### Task 5: Replace CustomCursor MutationObserver with event delegation

**Files:**
- Modify: `components/ui/CustomCursor.tsx`

**Interfaces:**
- Consumes: nothing external
- Produces: nothing (internal refactor, identical visual behavior)

**Context:** The current implementation attaches individual `mouseenter`/`mouseleave` handlers to every interactive element on mount, then re-attaches on every DOM mutation via `MutationObserver`. This fires on every React re-render and on every Live Activity poll (every 20 s), causing constant DOM churn.

The fix: a single `mouseover`/`mouseout` listener on `document` using `event.target.closest(selector)`. These events bubble, so delegation works without per-element listeners or `MutationObserver`.

**Edge case handled:** `e.relatedTarget` guards prevent double-firing when the mouse moves between two interactive elements (e.g., link → button) or between children of the same interactive element (e.g., `<span>` → `<span>` inside `<button>`). Only true boundary crossings trigger the GSAP animation.

- [ ] **Step 1: Replace the `useEffect` body in CustomCursor**

Open `components/ui/CustomCursor.tsx`. Replace everything from line 9 (`useEffect(() => {`) through line 95 (`}, []);`) with:

```tsx
useEffect(() => {
  const cursor = cursorRef.current;
  if (!cursor) return;

  const isTouchDevice =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia("(pointer: coarse)").matches;

  if (isTouchDevice) {
    cursor.style.display = "none";
    return;
  }

  const setX = gsap.quickSetter(cursor, "x", "px");
  const setY = gsap.quickSetter(cursor, "y", "px");

  const interactiveSelector = "a, button, input, textarea, select, [role='button']";

  const onMouseMove = (e: MouseEvent) => {
    setX(e.clientX);
    setY(e.clientY);
  };

  const onMouseOver = (e: MouseEvent) => {
    // Only fire when crossing INTO an interactive element from a non-interactive one
    if (!(e.target as Element).closest?.(interactiveSelector)) return;
    if ((e.relatedTarget as Element | null)?.closest?.(interactiveSelector)) return;
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
```

The JSX return (`<div ref={cursorRef} .../>`) is unchanged.

- [ ] **Step 2: Verify build passes**

```bash
npm run lint && npm run build
```

Expected: both exit 0.

- [ ] **Step 3: Visual check**

`npm run dev`, open the home page on a non-touch desktop:
- Hover a link → cursor expands to ring
- Move off → cursor shrinks back to dot
- Move from one link directly to another adjacent link → no flicker, smooth continuous ring state
- Move mouse over a `<span>` inside a `<button>` → cursor stays expanded (no flicker between children)
- Scroll to the Live Activity section, wait ~20 s for the poll → cursor behavior unchanged, no jitter

- [ ] **Step 4: Commit**

```bash
git add components/ui/CustomCursor.tsx
git commit -m "perf: replace CustomCursor MutationObserver with event delegation"
```
