# Design Spec: Home Certificates Section + Overlay/Preloader Fix

**Date:** 2026-06-23  
**Status:** Approved

---

## 1. Context

The home page (`app/page.tsx`) currently shows: Hero → Philosophy → Tech Stack → Projects → Experience → Live Activity.

Two problems to solve:
1. No certificate showcase on the home page.
2. `PageOverlay` (transition overlay) briefly flashes on first load because it starts at `y: 0` (covering the screen) and GSAP only repositions it when `active` changes — overlapping the `Preloader`.

---

## 2. Featured Projects Logic (informational)

`FeaturedProjectsSection.tsx` line 13: `const FEATURED = projects.slice(0, 3)` — first 3 items in the `projects` array. No `featured` flag. Order in `lib/projects.ts` controls what shows. No change needed.

---

## 3. Fix: PageOverlay ↔ Preloader Overlap

**Root cause:** `PageOverlay` renders at `y: 0` on mount. The `useEffect([active])` runs with `active = false` and animates it out (y: 0 → y: "-100%"), which is visible while the `Preloader` (`z-10000`) is still covering the screen. The overlay (`z-200`) is technically behind the preloader, but both animate out around the same time causing a visible flash after Preloader exits.

**Fix:** Add a single-run `useEffect([], ...)` in `PageOverlay.tsx` that immediately sets the initial off-screen position before any `active`-driven animation runs:

```ts
useEffect(() => {
  if (!overlayRef.current || !textRef.current) return;
  gsap.set(overlayRef.current, { y: "-100%" });
  gsap.set(textRef.current, { opacity: 0 });
}, []);
```

The overlay now starts above the viewport, invisible. Only a real route change (`active: true`) brings it in from below.

**Files changed:** `components/transitions/PageOverlay.tsx` — add ~5 lines.

---

## 4. New Section: FeaturedCertificatesSection

### 4.1 Data

All 3 certificates from `lib/certificates.ts` are shown. No filtering, no `featured` flag (YAGNI — there are exactly 3).

### 4.2 Home Page Placement

After `ExperienceSnapshotSection`, before `LiveActivity`:

```
Hero → Philosophy → Tech Stack → Projects → Experience → Certificates → Live Activity
```

Also added to `ChapterNav` as a new chapter entry.

### 4.3 Desktop Layout (≥ 1024px)

**Section wrapper:** Dark-tinted (`bg-background`), full-width, `py-32`.

**Header row:**
- Left: `"Credentials"` in the same heading style as other sections (`text-[clamp(2.5rem,5vw,4rem)] font-black tracking-tighter`)
- Right: `"View All →"` link to `/certificates` (monospace, muted, same as Projects section)

**Grid:** `grid-cols-3 gap-8`. Each card:

- **Structure:**
  - Container: `relative overflow-hidden` with `perspective: 1200px` on parent for 3D tilt
  - Top 60%: certificate image (`Image`, `object-contain`, dark background, `border border-border`)
  - Bottom 40%: card info — issuer (mono, muted, `text-xs uppercase tracking-widest`), title (`font-bold text-lg`), date (`text-xs text-muted-foreground`)
  - Left border accent: `border-l-2 border-primary` on the info block

- **Hover interactions (Framer Motion `whileHover`):**
  1. `rotateX(-4deg) rotateY(8deg) scale(1.03)` — 3D perspective tilt
  2. Scan-line: a `motion.div` absolutely positioned, `h-[2px] w-full bg-primary/40`, animates `y` from `"100%"` to `"-100%"` over 0.5s on hover enter, resets instantly on leave
  3. `VERIFIED ✓` badge: top-right corner, `font-mono text-[9px] uppercase tracking-[0.2em] text-primary`, `opacity: 0` → `opacity: 1` on hover, with a `border border-primary/60 bg-black/60 px-2 py-1` chip style
  4. Box shadow lifts: transition from `shadow-none` to `shadow-[0_0_24px_-4px] shadow-primary/30`

- Card wraps in `<Link href="/certificates/[slug]">`.

- **Scroll-enter animation:** Framer Motion `containerVariants` stagger (same pattern as Projects vertical grid), `y: 40 → 0, opacity: 0 → 1`.

### 4.4 Mobile Layout (< 1024px)

Horizontal snap scroll — same rhythm as Projects on mobile.

**Wrapper:** `overflow-x-auto scroll-snap-type-x-mandatory flex gap-6 px-6`, hidden scrollbar (`scrollbar-none`).

**Each card:** `flex-shrink-0 w-[85vw] scroll-snap-align-start`

- Full certificate image (top 55%, `object-contain`, bordered)
- Below: issuer tag + bold title + `"View →"` as text link
- On scroll-enter: subtle slide-in from right (`x: 30 → 0`) with stagger

No tilt, no scan-line, no shimmer — mouse-only effects don't belong on mobile. The stagger slide-in is the only entry animation.

### 4.5 Reduced Motion

All hover animations and shimmer skip when `usePrefersReducedMotion()` returns `true`. Images and text still visible; no motion.

### 4.6 SSR

Returns a simple vertical grid (no motion, no scroll snap) on the server render to avoid hydration mismatch — same pattern as `FeaturedProjectsSection`.

---

## 5. Files

| File | Change |
|------|--------|
| `components/transitions/PageOverlay.tsx` | Add initial GSAP set effect |
| `components/sections/FeaturedCertificatesSection.tsx` | New component |
| `app/page.tsx` | Import + add `<FeaturedCertificatesSection id="credentials" />` |
| `components/layout/ChapterNav.tsx` | Add `credentials` chapter entry |

---

## 6. Out of Scope

- No changes to `/certificates` page or its existing `Certificates.tsx` component
- No `featured` flag on `Certificate` type
- No lightbox/modal — cards navigate directly to the detail page
