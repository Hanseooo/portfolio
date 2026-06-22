# Home Certificates Section + Overlay Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a visually impressive `FeaturedCertificatesSection` to the home page (after Experience, before Live Activity), with a desktop 3D-tilt card grid and mobile horizontal snap scroll — and fix the PageOverlay/Preloader overlap bug.

**Architecture:** Three independent changes — a 2-line GSAP bug fix in `PageOverlay.tsx`, a new self-contained `FeaturedCertificatesSection.tsx` component, and wiring that component into `app/page.tsx` and `ChapterNav.tsx`. No data model changes; all 3 certificates from `lib/certificates.ts` are shown.

**Tech Stack:** Next.js 15, React, Framer Motion, Tailwind CSS v4, TypeScript, `lib/certificates.ts` for data, `useClientReady` + `usePrefersReducedMotion` hooks (existing).

## Global Constraints

- Tailwind v4 syntax: `aspect-4/3`, not `aspect-[4/3]`
- Always use `useClientReady()` guard for GSAP/browser-only code — return SSR fallback when `!isClient`
- Always use `usePrefersReducedMotion()` — skip all animations when true
- Match heading style: `text-[clamp(2.5rem,5vw,4rem)] font-black leading-none tracking-tighter text-foreground`
- Match header row style: heading left + monospace "View All →" link right, separated by `border-b border-border pb-8`
- `certificates` array has exactly 3 items — no filtering needed
- No changes to `lib/certificates.ts` or `/certificates` page

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `components/transitions/PageOverlay.tsx` | Modify | Add initial off-screen GSAP set to prevent first-load flash |
| `components/sections/FeaturedCertificatesSection.tsx` | Create | Desktop tilt+scan cards + mobile snap scroll |
| `app/page.tsx` | Modify | Import + render `FeaturedCertificatesSection` after `ExperienceSnapshotSection` |
| `components/layout/ChapterNav.tsx` | Modify | Add `{ id: "credentials", title: "Credentials", number: "06" }` chapter |

---

## Task 1: Fix PageOverlay/Preloader Overlap

**Files:**
- Modify: `components/transitions/PageOverlay.tsx`

**Context:** `PageOverlay` renders at `y: 0` on mount (covering the screen). Its `useEffect([active])` runs with `active = false` and animates it out (y: 0 → y: "-100%"), briefly overlapping the Preloader. Fix: add a mount-only effect that immediately positions it off-screen before any transition logic runs.

**Interfaces:**
- Produces: `PageOverlay` that starts hidden (above viewport) and only enters on route change

- [ ] **Step 1: Open the file and locate the existing useEffect**

File: `components/transitions/PageOverlay.tsx`

The current structure has one `useEffect([active], ...)` that branches on `active`. You will add a NEW `useEffect([], ...)` BEFORE it.

- [ ] **Step 2: Add the mount-only GSAP set effect**

Add this block immediately after the `const textRef = useRef...` line and BEFORE the existing `useEffect`:

```tsx
// Initialize off-screen immediately — prevents flash-over-Preloader on first load
useEffect(() => {
  if (!overlayRef.current || !textRef.current) return;
  gsap.set(overlayRef.current, { y: "-100%" });
  gsap.set(textRef.current, { opacity: 0 });
}, []);
```

The full file after the change:

```tsx
"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function PageOverlay({ active }: { active: boolean }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  // Initialize off-screen immediately — prevents flash-over-Preloader on first load
  useEffect(() => {
    if (!overlayRef.current || !textRef.current) return;
    gsap.set(overlayRef.current, { y: "-100%" });
    gsap.set(textRef.current, { opacity: 0 });
  }, []);

  useEffect(() => {
    if (!overlayRef.current || !textRef.current) return;

    if (active) {
      gsap.set(overlayRef.current, { y: "100%" });
      gsap.set(textRef.current, { y: 30, opacity: 0 });

      gsap
        .timeline()
        .to(overlayRef.current, { y: "0%", duration: 0.75, ease: "power4.out" })
        .to(
          textRef.current,
          { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" },
          "-=0.35"
        );
    } else {
      gsap
        .timeline()
        .to(textRef.current, {
          y: -30,
          opacity: 0,
          duration: 0.35,
          ease: "power3.in",
        })
        .to(
          overlayRef.current,
          { y: "-100%", duration: 0.75, ease: "power4.inOut" },
          "-=0.1"
        );
    }
  }, [active]);

  return (
    <div
      ref={overlayRef}
      className="pointer-events-none will-change-transform fixed inset-0 z-200 flex items-center justify-center bg-background"
    >
      <h1
        ref={textRef}
        className="font-sans text-[clamp(3rem,10vw,8rem)] font-black leading-[0.85] tracking-tighter text-foreground"
      >
        HANSEO
      </h1>
    </div>
  );
}
```

- [ ] **Step 3: Verify manually**

Run the dev server: `npm run dev`

Open the home page. Hard-refresh (Ctrl+Shift+R) — the loading bar (Preloader) should appear cleanly with NO "HANSEO" text flash beneath it. After the Preloader fades, the page should be fully visible.

Navigate to `/projects` and back — the overlay should slide in (from below) showing "HANSEO", then slide out (upward). That animation must still work.

- [ ] **Step 4: Commit**

```bash
git add components/transitions/PageOverlay.tsx
git commit -m "fix: initialize PageOverlay off-screen to prevent first-load preloader overlap"
```

---

## Task 2: Build FeaturedCertificatesSection

**Files:**
- Create: `components/sections/FeaturedCertificatesSection.tsx`

**Interfaces:**
- Consumes: `certificates` from `@/lib/certificates` (array of `{ slug, title, issuer, image: StaticImageData, date, credentialUrl }`)
- Consumes: `useClientReady()` from `@/components/utils/useClientReady`
- Consumes: `usePrefersReducedMotion()` from `@/components/utils/usePrefersReducedMotion`
- Produces: `export default function FeaturedCertificatesSection({ id }: { id: string })`

**Design:**
- **Desktop (≥ lg):** 3-column grid. Each card has a certificate image (top 60%, `object-contain`), then an info block with a left `border-primary` accent. On hover: Framer Motion `whileHover` applies 3D perspective tilt (`rotateX: -4, rotateY: 8, scale: 1.03`). A scan-line (`motion.div`) sweeps bottom-to-top. A `VERIFIED ✓` monospace badge fades in top-right.
- **Mobile (< lg):** Horizontal snap scroll, `85vw` cards, stagger slide-in from right. No tilt, no scan-line.
- **SSR:** Static vertical grid, no motion.
- **Reduced motion:** Skip all hover animations; static cards only.

- [ ] **Step 1: Create the file with SSR fallback + shared animation variants**

Create `components/sections/FeaturedCertificatesSection.tsx`:

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { certificates } from "@/lib/certificates";
import { useClientReady } from "@/components/utils/useClientReady";
import { usePrefersReducedMotion } from "@/components/utils/usePrefersReducedMotion";

type Cert = (typeof certificates)[number];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const mobileCardVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function FeaturedCertificatesSection({ id }: { id: string }) {
  const isClient = useClientReady();
  const reducedMotion = usePrefersReducedMotion();

  if (!isClient) {
    return (
      <section id={id} className="relative px-6 py-32">
        <div className="mx-auto w-full max-w-[1400px]">
          <SectionHeader />
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {certificates.map((cert, idx) => (
              <DesktopCard key={cert.slug} cert={cert} idx={idx} reducedMotion={false} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id={id} className="relative px-6 py-32">
      <div className="mx-auto w-full max-w-[1400px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
        >
          <SectionHeader />
        </motion.div>

        {/* Desktop grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="hidden lg:grid grid-cols-3 gap-8"
        >
          {certificates.map((cert, idx) => (
            <motion.div key={cert.slug} variants={cardVariants}>
              <DesktopCard cert={cert} idx={idx} reducedMotion={reducedMotion} />
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile snap scroll */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="lg:hidden flex gap-6 overflow-x-auto snap-x snap-mandatory -mx-6 px-6"
          style={{ scrollbarWidth: "none" }}
        >
          {certificates.map((cert) => (
            <motion.div
              key={cert.slug}
              variants={mobileCardVariants}
              className="flex-shrink-0 w-[85vw] snap-start"
            >
              <MobileCard cert={cert} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add the SectionHeader sub-component**

Append to the same file:

```tsx
function SectionHeader() {
  return (
    <div className="mb-20 flex items-end justify-between border-b border-border pb-8">
      <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-black leading-none tracking-tighter text-foreground">
        Credentials
      </h2>
      <Link
        href="/certificates"
        className="group flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
      >
        <span>View All</span>
        <ArrowUpRight
          size={16}
          className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
        />
      </Link>
    </div>
  );
}
```

- [ ] **Step 3: Add the DesktopCard sub-component (tilt + scan-line + badge)**

Append to the same file:

```tsx
function DesktopCard({
  cert,
  idx,
  reducedMotion,
}: {
  cert: Cert;
  idx: number;
  reducedMotion: boolean;
}) {
  const [scanning, setScanning] = useState(false);

  return (
    <Link
      href={`/certificates/${cert.slug}`}
      className="block"
      style={{ perspective: "1200px" }}
    >
      <motion.div
        className="relative overflow-hidden border border-border bg-card transition-shadow duration-300 hover:shadow-[0_8px_30px_-4px_hsl(var(--primary)/0.25)]"
        whileHover={
          reducedMotion
            ? undefined
            : { rotateX: -4, rotateY: 8, scale: 1.03 }
        }
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        onHoverStart={() => !reducedMotion && setScanning(true)}
        onHoverEnd={() => setScanning(false)}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* VERIFIED ✓ badge */}
        <AnimatePresence>
          {scanning && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute top-3 right-3 z-20 border border-primary/60 bg-black/60 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-primary backdrop-blur-sm"
            >
              VERIFIED ✓
            </motion.span>
          )}
        </AnimatePresence>

        {/* Scan-line — full-height container clips the sweep */}
        <AnimatePresence>
          {scanning && (
            <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: "-100%" }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.55, ease: "linear" }}
                className="h-full w-full"
                style={{
                  background:
                    "linear-gradient(to bottom, transparent 0%, transparent calc(50% - 1px), hsl(var(--primary) / 0.5) calc(50% - 1px), hsl(var(--primary) / 0.5) calc(50% + 1px), transparent calc(50% + 1px), transparent 100%)",
                }}
              />
            </div>
          )}
        </AnimatePresence>

        {/* Certificate image */}
        <div className="relative aspect-4/3 overflow-hidden border-b border-border bg-background">
          <Image
            src={cert.image}
            alt={cert.title}
            fill
            className="object-contain p-6"
            sizes="(max-width: 1023px) 100vw, 33vw"
          />
        </div>

        {/* Info block */}
        <div className="border-l-2 border-primary px-5 py-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {cert.issuer}
          </p>
          <h3 className="mt-1 font-bold leading-tight text-foreground">
            {cert.title}
          </h3>
          <p className="mt-1 font-mono text-xs text-muted-foreground/70">
            {cert.date}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}
```

- [ ] **Step 4: Add the MobileCard sub-component**

Append to the same file:

```tsx
function MobileCard({ cert }: { cert: Cert }) {
  return (
    <Link href={`/certificates/${cert.slug}`} className="group block">
      <div className="relative aspect-4/3 w-full overflow-hidden border border-border bg-background">
        <Image
          src={cert.image}
          alt={cert.title}
          fill
          className="object-contain p-6"
          sizes="85vw"
        />
      </div>
      <div className="mt-4 border-l-2 border-primary pl-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {cert.issuer}
        </p>
        <h3 className="mt-1 font-bold leading-tight text-foreground transition-colors group-hover:text-primary">
          {cert.title}
        </h3>
        <span className="mt-2 inline-flex items-center gap-1 font-mono text-xs text-primary">
          View <ArrowUpRight size={12} />
        </span>
      </div>
    </Link>
  );
}
```

- [ ] **Step 5: Run dev server and verify component renders**

```bash
npm run dev
```

Navigate to home page. The section won't appear yet (not wired in). Check the TypeScript build:

```bash
npx tsc --noEmit
```

Expected: no errors for `FeaturedCertificatesSection.tsx`.

- [ ] **Step 6: Commit**

```bash
git add components/sections/FeaturedCertificatesSection.tsx
git commit -m "feat: add FeaturedCertificatesSection with desktop tilt+scan and mobile snap scroll"
```

---

## Task 3: Wire Section into Home Page and ChapterNav

**Files:**
- Modify: `app/page.tsx` — import and render `FeaturedCertificatesSection`
- Modify: `components/layout/ChapterNav.tsx` — add credentials chapter

**Interfaces:**
- Consumes: `FeaturedCertificatesSection({ id: string })` from Task 2
- Produces: Credentials section visible on home page, ChapterNav showing `06 — Credentials`

- [ ] **Step 1: Add credentials chapter to ChapterNav**

In `components/layout/ChapterNav.tsx`, find the `chapters` array (lines 13-19) and add the new entry after `trajectory`:

```tsx
const chapters: Chapter[] = [
  { id: "identity", title: "Identity", number: "01" },
  { id: "approach", title: "Approach", number: "02" },
  { id: "stack", title: "Stack", number: "03" },
  { id: "work", title: "Selected Work", number: "04" },
  { id: "trajectory", title: "Trajectory", number: "05" },
  { id: "credentials", title: "Credentials", number: "06" },
];
```

- [ ] **Step 2: Import and render FeaturedCertificatesSection in app/page.tsx**

Add the import after the existing `ExperienceSnapshotSection` import:

```tsx
import FeaturedCertificatesSection from "@/components/sections/FeaturedCertificatesSection";
```

Add the component to the JSX after `<ExperienceSnapshotSection id="trajectory" />`:

```tsx
<ExperienceSnapshotSection id="trajectory" />
<FeaturedCertificatesSection id="credentials" />
<LiveActivity />
```

Full updated `app/page.tsx`:

```tsx
"use client";

import { useEffect } from "react";
import PageTransition from "@/components/layout/PageTransition";
import ChapterNav from "@/components/layout/ChapterNav";
import HeroSection from "@/components/sections/HeroSection";
import PhilosophySection from "@/components/sections/PhilosophySection";
import FeaturedProjectsSection from "@/components/sections/FeaturedProjectsSection";
import TechStackSection from "@/components/sections/TechStackSection";
import ExperienceSnapshotSection from "@/components/sections/ExperienceSnapshotSection";
import FeaturedCertificatesSection from "@/components/sections/FeaturedCertificatesSection";
import LiveActivity from "@/components/sections/LiveActivity";
import { useResetScrollTop } from "@/components/utils/useResetScrollTop";
import { ScrollTrigger } from "@/lib/gsap";

export default function Home() {
  useResetScrollTop();

  useEffect(() => {
    const timer = setTimeout(() => ScrollTrigger.refresh(), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <PageTransition>
      <div className="relative bg-background">
        <ChapterNav />
        <main>
          <HeroSection id="identity" />
          <PhilosophySection id="approach" />
          <TechStackSection id="stack" />
          <FeaturedProjectsSection id="work" />
          <ExperienceSnapshotSection id="trajectory" />
          <FeaturedCertificatesSection id="credentials" />
          <LiveActivity />
        </main>
      </div>
    </PageTransition>
  );
}
```

- [ ] **Step 3: Verify full integration visually**

```bash
npm run dev
```

Checks:
1. Home page loads — Credentials section appears after Experience, showing 3 certificate cards
2. Desktop (≥ 1024px): hover over a card → 3D tilt, scan-line sweeps bottom-to-top, `VERIFIED ✓` badge fades in top-right
3. Desktop: click a card → navigates to `/certificates/[slug]`
4. Mobile (< 1024px): horizontal scroll snap works, 3 cards are swipeable, tapping navigates
5. ChapterNav (xl screens): shows `06 Credentials`, dots to the section on click
6. Hard-refresh home page: Preloader shows cleanly with NO overlay flash
7. Navigate to another page and back: overlay transitions work correctly (slides in and out)

- [ ] **Step 4: Type check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx components/layout/ChapterNav.tsx
git commit -m "feat: wire FeaturedCertificatesSection into home page after Experience section"
```

---

## Self-Review

**Spec coverage:**
- ✅ Featured projects logic explained (informational, no change)
- ✅ PageOverlay overlap fixed (Task 1)
- ✅ Desktop 3D tilt + scan-line + VERIFIED badge (Task 2, Step 3)
- ✅ Mobile horizontal snap scroll, different style (Task 2, Step 4)
- ✅ SSR fallback (Task 2, Step 1)
- ✅ Reduced motion guard (Task 2, Step 3 — `reducedMotion` prop skips `whileHover` and `setScanning`)
- ✅ Placed after Experience (Task 3, Step 2)
- ✅ ChapterNav updated (Task 3, Step 1)
- ✅ "View All" links to `/certificates` (Task 2, Step 2)

**Placeholder scan:** None found.

**Type consistency:**
- `Cert` type alias used consistently across all sub-components
- `reducedMotion: boolean` prop flows correctly from parent to `DesktopCard`
- `id: string` prop used on `<section id={id}>`
- `certificates` import is the same array used in all tasks
