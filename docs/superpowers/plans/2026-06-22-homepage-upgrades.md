# Portfolio Homepage Upgrades — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a TechStackSection between Philosophy and Projects, extend Philosophy to 3 principles, and update the Experience section with specific project descriptions.

**Architecture:** Self-contained component additions and targeted edits to existing sections. Ticker animation uses pure CSS keyframes in globals.css — no new dependencies. ChapterNav gains one entry ("stack") and existing work/trajectory entries are renumbered 04/05.

**Tech Stack:** Next.js App Router, Tailwind CSS v4, GSAP ScrollTrigger (existing), CSS keyframe animation

## Global Constraints

- All section components are `"use client"` (existing pattern)
- Use `@/` alias for all imports (project convention)
- Badge pill style (match existing in ProjectBrief): `rounded-none border border-border px-3 py-1 font-bold text-[10px] uppercase tracking-[0.2em] text-foreground/80`
- Category label style: `font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60`
- Section max-width wrapper: `mx-auto w-full max-w-[1400px] px-6`
- Philosophy principle label style (existing): `font-bold text-xs uppercase tracking-[0.2em] text-muted-foreground/80`

---

### Task 1: TechStackSection component + ticker CSS

**Files:**
- Create: `components/sections/TechStackSection.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Produces: `default export TechStackSection({ id }: { id: string })` — consumed by Task 2

- [ ] **Step 1: Add ticker keyframe to globals.css**

In `app/globals.css`, append after the final `.scrollbar-live::-webkit-scrollbar-thumb:hover` block:

```css
@keyframes ticker {
  to { transform: translateX(-50%); }
}

.ticker-track {
  animation: ticker linear infinite;
}

@media (prefers-reduced-motion: reduce) {
  .ticker-track {
    animation-play-state: paused;
  }
}
```

How it works: the ticker track contains two copies of the item list. The animation moves the track by -50% (exactly one full copy width), then loops — seamless with no JS.

- [ ] **Step 2: Create TechStackSection.tsx**

Create `components/sections/TechStackSection.tsx`:

```tsx
"use client";

const categories = [
  {
    label: "Build",
    items: [
      "React", "Next.js", "TypeScript", "Python",
      "Django REST Framework", "PostgreSQL", "Tailwind CSS",
      "Shadcn/ui", "Zustand", "Tanstack Query", "Tanstack Router",
    ],
    duration: "30s",
  },
  {
    label: "Augment",
    items: ["Claude Code", "Codex", "Gemini CLI", "OpenCode", "Playwright", "Cursor"],
    duration: "40s",
  },
  {
    label: "Deploy",
    items: ["Vercel", "Supabase", "Firebase", "Cloudinary", "Brevo"],
    duration: "25s",
  },
];

export default function TechStackSection({ id }: { id: string }) {
  return (
    <section id={id} className="relative py-24 overflow-hidden border-y border-border">
      <div className="mx-auto w-full max-w-[1400px] px-6 mb-16">
        <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-black leading-none tracking-tighter text-foreground">
          Stack
        </h2>
      </div>

      {/* Desktop md+: scrolling tickers */}
      <div className="hidden md:flex flex-col gap-8">
        {categories.map((cat) => (
          <div key={cat.label}>
            <p className="px-6 mb-3 font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60">
              {cat.label}
            </p>
            <div className="overflow-hidden">
              <div
                className="ticker-track flex min-w-max gap-8"
                style={{ animationDuration: cat.duration }}
              >
                {[...cat.items, ...cat.items].map((item, i) => (
                  <span key={i} className="font-bold text-sm uppercase tracking-[0.15em] text-foreground/80">
                    {item}
                    <span className="text-primary/40 mx-3" aria-hidden="true">/</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile below md: badge grid */}
      <div className="md:hidden px-6 flex flex-col gap-10">
        {categories.map((cat) => (
          <div key={cat.label}>
            <p className="mb-3 font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60">
              {cat.label}
            </p>
            <ul className="flex flex-wrap gap-2">
              {cat.items.map((item) => (
                <li
                  key={item}
                  className="rounded-none border border-border px-3 py-1 font-bold text-[10px] uppercase tracking-[0.2em] text-foreground/80"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
```

Note: `text-foreground/80` used instead of the spec's `text-foreground/70` — stronger contrast on light (white) backgrounds.

- [ ] **Step 3: Verify TypeScript**

Run: `npx tsc --noEmit`
Expected: no errors on the new file.

- [ ] **Step 4: Commit**

```bash
git add components/sections/TechStackSection.tsx app/globals.css
git commit -m "feat: add TechStackSection with CSS ticker animation"
```

---

### Task 2: Wire TechStackSection into homepage + update ChapterNav

**Files:**
- Modify: `app/page.tsx`
- Modify: `components/layout/ChapterNav.tsx`

**Interfaces:**
- Consumes: `TechStackSection` from `@/components/sections/TechStackSection` (Task 1)

- [ ] **Step 1: Update ChapterNav chapters array**

In `components/layout/ChapterNav.tsx`, replace the `chapters` array (lines 13–18):

```ts
const chapters: Chapter[] = [
  { id: "identity", title: "Identity", number: "01" },
  { id: "approach", title: "Approach", number: "02" },
  { id: "stack", title: "Stack", number: "03" },
  { id: "work", title: "Selected Work", number: "04" },
  { id: "trajectory", title: "Trajectory", number: "05" },
];
```

- [ ] **Step 2: Add TechStackSection to app/page.tsx**

Add import at top with other section imports:
```tsx
import TechStackSection from "@/components/sections/TechStackSection";
```

In the JSX, insert `<TechStackSection id="stack" />` between PhilosophySection and FeaturedProjectsSection:

```tsx
<HeroSection id="identity" />
<PhilosophySection id="approach" />
<TechStackSection id="stack" />
<FeaturedProjectsSection id="work" />
<ExperienceSnapshotSection id="trajectory" />
<LiveActivity />
```

- [ ] **Step 3: Verify in browser**

Run `npm run dev` and check:
- Ticker rows scroll at different speeds on desktop (≥ md breakpoint)
- Mobile (< md): badge grid renders for all 3 categories
- ChapterNav shows 5 entries (01–05); "Stack" activates when the section is in view
- DevTools: set `prefers-reduced-motion: reduce` — confirm `animation-play-state: paused` on `.ticker-track`

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx components/layout/ChapterNav.tsx
git commit -m "feat: wire TechStackSection into homepage, update ChapterNav to 5 chapters"
```

---

### Task 3: PhilosophySection — 3rd principle + GSAP timeline extension

**Files:**
- Modify: `components/sections/PhilosophySection.tsx`

**Interfaces:**
- No new interfaces — self-contained modification

- [ ] **Step 1: Replace PhilosophySection.tsx**

Replace the entire file:

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
            <div ref={principle01Ref}>
              <h3 className="mb-4 font-bold text-xs uppercase tracking-[0.2em] text-muted-foreground/80">
                <span className="font-mono mr-2">01 /</span>Architecture
              </h3>
              <p className="text-xl text-muted-foreground">
                I design the system before I write the code. Clear structure upfront means less firefighting later.
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
                I build interfaces that work on any device, backed by APIs that hold up under real usage.
              </p>
            </div>

            <div
              ref={divider02Ref}
              className="h-px w-full bg-border"
              style={{ transformOrigin: "left" }}
            />

            <div ref={principle03Ref}>
              <h3 className="mb-4 font-bold text-xs uppercase tracking-[0.2em] text-muted-foreground/80">
                <span className="font-mono mr-2">03 /</span>Intelligence
              </h3>
              <p className="text-xl text-muted-foreground">
                I treat AI as a system concern. Quota management, usage windows, and evaluation logic are designed in from the start, not added when things break.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify in browser**

Run `npm run dev` on a desktop viewport (≥ 1024px) and scroll through the Philosophy section:
- Principle 01 fades in first, then divider01 expands, then principle 02, then divider02, then principle 03
- All 3 dividers animate left-to-right (check `transformOrigin: "left"` is on both)
- Mobile (< 1024px): all 3 principles visible immediately, no scroll pin
- `prefers-reduced-motion`: all 3 principles visible immediately with no animation

- [ ] **Step 3: Commit**

```bash
git add components/sections/PhilosophySection.tsx
git commit -m "feat: add 3rd philosophy principle with extended GSAP scroll timeline"
```

---

### Task 4: ExperienceSnapshotSection — update freelance entry text

**Files:**
- Modify: `components/sections/ExperienceSnapshotSection.tsx`

**Interfaces:**
- No new interfaces — targeted text replacement only

- [ ] **Step 1: Replace freelance entry body paragraph**

In `components/sections/ExperienceSnapshotSection.tsx`, in Entry 2 (the Freelance block, lines 122–135), replace the `<p>` content:

Old:
```tsx
<p className="text-lg text-muted-foreground leading-relaxed">
  Built full-stack web applications using Next.js, React,
  PostgreSQL, and Django with a focus on robust architecture and
  scalable features.
</p>
```

New:
```tsx
<p className="text-lg text-muted-foreground leading-relaxed">
  Built The Podium for HCDC's VPAA, a seminar tracking platform with QR attendance, certificate generation, and email notifications. Also built HCDC LFMS, a lost and found platform with real-time claims, moderation, and role-based access control.
</p>
```

- [ ] **Step 2: Verify visually**

Run dev server. Scroll to Experience section in both light and dark mode. Confirm new text renders correctly and the GSAP scroll animation (entry slides in on scroll) still works.

- [ ] **Step 3: Commit**

```bash
git add components/sections/ExperienceSnapshotSection.tsx
git commit -m "chore: update freelance experience entry with specific project names"
```
