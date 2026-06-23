# Mobile Experience Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix 7 mobile-experience issues across 5 components — replace GSAP with Framer Motion for mobile entry animations, remove hover-only grayscale on touch devices, polish badge styles, and fix gallery image cropping.

**Architecture:** All changes are isolated to individual component files. Mobile detection uses the existing `getRuntimeEnv()` / `useClientReady()` pattern from `Hero.tsx`. No new dependencies.

**Tech Stack:** Next.js, React 19, TypeScript, Framer Motion, GSAP, Tailwind CSS v4

## Global Constraints

- Package manager: `npm` — never pnpm/yarn/bun
- No new npm dependencies
- Tailwind v4: no `tailwind.config.js`, config lives in CSS/postcss
- Never mix Framer Motion and GSAP on the same element
- Always respect `prefers-reduced-motion` in any animation
- "Passing" = `npm run lint` exits 0 AND `npm run build` exits 0 AND feature works visually in browser

---

## File Map

| File | Change |
|------|--------|
| `components/sections/HeroSection.tsx` | Add `isMobile`; skip GSAP + use FM on mobile |
| `components/sections/PhilosophySection.tsx` | Add `isMobile`; add FM `whileInView` on mobile |
| `components/sections/live-activity/SpotifyActivityCard.tsx` | Add `isMobile`; conditional grayscale |
| `components/sections/live-activity/DiscordStatusCard.tsx` | Add `isMobile`; conditional grayscale |
| `components/sections/TechStackSection.tsx` | Badge fill + divider + FM entry on mobile |
| `components/projects/ProjectBrief.tsx` | Badge fill on Stack + Integrations lists |
| `components/projects/ProjectGallery.tsx` | `object-cover` → `object-contain` |

---

## Task 1: HeroSection — skip GSAP on mobile, use Framer Motion

**Files:**
- Modify: `components/sections/HeroSection.tsx`

**What this task does:** Detects mobile via `getRuntimeEnv()`. On mobile: skips GSAP SplitText entirely, wraps `<h1>` and `<p>` in `motion.h1` / `motion.p` with fade+slide entry. Preserves the 3.5s first-visit delay (matching the existing GSAP timeline delay). Desktop GSAP path is unchanged.

- [ ] **Step 1: Update `HeroSection.tsx`**

Replace the entire file with:

```tsx
"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import hansImg from "@/app/assets/myImages/hans.webp";
import hansImg2 from "@/app/assets/myImages/hans2.webp";
import { useClientReady } from "@/components/utils/useClientReady";
import { usePrefersReducedMotion } from "@/components/utils/usePrefersReducedMotion";
import { getRuntimeEnv } from "@/components/utils/browserInfo";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";
import { motionTokens } from "@/lib/motion";
import ConnectModal from "@/components/dialogs/ConnectModal";

type SplitTextInstance = InstanceType<typeof SplitText>;

export default function HeroSection({ id }: { id: string }) {
  const { resolvedTheme } = useTheme();
  const isClient = useClientReady();
  const currentImage = isClient && resolvedTheme === "dark" ? hansImg : hansImg2;
  const reducedMotion = usePrefersReducedMotion();
  const runtimeEnv = isClient ? getRuntimeEnv() : { isMobile: false, isWebView: false };
  const isMobile = runtimeEnv.isMobile;
  const isFirstVisit = isClient ? !sessionStorage.getItem("hasVisited") : false;
  const mobileEntryDelay = isFirstVisit ? 3.5 : 0;

  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const portraitColRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isClient) return;
    if (isMobile) return; // FM handles mobile; skip GSAP

    if (reducedMotion) {
      if (headingRef.current) gsap.set(headingRef.current, { opacity: 1 });
      if (paragraphRef.current) gsap.set(paragraphRef.current, { opacity: 1 });
      return;
    }

    let animSplit: SplitTextInstance | null = null;
    let rafId = 0;

    const ctx = gsap.context(() => {
      // ponytail: ctx.add() inside .then() so async animations are tracked and ctx.revert() cleans them up
      document.fonts.ready.then(() => {
        ctx.add(() => {
          if (!headingRef.current || !paragraphRef.current) return;

          const isFirstVisitGsap = !sessionStorage.getItem("hasVisited");

          if (isFirstVisitGsap) {
            animSplit = new SplitText(headingRef.current, { type: "chars" });
            gsap.set(paragraphRef.current, { opacity: 0, y: 20 });
            const tl = gsap.timeline({ delay: 3.5 });
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
            tl.to(
              paragraphRef.current,
              { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
              "-=0.2"
            );
          }

          if (sectionRef.current && portraitColRef.current && window.innerWidth >= 1024) {
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
    });

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
  }, [isClient, reducedMotion, isMobile]);

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

          {isMobile ? (
            <motion.h1
              ref={headingRef}
              aria-label="Building With Intent."
              initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                ease: motionTokens.framerEase.enter,
                delay: reducedMotion ? 0 : mobileEntryDelay,
              }}
              className="font-sans text-[clamp(3rem,8vw,8rem)] font-black leading-[0.85] tracking-tighter text-foreground"
            >
              Building
              <br />
              <span className="text-muted-foreground">With Intent.</span>
            </motion.h1>
          ) : (
            <h1
              ref={headingRef}
              aria-label="Building With Intent."
              className="font-sans text-[clamp(3rem,8vw,8rem)] font-black leading-[0.85] tracking-tighter text-foreground"
            >
              Building
              <br />
              <span className="text-muted-foreground">With Intent.</span>
            </h1>
          )}

          {isMobile ? (
            <motion.p
              ref={paragraphRef}
              initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                ease: motionTokens.framerEase.enter,
                delay: reducedMotion ? 0 : mobileEntryDelay + 0.2,
              }}
              className="mt-8 max-w-xl text-lg md:text-xl text-muted-foreground leading-relaxed"
            >
              I build maintainable systems with proper architecture, modular
              implementation, and good user experience. A Full-stack architect
              &amp; AI product engineer focused on providing solutions that are not
              only functional but also intuitive and scalable.
            </motion.p>
          ) : (
            <p
              ref={paragraphRef}
              className="mt-8 max-w-xl text-lg md:text-xl text-muted-foreground leading-relaxed"
            >
              I build maintainable systems with proper architecture, modular
              implementation, and good user experience. A Full-stack architect
              &amp; AI product engineer focused on providing solutions that are not
              only functional but also intuitive and scalable.
            </p>
          )}

          <ConnectModal>
            <button className="mt-8 inline-flex items-center gap-2 bg-primary px-6 py-3 font-mono text-sm uppercase tracking-widest text-background transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              Let&apos;s Connect
            </button>
          </ConnectModal>
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

- [ ] **Step 2: Lint + build**

```bash
npm run lint && npm run build
```

Expected: both exit 0, no TypeScript errors.

- [ ] **Step 3: Visual check**

Start `npm run dev`, open on a mobile device or DevTools mobile viewport (e.g. iPhone 12 Pro). On first visit:
- Heading and paragraph should fade + slide up after ~3.5s
- On a return visit (sessionStorage has `hasVisited`): immediate fade-in
- Desktop: GSAP SplitText animation unchanged

- [ ] **Step 4: Commit**

```bash
git add components/sections/HeroSection.tsx
git commit -m "feat: use framer motion for hero entry animation on mobile, skip gsap"
```

---

## Task 2: PhilosophySection — Framer Motion entry animations on mobile

**Files:**
- Modify: `components/sections/PhilosophySection.tsx`

**What this task does:** Adds `isMobile` detection. Converts the five principle/divider `<div>` elements to `motion.div`. On mobile (where GSAP is already skipped), adds `whileInView` stagger entry animations. On desktop, the motion divs have no extra FM props so GSAP continues to control them unchanged.

- [ ] **Step 1: Update `PhilosophySection.tsx`**

Replace the entire file with:

```tsx
"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/components/utils/usePrefersReducedMotion";
import { useClientReady } from "@/components/utils/useClientReady";
import { getRuntimeEnv } from "@/components/utils/browserInfo";
import { motionTokens } from "@/lib/motion";

export default function PhilosophySection({ id }: { id: string }) {
  const reducedMotion = usePrefersReducedMotion();
  const isClient = useClientReady();
  const runtimeEnv = isClient ? getRuntimeEnv() : { isMobile: false, isWebView: false };
  const isMobile = runtimeEnv.isMobile;

  const sectionRef = useRef<HTMLElement>(null);
  const principle01Ref = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const principle02Ref = useRef<HTMLDivElement>(null);
  const divider02Ref = useRef<HTMLDivElement>(null);
  const principle03Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion) return;
    if (window.innerWidth < 1024) return;
    if (
      !sectionRef.current ||
      !principle01Ref.current ||
      !dividerRef.current ||
      !principle02Ref.current ||
      !divider02Ref.current ||
      !principle03Ref.current
    )
      return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          start: "top top",
          end: "+=450vh",
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
      tl.fromTo(
        divider02Ref.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.2 },
        0.75
      );
      tl.fromTo(
        principle03Ref.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.35 },
        0.90
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  // Mobile FM entry props — only applied when isMobile and not reducedMotion
  const mobileEntry = (delayIndex: number) =>
    isMobile && !reducedMotion
      ? {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: {
            duration: motionTokens.duration.base,
            ease: motionTokens.framerEase.enter,
            delay: delayIndex * 0.12,
          },
        }
      : {};

  return (
    <section
      ref={sectionRef}
      id={id}
      className="relative flex min-h-screen items-center px-6 py-32"
    >
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-black leading-none tracking-tighter text-foreground">
              Design Systems, <br />
              <span className="text-primary">Then Ship Them.</span>
            </h2>
          </div>

          <div className="flex flex-col justify-center space-y-12 lg:col-span-6 lg:col-start-7">
            <motion.div ref={principle01Ref} {...mobileEntry(0)}>
              <h3 className="mb-4 font-bold text-xs uppercase tracking-[0.2em] text-muted-foreground/80">
                <span className="font-mono mr-2">01 /</span>Architecture
              </h3>
              <p className="text-xl text-muted-foreground">
                I design the system by creating PRDs, ADRs, and specs before I write the code. Clear structure upfront means less problems later.
              </p>
            </motion.div>

            <motion.div
              ref={dividerRef}
              className="h-px w-full bg-border"
              style={{ transformOrigin: "left" }}
              {...mobileEntry(1)}
            />

            <motion.div ref={principle02Ref} {...mobileEntry(2)}>
              <h3 className="mb-4 font-bold text-xs uppercase tracking-[0.2em] text-muted-foreground/80">
                <span className="font-mono mr-2">02 /</span>Execution
              </h3>
              <p className="text-xl text-muted-foreground">
                I make the most of my resources, combining with efficient workflows, and using AI as a multiplier to ship high-quality work faster. I focus on the right things, not just doing things right.
              </p>
            </motion.div>

            <motion.div
              ref={divider02Ref}
              className="h-px w-full bg-border"
              style={{ transformOrigin: "left" }}
              {...mobileEntry(3)}
            />

            <motion.div ref={principle03Ref} {...mobileEntry(4)}>
              <h3 className="mb-4 font-bold text-xs uppercase tracking-[0.2em] text-muted-foreground/80">
                <span className="font-mono mr-2">03 /</span>Workflows
              </h3>
              <p className="text-xl text-muted-foreground">
                Identifying problems, designing solutions, and shipping them to production is my favorite part. I love seeing my work in the hands of real users.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Lint + build**

```bash
npm run lint && npm run build
```

Expected: exit 0.

- [ ] **Step 3: Visual check**

On mobile viewport: scroll to Philosophy section — each principle should fade+slide in sequentially. Desktop: pinned GSAP scroll animation unchanged.

- [ ] **Step 4: Commit**

```bash
git add components/sections/PhilosophySection.tsx
git commit -m "feat: add framer motion whileInView entry for philosophy principles on mobile"
```

---

## Task 3: Grayscale fixes — Spotify + Discord cards

**Files:**
- Modify: `components/sections/live-activity/SpotifyActivityCard.tsx`
- Modify: `components/sections/live-activity/DiscordStatusCard.tsx`

**What this task does:** Adds `isMobile` detection to both live-activity cards. Conditionally applies `grayscale group-hover:grayscale-0` / `grayscale hover:grayscale-0` only on non-mobile devices, where hover actually works.

- [ ] **Step 1: Update `SpotifyActivityCard.tsx`**

Add these two imports at the top (after the existing imports):

```tsx
import { useClientReady } from "@/components/utils/useClientReady";
import { getRuntimeEnv } from "@/components/utils/browserInfo";
```

Add these two lines inside the component body, right after the `const data = payload?.data;` line:

```tsx
const isClient = useClientReady();
const isMobile = isClient ? getRuntimeEnv().isMobile : false;
```

Then make these three targeted className changes:

**Now-playing artwork** (the `<img>` inside the `<a href={data.nowPlaying.trackUrl}...>` block):
```tsx
// Before:
className="h-16 w-16 shrink-0 object-cover grayscale transition-all duration-500 group-hover:grayscale-0"

// After:
className={`h-16 w-16 shrink-0 object-cover transition-all duration-500${!isMobile ? " grayscale group-hover:grayscale-0" : ""}`}
```

**Top Tracks modal images** (inside `HorizontalRail title="Top Tracks"`):
```tsx
// Before:
className="h-36 w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0"

// After:
className={`h-36 w-full object-cover transition-all duration-500${!isMobile ? " grayscale group-hover:grayscale-0" : ""}`}
```

**Top Artists modal images** (inside `HorizontalRail title="Top Artists"`):
```tsx
// Before:
className="h-36 w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0"

// After:
className={`h-36 w-full object-cover transition-all duration-500${!isMobile ? " grayscale group-hover:grayscale-0" : ""}`}
```

- [ ] **Step 2: Update `DiscordStatusCard.tsx`**

Add these two imports at the top (after the existing imports):

```tsx
import { useClientReady } from "@/components/utils/useClientReady";
import { getRuntimeEnv } from "@/components/utils/browserInfo";
```

Add these two lines inside the component body, right after `const data = payload?.data;` and `const spotifyHasLink = ...`:

```tsx
const isClient = useClientReady();
const isMobile = isClient ? getRuntimeEnv().isMobile : false;
```

Then make these four targeted className changes:

**User avatar** (the `<img src={data.user.avatarUrl}...>`):
```tsx
// Before:
className="h-14 w-14 shrink-0 object-cover grayscale transition-all duration-500 hover:grayscale-0"

// After:
className={`h-14 w-14 shrink-0 object-cover transition-all duration-500${!isMobile ? " grayscale hover:grayscale-0" : ""}`}
```

**Discord Spotify album art** (the `<img src={data.live.spotify.albumArtUrl}...>`):
```tsx
// Before:
className="h-12 w-12 shrink-0 object-cover grayscale transition-all duration-500 hover:grayscale-0"

// After:
className={`h-12 w-12 shrink-0 object-cover transition-all duration-500${!isMobile ? " grayscale hover:grayscale-0" : ""}`}
```

**Gaming image** (the `<img src={data.live.gaming.imageUrl}...>`):
```tsx
// Before:
className="h-12 w-12 shrink-0 object-cover grayscale transition-all duration-500 hover:grayscale-0"

// After:
className={`h-12 w-12 shrink-0 object-cover transition-all duration-500${!isMobile ? " grayscale hover:grayscale-0" : ""}`}
```

**Other activities images** (the `<img src={activity.imageUrl}...>`):
```tsx
// Before:
className="h-12 w-12 shrink-0 object-cover grayscale transition-all duration-500 hover:grayscale-0"

// After:
className={`h-12 w-12 shrink-0 object-cover transition-all duration-500${!isMobile ? " grayscale hover:grayscale-0" : ""}`}
```

- [ ] **Step 3: Lint + build**

```bash
npm run lint && npm run build
```

Expected: exit 0.

- [ ] **Step 4: Visual check**

On mobile viewport: open Live Activity section. All images (avatar, album art, etc.) should appear in full color, not grayscale. Desktop: images should still be grayscale and reveal color on hover.

Also open the Spotify "View details" dialog on mobile — top tracks and top artists images should be in color.

- [ ] **Step 5: Commit**

```bash
git add components/sections/live-activity/SpotifyActivityCard.tsx components/sections/live-activity/DiscordStatusCard.tsx
git commit -m "fix: show live activity images in color on mobile (no hover on touch)"
```

---

## Task 4: Badge polish — TechStack mobile + ProjectBrief

**Files:**
- Modify: `components/sections/TechStackSection.tsx`
- Modify: `components/projects/ProjectBrief.tsx`

**What this task does:** Adds `bg-foreground/5` fill to all tech/stack badges for visual depth. Adds a horizontal rule below each category label in TechStack mobile view. Adds Framer Motion stagger entry to TechStack mobile category groups.

- [ ] **Step 1: Update `TechStackSection.tsx`**

Replace the entire file with:

```tsx
"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/components/utils/usePrefersReducedMotion";
import { motionTokens } from "@/lib/motion";

const categories = [
  {
    label: "Build",
    items: [
      "React", "Next.js", "Langchain",
      "FastAPI", "PostgreSQL", "Tailwind CSS",
       "Zustand", "Tanstack Query", "Tanstack Router",
    ],
    duration: "50s",
  },
  {
    label: "Augment",
    items: ["Claude Code", "Codex", "Gemini CLI", "OpenCode", "Playwright CLI", "Github CLI", "Docker"],
    duration: "45s",
  },
  {
    label: "Deploy",
    items: ["Vercel", "Supabase", "Firebase", "Cloudinary", "Brevo", "Neon", "Render", "Railway", "Upstash", "Cloudflare", "Clerk", "Posthog", "Sentry"],
    duration: "65s",
  },
];

export default function TechStackSection({ id }: { id: string }) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section id={id} className="relative py-24 overflow-hidden border-y border-border">
      <div className="mx-auto w-full max-w-[1400px] px-6 mb-16">
        <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-black leading-none tracking-tighter text-foreground">
          Stack
        </h2>
      </div>

      {/* Desktop md+: scrolling tickers */}
      <div className="hidden md:flex flex-col gap-8">
        {categories.map((cat, index) => {
          const reverse = index % 2 !== 0;
          const trackClass = reverse ? "ticker-track-reverse" : "ticker-track";
          // ponytail: 4 copies so shortest row (Deploy ~750px) × 4 = 3000px > 2 × max-viewport
          const items = [...cat.items, ...cat.items, ...cat.items, ...cat.items];
          return (
            <div key={cat.label} className="ticker-row">
              <p className="px-6 mb-3 font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60">
                {cat.label}
              </p>
              <div className="overflow-hidden ticker-fade">
                <div
                  className={`${trackClass} flex min-w-max`}
                  style={{ animationDuration: cat.duration }}
                >
                  {/* ponytail: key={i} intentional — quadrupled array makes string keys collide */}
                  {items.map((item, i) => (
                    <span key={i} className="pr-8 font-bold text-sm uppercase tracking-[0.15em] text-foreground/80">
                      {item}
                      <span className="text-primary/40 ml-8" aria-hidden="true">/</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile below md: badge grid */}
      <div className="md:hidden px-6 flex flex-col gap-10">
        {categories.map((cat, index) => (
          <motion.div
            key={cat.label}
            initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: motionTokens.duration.base,
              ease: motionTokens.framerEase.enter,
              delay: index * 0.1,
            }}
          >
            <p className="mb-2 font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60">
              {cat.label}
            </p>
            <div className="h-px w-full bg-border mb-3" aria-hidden="true" />
            <ul className="flex flex-wrap gap-2">
              {cat.items.map((item) => (
                <li
                  key={item}
                  className="bg-foreground/5 rounded-none border border-border px-3 py-1 font-bold text-[10px] uppercase tracking-[0.2em] text-foreground/80"
                >
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Update badge classNames in `ProjectBrief.tsx`**

Two changes — both `<li>` elements in the badge lists:

**Stack list** (inside `<ul className="flex flex-wrap gap-2">` under "Stack" heading):
```tsx
// Before:
className="rounded-none border border-border px-3 py-1 font-bold text-[10px] uppercase tracking-[0.2em] text-foreground/80"

// After:
className="bg-foreground/5 rounded-none border border-border px-3 py-1 font-bold text-[10px] uppercase tracking-[0.2em] text-foreground/80"
```

**Integrations list** (inside `<ul className="flex flex-wrap gap-2">` under "Integrations & Services" heading):
```tsx
// Before:
className="rounded-none border border-border px-3 py-1 font-bold text-[10px] uppercase tracking-[0.2em] text-foreground/80"

// After:
className="bg-foreground/5 rounded-none border border-border px-3 py-1 font-bold text-[10px] uppercase tracking-[0.2em] text-foreground/80"
```

- [ ] **Step 3: Lint + build**

```bash
npm run lint && npm run build
```

Expected: exit 0.

- [ ] **Step 4: Visual check**

On mobile: scroll to Stack section. Each category group should fade+slide in as it enters the viewport. Badges should have a subtle fill background. A thin line should appear below each category label.

On a project slug page (e.g. `/projects/clarift`): Stack and Integrations badges should have the same subtle fill as the Stack section.

- [ ] **Step 5: Commit**

```bash
git add components/sections/TechStackSection.tsx components/projects/ProjectBrief.tsx
git commit -m "feat: polish badge style with fill, add dividers and mobile entry animation to stack section"
```

---

## Task 5: ProjectGallery — fix cropped/zoomed screenshots

**Files:**
- Modify: `components/projects/ProjectGallery.tsx`

**What this task does:** Changes `object-cover` to `object-contain` on gallery images so screenshots that aren't exactly 16:9 are shown in full without being cropped or zoomed.

- [ ] **Step 1: Update `ProjectGallery.tsx`**

Find the `<Image>` inside the gallery loop and change the single class:

```tsx
// Before:
className="object-cover"

// After:
className="object-contain"
```

The full `<Image>` tag after the change:
```tsx
<Image
  src={img}
  alt={`Project image ${i + 1}`}
  fill
  sizes="(max-width: 768px) 100vw, 900px"
  className="object-contain"
  priority={i === 0}
/>
```

- [ ] **Step 2: Lint + build**

```bash
npm run lint && npm run build
```

Expected: exit 0.

- [ ] **Step 3: Visual check**

Open any project slug page (`/projects/[slug]`) and scroll to Screenshots section. Images should display their full content without cropping. If screenshots are taller or wider than 16:9, they should be letterboxed within the aspect-video container rather than cropped.

- [ ] **Step 4: Commit**

```bash
git add components/projects/ProjectGallery.tsx
git commit -m "fix: use object-contain in project gallery to prevent screenshot cropping"
```
