# Information Architecture

## Recommended Sitemap
The structure moves from a curated, high-impact homepage to detailed, substantive subpages.

```text
/ (Homepage - The Cinematic Overview)
├── /projects (Comprehensive Project Gallery)
│   ├── /projects/simply-note
│   ├── /projects/the-podium
│   └── /projects/hcdc-lfms
├── /experience (Detailed Career Timeline)
└── /certificates (Full Credential Verification)
```

## Section Order (Homepage)
The homepage functions as a continuous story, paced carefully:
1. **Hero (00):** Impactful statement, abstract visual or high-res portrait.
2. **Identity & Philosophy (01):** The "Building with Intent" thesis.
3. **Selected Work (02):** Deep dive into 3 featured projects only.
4. **Trajectory (03):** High-level visual timeline (Experience snapshot).
5. **Connect & Live Signals (04):** Contact info and real-time activity (GitHub/Discord).

## Navigation Model
**Hybrid Approach:**
1. **Global Top Nav:** A minimalist, sticky (or reveal-on-scroll-up) top bar containing links to `Work`, `Experience`, `Certificates`, and `Contact`.
2. **Chapter-Style Side Navigation (Homepage Only):** Inspired by the reference site. A fixed, subtle indicator on the left or right side of the screen (e.g., `01 — Approach`, `02 — Work`) that updates based on scroll position using Intersection Observer or GSAP ScrollTrigger. This reinforces the narrative structure.

## Rationale for the Structure
- **Cognitive Load:** The current site presents too much information at once on a single page. By curating the homepage to just the highlights and pushing details to subpages, we force the user to focus on the premium presentation of the core narrative.
- **Performance & Pacing:** Segmenting content allows for larger, more immersive sections (full viewport height `100vh` per chapter) without overwhelming the user's scrollbar.
- **Professionalism:** Dedicated subpages for `/projects` and `/experience` mirror the structure of a professional dossier or agency site.
