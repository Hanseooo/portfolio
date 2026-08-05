# S4 Secondary Routes and Reusable Page Families Design

**Date:** 2026-08-04  
**Session:** S4 · Secondary routes & reusable page families  
**Status:** Approved  
**Visual grammar:** Constructed Signal

## 1. Purpose

Define the information hierarchy and responsive composition of every non-home portfolio route. The design must make complete project, experience, and credential evidence easy to scan without collapsing unlike content into one visible template.

The governing model is a **shared editorial spine with adaptive evidence bodies**. Reuse means consistent orientation, reading rhythm, navigation semantics, and responsive logic. It does not mean project case studies, career records, certificates, and utility states must look identical.

## 2. Governing context

This specification inherits all confirmed constraints in `docs/dockets/portfolio-redesign-docket.md`, especially:

- S1's route communication jobs and source-of-truth contract;
- S2's Constructed Signal visual grammar;
- default ivory/red light mode and optional black/ice dark mode;
- neutral surfaces for long-form reading and dense evidence;
- full-color project screenshots and documentary certificate treatment;
- flat architectural planes, purposeful geometry, semantic indexing, and visible focus;
- no invented claims, dates, outcomes, links, or credential states.

Canonical S4 terms are recorded in `CONTEXT.md`: collection index, evidence detail, career record, evidence unit, record continuation, utility state, and page family.

## 3. Scope

### In scope

- Shared orientation and reading patterns for non-home routes.
- Project and certificate collection indexes.
- Project and certificate evidence details.
- The complete experience route and its career records.
- Evidence order, image pacing, long-content density, and record continuation.
- Responsive transformations for desktop, tablet, mobile, and short viewports.
- Static composition and recovery behavior for loading, rendering-error, and not-found states.
- Route-level accessibility and truthful missing-content behavior.

### Out of scope

- Changing or rewriting approved source content.
- Homepage composition.
- Motion timing, choreography, animation engines, scrolling libraries, and transition lifecycles.
- React component boundaries, data schema changes, data migration, and provider ownership.
- Implementation sequencing, tickets, and code.

## 4. Page-family model

S4 defines four related families.

### 4.1 Collection indexes

- `/projects` is the complete project catalogue.
- `/certificates` is the complete credential register.

Both provide complete discovery, but projects are image-led product evidence while certificates are supporting documentary artifacts.

### 4.2 Evidence details

- `/projects/[slug]` is a long claim-to-proof dossier.
- `/certificates/[slug]` is a compact documentary record.

They share orientation and continuation semantics, not equivalent ceremony or section depth.

### 4.3 Career route

`/experience` is a complete career ledger containing full career records. It does not invent experience-detail routes.

### 4.4 Utility states

Loading, rendering-error, and not-found states use the portfolio's editorial frame while prioritizing status comprehension and recovery.

## 5. Shared editorial spine

Every non-home family uses the following static composition contract.

### 5.1 Compact indexed masthead

The masthead remains in ordinary document flow rather than occupying a full viewport. It contains only applicable orientation data:

- parent path or route type;
- semantic collection or record index;
- page or record title;
- factual record count or position;
- available primary metadata;
- applicable parent destination and record actions.

The masthead uses one controlled structural break, such as an offset title edge, narrow signal field, or strong signal rule. It does not invent introductory prose to fill space.

In light mode, a concentrated red field or strong red rule may provide route emphasis. Dark mode translates that role to near-black depth with ice typography, rules, edges, or a smaller concentrated field rather than a broad cyan replacement.

### 5.2 Grid and surfaces

- Desktop compositions align to the shared 12-column grid.
- Long-form copy and dense evidence stay on neutral reading surfaces.
- Rules, indexing, and visible grid segments mark real boundaries and hierarchy.
- A route returns to alignment after any deliberate offset or overlap.
- Repeated evidence reads as a sequence, ledger, register, or dossier—not as a generic card grid.

### 5.3 Global context

Global navigation and the shared contact footer remain present across secondary routes and utility states. Secondary routes do not recreate homepage chapter navigation.

## 6. Project collection index `/projects`

### 6.1 Communication job

Present the complete project catalogue with every project consistently discoverable. Homepage curation has already established flagship hierarchy; the collection index does not repeat it through unequal record sizes.

### 6.2 Record hierarchy

After the compact masthead and factual project count, every project occupies one full-width ruled band with equivalent structural weight. Each band contains:

1. full-color hero image;
2. semantic record number;
3. title;
4. year;
5. role;
6. concise source subtitle;
7. optional source-authorized client context;
8. explicit case-study destination.

The index does not add stack-chip clouds or direct GitHub/live actions. Those would create metadata clutter and competing exits before the case study establishes context.

### 6.3 Composition

- Wide desktop uses an approximately 7/5 image-to-information split.
- Controlled alternating alignment may create irregularity without changing record importance.
- Record image proportions remain consistent enough that layout size does not imply ranking.
- The complete record band acts as one clear route destination, with any nested secondary action avoided.
- Records render in authoritative source order; S4 introduces no sorting, filtering, or ranking control for the current five-item collection.

## 7. Certificate collection index `/certificates`

### 7.1 Communication job

Present all credentials as supporting documentary evidence without giving them project-level dominance.

### 7.2 Register hierarchy

The route uses one continuous ruled register. Each certificate record contains:

1. restrained, uncropped artifact preview;
2. semantic record number;
3. complete title;
4. issuer;
5. date;
6. existing description when available;
7. evidence-detail destination;
8. external credential action only when `credentialUrl` exists.

Long titles wrap at a readable size. A missing credential URL creates neither an empty control nor a label implying external verification. The Eskwelabs record remains a valid portfolio record without a credential action.

### 7.3 Composition

- Desktop pairs a narrower artifact column with a wider information column.
- Every record belongs to one continuous register rather than an isolated card.
- Artifact previews remain subordinate to project imagery but large enough to recognize as documentary evidence.
- Records render in authoritative source order; no new credential ranking is introduced.

## 8. Experience route `/experience`

### 8.1 Communication job

Present the complete professional history using every source bullet while avoiding résumé-widget or decorative-timeline treatment.

### 8.2 Career ledger

Each role is one wide ruled career record.

- The metadata rail contains record number, role, company, and period when known.
- The evidence column contains every source bullet as a separately numbered evidence unit.
- Evidence uses a restrained reading measure, clear internal spacing, and visible separation.
- Quantified outcomes remain in their source statements; the design does not replace full bullets with extracted statistics.
- The Freelance record omits period because the source has none. It does not display a blank placeholder, `Present`, or an inferred range.

No ornamental timeline dots or invented chronology are used. The two records render in authoritative source order.

## 9. Project evidence detail `/projects/[slug]`

### 9.1 Communication job

Provide complete case-study evidence for one project, prioritizing engineering judgment and source-backed outcomes over a raw feature inventory.

### 9.2 Claim-to-proof sequence

Each project detail follows this order:

1. **Orientation masthead** — parent collection, record position, title, subtitle, year, role, optional source-authorized client context, and only available GitHub/live actions.
2. **Primary visual evidence** — a contained, full-color hero screenshot beside or immediately after the orientation content. It is not darkened into a full-bleed background.
3. **Local case-study index** — destinations for Brief, Decisions, System, Capabilities, and Screenshots. A destination is omitted if its section has no evidence.
4. **Case brief** — problem, response/overview, and a source-backed outcome when available. Missing outcomes produce no empty heading or inferred result.
5. **Technical decisions** — complete numbered decisions, one readable decision per row.
6. **System index** — complete stack and integrations as structured textual lists. Stack and integrations remain distinct source categories and do not become dozens of pills.
7. **Capability register** — every feature remains visible in source order as a numbered evidence unit.
8. **Screenshot record** — complete full-color gallery without invented feature mappings.
9. **Record continuation** — parent collection plus linear previous/next projects.

### 9.3 Local navigation

Project detail is the only S4 family that receives local section navigation.

- Wide screens use a restrained sticky rail beside the current evidence region.
- Tablet and mobile use an inline contents list after the masthead.
- The contents list does not become a swipe-only rail.
- Anchor targets account for the persistent global navigation and preserve visible keyboard focus.
- Current-section appearance follows S2's non-color state rules; S5 owns any animated tracking behavior.

### 9.4 Long evidence

- Technical decisions remain single-column at a readable measure.
- Capabilities may use two balanced columns only on wide screens and only when numbering and reading order remain unambiguous.
- Tablet and mobile use one capability column.
- No accordions, tabs, or `Show all` controls conceal complete case-study evidence.

### 9.5 Screenshot record

- The first non-duplicated gallery artifact may receive a wide row; following artifacts may use paired documentary rows on wide screens.
- Tablet reduces pairing when images would become too small to inspect.
- Mobile uses one image per row.
- Images preserve their full color and meaningful UI content.
- If the hero asset also occurs in `gallery`, it appears once visually rather than being repeated in the screenshot record.
- Images without source captions are not assigned invented feature names, outcomes, or claim relationships.

## 10. Certificate evidence detail `/certificates/[slug]`

### 10.1 Communication job

Present one credential with enough context to inspect and verify it where possible, while keeping credentials subordinate to work evidence.

### 10.2 Documentary sequence

1. Compact orientation masthead with parent collection, record position, complete title, issuer, and date.
2. One large, complete, undistorted certificate artifact on a quiet paper or near-black mat.
3. Existing description in a restrained reading column.
4. External credential action only when available.
5. Parent collection plus linear previous/next certificates.

The route does not use a blurred artifact background, full-viewport image hero, repeated artifact thumbnail, project-style local section navigation, or image-heavy continuation cards.

## 11. Record continuation and route truthfulness

Continuation is deterministic rather than history-dependent.

- Project details link to `/projects` using truthful wording such as `All Projects`.
- Certificate details link to `/certificates` using truthful wording such as `All Certificates`.
- Previous and next links follow authoritative source order.
- Adjacency does not wrap. The first record has no previous destination; the last has no next destination.
- Missing adjacency does not leave a misleading disabled control.
- Index and experience mastheads expose a direct Home destination.
- Controls name destinations and do not pretend to be browser-history actions.

The current behavior where a control labeled `Back to Projects` may route to a homepage section is not part of the approved design.

## 12. Responsive transformation

Responsive behavior preserves evidence order and changes composition rather than content priority.

| Concern | Wide desktop | Tablet | Mobile and narrow widths |
| --- | --- | --- | --- |
| Shared masthead | Indexed asymmetric composition | Reduced asymmetry | Single-column, top-aligned flow |
| Project index | 7/5 split with controlled alternation | Two columns only while readable | Image → metadata → title → summary → destination; no alternation |
| Certificate register | Artifact and information columns | Narrower artifact/info split | Artifact above information |
| Career record | Metadata rail beside evidence | Metadata band or reduced rail | Metadata above one evidence column |
| Project local index | Sticky side rail | Inline contents list | Inline, wrapping contents list |
| Decisions | Single readable column | Single readable column | Single readable column |
| Capabilities | Up to two explicit columns | One column unless ample width remains | One column |
| Screenshot record | Wide opening artifact, then optional pairs | Pair only when inspectable | One artifact per row |
| Continuation | Parent plus previous/next spatially separated | Compact two-direction layout | Explicit stacked destinations |

Additional rules:

- No source evidence disappears because the viewport is narrow.
- Galleries, capabilities, certificate records, and career evidence never become swipe-only.
- Certificate artifacts remain fully visible without arbitrary cropping.
- Long titles and metadata wrap rather than clip or shrink below readable size.
- Short viewports use ordinary top-aligned document flow; no secondary masthead is vertically centered or viewport-locked.
- Touch targets are at least 44 by 44 CSS pixels where applicable.

## 13. Utility states

Utility states use a shared contextual frame rather than independent decorative scenes.

### 13.1 Shared frame

- Preserve global navigation and footer access.
- Preserve route gutters, grid alignment, neutral reading surfaces, and Constructed Signal rules.
- Keep status and recovery content early in reading and keyboard order.
- Do not delay recovery controls behind a full-screen animation.

### 13.2 Loading

- Loading composition approximates the destination family's real hierarchy.
- Project loading shows sharp masthead, primary-image, and reading-band placeholders.
- Certificate loading shows sharp masthead and artifact placeholders.
- Placeholders contain no fabricated labels, titles, metadata, or claims.
- Corners remain square or minimally rounded in accordance with S2.
- S5 decides whether placeholders animate and defines the reduced-motion equivalent.

### 13.3 Rendering error

- Identify the affected record family in plain language.
- Offer Retry when recovery is possible.
- Offer the relevant parent collection as an independent escape route.
- Do not expose technical stack traces or use brand-red styling as a dark-theme accent; genuine error semantics may use restrained semantic red with text/icon reinforcement.

### 13.4 Not found

Use one restrained `404` signal statement with clear destinations to Home, Projects, Experience, and Certificates. The page remains part of the portfolio shell and does not wait through a decorative entrance before exposing navigation.

## 14. Accessibility and reading-order contract

- Every page has one clear `h1` and a logical heading hierarchy beneath it.
- DOM, keyboard, visual, and responsive reading orders agree.
- Alternating desktop project rows do not alternate DOM order.
- No evidence, route destination, or external credential action is hover-only.
- Focus remains visible against neutral surfaces, signal fields, and full-color images.
- Sticky project navigation does not cover focused content or anchor headings.
- Project images and certificate artifacts receive context-appropriate alternative text or nearby descriptions; decorative lines and frames remain hidden from assistive technology.
- Repeated direction controls include destination names, not arrows alone.
- State and verification meaning never rely on accent color alone.
- Theme changes preserve content hierarchy, reading order, actions, and recovery behavior.

## 15. Content-variance and omission rules

Optional source fields alter local evidence only; they never break the family composition.

- Le Doux may show source-authorized client context and its live destination while omitting GitHub.
- HCDC LFMS may show GitHub while omitting a live destination.
- Empty integrations do not create an empty integrations list; the System section remains available for stack evidence.
- A missing project outcome creates no outcome panel.
- The Freelance career record omits period.
- The Eskwelabs credential omits external credential action without being called externally verified.
- Missing optional descriptions omit the description region rather than borrowing copy from another record.
- A collection with one record omits adjacent navigation; an empty collection is not currently designed because authoritative production sources are non-empty.

## 16. Real-content pressure-test matrix

| Source extreme | Required behavior |
| --- | --- |
| Five projects with two homepage flagships | `/projects` gives all five equal structural rank; homepage curation does not become unequal index sizing. |
| Le Doux: 20 features | Full numbered capability register remains visible; two columns only on wide screens; no disclosure control. |
| Le Doux: 6 long decisions | One decision per readable row; decisions precede the feature inventory. |
| Le Doux: 11 gallery entries including hero | Hero is not repeated; remaining screenshots use a wide-plus-paired desktop sequence and single-column mobile sequence. |
| Le Doux: client and live URL, no GitHub | Show authorized client context and live action; omit GitHub without leaving a gap. |
| Clarift: 18 stack items and 8 integrations | Show complete structured Stack and Integrations lists; do not create 26 equal visual pills. |
| SimplyNote: empty integrations | Omit the empty integration subgroup without removing the stack evidence. |
| HCDC LFMS: no live URL | Omit live action; retain GitHub and case-study evidence. |
| Experience: four bullets versus two | Career records may differ in height; neither is padded, truncated, or visually promoted through decorative size. |
| Freelance: no period | Omit period with no inferred replacement. |
| Four certificates with one long title | Title wraps; register alignment and artifact size remain stable. |
| Eskwelabs certificate: no credential URL | No external action or false verification status; detail route remains complete. |
| Unknown detail slug | Not-found recovery exposes portfolio destinations without invented record context. |

## 17. Acceptance checks

A later design or implementation conforms to S4 when all answers are yes:

1. Do non-home routes share orientation, grid, reading, and continuation logic without appearing as one forced template?
2. Does `/projects` present every project with equal structural weight and no generic card grid?
3. Does `/certificates` read as a continuous documentary register?
4. Does `/experience` preserve every bullet and omit unknown period data?
5. Does each project detail follow the claim-to-proof sequence and keep complete evidence visible?
6. Are technical decisions more prominent than an undifferentiated feature dump?
7. Are complete stack and integration lists readable at Clarift's maximum density?
8. Are project screenshots full-color, non-duplicated, and free from invented claim mappings?
9. Does certificate detail remain compact, undistorted, and quieter than project detail?
10. Do parent links route to actual parent collections, and does adjacency remain linear and non-wrapping?
11. Do mobile and short-viewport layouts preserve evidence order without swipe-only or hidden content?
12. Do utility states preserve context and expose recovery immediately?
13. Do heading, DOM, keyboard, and visual reading orders agree?
14. Do both themes preserve the same hierarchy while following S2's role-equivalent, area-asymmetric signal transformation?
15. Are missing links, dates, outcomes, integrations, and credential URLs omitted without empty controls or invented replacements?

## 18. Constraints for later sessions

Subject to written-spec review and docket confirmation:

- S5 must treat the compact masthead, index sequences, career ledger, project dossier, certificate documentary record, continuation, and utility frame as settled compositions.
- S5 may animate evidence entrances and navigation feedback but may not hide complete evidence, introduce swipe-only access, or turn secondary mastheads into delayed full-screen scenes.
- S5 must support project local-section navigation without obscuring anchor targets or assigning competing animation ownership.
- S6 must preserve the shared editorial-spine contract while allowing project, certificate, career, and utility bodies to remain deliberately distinct.
- S6 must support optional evidence without empty regions, fabricated fallback content, or duplicated hero/gallery imagery.
- S6 must keep route-parent and linear-adjacency semantics independent from browser history.
- Later implementation must preserve source traceability and must not infer missing links, dates, outcomes, integrations, or verification states.

## Outcome

Secondary routes become one coherent evidence system rather than a collection of card grids and parallel cinematic templates. The shared editorial spine establishes orientation and trust; each adaptive evidence body then serves its real information demand: catalogue, career ledger, case-study dossier, documentary credential, or recovery state.
