# Implementation Plan

## Recommended Tech Approach
- **Framework:** Next.js 16 (App Router) + React 19.
- **Styling:** Tailwind CSS v4.
- **UI Primitives:** shadcn/ui for accessible base components (Buttons, Dialogs).
- **Animation Stack:** GSAP + ScrollTrigger + Lenis + Framer Motion (only if GSAP is overkill for micro-interactions).
- **Deployment:** Vercel (Current standard for Next.js).

## Component Breakdown
1. **Core Layout:**
   - `RootLayout` (Theme config, Lenis wrapper, Font loading).
   - `GlobalNav` (Sticky top bar).
   - `ChapterNav` (Scroll-tied side indicator).
   - `Footer`.
2. **Homepage Sections:**
   - `HeroSection` (Identity & hook).
   - `PhilosophySection` (Approach & mindset).
   - `FeaturedProjectsSection` (3 curated cards).
   - `ExperienceSnapshotSection` (Timeline summary).
3. **Subpages:**
   - `/projects/page.tsx` (Grid of all projects).
   - `/experience/page.tsx` (Detailed career history).
   - `/certificates/page.tsx` (Credential grid).
4. **UI Primitives:**
   - `MagneticButton` (Button with GSAP hover effect).
   - `ProjectCard` (Hover-scaling image, sharp borders).
   - `TechBadge` (Minimalist pill for skills).

## Build Phases

### Phase 1: Foundation & Design System (Complexity: Low)
- Setup Next.js, Tailwind v4, and fonts.
- Define global CSS variables for colors (Black + Ice Blue).
- Build base UI components (Typography, Buttons, Cards).

### Phase 2: Global Layout & Routing (Complexity: Low)
- Implement `GlobalNav` and `Footer`.
- Create placeholder pages for `/`, `/projects`, `/experience`, `/certificates`.
- Setup Lenis for smooth scrolling.

### Phase 3: Homepage Architecture (Complexity: High)
- Build out the static sections for the Homepage.
- Implement the `ChapterNav` logic (tracking scroll position to update active chapter).

### Phase 4: Data & Content Migration (Complexity: Medium)
- Move existing project/experience data into `lib/data.ts` or a localized MDX setup.
- Populate the subpages with full content.

### Phase 5: Cinematic Polish (Complexity: High)
- Integrate GSAP ScrollTrigger for section reveal animations.
- Implement micro-interactions (magnetic buttons, image hover scales, custom cursor if desired).
- Add the initial loading sequence.

### Phase 6: QA & Optimization (Complexity: Medium)
- Audit accessibility and contrast.
- Test responsive breakpoints thoroughly.
- Run performance profiling and optimize bundle size.

## Order of Implementation
Proceed strictly linearly through Phases 1-6. Do not attempt GSAP animations until the static layout is perfect across breakpoints.
