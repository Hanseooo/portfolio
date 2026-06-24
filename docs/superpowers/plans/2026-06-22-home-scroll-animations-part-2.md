# Home Scroll Animations — Part 2: Philosophy + Experience + ChapterNav + Global

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add GSAP scrubbed pin to PhilosophySection, animated timeline draw to ExperienceSnapshotSection, fix ChapterNav to use ScrollTrigger per chapter (instead of raw scroll events that break during pinned sections), and wire a global `ScrollTrigger.refresh()` in `app/page.tsx`.

**Architecture:** Part 2 depends on Part 1 being merged first (lib/gsap.ts must already export ScrollTrigger). Philosophy and Experience replace all Framer Motion with GSAP. ChapterNav keeps its Framer indicator animation but replaces the broken scroll listener with GSAP ScrollTrigger observers. `app/page.tsx` adds one `useEffect` for post-hydration refresh.

**Tech Stack:** GSAP 3.14 (ScrollTrigger), `usePrefersReducedMotion` hook, React refs.

## Global Constraints

- Part 1 must be complete before Part 2 is executed (`lib/gsap.ts` must export `ScrollTrigger`).
- No new npm dependencies.
- Mobile untouched — all GSAP gated behind `window.innerWidth` checks or `reducedMotion` guard.
- Every GSAP `useEffect` returns `() => ctx.revert()`.
- Elements must have their final visible CSS state as defaults; GSAP sets initial hidden state only after the animation guard confirms it will run.
- `usePrefersReducedMotion()` checked at top of every GSAP `useEffect`.

---

### Task 4: PhilosophySection — Remove Framer, Add GSAP Pin + Scrub

**Files:**
- Modify: `components/sections/PhilosophySection.tsx`

**Interfaces:**
- Consumes: `gsap`, `ScrollTrigger` from `@/lib/gsap`; `usePrefersReducedMotion` from `@/components/utils/usePrefersReducedMotion`

**Context — current file state (`components/sections/PhilosophySection.tsx`):**
- `motion.div` with `containerVariants` / `itemVariants` + `whileInView` on section wrapper and each item
- Divider line: `<motion.div ... className="h-px ... animate-[grow_1s_ease-out_forwards] [animation-delay:0.5s]" />`
- Layout: left col (5/12) = h2 heading, right col (6/12 col-start-7) = two principles + divider

**Target behavior:**
- Desktop ≥ 1024px: section pins for `+=300vh` of scroll; principles and divider scrub in
- Mobile < 1024px: section renders normally, all content visible

**Animation sequence (scroll scrubbed):**
- Position 0 → 0.35: Principle 01 (`y: 40→0, opacity: 0→1`)
- Position 0.35 → 0.55: Divider (`scaleX: 0→1`, left-to-right)
- Position 0.55 → 0.90: Principle 02 (`y: 40→0, opacity: 0→1`)
- Remaining 10%: everything visible, section stays pinned

- [ ] **Step 1: Write the full rewritten component**

Replace the entire file with:
```tsx
"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/components/utils/usePrefersReducedMotion";

export default function PhilosophySection({ id }: { id: string }) {
  const reducedMotion = usePrefersReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  const principle01Ref = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const principle02Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion) return; // content is visible by default CSS
    if (window.innerWidth < 1024) return; // mobile: no pin, content visible
    if (
      !sectionRef.current ||
      !principle01Ref.current ||
      !dividerRef.current ||
      !principle02Ref.current
    )
      return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          start: "top top",
          end: "+=300vh",
          scrub: true,
        },
      });

      tl.fromTo(
        principle01Ref.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.35 },
        0
      );
      tl.fromTo(
        dividerRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.2 },
        0.35
      );
      tl.fromTo(
        principle02Ref.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.35 },
        0.55
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id={id}
      className="relative flex min-h-screen items-center px-6 py-32"
    >
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
          {/* Left column — static anchor */}
          <div className="lg:col-span-5">
            <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-black leading-none tracking-tighter text-foreground">
              Design Systems, <br />
              <span className="text-primary">Then Ship Them.</span>
            </h2>
          </div>

          {/* Right column — animated principles */}
          <div className="flex flex-col justify-center space-y-12 lg:col-span-6 lg:col-start-7">
            <div ref={principle01Ref}>
              <h3 className="mb-4 font-bold text-xs uppercase tracking-[0.2em] text-muted-foreground/80">
                <span className="font-mono mr-2">01 /</span>Architecture
              </h3>
              <p className="text-xl text-muted-foreground">
                I design architectures from PRDs before implementation so
                delivery stays clear, scalable, and maintainable.
              </p>
            </div>

            <div
              ref={dividerRef}
              className="h-px w-full bg-border"
              style={{ transformOrigin: "left" }}
            />

            <div ref={principle02Ref}>
              <h3 className="mb-4 font-bold text-xs uppercase tracking-[0.2em] text-muted-foreground/80">
                <span className="font-mono mr-2">02 /</span>Execution
              </h3>
              <p className="text-xl text-muted-foreground">
                Responsive interfaces with accessible interaction patterns,
                built on solid API-driven features across client and server
                boundaries.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

Key changes from original:
- Removed all `motion.div`, `motion.` prefixes, `containerVariants`, `itemVariants`, `whileInView`, `viewport`, `initial`, `animate`
- Removed `animate-[grow_...]` CSS animation class and `scale-x-0` initial CSS from divider
- Divider is now a plain `<div ref={dividerRef}>` with `style={{ transformOrigin: "left" }}`
- All three animated elements are plain `<div>` with refs
- Framer Motion import removed entirely
- Content has no initial hidden state in CSS — GSAP sets it only after guard passes

- [ ] **Step 2: Verify TypeScript**

Run: `npx tsc --noEmit`
Expected: 0 errors

- [ ] **Step 3: Visual check — desktop ≥ 1024px**

Open http://localhost:3000

- [ ] Scroll to "Design Systems, Then Ship Them." section — it pins to viewport
- [ ] Principle 01 fades up into view on the first ~35% of pin scroll
- [ ] Divider line draws left-to-right between 35%–55% of pin scroll
- [ ] Principle 02 fades up into view between 55%–90% of pin scroll
- [ ] Section unpins and page continues after 300vh of scroll distance
- [ ] Left heading ("Design Systems...") never animates — stays static

- [ ] **Step 4: Visual check — mobile < 1024px**

- [ ] All content (both principles, divider) is immediately visible — no pin, no scrub

- [ ] **Step 5: Commit**

```bash
git add components/sections/PhilosophySection.tsx
git commit -m "feat: replace Framer with GSAP pin+scrub reveal in PhilosophySection"
```

---

### Task 5: ExperienceSnapshotSection — Animated Timeline Draw

**Files:**
- Modify: `components/sections/ExperienceSnapshotSection.tsx`

**Interfaces:**
- Consumes: `gsap`, `ScrollTrigger` from `@/lib/gsap`; `usePrefersReducedMotion` from `@/components/utils/usePrefersReducedMotion`

**Context — current file state (`components/sections/ExperienceSnapshotSection.tsx`):**
- Two hardcoded `motion.div` entries, each with `border-l border-border pl-8`
- Each entry has a dot: `<span className="absolute -left-[5px] top-2 h-2 w-2 rounded-full bg-border transition-colors group-hover:bg-primary" />`
- Framer `containerVariants` + `itemVariants` with `whileInView`

**Target DOM structure:**
```
<div ref={timelineRef} className="relative flex flex-col gap-12 lg:w-2/3 lg:gap-24">
  <div ref={lineRef} className="absolute left-0 top-0 w-px h-full bg-border origin-top" />
  <div className="experience-entry group relative pl-8">
    <span className="entry-dot absolute -left-[5px] top-2 h-2 w-2 rounded-full bg-border" />
    ...content...
  </div>
  ...
</div>
```

**Animation:**
- Line: `scaleY: 0 → 1` scrubbed from `start: "top 70%"` to `end: "bottom 70%"` of `timelineRef`
- Each entry dot: `scale: 0.5 → 1`, `backgroundColor: hsl(var(--border)) → hsl(var(--primary))` on `start: "top 65%"` of that entry
- Each entry text: `x: -20 → 0`, `opacity: 0 → 1` after dot activates (reversed on scroll back)

- [ ] **Step 1: Write the full rewritten component**

Replace the entire file with:
```tsx
"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/components/utils/usePrefersReducedMotion";

export default function ExperienceSnapshotSection({ id }: { id: string }) {
  const reducedMotion = usePrefersReducedMotion();

  const timelineRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion) return;
    if (!timelineRef.current || !lineRef.current) return;

    const ctx = gsap.context(() => {
      // Animated line draws as user scrolls through the timeline section
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 70%",
            end: "bottom 70%",
            scrub: true,
          },
        }
      );

      // Per-entry: dot activates then text slides in
      gsap.utils.toArray<HTMLElement>(".experience-entry").forEach((entry) => {
        const dot = entry.querySelector<HTMLElement>(".entry-dot");

        // Set initial hidden state only after animation guard has passed
        gsap.set(entry, { opacity: 0, x: -20 });
        if (dot) gsap.set(dot, { scale: 0.5 });

        const tl = gsap.timeline({ paused: true });
        if (dot) {
          tl.to(dot, {
            scale: 1,
            backgroundColor: "hsl(var(--primary))",
            duration: 0.3,
            ease: "back.out(1.4)",
          });
        }
        tl.to(
          entry,
          { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" },
          "-=0.2"
        );

        ScrollTrigger.create({
          trigger: entry,
          start: "top 65%",
          onEnter: () => tl.play(),
          onLeaveBack: () => tl.reverse(),
        });
      });
    }, timelineRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section id={id} className="relative min-h-screen px-6 py-32">
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="mb-20 flex items-end justify-between border-b border-border pb-8">
          <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-black leading-none tracking-tighter text-foreground">
            Experience
          </h2>
          <Link
            href="/experience"
            className="group flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
          >
            <span>History</span>
            <ArrowUpRight
              size={16}
              className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </Link>
        </div>

        {/* Timeline wrapper — single animated line replaces per-entry border-l */}
        <div
          ref={timelineRef}
          className="relative flex flex-col gap-12 lg:w-2/3 lg:gap-24"
        >
          {/* Animated line */}
          <div
            ref={lineRef}
            className="absolute left-0 top-0 w-px h-full bg-border"
            style={{ transformOrigin: "top" }}
          />

          {/* Entry 1 */}
          <div className="experience-entry group relative pl-8">
            <span className="entry-dot absolute -left-[5px] top-2 h-2 w-2 rounded-full bg-border" />
            <h3 className="text-2xl font-bold text-foreground mb-2">
              AI Solutions Development Intern
            </h3>
            <p className="font-mono text-sm uppercase tracking-widest text-primary mb-6">
              Eskwelabs // 2026
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Designed and built an internal full-stack Recruitment Automation
              System. Reduced manual workload by 80%, turning day-long
              operations into workflows completed in minutes.
            </p>
          </div>

          {/* Entry 2 */}
          <div className="experience-entry group relative pl-8">
            <span className="entry-dot absolute -left-[5px] top-2 h-2 w-2 rounded-full bg-border" />
            <h3 className="text-2xl font-bold text-foreground mb-2">
              Full-Stack Web Developer
            </h3>
            <p className="font-mono text-sm uppercase tracking-widest text-muted-foreground/80 mb-6">
              Freelance // 2023 - 2024
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Built full-stack web applications using Next.js, React,
              PostgreSQL, and Django with a focus on robust architecture and
              scalable features.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
```

Key changes from original:
- Removed Framer Motion entirely (`motion.div`, `containerVariants`, `itemVariants`, `whileInView`)
- Each entry is a plain `div.experience-entry` — no `border-l border-border` (single animated line replaces it)
- Added `ref={timelineRef}` wrapper div with `position: relative`
- Added `ref={lineRef}` animated line div (`absolute left-0 top-0 w-px h-full bg-border`, `transformOrigin: top`)
- Dot: removed `transition-colors group-hover:bg-primary` (GSAP owns background color now); added `entry-dot` class
- Content has no initial hidden CSS — GSAP sets `{ opacity: 0, x: -20 }` only after guard passes

- [ ] **Step 2: Verify TypeScript**

Run: `npx tsc --noEmit`
Expected: 0 errors

- [ ] **Step 3: Visual check**

Open http://localhost:3000, scroll to Experience section.

- [ ] Single vertical line (1px, `bg-border`) grows downward as user scrolls through the section
- [ ] Entry 1 dot scales up and turns primary color when entry enters 65% of viewport
- [ ] Entry 1 text slides from `x: -20` to `x: 0` with fade
- [ ] Entry 2 activates the same way when it enters viewport
- [ ] Scrolling back up: entries reverse (fade out, dot returns to `bg-border`)
- [ ] No `border-l` visible on individual entries (replaced by single animated line)

- [ ] **Step 4: Reduced motion check**

Emulate reduced motion → both entries render fully visible immediately, no animation.

- [ ] **Step 5: Commit**

```bash
git add components/sections/ExperienceSnapshotSection.tsx
git commit -m "feat: replace Framer with GSAP timeline draw in ExperienceSnapshotSection"
```

---

### Task 6: ChapterNav — Replace Scroll Listener with ScrollTrigger

**Files:**
- Modify: `components/layout/ChapterNav.tsx`

**Interfaces:**
- Consumes: `ScrollTrigger` from `@/lib/gsap`
- Produces: correct `activeId` state that works through pinned sections (Philosophy, FeaturedProjects)

**Context — current file state (`components/layout/ChapterNav.tsx`):**
- Raw `window.addEventListener("scroll", handleScroll)` using `getBoundingClientRect()` to detect active section
- Bug: `getBoundingClientRect()` does not update correctly when GSAP pins sections — the element stays fixed in the viewport and its rect doesn't change as the user scrolls through the pin spacer
- Framer Motion still used for the indicator line animation — this is kept

**Fix:** Replace the scroll handler with one `ScrollTrigger.create()` per chapter. ScrollTrigger is aware of pin spacers and fires correctly.

- [ ] **Step 1: Write the updated component**

Replace the entire file with:
```tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ScrollTrigger } from "@/lib/gsap";

interface Chapter {
  id: string;
  title: string;
  number: string;
}

const chapters: Chapter[] = [
  { id: "identity", title: "Identity", number: "01" },
  { id: "approach", title: "Approach", number: "02" },
  { id: "work", title: "Selected Work", number: "03" },
  { id: "trajectory", title: "Trajectory", number: "04" },
];

export default function ChapterNav() {
  const [activeId, setActiveId] = useState<string>("identity");

  useEffect(() => {
    const triggers = chapters.map((chapter) => {
      const el = document.getElementById(chapter.id);
      if (!el) return null;

      return ScrollTrigger.create({
        trigger: el,
        start: "top 50%",
        end: "bottom 50%",
        onEnter: () => setActiveId(chapter.id),
        onEnterBack: () => setActiveId(chapter.id),
      });
    });

    return () => {
      triggers.forEach((t) => t?.kill());
    };
  }, []);

  return (
    <div className="fixed left-6 top-1/2 z-50 hidden -translate-y-1/2 flex-col gap-8 xl:flex">
      {chapters.map((chapter) => (
        <button
          key={chapter.id}
          onClick={() => {
            document.getElementById(chapter.id)?.scrollIntoView({ behavior: "smooth" });
          }}
          className="relative flex items-center gap-4 group cursor-pointer"
        >
          {/* Active Line Indicator */}
          <motion.div
            initial={false}
            animate={{
              width: activeId === chapter.id ? 24 : 0,
              opacity: activeId === chapter.id ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="absolute -left-10 h-[1px] bg-primary group-hover:opacity-50"
          />

          <span
            className={`font-mono text-xs transition-all duration-300 ${
              activeId === chapter.id
                ? "text-primary opacity-100"
                : "text-muted-foreground opacity-50 group-hover:text-primary group-hover:opacity-75"
            }`}
          >
            {chapter.number}
          </span>
          <span
            className={`text-xs uppercase tracking-widest transition-all duration-300 ${
              activeId === chapter.id
                ? "text-foreground opacity-100 font-bold"
                : "text-muted-foreground opacity-0 -translate-x-4 group-hover:opacity-50 group-hover:translate-x-0"
            }`}
          >
            {chapter.title}
          </span>
        </button>
      ))}
    </div>
  );
}
```

Key changes from original:
- Removed `window.addEventListener("scroll", handleScroll)` and `handleScroll` function entirely
- Added `import { ScrollTrigger } from "@/lib/gsap"`
- One `ScrollTrigger.create()` per chapter using `start: "top 50%"` / `end: "bottom 50%"`
- Cleanup: `triggers.forEach((t) => t?.kill())`
- Framer Motion indicator animation kept unchanged

- [ ] **Step 2: Verify TypeScript**

Run: `npx tsc --noEmit`
Expected: 0 errors

- [ ] **Step 3: Visual check**

Open http://localhost:3000 on a wide viewport (xl: 1280px+) so ChapterNav is visible.

- [ ] "01 Identity" is active when Hero section is in view
- [ ] Scrolling into Philosophy section activates "02 Approach" — including during the pin (300vh scroll distance)
- [ ] Scrolling into FeaturedProjects activates "03 Selected Work" — including during the pin
- [ ] Scrolling into Experience activates "04 Trajectory"
- [ ] Scrolling back up reverses active state correctly
- [ ] Clicking any chapter nav item scrolls to that section smoothly

- [ ] **Step 4: Commit**

```bash
git add components/layout/ChapterNav.tsx
git commit -m "fix: replace scroll listener in ChapterNav with ScrollTrigger to handle pinned sections"
```

---

### Task 7: app/page.tsx — Global ScrollTrigger.refresh() Coordination

**Files:**
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `ScrollTrigger` from `@/lib/gsap`

**Context — current file state (`app/page.tsx`):**
- Renders `ChapterNav`, `HeroSection`, `PhilosophySection`, `FeaturedProjectsSection`, `ExperienceSnapshotSection`, `LiveActivity`
- No GSAP coordination currently

**Why:** After all sections mount and their GSAP `useEffect` hooks run, the total page height includes multiple pin spacers. Each ScrollTrigger calculated its positions based on the layout at mount time, but if multiple sections mount in sequence, later positions may be stale. `ScrollTrigger.refresh()` after 200ms ensures all triggers recalculate with the final layout.

- [ ] **Step 1: Add ScrollTrigger import and refresh effect**

Current `app/page.tsx`:
```tsx
"use client";

import PageTransition from "@/components/layout/PageTransition";
import ChapterNav from "@/components/layout/ChapterNav";
import HeroSection from "@/components/sections/HeroSection";
import PhilosophySection from "@/components/sections/PhilosophySection";
import FeaturedProjectsSection from "@/components/sections/FeaturedProjectsSection";
import ExperienceSnapshotSection from "@/components/sections/ExperienceSnapshotSection";
import LiveActivity from "@/components/sections/LiveActivity";
import { useResetScrollTop } from "@/components/utils/useResetScrollTop";

export default function Home() {
  useResetScrollTop();

  return (
    <PageTransition>
      <div className="relative bg-background">
        <ChapterNav />
        <main>
          <HeroSection id="identity" />
          <PhilosophySection id="approach" />
          <FeaturedProjectsSection id="work" />
          <ExperienceSnapshotSection id="trajectory" />
          <LiveActivity />
        </main>
      </div>
    </PageTransition>
  );
}
```

New `app/page.tsx`:
```tsx
"use client";

import { useEffect } from "react";
import PageTransition from "@/components/layout/PageTransition";
import ChapterNav from "@/components/layout/ChapterNav";
import HeroSection from "@/components/sections/HeroSection";
import PhilosophySection from "@/components/sections/PhilosophySection";
import FeaturedProjectsSection from "@/components/sections/FeaturedProjectsSection";
import ExperienceSnapshotSection from "@/components/sections/ExperienceSnapshotSection";
import LiveActivity from "@/components/sections/LiveActivity";
import { useResetScrollTop } from "@/components/utils/useResetScrollTop";
import { ScrollTrigger } from "@/lib/gsap";

export default function Home() {
  useResetScrollTop();

  // After all section effects mount and pin spacers are inserted, recalculate positions
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
          <FeaturedProjectsSection id="work" />
          <ExperienceSnapshotSection id="trajectory" />
          <LiveActivity />
        </main>
      </div>
    </PageTransition>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

Run: `npx tsc --noEmit`
Expected: 0 errors

- [ ] **Step 3: Full integration visual check**

Open http://localhost:3000 on a desktop viewport (≥ 1280px wide).

End-to-end scroll test:
- [ ] Hero: SplitText chars animate in, parallax on portrait works
- [ ] Philosophy: section pins, principles scrub in correctly
- [ ] ChapterNav "02 Approach" activates while scrolling through Philosophy pin
- [ ] FeaturedProjects: section pins, cards scroll horizontally
- [ ] ChapterNav "03 Selected Work" activates while scrolling through FeaturedProjects pin
- [ ] Experience: timeline line draws, entries fade in
- [ ] ChapterNav "04 Trajectory" activates at Experience section
- [ ] No double-pin issues, no incorrect scroll positions after refresh

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat: add ScrollTrigger.refresh coordination in app/page.tsx after hydration"
```

---

## Self-Review

**Spec coverage:**
- [x] Philosophy: remove Framer, add GSAP pin `+=300vh` (Task 4)
- [x] Philosophy: Principle 01 scrub 0→35% (Task 4)
- [x] Philosophy: Divider scaleX draw 35→55% (Task 4)
- [x] Philosophy: Principle 02 scrub 55→90% (Task 4)
- [x] Philosophy: `transformOrigin: "left"` on divider (Task 4)
- [x] Philosophy: `window.innerWidth < 1024` fallback (Task 4)
- [x] Philosophy: reduced motion skips pin (Task 4)
- [x] Experience: single animated line replaces per-entry `border-l` (Task 5)
- [x] Experience: `scaleY: 0→1` scrubbed start "top 70%" / end "bottom 70%" (Task 5)
- [x] Experience: per-entry dot `scale: 0.5→1`, color `border→primary` (Task 5)
- [x] Experience: per-entry text `x: -20→0, opacity: 0→1` (Task 5)
- [x] Experience: `toggleActions`-equivalent via `onEnter` / `onLeaveBack` (Task 5)
- [x] Experience: `gsap.utils.toArray(".experience-entry")` pattern (Task 5)
- [x] Experience: remove Framer completely (Task 5)
- [x] ChapterNav: replace raw scroll listener with ScrollTrigger per chapter (Task 6)
- [x] ChapterNav: `start: "top 50%"`, `end: "bottom 50%"` (Task 6)
- [x] ChapterNav: `onEnter` + `onEnterBack` set active (Task 6)
- [x] ChapterNav: Framer indicator kept (Task 6)
- [x] app/page.tsx: `ScrollTrigger.refresh()` after 200ms (Task 7)
- [x] `ctx.revert()` cleanup in all effects (Tasks 4, 5)
- [x] `.kill()` cleanup in ChapterNav (Task 6)

**No gaps found.**

**Placeholder scan:** No TODOs, TBDs, or forward references present.

**Type consistency:**
- `ScrollTrigger.create()` return type: `ScrollTrigger` — `.kill()` exists on it
- `gsap.utils.toArray<HTMLElement>()` → correct generic usage
- `entry.querySelector<HTMLElement>(".entry-dot")` → nullable, guarded with `if (dot)`
