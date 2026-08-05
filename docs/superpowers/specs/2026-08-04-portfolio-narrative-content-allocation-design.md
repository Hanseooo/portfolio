# S1 Portfolio Narrative and Content Allocation Design

**Date:** 2026-08-04  
**Status:** Awaiting written-spec review  
**Docket:** `docs/dockets/portfolio-redesign-docket.md` — S1  
**Scope:** Recruiter-facing narrative, route communication jobs, source-content allocation, approved editorial summaries, and content fallbacks.

## 1. Purpose

Define the information contract for the complete portfolio redesign before visual language, page composition, responsive behavior, motion, or component architecture are designed.

The portfolio should help recruiters and engineering leaders understand that Hans Amoguis is a full-stack engineer focused on AI product engineering. It should demonstrate readiness for senior full-stack and AI product-engineering roles through end-to-end ownership, technical decisions, and measurable outcomes without claiming “Senior” as a current title.

The homepage is a focused recruiter brief. Secondary routes preserve complete evidence for visitors who want more detail.

## 2. Scope boundaries

### In scope

- The recruiter-facing story and its information sequence.
- The communication job of the homepage and each existing content route.
- Homepage allocation of projects, experience, credentials, live signals, personal material, and contact access.
- Rules for summarizing source copy without changing its meaning.
- Exact homepage summary copy approved during S1.
- Missing-data and live-provider content fallbacks.
- Traceability and content-validation requirements.

### Out of scope

- Typography, color, geometry, imagery treatment, and exact layout.
- Breakpoints and responsive composition.
- Motion, scrolling, transitions, and animation ownership.
- React component boundaries, content schema changes, and implementation sequencing.
- Detailed secondary-route templates.

Those decisions remain assigned to S2–S6 in the redesign docket.

## 3. Source-of-truth contract

Existing production content remains authoritative:

| Content | Authoritative source |
| --- | --- |
| Identity, philosophy, and working approach | Current homepage copy and `lib/about.ts` |
| Projects and case-study facts | `lib/projects.ts` |
| Experience and quantified outcomes | `lib/experience.ts` |
| Credentials | `lib/certificates.ts` |
| GitHub, Spotify, and Discord signals | Existing live-activity sources and API routes |
| Portrait | Existing images under `app/assets/myImages/` |
| Contact channels | Existing configured portfolio contact links |

S1 does not create or authorize a parallel factual content source. Later implementation may reorganize where approved summaries live, but that ownership decision belongs to S6.

### Editorial rules

Editorial summaries may improve clarity, grammar, brevity, and scannability. They must:

1. Remain close to Hans’s original wording and use a simple, personal voice.
2. Preserve meaning, role, scope, attribution, numbers, and qualifiers.
3. Introduce no new client, outcome, responsibility, technology, title, or availability claim.
4. Omit an unknown fact rather than infer it.
5. Keep `75%` attributed to the client’s experience and keep `~80%` approximate.
6. Avoid repeating the same explanatory sentence in multiple homepage stages. Compact proof figures may recur when later content provides context.

## 4. Naming and positioning

- Use **Hans Amoguis** as the main professional name in the opening, formal evidence, route titles, and metadata.
- Use **Hanseo** only where it naturally supports personal identity, such as the portrait or personal/live-presence stage.
- Do not combine the names as “Hans Amoguis — Hanseo” in the main introduction.
- Use **“Full-stack engineer focused on AI product engineering”** as the lead professional identity.
- Do not present “Senior” as Hans’s current title. Demonstrate senior-role readiness through ownership, architecture, delivery, and outcomes.

## 5. Governing narrative: Evidence Ladder

The homepage follows an Evidence Ladder. Each stage answers one recruiter question and earns the next level of detail.

### Stage 1 — Identity and immediate proof

**Communication job:** establish who Hans is, the work he focuses on, that he owns products end to end, and that his work has measurable outcomes.

**Approved identity:**

> Full-stack engineer focused on AI product engineering.

**Approved personal introduction:**

> I build maintainable full-stack and AI products with clear architecture, clean implementation, and practical user experience.

**Approved immediate proof:**

> Sole developer behind a client ordering platform that helped process orders 75% faster.

> Built AI recruitment workflows at Eskwelabs that reduced manual work by ~80%.

The opening also provides direct contact access. Its exact composition and action treatment belong to S3.

### Stage 2 — Flagship Work

**Communication job:** substantiate the opening through two complementary case studies.

- **Le Doux** proves real-client delivery, sole full-stack ownership, production scope, and business impact.
- **Clarift** proves AI product engineering, full-stack architecture, asynchronous processing, and grounded AI workflows.

Each flagship receives title, year, role, a concise product explanation, strongest relevant proof, selected technical decisions, and a route to its complete case study. S1 defines the information priority, not the visual amount or arrangement.

**Approved Le Doux summary:**

> I built Le Doux for an artisanal cookie business in Davao, replacing its Google Forms workflow with a structured ordering platform and admin system. As the sole full-stack developer, I handled ordering, GCash verification, menu management, CRM, and analytics. The client reported processing orders 75% faster.

**Approved Clarift summary:**

> I built Clarift as an AI-powered study engine for Filipino students. It turns uploaded material into grounded summaries, quizzes, and targeted practice using a Next.js and FastAPI architecture with background jobs, Redis, and pgvector.

### Stage 3 — Experience and corroboration

**Communication job:** show the professional contexts behind the work and corroborate the AI experience with the most relevant credential.

Both existing experience records appear as concise proof records. The complete source bullets remain on `/experience`.

**Approved Eskwelabs summary:**

> At Eskwelabs, I architected and scaffolded a recruitment automation system with AI-assisted job-description and social-post generation. I owned the UI layer, coordinated implementation tasks through GitHub issues, and helped reduce manual recruitment work by about 80%.

Display the existing role, company, and period: **AI Solutions Development Intern · Eskwelabs · Feb 2026–May 2026**.

**Approved freelance summary:**

> As the sole developer for Le Doux, I replaced a Google Forms ordering workflow with a production platform covering customer orders, GCash verification, menu management, CRM, and analytics.

Display the existing role and context: **Full-Stack Web Developer · Freelance**. The source has no period, so the portfolio must not invent one.

The **Eskwelabs AI Solution Development Track** is the sole homepage-emphasized credential and appears as corroboration beside the related experience.

**Approved credential summary:**

> Completed the Eskwelabs AI Solution Development Track while building AI-powered recruitment and operations workflows.

The homepage provides a route to `/certificates`, where all four credentials remain available.

### Stage 4 — More Selected Work

**Communication job:** prove that Le Doux and Clarift are flagships, not Hans’s only projects, and show range without giving every project case-study depth.

**Approved supporting summaries:**

- **SimplyNote:** “An AI learning application that turns a learner’s own notes and PDFs into summaries, roadmaps, and quizzes.”
- **The Podium:** “A seminar platform for HCDC’s VPAA with QR attendance, certificate generation, email notifications, and evaluation analytics.”
- **HCDC LFMS:** “A centralized lost-and-found system with reporting, claims, notifications, moderation, and role-based access.”

Each supporting project remains individually identifiable and links to its case study. This stage ends with an explicit route cue to the complete `/projects` catalogue so visitors do not interpret the two flagships as the complete body of work.

### Stage 5 — Personal and live presence

**Communication job:** show the person behind the work without inventing biography or weakening professional credibility.

Use:

- An existing real portrait.
- The Hanseo identity where personally applicable.
- A concise first-person working philosophy.
- GitHub activity as professional evidence.
- Spotify and Discord as informal human presence.
- Existing GitHub, LinkedIn, and configured contact access.

**Approved working philosophy:**

> I design architecture from product requirements before implementation so delivery stays clear and maintainable. I use specs to keep decisions explicit and reduce rework.

All three existing live sources—GitHub, Spotify, and Discord—remain part of the homepage. Their exact visual hierarchy belongs to S3.

### Stage 6 — Contact

**Communication job:** close with a direct, low-friction path to continue the conversation.

**Approved close:**

> Let’s connect.

Preserve existing email, LinkedIn, and GitHub access. Do not introduce “available for work,” “open to work,” or another availability claim without separate user approval.

## 6. Homepage chapter changes

The current standalone **Approach**, **Stack**, and **Credentials** chapters do not remain independent narrative stops.

- Working approach is expressed concisely in the personal stage and demonstrated by project and experience decisions.
- Technologies appear as evidence attached to relevant work rather than as an isolated inventory.
- The Eskwelabs credential appears with Eskwelabs experience; the complete credential collection remains on `/certificates`.
- Flagship Work and More Selected Work are separate narrative stages. Both are clearly project stages, and the latter provides the complete-catalogue cue.

This is an information hierarchy. S3 determines exact chapter names in navigation, scene composition, and whether adjacent stages share a visual section.

## 7. Route communication jobs

### Homepage `/`

A curated recruiter brief containing identity, immediate proof, two flagship projects, both experience records, one corroborating credential, three supporting projects, personal/live signals, and contact access.

### Project index `/projects`

The complete project catalogue. Every project remains consistently discoverable here, including future projects that do not appear in the capped homepage selection.

### Project detail `/projects/[slug]`

The complete case-study evidence for one project: problem, overview, role, year, technical decisions, features, stack, integrations, gallery, and available GitHub/live/client context. Detail pages carry depth that the homepage deliberately omits.

### Experience `/experience`

The complete two-record professional history using the full source bullets. S1 does not require experience-detail routes.

### Certificate index `/certificates`

The complete set of four credentials with title, issuer, date, description, image, and verification availability.

### Certificate detail `/certificates/[slug]`

Focused credential context, imagery, and verification when a URL exists. A certificate supports work evidence; it does not substitute for it.

### Shared navigation and contact

Provide clear routes to the complete projects, experience, certificates, and configured contact channels. Exact navigation composition remains outside S1.

## 8. Selection and allocation rules

### Projects

- Show no more than five projects on the homepage.
- Use two flagship slots and up to three supporting slots.
- Le Doux and Clarift are the current flagships.
- SimplyNote, The Podium, and HCDC LFMS are the current supporting projects.
- Future homepage choices consider relevance to full-stack and AI product-engineering roles, evidence strength, recency, and capability range.
- Do not automatically render every future project on the homepage.
- If fewer than five suitable projects exist, show fewer rather than fill space with weak or invented work.
- `/projects` always presents the complete catalogue.

### Experience

- Represent both current records on the homepage.
- Keep homepage records concise: role, organization/context, period when known, ownership, and strongest evidence.
- Preserve complete source bullets on `/experience`.

### Credentials

- Emphasize only the Eskwelabs AI Solution Development Track on the homepage.
- Keep all four credentials on `/certificates` and their existing detail routes.

### Live signals

- Preserve GitHub, Spotify, and Discord.
- Treat GitHub as professional evidence.
- Treat Spotify and Discord as personal presence.
- Do not make static hiring claims depend on live-provider availability.

## 9. Content fallbacks

- A project without a GitHub or live URL omits that action; it does not display a dead control.
- A credential without a verification URL remains identified but is not described as externally verified.
- A failed live provider reports temporary signal unavailability. It must not imply that Hans is professionally inactive or remove the static personal narrative.
- Unknown dates, outcomes, clients, responsibilities, and availability remain absent.
- Missing optional content must not cause another record to inherit facts or links.

Detailed UI states and implementation behavior remain assigned to later sessions.

## 10. Validation contract

S1 is satisfied only when later designs preserve all of the following:

1. A first-viewport content review can identify Hans Amoguis’s role focus, end-to-end ownership, measurable outcomes, and contact path.
2. Every factual homepage claim maps to current source content; every editorial sentence is one approved in this spec or separately approved later.
3. The words “Senior” or an equivalent level are not presented as Hans’s current title.
4. Le Doux and Clarift receive flagship depth.
5. SimplyNote, The Podium, and HCDC LFMS are visibly represented as additional projects.
6. The homepage exposes an explicit route to the complete `/projects` catalogue.
7. Both experience records are represented concisely, while `/experience` retains their full source bullets.
8. The Eskwelabs credential is emphasized on the homepage, and all four credentials remain accessible from `/certificates`.
9. GitHub, Spotify, and Discord remain represented, with provider failures handled as temporary unavailability.
10. The real portrait, concise philosophy, and personal Hanseo usage remain available without replacing the main professional name.
11. Long source copy is not duplicated across homepage stages.
12. Project, experience, certificate, and live-data omissions never produce invented content.

## 11. Downstream constraints established by S1

Subject to written-spec review and docket confirmation:

- S2 must support one narrative in both themes rather than changing content priority by theme.
- S3 must preserve the six-stage Evidence Ladder and distinguish Flagship Work from More Selected Work while keeping the complete-projects cue explicit.
- S3 may change visual arrangement but may not remove any of the five current homepage projects, either experience record, the Eskwelabs credential, the approved personal material, or any of the three live signals.
- S4 must preserve the route communication jobs and full source evidence defined here.
- S5 may animate or transition content but may not delay or obscure the opening identity and proof contract.
- S6 must maintain traceability to the existing production content sources and prevent summary content from becoming an untracked competing factual source.
