# Marquee Polish — Design Spec

**Date:** 2026-06-23  
**Scope:** `TechStackSection` ticker rows only  
**Files:** `components/sections/TechStackSection.tsx`, `app/globals.css`

---

## Problem

Current marquee has three issues:
1. **Visible seam** — 2 copies of items is not enough to fill the viewport; the loop reset is visible on shorter rows (Deploy, Augment).
2. **Single direction** — all rows scroll left; no visual dynamism.
3. **No hover pause** — user cannot stop to read items.

---

## Solution

### 1. Infinite loop fix
Use **4 copies** of each item list instead of 2. `translateX(-50%)` shifts the track by exactly 2 copy-widths. At any animation frame, the visible viewport is always within the middle 2 copies — the seam (end of copy 4 → start of copy 1) is never reachable.

**Constraint satisfied:** `4 × shortest_row_width > 2 × max_viewport_width`  
Deploy row (~750px) × 4 = 3000px > 2 × 1440px = 2880px ✓

### 2. Alternating direction
- **Row 0 (Build), Row 2 (Deploy):** `ticker` keyframe — scrolls left (`0% → translateX(-50%)`)
- **Row 1 (Augment):** `ticker-reverse` keyframe — scrolls right (`translateX(-50%) → 0%`)

New CSS keyframe:
```css
@keyframes ticker-reverse {
  from { transform: translateX(-50%); }
  to   { transform: translateX(0%); }
}
```

Direction assigned by `index % 2 !== 0` in the component.

### 3. Hover pause
Wrap each ticker row's `overflow-hidden` div with a `.ticker-row` class. CSS rule:
```css
.ticker-row:hover .ticker-track {
  animation-play-state: paused;
}
```
Pure CSS — no JS, no state.

### 4. Edge fade masks
Apply `mask-image` to each `.ticker-row` (or its `overflow-hidden` child):
```css
.ticker-fade {
  mask-image: linear-gradient(
    to right,
    transparent 0%,
    black 10%,
    black 90%,
    transparent 100%
  );
}
```
10% fade zone on each edge. Applied to the `overflow-hidden` container so the fade clips content naturally.

---

## CSS Changes (`app/globals.css`)

Add after existing `ticker-track` block:
```css
@keyframes ticker-reverse {
  from { transform: translateX(-50%); }
  to   { transform: translateX(0%); }
}

.ticker-reverse {
  animation: ticker-reverse linear infinite;
}

.ticker-row:hover .ticker-track,
.ticker-row:hover .ticker-reverse {
  animation-play-state: paused;
}

.ticker-fade {
  mask-image: linear-gradient(
    to right,
    transparent 0%,
    black 10%,
    black 90%,
    transparent 100%
  );
}
```

## Component Changes (`TechStackSection.tsx`)

- Change `[...cat.items, ...cat.items]` → `[...cat.items, ...cat.items, ...cat.items, ...cat.items]`
- Add `ticker-row` class to the outer wrapper div of each row
- Add `ticker-fade` class to the `overflow-hidden` div
- Apply `ticker-reverse` class on the track when `index % 2 !== 0` (instead of `ticker-track`)

---

## Non-Goals

- No JS resize observer or dynamic cloning
- No new npm dependencies
- No changes to the mobile badge grid
- No separator or typography changes
