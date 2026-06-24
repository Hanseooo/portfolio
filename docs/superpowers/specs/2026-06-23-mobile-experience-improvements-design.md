# Mobile Experience Improvements — Design Spec

**Date:** 2026-06-23  
**Status:** Approved

---

## Scope

Seven targeted fixes to improve the mobile experience across the portfolio. No new dependencies. All changes use patterns already present in the codebase.

---

## 1. HeroSection — GSAP → Framer Motion on mobile

**File:** `components/sections/HeroSection.tsx`

**Problem:** GSAP SplitText + timeline runs on all devices. On mobile this is unnecessary overhead and SplitText can misbehave on small viewports.

**Solution:**
- Import `getRuntimeEnv` from `@/components/utils/browserInfo` and `useClientReady`.
- Derive `isMobile` the same way `Hero.tsx` does.
- When `isMobile`: skip GSAP entirely.
- Wrap `<h1>` in `motion.h1` and `<p>` (paragraph) in `motion.p` with:
  - `initial={{ opacity: 0, y: 20 }}`
  - `animate={{ opacity: 1, y: 0 }}`
  - `transition={{ duration: 0.6, ease: motionTokens.framerEase.enter }}`
  - First visit (no `sessionStorage.hasVisited`): `delay: 3.5` — matches existing GSAP timeline delay.
  - Return visits: `delay: 0`.
  - When `reducedMotion`: `initial={{ opacity: 1, y: 0 }}` (instant).
- Portrait parallax already gated to `window.innerWidth >= 1024` — no change needed.
- The existing GSAP `useEffect` keeps running on desktop unchanged.

---

## 2. PhilosophySection — Framer Motion entry on mobile

**File:** `components/sections/PhilosophySection.tsx`

**Problem:** GSAP scroll-pin is already skipped on `window.innerWidth < 1024`. Mobile shows fully static content with no entry animation.

**Solution:**
- Wrap each of the three principle `<div>` blocks and both `<div>` dividers in `motion.div`.
- All five elements: `initial={{ opacity: 0, y: 24 }}`, `whileInView={{ opacity: 1, y: 0 }}`, `viewport={{ once: true }}`.
- Stagger via `transition={{ delay: index * 0.12 }}` where index maps: principle01→0, divider01→0.12, principle02→0.24, divider02→0.36, principle03→0.48.
- When `reducedMotion`: skip animation (already handled via existing `reducedMotion` guard — extend it to also skip FM by passing `initial={{ opacity: 1, y: 0 }}` when `reducedMotion`).
- Desktop GSAP scroll-pin is unchanged — FM `whileInView` only applies when `window.innerWidth < 1024` (GSAP already returns early, FM picks up).
- Since `motion.div` is applied regardless of screen size but GSAP pins on desktop, the FM `whileInView` will also fire on desktop. To avoid conflict: wrap FM only when not on desktop, or rely on the fact that GSAP overrides opacity/transform via inline styles on desktop (acceptable — but cleaner to conditionally apply). Simple approach: check `isMobile` (same `getRuntimeEnv` import) and only apply FM `initial`/`whileInView` when `isMobile`. On desktop the elements remain static divs and GSAP handles everything.

---

## 3. SpotifyActivityCard — grayscale only on desktop

**File:** `components/sections/live-activity/SpotifyActivityCard.tsx`

**Problem:** Album art uses `grayscale group-hover:grayscale-0`. On touch devices `:hover` never fires naturally, leaving images permanently grayscale.

**Solution:**
- Add `isMobile` detection via `getRuntimeEnv` + `useClientReady` (existing pattern).
- Three image sites:
  1. **Now-playing artwork** (line ~190): change `className` to conditionally apply `grayscale group-hover:grayscale-0` only when `!isMobile`.
  2. **Top Tracks modal images** (line ~284): same conditional.
  3. **Top Artists modal images** (line ~313): same conditional.
- Transition class `transition-all duration-500` stays on all devices for smooth desktop hover.

---

## 4. DiscordStatusCard — grayscale only on desktop

**File:** `components/sections/live-activity/DiscordStatusCard.tsx`

**Problem:** Same as Spotify — `grayscale hover:grayscale-0` on all images, permanently gray on touch.

**Solution:**
- Add `isMobile` detection (same pattern).
- Four image sites:
  1. **User avatar** (line ~86): conditional grayscale.
  2. **Spotify album art in Discord** (line ~115): conditional grayscale.
  3. **Gaming activity image** (line ~154): conditional grayscale.
  4. **Other activities images** (line ~191): conditional grayscale.

---

## 5. TechStackSection — mobile badge polish + entry animation

**File:** `components/sections/TechStackSection.tsx`

**Problem:** Mobile badge grid is visually flat — small borderless badges with no depth or entry animation.

**Solution:**
- **Badge style:** add `bg-foreground/5` fill to each badge `<li>`. Keep `rounded-none border border-border`.
- **Category label:** add a `<div className="h-px w-full bg-border mb-3" />` rule below the label `<p>` for visual separation.
- **Entry animation:** wrap each category group `<div>` in `motion.div` with `whileInView={{ opacity: 1, y: 0 }}`, `initial={{ opacity: 0, y: 12 }}`, `viewport={{ once: true }}`, stagger `delay: index * 0.1`.
- Skip animation when `reducedMotion` (pass `initial={{ opacity: 1, y: 0 }}` when reduced).
- Import `motion` from `framer-motion` and `usePrefersReducedMotion` (already used elsewhere in project).

---

## 6. ProjectBrief — badge polish

**File:** `components/projects/ProjectBrief.tsx`

**Problem:** Stack and Integrations badge lists use identical flat style as TechStack mobile. Inconsistent with the improved TechStack badges after change #5.

**Solution:**
- Add `bg-foreground/5` to each badge `<li>` in both the Stack list and the Integrations list. Single-line change per list.

---

## 7. ProjectGallery — fix zoomed screenshots

**File:** `components/projects/ProjectGallery.tsx`

**Problem:** Gallery images use `object-cover` with `fill` inside a forced `aspect-video` container. Screenshots not exactly 16:9 are cropped/zoomed.

**Solution:**
- Change `className="object-cover"` → `className="object-contain"` on the `<Image>` inside the gallery.
- The `aspect-video` container keeps the layout stable. `object-contain` fits the full image within the box without cropping, showing letterbox bars on mismatched ratios.
- No other changes needed.

---

## Non-goals

- No changes to desktop animations.
- No new npm dependencies.
- No changes to the GSAP setup or `lib/gsap.ts`.
- No layout changes to the hero section (only entry animation behavior changes).
- No changes to the ticker/scrolling rows in TechStackSection desktop.
