# Portfolio Project Case Study Depth — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add year, problem, and technicalDecisions fields to project data; surface them across the project hero, brief, and a new Technical Decisions section; add prev/next project navigation cards at the bottom of each case study page.

**Architecture:** Data change in `lib/projects.ts` propagates to two existing components (ProjectHero, ProjectBrief) and two new ones (ProjectTechnicalDecisions, ProjectNextPrev). Dead type fields `heroSubtitleColor` and `heroTextPosition` are removed since no component consumes them. All project components follow the existing `"use client"` + Framer Motion `whileInView` pattern.

**Tech Stack:** Next.js App Router, Framer Motion (existing), next/image (existing), TypeScript

## Global Constraints

- All project components use `"use client"` directive (existing pattern)
- Import type: `import type { Project } from "@/lib/projects"` (existing pattern)
- Motion pattern: `initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}` using `motionTokens` from `@/lib/motion`
- Section wrapper: `mx-auto max-w-[1400px] px-6`
- Meta label style: `font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80`
- Mono number/label style: `font-mono text-primary`
- `motionTokens.duration.base = 0.38`, `motionTokens.stagger.text = 0.06`, `motionTokens.framerEase.enter = [0.22, 0.61, 0.36, 1]`

---

### Task 1: lib/projects.ts — type changes and data population

**Files:**
- Modify: `lib/projects.ts`

**Interfaces:**
- Produces: updated `Project` type — `year: string`, `problem: string`, `technicalDecisions: string[]` added; `heroSubtitleColor` and `heroTextPosition` removed. All downstream tasks depend on this.

- [ ] **Step 1: Update the Project type**

In `lib/projects.ts`, replace lines 69–86 (the `Project` type):

```ts
export type Project = {
    slug: string;
    title: string;
    subtitle: string;
    heroImage: StaticImageData;
    year: string;
    problem: string;
    technicalDecisions: string[];
    overview: string;
    features: string[];
    role: string;
    stack: string[];
    integrations?: string[];
    gallery: StaticImageData[];
    github?: string;
    live?: string;
    client?: string;
    clientConsent?: boolean;
}
```

- [ ] **Step 2: Update SimplyNote data object**

Replace the SimplyNote object in the `projects` array (lines 88–116):

```ts
{
    slug: "simply-note",
    title: "SimplyNote",
    subtitle: "An AI-Powered Learning Productivity Web Application with Note Summarization and Quiz Generation capabilities",
    heroImage: simplyNoteHero,
    year: "2025",
    problem: "Students studying with raw notes had no fast way to turn them into structured study material. Existing tools either required manual reformatting or didn't work with your own content.",
    technicalDecisions: [
      "Rolling-window AI quota system: tracks usage per user over a sliding 24h window rather than a hard daily reset, fairer distribution and harder to game than a midnight cutoff.",
      "Django REST over Next.js API routes: the quota logic, PDF parsing, and AI orchestration needed a persistent process with proper task isolation, serverless functions would hit timeout limits.",
      "Zustand over Redux: the client state surface (auth, quota display, note draft) is small enough that a store factory pattern would have been over-engineering for 3 slices.",
    ],
    overview:
      "SimplyNote is an AI-powered learning productivity platform that helps students and self-learners study smarter using their own content. It transforms raw notes into concise structured summaries, structured learning roadmaps, interactive quizzes with explanations. SimplyNote implements a rolling-window AI quota system to ensure fairness, performance, and transparency.",
    features: [
      "JWT-based authentication",
      "Summarize pasted notes or PDFs",
      "AI-powered summarization, roadmap & quiz generation",
      "Create quizzes only from your notes",
      "Quiz answer explanations",
      "Note formatting",
      "Share generated content via share codes",
      "Quiz explanations and mastery analytics",
      "Transparent AI quota system",
      "Feedback & bug reporting system",
    ],
    role: "Solo Developer",
    stack: ["React", "TypeScript", "Tailwind CSS", "Shadcn/ui", "Zustand", "Tanstack Router", "Tanstack Query", "Django REST Framework", "PostgreSQL", "Brevo"],
    integrations: [],
    gallery: simplyNoteImages,
    github: "https://github.com/Hanseooo/simply-note",
    live: "https://simplynote-ai.vercel.app",
  },
```

- [ ] **Step 3: Update The Podium data object**

Replace the ThePodium object (lines 117–145):

```ts
{
    slug: "the-podium",
    title: "The Podium",
    subtitle: "A Seminar Tracking Platform with automated Certifications and Attendance System",
    heroImage: ThePodiumHero,
    year: "2024",
    problem: "HCDC's VPAA managed seminar attendance and certificate distribution manually, spreadsheets, printed sign-in sheets, and emailed certificates sent one by one.",
    technicalDecisions: [
      "QR codes generated server-side and validated on scan: avoids the race condition where a client-generated code could be shared or reused before the server invalidates it.",
      "Certificate rendering via canvas/PNG rather than PDF: gives admins live preview of font and position changes, and Cloudinary can serve the PNG directly without a PDF renderer on the client.",
      "Brevo for transactional email: the free tier covers the organization's volume and the template editor reduces the need to maintain HTML email strings in code.",
    ],
    overview:
      "A Full-stack web application built as a school project for HCDC's VPAA for seminar management. This system streamlines seminar management, QR-based attendance, certificate generation and editing, email notifications, and evaluation analytics.",
    features: [
      "Participant roles: attend seminars, view history, download certificates",
      "Admin roles: manage seminars, track attendance, view analytics",
      "QR attendance system: auto-generated codes, instant server validation, error handling",
      "Certificate generation: upload templates, adjust text, fonts, colors, rendered as PNG",
      "Supports customization: font family, size, color, text position, show/hide event name",
      "Email system via Brevo API: verification codes, password reset links, certificate notifications",
      "Seminar evaluation analytics: collect participant feedback, admin dashboards and charts for ratings, satisfaction, responses",
      "Seminar management: create, edit, delete seminars, upload images, view attendance, export data",
    ],
    role: "Solo Developer",
    stack: ["React", "TypeScript", "Tailwind CSS", "Shadcn/ui", "Zustand", "Django REST Framework", "PostgreSQL", "Brevo", "Cloudinary"],
    gallery: thePodiumImages,
    github: "https://github.com/Hanseooo/attendance-evaluation-certification",
    live: "https://hcdc-podium.vercel.app",
    client: "HCDC – VPAA",
    clientConsent: true,
  },
```

- [ ] **Step 4: Update HCDC LFMS data object**

Replace the hcdc-lfms object (lines 146–183):

```ts
{
    slug: "hcdc-lfms",
    title: "Lost and Found Management System",
    subtitle: "A centralized Lost and Found Management System with reporting, claims, notifications, and admin moderation",
    heroImage: hcdcLFMSHero,
    year: "2023",
    problem: "Lost and found items at HCDC were reported informally, word of mouth, group chats, bulletin boards. No central record meant items went unclaimed and disputes had no audit trail.",
    technicalDecisions: [
      "Role-based access at the API layer, not just the UI: admin-only endpoints validate the role on every request so a user who inspects the frontend cannot call moderation routes directly.",
      "Cloudinary for image uploads: offloads resizing and storage from the Django server, keeping the API layer stateless and the server footprint small.",
      "Real-time notifications via polling rather than WebSockets: the notification surface (claim updates, report status) does not need sub-second latency, and polling avoids maintaining a persistent connection on a shared hosting environment.",
    ],
    overview:
      "HCDC Lost and Found Management System is a full-stack web application built as an academic project to streamline lost and found reporting within an organization. The platform allows users to report lost or found items, upload images, interact through claims and comments, and receive real-time notifications. An admin dashboard enables moderation, report validation, and status management to ensure accurate and secure item recovery.",
    features: [
      "User authentication and profile management",
      "Create and manage lost and found item reports",
      "Image uploads using Cloudinary",
      "Item claiming system with activity and resolution logs",
      "Real-time notifications for claims and report updates",
      "Commenting system for report discussions",
      "Admin dashboard for report review, approval, and moderation",
      "Role-based access control (user and admin roles)",
      "Responsive UI with light, dark, and system theme support",
    ],
    role: "Solo Developer",
    stack: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Shadcn/ui",
      "Django REST Framework",
      "PostgreSQL",
      "Cloudinary",
    ],
    gallery: hcdcLFMSImages,
    github: "https://github.com/Hanseooo/hcdc-lfms",
    client: "HCDC",
    clientConsent: true,
  },
```

- [ ] **Step 5: Verify TypeScript**

Run: `npx tsc --noEmit`
Expected: no type errors — `heroSubtitleColor` and `heroTextPosition` removed from type and all 3 data objects, new required fields populated on all 3.

- [ ] **Step 6: Commit**

```bash
git add lib/projects.ts
git commit -m "feat: add year, problem, technicalDecisions to project data; remove dead type fields"
```

---

### Task 2: Year in ProjectHero meta line + projects grid card

**Files:**
- Modify: `components/projects/ProjectHero.tsx`
- Modify: `app/projects/page.tsx`

**Interfaces:**
- Consumes: `project.year: string` from updated `Project` type (Task 1)

- [ ] **Step 1: Add year to ProjectHero meta line**

In `components/projects/ProjectHero.tsx`, find the meta `<div>` (line 37). Add a separator and year span after the existing `<span>{project.role}</span>`:

```tsx
<div className="mb-6 flex flex-wrap items-center gap-3 font-bold text-[10px] uppercase tracking-[0.2em] text-white">
  <span className="text-primary">Case Study</span>
  <span className="h-px w-10 bg-primary/70" aria-hidden="true" />
  {project.client && (
    <>
      <span className="border border-primary/60 bg-black/50 px-2 py-0.5 font-mono text-[9px] text-primary backdrop-blur-sm">
        Client Project
      </span>
      <span className="h-px w-10 bg-primary/70" aria-hidden="true" />
    </>
  )}
  <span>{project.role}</span>
  <span className="h-px w-10 bg-primary/70" aria-hidden="true" />
  <span>{project.year}</span>
</div>
```

- [ ] **Step 2: Add year to projects grid subtitle**

In `app/projects/page.tsx`, update the subtitle span (line 34):

Old:
```tsx
<span className="font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">
  <span className="font-mono mr-2">0{idx + 1} {"//"}</span> {project.subtitle}
</span>
```

New:
```tsx
<span className="font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">
  <span className="font-mono mr-2">0{idx + 1} {"//"}</span> {project.year} — {project.subtitle}
</span>
```

- [ ] **Step 3: Verify visually**

Run `npm run dev`. Check:
- `/projects` grid: each card shows e.g. `01 // 2025 — An AI-Powered...`
- `/projects/simply-note` hero meta line: `Case Study — Solo Developer — 2025`
- `/projects/the-podium` (client project): `Case Study — Client Project — Solo Developer — 2024`

- [ ] **Step 4: Commit**

```bash
git add components/projects/ProjectHero.tsx app/projects/page.tsx
git commit -m "feat: add year to project hero meta line and projects grid card"
```

---

### Task 3: ProjectBrief — split overview into Problem + Solution blocks

**Files:**
- Modify: `components/projects/ProjectBrief.tsx`

**Interfaces:**
- Consumes: `project.problem: string` and `project.overview: string` from updated `Project` type (Task 1)

- [ ] **Step 1: Replace the left column in ProjectBrief.tsx**

In `components/projects/ProjectBrief.tsx`, replace the entire left `motion.div` (lines 12–28):

Old:
```tsx
<motion.div
  className="md:col-span-7"
  initial={{ y: 30, opacity: 0 }}
  whileInView={{ y: 0, opacity: 1 }}
  transition={{
    duration: motionTokens.duration.base,
    ease: motionTokens.framerEase.enter,
  }}
  viewport={{ once: true }}
>
  <h2 className="mb-6 text-2xl font-black tracking-tight uppercase">
    Overview
  </h2>
  <p className="text-lg leading-relaxed text-muted-foreground">
    {project.overview}
  </p>
</motion.div>
```

New:
```tsx
<motion.div
  className="md:col-span-7 flex flex-col gap-10"
  initial={{ y: 30, opacity: 0 }}
  whileInView={{ y: 0, opacity: 1 }}
  transition={{
    duration: motionTokens.duration.base,
    ease: motionTokens.framerEase.enter,
  }}
  viewport={{ once: true }}
>
  {project.problem && (
    <div>
      <h2 className="mb-4 font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">
        Problem
      </h2>
      <p className="text-lg leading-relaxed text-muted-foreground">
        {project.problem}
      </p>
    </div>
  )}
  <div>
    <h2 className="mb-4 font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">
      Solution
    </h2>
    <p className="text-lg leading-relaxed text-muted-foreground">
      {project.overview}
    </p>
  </div>
</motion.div>
```

- [ ] **Step 2: Verify visually**

Run dev server. On `/projects/simply-note`:
- Problem label + paragraph renders above Solution label + paragraph
- Both labels use the small monospace-adjacent uppercase style (not the old `text-2xl font-black` heading)
- Layout: left column still spans 7 columns on md+, right meta column unchanged

- [ ] **Step 3: Commit**

```bash
git add components/projects/ProjectBrief.tsx
git commit -m "feat: split project brief into Problem and Solution labeled blocks"
```

---

### Task 4: New ProjectTechnicalDecisions component

**Files:**
- Create: `components/projects/ProjectTechnicalDecisions.tsx`

**Interfaces:**
- Produces: `default export ProjectTechnicalDecisions({ project }: { project: Project })` — consumed by Task 6
- Consumes: `project.technicalDecisions: string[]` from updated `Project` type (Task 1)

- [ ] **Step 1: Create ProjectTechnicalDecisions.tsx**

Create `components/projects/ProjectTechnicalDecisions.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import type { Project } from "@/lib/projects";
import { motionTokens } from "@/lib/motion";

export default function ProjectTechnicalDecisions({ project }: { project: Project }) {
  if (!project.technicalDecisions || project.technicalDecisions.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1400px] px-6 py-24">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{
          duration: motionTokens.duration.base,
          ease: motionTokens.framerEase.enter,
        }}
        viewport={{ once: true }}
        className="mb-10"
      >
        <h2 className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
          03 / Technical Decisions
        </h2>
        <div className="h-px w-full bg-border" />
      </motion.div>

      <ul className="space-y-8">
        {project.technicalDecisions.map((decision, i) => (
          <motion.li
            key={i}
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{
              duration: motionTokens.duration.base,
              ease: motionTokens.framerEase.enter,
              delay: i * motionTokens.stagger.text,
            }}
            viewport={{ once: true }}
            className="flex items-baseline gap-6"
          >
            <span className="shrink-0 font-mono text-primary">
              {String(i + 1).padStart(2, "0")} /
            </span>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {decision}
            </p>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/projects/ProjectTechnicalDecisions.tsx
git commit -m "feat: add ProjectTechnicalDecisions component"
```

---

### Task 5: New ProjectNextPrev component

**Files:**
- Create: `components/projects/ProjectNextPrev.tsx`

**Interfaces:**
- Produces: `default export ProjectNextPrev({ project }: { project: Project })` — consumed by Task 6
- Consumes: `projects` array and `Project` type from `@/lib/projects`; uses `project.heroImage`, `project.title`, `project.slug`

Design note from impeccable review: use `aspect-[5/2]` (not `16/9`) for the cards — better proportioned at 50vw desktop width. Arrow labels get a 4px hover slide to reinforce direction.

- [ ] **Step 1: Create ProjectNextPrev.tsx**

Create `components/projects/ProjectNextPrev.tsx`:

```tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { projects } from "@/lib/projects";
import type { Project } from "@/lib/projects";

function NavCard({
  project,
  direction,
}: {
  project: Project;
  direction: "prev" | "next";
}) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group relative block aspect-[5/2] overflow-hidden"
    >
      <Image
        src={project.heroImage}
        alt={project.title}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-8">
        <p className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
          {direction === "prev" && (
            <span className="transition-transform duration-300 group-hover:-translate-x-1">
              ←
            </span>
          )}
          <span>{direction === "prev" ? "Previous" : "Next"}</span>
          {direction === "next" && (
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          )}
        </p>
        <h3 className="text-xl font-black text-white">{project.title}</h3>
      </div>
    </Link>
  );
}

export default function ProjectNextPrev({ project }: { project: Project }) {
  if (projects.length < 2) return null;

  const idx = projects.findIndex((p) => p.slug === project.slug);
  const prev = projects[(idx - 1 + projects.length) % projects.length];
  const next = projects[(idx + 1) % projects.length];

  return (
    <section className="mx-auto max-w-[1400px] px-6 py-16">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Mobile: next on top; desktop: prev left, next right */}
        <div className="order-1 md:order-2">
          <NavCard project={next} direction="next" />
        </div>
        <div className="order-2 md:order-1">
          <NavCard project={prev} direction="prev" />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/projects/ProjectNextPrev.tsx
git commit -m "feat: add ProjectNextPrev navigation component"
```

---

### Task 6: Wire new components into [slug]/page.tsx

**Files:**
- Modify: `app/projects/[slug]/page.tsx`

**Interfaces:**
- Consumes: `ProjectTechnicalDecisions` (Task 4), `ProjectNextPrev` (Task 5)

- [ ] **Step 1: Replace [slug]/page.tsx**

Replace the entire file:

```tsx
"use client";

import { notFound } from "next/navigation";
import { projects } from "@/lib/projects";
import PageTransition from "@/components/layout/PageTransition";
import ProjectGallery from "@/components/projects/ProjectGallery";
import { use } from "react";
import BackButton from "@/components/utils/BackButton";
import ProjectHero from "@/components/projects/ProjectHero";
import ProjectBrief from "@/components/projects/ProjectBrief";
import ProjectFeatures from "@/components/projects/ProjectFeatures";
import ProjectTechnicalDecisions from "@/components/projects/ProjectTechnicalDecisions";
import ProjectNextPrev from "@/components/projects/ProjectNextPrev";
import SectionDivider from "@/components/ui/SectionDivider";
import { useResetScrollTop } from "@/components/utils/useResetScrollTop";

export default function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const project = projects.find((p) => p.slug === resolvedParams.slug);
  useResetScrollTop();

  if (!project) notFound();

  return (
    <PageTransition>
      <ProjectHero project={project} />
      <ProjectBrief project={project} />
      <SectionDivider />
      <ProjectFeatures project={project} />
      <SectionDivider />
      <ProjectTechnicalDecisions project={project} />
      <SectionDivider />
      <ProjectGallery images={project.gallery} />
      <SectionDivider />
      <ProjectNextPrev project={project} />
      <SectionDivider />
      <BackButton sectionId="projects" text="Back to Projects" />
    </PageTransition>
  );
}
```

- [ ] **Step 2: End-to-end browser check**

Run `npm run dev`. Visit `/projects/simply-note` and verify the full page top-to-bottom:

1. Hero: `Case Study — Solo Developer — 2025` in meta line
2. Brief: Problem paragraph above Solution paragraph
3. Key Features: unchanged
4. Technical Decisions: 3 numbered items (`01 /`, `02 /`, `03 /`) with `whileInView` fade-up
5. Gallery: unchanged
6. ProjectNextPrev: two cards — The Podium (next, top on mobile) and HCDC LFMS (prev, bottom on mobile / left on desktop)
7. Arrow hover: `←` slides left on The Podium card hover, `→` slides right on HCDC card hover (wait, check direction — on simply-note, prev=hcdc-lfms, next=the-podium)
8. BackButton still present

Also verify circular navigation:
- On `/projects/hcdc-lfms` (last): next card = SimplyNote (wraps to index 0)
- On `/projects/simply-note` (first): prev card = HCDC LFMS (wraps to last)

- [ ] **Step 3: Commit**

```bash
git add app/projects/[slug]/page.tsx
git commit -m "feat: wire ProjectTechnicalDecisions and ProjectNextPrev into project case study page"
```
