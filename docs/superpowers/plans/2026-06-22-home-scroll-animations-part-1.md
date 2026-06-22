# Home Scroll Animations — Part 1: Hero + FeaturedProjects

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add GSAP SplitText hero reveal + scroll parallax, and a desktop horizontal-scroll pin for the FeaturedProjects section.

**Architecture:** GSAP `ScrollTrigger` + `SplitText` are wired into existing components. `lib/gsap.ts` is the single registration point for GSAP plugins. Desktop viewport check gates horizontal mode; mobile falls back to current vertical layout. Framer Motion stays on the vertical fallback of FeaturedProjects but is removed from the Hero text animation.

**Tech Stack:** GSAP 3.14 (SplitText, ScrollTrigger already installed), React refs, `usePrefersReducedMotion` hook at `components/utils/usePrefersReducedMotion.ts`, `useClientReady` hook at `components/utils/useClientReady.ts`.

## Global Constraints

- No new npm dependencies — GSAP 3.14 is already installed at `^3.14.2`.
- Mobile untouched — all GSAP is gated behind viewport checks or `!isMobile`.
- Every GSAP `useEffect` must return `() => ctx.revert()` for cleanup.
- All elements must have their final visible CSS state by default; GSAP only sets initial hidden state after the animation guard confirms it will run.
- Check `usePrefersReducedMotion()` at top of every GSAP `useEffect`; if `true`, skip all GSAP setup (set content visible instead).
- Part 2 of this plan covers: PhilosophySection, ExperienceSnapshotSection, ChapterNav, and app/page.tsx.

---

### Task 1: Register SplitText in lib/gsap.ts

**Files:**
- Modify: `lib/gsap.ts`

**Interfaces:**
- Produces: `SplitText` export consumed by Task 2 (`HeroSection`)

- [ ] **Step 1: Open and read current file**

Current content of `lib/gsap.ts`:
```ts
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
```

- [ ] **Step 2: Add SplitText registration**

Replace entire file content:
```ts
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

export { gsap, ScrollTrigger, SplitText };
```

- [ ] **Step 3: Verify no TypeScript errors**

Run: `npx tsc --noEmit`
Expected: 0 errors (GSAP 3.14 ships SplitText types in `gsap/SplitText`)

- [ ] **Step 4: Commit**

```bash
git add lib/gsap.ts
git commit -m "feat: register SplitText plugin in gsap module"
```

---

### Task 2: HeroSection — SplitText Reveal + Scroll Parallax

**Files:**
- Modify: `components/sections/HeroSection.tsx`

**Interfaces:**
- Consumes: `gsap`, `ScrollTrigger`, `SplitText` from `@/lib/gsap`; `usePrefersReducedMotion` from `@/components/utils/usePrefersReducedMotion`

**Context — current file state (`components/sections/HeroSection.tsx`):**
- Two `motion.div` wrappers: left column (text) with `initial/animate`, right column (portrait) with `initial/animate`
- `<h1>` with "Building\n<span>With Intent.</span>"
- Section has `className="... overflow-hidden"` — must remove `overflow-hidden` for parallax
- No GSAP at all

- [ ] **Step 1: Write the full rewritten component**

Replace the entire file with:
```tsx
"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import hansImg from "@/app/assets/myImages/hans.webp";
import hansImg2 from "@/app/assets/myImages/hans2.webp";
import { useClientReady } from "@/components/utils/useClientReady";
import { usePrefersReducedMotion } from "@/components/utils/usePrefersReducedMotion";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";

type SplitTextInstance = InstanceType<typeof SplitText>;

export default function HeroSection({ id }: { id: string }) {
  const { resolvedTheme } = useTheme();
  const isClient = useClientReady();
  const currentImage = isClient && resolvedTheme === "dark" ? hansImg : hansImg2;
  const reducedMotion = usePrefersReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const portraitColRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isClient) return;

    if (reducedMotion) {
      if (headingRef.current) gsap.set(headingRef.current, { opacity: 1 });
      if (paragraphRef.current) gsap.set(paragraphRef.current, { opacity: 1 });
      return;
    }

    let animSplit: SplitTextInstance | null = null;
    let rafId = 0;

    const ctx = gsap.context(() => {
      document.fonts.ready.then(() => {
        if (!headingRef.current || !paragraphRef.current) return;

        const isFirstVisit = !sessionStorage.getItem("hasVisited");
        const delay = isFirstVisit ? 3.5 : 0.2;

        animSplit = new SplitText(headingRef.current, { type: "chars" });

        const tl = gsap.timeline({ delay });
        tl.from(animSplit.chars, {
          y: 60,
          opacity: 0,
          rotationX: -90,
          stagger: 0.025,
          duration: 0.6,
          ease: "back.out(1.4)",
          onComplete: () => {
            animSplit?.revert();
            animSplit = null;
          },
        });
        tl.from(
          paragraphRef.current,
          { y: 20, opacity: 0, duration: 0.8, ease: "power2.out" },
          "-=0.2"
        );

        // Parallax: portrait column moves up at 40% scroll speed
        if (sectionRef.current && portraitColRef.current) {
          ScrollTrigger.create({
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
            onUpdate: (self) => {
              gsap.set(portraitColRef.current, { y: -80 * self.progress });
            },
          });
        }
      });
    });

    // Debounced resize: if split still active during resize, revert + restore visible state
    const onResize = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (animSplit) {
          animSplit.revert();
          animSplit = null;
        }
        if (headingRef.current) gsap.set(headingRef.current, { clearProps: "all" });
      });
    };
    window.addEventListener("resize", onResize);

    return () => {
      ctx.revert();
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafId);
    };
  }, [isClient, reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id={id}
      className="relative flex min-h-screen items-center justify-center px-6 pt-20"
    >
      <div className="relative z-10 mx-auto w-full max-w-[1400px] flex flex-col lg:grid lg:grid-cols-12 lg:gap-8 items-center">
        <div className="lg:col-span-7">
          <p className="mb-6 font-bold text-xs uppercase tracking-[0.2em] text-primary">
            Hans Amoguis
          </p>
          <h1
            ref={headingRef}
            aria-label="Building With Intent."
            className="font-sans text-[clamp(3rem,8vw,8rem)] font-black leading-[0.85] tracking-tighter text-foreground"
          >
            Building
            <br />
            <span className="text-muted-foreground">With Intent.</span>
          </h1>
          <p
            ref={paragraphRef}
            className="mt-8 max-w-xl text-lg md:text-xl text-muted-foreground leading-relaxed"
          >
            I build maintainable systems with proper architecture, modular
            implementation, and good user experience. A Full-stack architect
            &amp; AI product engineer focused on providing solutions that are not
            only functional but also intuitive and scalable.
          </p>
        </div>

        <div ref={portraitColRef} className="lg:col-span-5 w-full mt-12 lg:mt-0">
          <div className="group relative mx-auto w-full max-w-md lg:max-w-none overflow-hidden">
            <Image
              src={currentImage}
              alt="Hanseo portrait"
              className="block w-full object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
            <div className="absolute bottom-0 w-full bg-background/80 px-4 py-3 text-center backdrop-blur">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-foreground">
                Hanseo
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

Key changes from the original:
- Removed `overflow-hidden` from the section (was clipping parallax travel)
- Replaced both `motion.div` wrappers with plain `div`
- Added `ref` on `h1`, paragraph `<p>`, portrait column `<div>`, and section
- Added `aria-label="Building With Intent."` on h1
- `&amp;` replaces `&` in JSX text to be valid (was `&` before — fine either way)

- [ ] **Step 2: Verify TypeScript**

Run: `npx tsc --noEmit`
Expected: 0 errors

- [ ] **Step 3: Start dev server and visual check**

Run: `npm run dev`

Open http://localhost:3000

First visit checks (clear sessionStorage first via DevTools → Application → Session Storage → Clear):
- [ ] Page shows preloader for ~2.5s
- [ ] After preloader fades, H1 "Building / With Intent." chars animate in with 3D flip stagger
- [ ] Subtitle paragraph fades in after heading
- [ ] Scrolling down: portrait moves upward at ~40% of scroll speed (parallax)
- [ ] No clipping of portrait during scroll

Returning visit checks (sessionStorage has `hasVisited = "true"`):
- [ ] Chars animation fires almost immediately (0.2s delay)

Reduced motion check (DevTools → Rendering → Emulate prefers-reduced-motion: reduce):
- [ ] Heading and paragraph are immediately visible, no animation

- [ ] **Step 4: Commit**

```bash
git add components/sections/HeroSection.tsx
git commit -m "feat: add GSAP SplitText hero reveal and scroll parallax on portrait"
```

---

### Task 3: FeaturedProjectsSection — Desktop Horizontal Scroll Pin

**Files:**
- Modify: `components/sections/FeaturedProjectsSection.tsx`

**Interfaces:**
- Consumes: `gsap`, `ScrollTrigger` from `@/lib/gsap`; `usePrefersReducedMotion` from `@/components/utils/usePrefersReducedMotion`; `useClientReady` from `@/components/utils/useClientReady`
- Produces: ScrollTrigger ID `"projects-horizontal"` (referenced by ChapterNav in Part 2)

**Context — current file state:**
- Framer Motion `containerVariants` + `itemVariants` used for vertical grid animation
- Grid: `grid-cols-1 gap-12 lg:grid-cols-3`
- Each card: `aspect-[4/5]` image + metadata below
- No horizontal scroll, no viewport detection

**Desktop horizontal mode target:**
- Section is `h-screen overflow-hidden` when pinned
- Header ("Projects / View All") stays above the track, visible throughout
- Track div: `flex` row, translates left as user scrolls
- Each card: `w-[85vw] h-full` — image top 65%, metadata bottom 35%
- Total scroll distance: `(cards - 1) × 85vw` = `2 × 85vw`

- [ ] **Step 1: Write the full rewritten component**

Replace the entire file with:
```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { projects } from "@/lib/projects";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useClientReady } from "@/components/utils/useClientReady";
import { usePrefersReducedMotion } from "@/components/utils/usePrefersReducedMotion";

const FEATURED = projects.slice(0, 3);
const CARD_VW = 0.85; // 85vw per card

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function FeaturedProjectsSection({ id }: { id: string }) {
  const isClient = useClientReady();
  const reducedMotion = usePrefersReducedMotion();
  const [isDesktop, setIsDesktop] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const activeIdxRef = useRef(0);

  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Viewport detection
  useEffect(() => {
    if (!isClient) return;
    let rafId = 0;
    const check = () => setIsDesktop(window.innerWidth >= 1240);
    check();
    const onResize = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(check);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafId);
    };
  }, [isClient]);

  const useHorizontalMode = isDesktop && !reducedMotion;

  // GSAP horizontal scroll pin
  useEffect(() => {
    if (!isClient || !useHorizontalMode) return;
    if (!sectionRef.current || !trackRef.current) return;

    const ctx = gsap.context(() => {
      const useSnap = window.innerHeight >= 860;

      gsap.to(trackRef.current, {
        x: () => -(FEATURED.length - 1) * window.innerWidth * CARD_VW,
        ease: "none",
        scrollTrigger: {
          id: "projects-horizontal",
          trigger: sectionRef.current,
          pin: true,
          scrub: 1.2,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          start: "top top",
          end: () =>
            `+=${(FEATURED.length - 1) * window.innerWidth * CARD_VW}`,
          snap: useSnap
            ? {
                snapTo: 1 / (FEATURED.length - 1),
                duration: { min: 0.18, max: 0.42 },
                delay: 0.05,
                ease: "power2.inOut",
              }
            : false,
          onUpdate: (self) => {
            const newIdx = Math.round(
              self.progress * (FEATURED.length - 1)
            );
            if (activeIdxRef.current !== newIdx) {
              activeIdxRef.current = newIdx;
              setActiveCardIndex(newIdx);
            }
          },
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [isClient, useHorizontalMode]);

  if (!isClient) {
    // SSR: render vertical layout to avoid hydration mismatch
    return (
      <section id={id} className="relative min-h-screen px-6 py-32">
        <div className="mx-auto w-full max-w-[1400px]">
          <div className="mb-20 flex items-end justify-between border-b border-border pb-8">
            <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-black leading-none tracking-tighter text-foreground">
              Projects
            </h2>
            <Link
              href="/projects"
              className="group flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
            >
              <span>View All</span>
              <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {FEATURED.map((project, idx) => (
              <VerticalCard key={project.title} project={project} idx={idx} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id={id}
      className={
        useHorizontalMode
          ? "relative h-screen overflow-hidden"
          : "relative min-h-screen px-6 py-32"
      }
    >
      {/* Header — stays visible above track during horizontal pin */}
      <div
        className={`flex items-end justify-between border-b border-border ${
          useHorizontalMode
            ? "px-6 pt-10 pb-6"
            : "mx-auto w-full max-w-[1400px] mb-20 pb-8"
        }`}
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
          className="text-[clamp(2.5rem,5vw,4rem)] font-black leading-none tracking-tighter text-foreground"
        >
          Projects
        </motion.h2>
        <Link
          href="/projects"
          className="group flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
        >
          <span>View All</span>
          <ArrowUpRight
            size={16}
            className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
          />
        </Link>
      </div>

      {useHorizontalMode ? (
        /* Horizontal track */
        <div ref={trackRef} className="flex h-[calc(100%-5.5rem)]">
          {FEATURED.map((project, idx) => (
            <Link
              key={project.title}
              href={`/projects/${project.slug}`}
              className="group relative flex-shrink-0 w-[85vw] h-full block"
              aria-hidden={activeCardIndex !== idx ? true : undefined}
              tabIndex={activeCardIndex !== idx ? -1 : 0}
            >
              <div className="relative h-[65%] overflow-hidden">
                <Image
                  src={project.heroImage}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-primary/0 transition-colors duration-500 group-hover:bg-primary/5" />
              </div>
              <div className="h-[35%] flex flex-col justify-center px-8 gap-3">
                <span className="font-bold text-xs uppercase tracking-[0.2em] text-muted-foreground/80">
                  <span className="font-mono mr-2">
                    0{idx + 1} {"//"}
                  </span>{" "}
                  {project.subtitle.substring(0, 40)}
                  {project.subtitle.length > 40 ? "..." : ""}
                </span>
                <h3 className="text-3xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary flex items-center gap-2">
                  {project.title}
                  <ArrowUpRight
                    size={20}
                    className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </h3>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        /* Vertical fallback — original Framer Motion grid */
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mx-auto w-full max-w-[1400px] grid grid-cols-1 gap-12 lg:grid-cols-3"
        >
          {FEATURED.map((project, idx) => (
            <motion.div variants={itemVariants} key={project.title}>
              <VerticalCard project={project} idx={idx} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
}

function VerticalCard({
  project,
  idx,
}: {
  project: (typeof FEATURED)[number];
  idx: number;
}) {
  return (
    <Link href={`/projects/${project.slug}`} className="group block">
      <div className="aspect-[4/5] w-full overflow-hidden relative">
        <Image
          src={project.heroImage}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-primary/0 transition-colors duration-500 group-hover:bg-primary/5" />
      </div>
      <div className="mt-6 flex flex-col gap-2">
        <span className="font-bold text-xs uppercase tracking-[0.2em] text-muted-foreground/80">
          <span className="font-mono mr-2">0{idx + 1} {"//"}</span>{" "}
          {project.subtitle.substring(0, 40)}
          {project.subtitle.length > 40 ? "..." : ""}
        </span>
        <h3 className="text-2xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
          {project.title}
        </h3>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

Run: `npx tsc --noEmit`
Expected: 0 errors

- [ ] **Step 3: Visual check — horizontal mode (desktop ≥ 1240px)**

Start dev server: `npm run dev`
Open http://localhost:3000 on a window ≥ 1240px wide.

- [ ] Section pins when "Projects" header reaches top of viewport
- [ ] Scrolling moves the three cards horizontally (each card ~85vw wide)
- [ ] Cards snap between positions on scroll release
- [ ] "Projects / View All" header stays visible above the cards during entire scroll
- [ ] Active card's Link is focusable (tabIndex 0); off-screen cards have tabIndex -1
- [ ] Pin spacer added by GSAP so the page continues after the section

- [ ] **Step 4: Visual check — vertical fallback (viewport < 1240px or reduced motion)**

- [ ] Resize window below 1240px → vertical 3-column grid with Framer fade-in
- [ ] Reduced motion emulation → vertical grid renders, no GSAP pin

- [ ] **Step 5: Commit**

```bash
git add components/sections/FeaturedProjectsSection.tsx
git commit -m "feat: add GSAP horizontal scroll pin for FeaturedProjects on desktop"
```

---

## Self-Review

**Spec coverage:**
- [x] Task 1: SplitText char-by-char reveal (Task 2)
- [x] Scroll parallax on portrait (Task 2)
- [x] Preloader coordination via `sessionStorage.hasVisited` (Task 2)
- [x] Font loading guard via `document.fonts.ready` (Task 2)
- [x] Resize handler with debounce (Task 2)
- [x] `aria-label` on h1 (Task 2)
- [x] Reduced motion guards on Hero (Task 2)
- [x] Horizontal scroll pin with snap (Task 3)
- [x] 85vw cards, `h-screen` height (Task 3)
- [x] Header above track, stays pinned (Task 3)
- [x] `activeCardIndex` aria-hidden on off-screen cards (Task 3)
- [x] Short-height guard: no snap if `innerHeight < 860` (Task 3)
- [x] ScrollTrigger ID `"projects-horizontal"` (Task 3)
- [x] Vertical fallback below 1240px (Task 3)
- [x] `ctx.revert()` cleanup in all effects (Tasks 2, 3)

**No gaps found.**

**Placeholder scan:** No TODOs, TBDs, or "similar to above" references present.

**Type consistency:**
- `FEATURED` used consistently across both JSX branches and GSAP effect
- `activeCardIndex` / `activeIdxRef` updated together atomically
- `SplitTextInstance` type alias used for the mutable ref variable
