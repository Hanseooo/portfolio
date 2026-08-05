# S3 Homepage Composition and Responsive Transformation Design

**Date:** 2026-08-04  
**Session:** S3 · Homepage composition & responsive transformation  
**Status:** Approved  
**Docket:** `docs/dockets/portfolio-redesign-docket.md`  
**Upstream contracts:** S1 Portfolio Narrative and Content Allocation; S2 Cross-theme Red Signal Visual Language

## Purpose

Define the homepage's final scene hierarchy and the spatial transformation of that hierarchy across wide desktop, compact desktop, tablet, mobile, short viewports, touch input, and constrained webviews.

The homepage remains a recruiter brief built around S1's Evidence Ladder. It uses S2's Constructed Signal grammar to create selective cinematic impact without forcing every evidence record into a full-viewport chapter. The canonical experience is readable native document flow; later motion design may enhance it but may not become necessary to understand it.

## Scope

This specification defines:

- the six homepage scenes and their communication hierarchy;
- the spatial relationship among identity, portrait, proof, work, experience, credential, live signals, and contact;
- which scenes are viewport-aware, extended editorial flow, compact fields, or possible sticky-layout candidates;
- the distinct responsibilities of global and homepage chapter navigation;
- responsive transformation at wide desktop, compact desktop/tablet, and mobile;
- short-height, touch, and webview composition fallbacks;
- content-preservation and progressive-simplification rules;
- the light- and dark-theme signal-field rhythm at homepage scale;
- composition acceptance criteria.

This specification does not define:

- secondary-route layouts or route-family templates;
- animation timing, easing, choreography, replay behavior, or engine ownership;
- whether any composition candidate is ultimately pinned or animated;
- React component boundaries, content schemas, CSS architecture, or source-file structure;
- implementation tasks, dependencies, migration order, or performance tuning;
- new factual claims or copy beyond the S1-approved content.

## Governing principles

### Hybrid evidence rhythm

The homepage does not treat all six Evidence Ladder stages as equally theatrical scenes. It alternates emphasis and recovery:

1. an impactful, viewport-aware identity opening;
2. four neutral evidence-led editorial scenes;
3. a decisive compact contact close.

Only the hero is designed around the viewport. Evidence sections derive their height from content rather than forced cinematic padding. No scene requires horizontal scrolling, scroll hijacking, pinning, or animation to communicate its hierarchy.

### Role-preserving transformation

Responsive behavior preserves each element's narrative role, priority, evidence, and action while allowing its spatial form to change substantially. Desktop asymmetry may become tablet alignment or mobile stacking. Overlap may disappear. A rail may become a marker or numbered heading. Content allocation and meaning do not change by breakpoint.

### Evidence before decoration

Project screenshots, proof figures, experience records, credential context, live-signal distinctions, and actions remain more important than exposed grid lines or geometric framing. Responsive simplification removes decoration before it removes orientation, evidence, or access.

## Homepage sequence

The final homepage sequence follows S1's Evidence Ladder without inserting standalone Approach, Stack, or Credentials chapters:

1. **Identity & Immediate Proof**
2. **Flagship Work**
3. **Experience & Corroboration**
4. **More Selected Work**
5. **Personal & Live Presence**
6. **Contact**

Approach and technologies remain attached to the work that demonstrates them. The Eskwelabs credential remains attached to its related experience. The six stages may have visually distinct subregions, but their order does not change across viewport or theme.

## Scene 01 · Identity & Immediate Proof

### Communication job

Identify Hans Amoguis as a full-stack engineer focused on AI product engineering; communicate end-to-end ownership, the source-backed `75%` and `~80%` outcomes, and direct contact access immediately.

### Desktop composition

The opening uses an adaptive Red Signal composition rather than reproducing the prototype literally.

- A broad red field performs the light-theme identity role.
- Oversized Anton display type presents **Hans Amoguis**, with intentional crossing between neutral and signal regions.
- The role statement and approved concise introduction remain in uninterrupted Inter reading zones.
- The real portrait is recognizable, editorially cropped, and structurally framed. Display type and geometry may approach or cross its frame but may not obscure the face.
- The `75%` Le Doux result and `~80%` Eskwelabs result form a compact immediate-proof pair with their qualifiers and attribution intact.
- A direct contact action and a selected-work action remain plainly visible and keyboard reachable.
- The top navigation is part of the opening frame but does not compete with the name or proof.

The hero may occupy a generous initial canvas on a sufficiently tall desktop, but it uses `min-height` plus normal content flow rather than a fixed-height box. Its proof and actions must never be clipped to preserve a poster silhouette.

### Tablet and compact-desktop transformation

- Reduce the scale and amount of display-type overlap.
- Convert the broad red plane into a simpler side or backing field while preserving its identity role.
- Keep the portrait adjacent to identity when space permits, but place proof and actions in stable reading zones.
- Do not position proof figures over the portrait or project-like imagery.
- Allow the opening to grow vertically when viewport height is insufficient.

### Mobile transformation

Mobile uses an evidence-first order:

1. Hans Amoguis;
2. role statement and concise introduction;
3. compact `75%` and `~80%` proof pair;
4. direct contact action, with selected-work access also available in the opening;
5. the portrait beginning at the lower viewport edge or following immediately within the same opening scene.

This ordering satisfies the first-viewport content contract without shrinking body copy, proof attribution, portrait recognition, or touch targets. Desktop overlap disappears. A red-backed or red-framed portrait offset may preserve controlled irregularity after the required evidence. The portrait remains part of Scene 01 even when it begins below the first physical viewport.

### Dark-mode transformation

The broad light-mode red identity plane becomes black or near-black tonal depth. Ice blue concentrates in display emphasis, proof figures, rules, portrait framing, focus, and actions. The dark hero does not replace the red plane with an equally broad cyan plane.

## Scene 02 · Flagship Work

### Communication job

Substantiate the opening through Le Doux and Clarift as complementary flagship case studies.

### Shared flagship dossier

Both projects live inside one extended neutral chapter rather than independent full-screen scenes or a motion-dependent comparison.

- A chapter introduction establishes the pair without delaying the first project.
- **Le Doux leads** with real-client delivery, sole full-stack ownership, production scope, and the client-reported 75% faster order processing.
- **Clarift follows** with AI product engineering, full-stack architecture, asynchronous processing, and grounded study workflows.
- Each record includes its title, year, role, S1-approved summary, strongest relevant proof, selected source-backed technical evidence, full-color screenshot evidence, and case-study action.
- The records share one structural grammar but reverse or vary spatial emphasis so they read as a deliberate pair rather than duplicated cards.
- Technology labels remain attached to the decisions or systems they substantiate.

### Responsive composition

- **Wide desktop:** use broad editorial records with image and evidence occupying complementary grid regions. One record may lead with image while the other leads with evidence.
- **Compact desktop/tablet:** retain two-part records when both text and screenshot details remain legible; otherwise stack within each record.
- **Mobile:** use image-first, proof-next reading order for each project, followed by summary, selected technical evidence, and action. Do not use a carousel or horizontal rail.

A chapter label or evidence rail may be treated as a later sticky candidate on capable desktop layouts. The record sequence and all evidence remain complete and correctly ordered without sticky behavior.

## Scene 03 · Experience & Corroboration

### Communication job

Show the two professional contexts behind the work and connect the Eskwelabs AI credential to the experience it corroborates.

### Evidence ledger

The scene is a neutral ruled evidence ledger, not a chronological timeline.

- The Eskwelabs and freelance records receive equal legitimacy.
- Each record shows role, organization or context, period only when known, concise ownership, and strongest source-backed evidence.
- The freelance record does not gain an inferred date, ordering label, duration, or timeline position.
- The Eskwelabs AI Solution Development Track is physically and semantically attached to the Eskwelabs record as a smaller documentary artifact.
- The credential does not appear as a third job or a standalone homepage chapter.
- The scene closes with clear routes to `/experience` and `/certificates`.

### Responsive composition

- **Wide desktop:** the two records may stagger across the grid or use unequal starting positions while remaining equally readable. Rules and labels make the relationship between Eskwelabs and its credential explicit.
- **Compact desktop/tablet:** use a stable two-record field if content fits; otherwise stack without a central chronology axis.
- **Mobile:** stack the records as independent evidence entries. Keep the credential immediately within or after the Eskwelabs entry. Do not use connecting lines that imply chronological order.

## Scene 04 · More Selected Work

### Communication job

Show that the flagships are not the complete body of work and provide an explicit route to the full project catalogue.

### Editorial project register

SimplyNote, The Podium, and HCDC LFMS appear as a numbered editorial sequence rather than a card grid or horizontal carousel.

Each record includes:

- semantic project number;
- project title;
- S1-approved concise summary;
- truthful full-color screenshot crop;
- compact source-backed role, technology, or evidence metadata where relevant;
- direct case-study action.

The sequence ends with a visually explicit **View all projects** action to `/projects`. It is a closing record or major route cue, not a small utility link.

### Responsive composition

- **Wide desktop:** alternate image/text alignment or vary column span to create one controlled irregularity per record while preserving a shared register structure.
- **Compact desktop/tablet:** use consistent two-part rows with restrained alternation.
- **Mobile:** stack image, title, summary, metadata, and action in that reading order. Preserve all three records and the catalogue action.

## Scene 05 · Personal & Live Presence

### Communication job

Show the person behind the work while preserving GitHub as professional evidence and Spotify/Discord as informal human context.

### Personal studio composition

- The real portrait and S1-approved first-person working philosophy anchor the scene.
- Hanseo may appear only as a personal identifier or caption, not as a replacement for the professional name established in Scene 01.
- GitHub receives a substantive evidence rail or activity field.
- Spotify and Discord remain visible as smaller, explicitly informal signals.
- The three providers do not become equally weighted dashboard cards.
- Static identity and philosophy do not depend on provider success.
- Provider loading, unavailable, or error states retain stable layout footprints and use concise state text so the scene does not collapse or reorder.

### Responsive composition

- **Wide desktop:** compose portrait/philosophy and GitHub as the primary spatial relationship; place Spotify and Discord in a subordinate rail or aligned field.
- **Compact desktop/tablet:** preserve the primary/subordinate distinction while reducing nested columns.
- **Mobile:** order content as portrait/personal identity, philosophy, GitHub, Spotify, then Discord. The professional live signal precedes the casual signals.

## Scene 06 · Contact

### Communication job

Close with a direct, low-friction path to continue the conversation.

### Composition

- Use the approved “Let’s connect.” close.
- Preserve email, LinkedIn, and GitHub access.
- Do not introduce an availability claim.
- Light mode uses the second and final broad red field as a decisive closing action.
- Dark mode uses black or near-black depth with concentrated ice typography, rules, focus, and actions rather than a broad cyan replacement.
- Keep the scene concise and content-sized; it is not another full-viewport chapter.

## Signal-field and recovery rhythm

The homepage uses two broad signal anchors in light mode:

1. the identity hero;
2. the contact close.

The four evidence scenes between them use warm ivory or paper reading surfaces with concentrated red in chapter rules, indices, proof figures, frames, and selected actions. Full-color project screenshots provide visual variation without adding more broad signal planes.

This creates a red identity signal, an extended neutral evidence journey, and a red closing signal. The anchors are never adjacent. Dark mode preserves this hierarchy through tonal black depth and concentrated ice rather than area-equivalent cyan fields.

## Navigation model

### Global navigation

The persistent top navigation owns site-level movement and universal controls:

- wordmark/home;
- Projects;
- Experience;
- Certificates;
- Contact;
- theme control;
- compact menu behavior where required.

Its route links are not repeated as chapter labels. On narrow layouts, route access may move into a menu while the wordmark, menu control, and theme access remain available in an accessible form.

### Homepage chapter navigation

Homepage chapter orientation owns in-page movement only.

The six labels are:

1. `01 Identity`
2. `02 Flagships`
3. `03 Experience`
4. `04 More Work`
5. `05 Presence`
6. `06 Contact`

- **Wide desktop:** a restrained side rail appears only after the hero begins to leave. The active label may expand; inactive stages remain compact. The rail must not overlap reading content or exceed usable viewport height.
- **Short wide viewports:** contract the rail to numbers only. If six accessible targets still do not fit without collision, remove the rail and rely on scene headings.
- **Tablet/compact desktop:** replace the rail with a compact current-stage marker associated with the top navigation. It does not become a second row of six persistent links.
- **Mobile/touch/webview:** do not show persistent chapter navigation. Numbered section headings preserve orientation. Optional homepage anchors may appear inside the global menu.

Global and chapter navigation must remain distinguishable by label, location, and purpose. Keyboard order follows document and control order rather than visual overlap.

## Responsive system

Breakpoint values describe composition modes, not device identity. Content fit, height, input capability, and browser reliability may trigger a simpler mode earlier.

### Wide desktop mode

Nominal condition: approximately `1280px+`, sufficient usable height, and fine-pointer capability.

- Use a 12-column editorial grid.
- Enable full asymmetry and at most one purposeful overlap within a focal composition.
- Use expansive spacing where it establishes hierarchy.
- Show the global top bar and eligible chapter rail.
- Permit sticky-layout candidacy only where normal flow is already complete.

### Compact desktop and tablet mode

Nominal condition: approximately `768–1279px`, or a wide viewport with constrained height or touch-dominant input.

- Use a simplified 8-column composition.
- Reduce display scale, overlap, and exposed construction lines.
- Replace the chapter rail with the compact stage marker.
- Preserve side-by-side records only when body copy, screenshots, actions, and focus states remain comfortable.
- Allow sections to grow naturally rather than enforcing desktop proportions.

### Mobile mode

Nominal condition: below approximately `768px`, with a supported minimum width of `320px`.

- Use a four-column structural grid expressed mainly through gutters, alignment, rules, and selected offsets rather than visible grid wallpaper.
- Use one primary reading column.
- Preserve native vertical scrolling.
- Remove persistent chapter navigation, side-by-side evidence, decorative type overlap, and pinning assumptions.
- Keep touch targets at least `44px` in both dimensions and body text at least `16px`.
- Keep project screenshots, proof qualifiers, actions, and provider states legible without hover or expansion.

### Short-height override

At any width, height cannot determine whether required content is visible or reachable.

- Hero and scenes use minimum height plus content flow, not fixed viewport locking.
- Remove vertical centering that clips or pushes proof and actions outside the intended opening sequence.
- Compact or remove the chapter rail before reducing readable type or target sizes.
- Sticky regions must release or become static when their content cannot fit the usable viewport.

### Touch override

- No accurate screenshot color, readable evidence, action, or state meaning depends on hover.
- Hover-specific affordances have visible resting equivalents.
- Persistent side controls may be removed even at desktop-like widths if they compete with touch content or browser chrome.
- Composition does not require drag gestures.

### Webview and constrained-browser override

- Use native vertical flow.
- Do not require sticky, pinned, horizontal, or smooth-scroll behavior for comprehension or navigation.
- Retain global navigation only in a form reliable within the available browser chrome and safe-area insets.
- Preserve the same content order, section headings, actions, and theme hierarchy.

## Structural grid and geometry

The homepage uses 12-, 8-, and 4-column underlying modes for wide, compact/tablet, and mobile compositions respectively. These columns describe alignment logic; they are not continuously drawn.

Expose structure only where it performs a job:

- scene boundaries;
- image rails and screenshot frames;
- immediate-proof and evidence strips;
- chapter labels and active orientation;
- relationship between Eskwelabs experience and its credential;
- major route actions and the contact close.

Rules connect labels to the content they identify. Portrait frames crop and focus the real image. Project frames preserve screenshots as evidence. A deliberate grid break must establish one focal point and return to alignment afterward. Decorative telemetry, fabricated schematics, continuous graph-paper backgrounds, and geometry added only to fill empty space remain prohibited.

## Content-preservation rules

Responsive simplification may remove or reduce:

- decorative grid lines;
- repeated nonessential labels;
- expanded inactive chapter names;
- non-semantic geometric framing;
- optional overlap;
- excess whitespace;
- hover-only embellishment.

It may not remove, hide behind interaction, or defer out of the homepage:

- Hans Amoguis's role focus and approved introduction;
- the `75%` and `~80%` immediate proof with qualifiers;
- direct contact access;
- either flagship project;
- any of the three supporting projects;
- the `/projects` catalogue cue;
- either experience record;
- the Eskwelabs credential and routes to full experience/certificates;
- the real portrait and approved philosophy;
- GitHub, Spotify, or Discord;
- email, LinkedIn, or GitHub in the contact close.

Long source copy and complete technical depth remain on their S1-assigned detail routes. Homepage composition does not solve density by reproducing full case studies.

## Accessibility and non-motion coherence

- Use one page `<h1>` for the opening identity and maintain strict heading order through the six scenes.
- Provide a skip-to-main-content path before persistent navigation.
- Reading and keyboard order follows the narrative sequence even where desktop visuals overlap or reverse alignment.
- Visible focus must remain unobscured by sticky navigation, signal fields, frames, and viewport edges.
- Chapter controls and global links use semantic links or buttons with clear accessible names.
- Current-stage indication uses text, position, and rule treatment in addition to color.
- Project screenshots and the portrait retain meaningful alternative text or nearby descriptions; structural geometry remains hidden from assistive technology.
- The complete hierarchy remains coherent with reduced motion or all animation disabled.
- No content begins hidden solely to support a future entrance animation.

## Relationship to S5 motion design

S3 identifies only composition candidates:

- a desktop chapter/evidence rail may remain sticky;
- selected desktop scene labels or image rails may support later scroll-linked emphasis;
- the hero and scene transitions may support later entrance choreography.

S5 decides whether any candidate moves, pins, or remains static. It must preserve these S3 invariants:

- normal document flow is complete and canonical;
- opening identity, proof, and contact are not delayed or obscured;
- mobile and webview comprehension never depends on pinning or parallax;
- short-height content remains reachable;
- reduced-motion presentation retains the same hierarchy;
- motion cannot change project order, evidence priority, or navigation responsibility.

## Normative precision rules

The following rules resolve edge cases and override any looser wording elsewhere in this specification.

### Opening feasibility and height

- The supported narrow-width validation baseline is `320 × 568px`. At that size and on taller mobile viewports, the priority cluster—professional name, role/introduction, both qualified proof figures, and direct contact action—must fit before the portrait and before any decorative geometry. Copy may use the concise S1-approved opening language and compact proof labels, but qualifiers and attribution remain visible.
- If browser chrome or an unusually short viewport reduces usable height below that baseline, every priority item still precedes the portrait in the stated order. The opening becomes naturally scrollable; no priority item is hidden, collapsed, or deferred, and body text or touch targets do not shrink to preserve a single-screen illusion.
- On wide viewports with less than approximately `700px` of usable height, the hero uses compact-desktop composition. It does not vertically center all content inside a viewport-filling frame. Name, portrait, proof, and actions remain in natural flow, and the red field may extend with the content rather than clip it.
- Hero minimum height is bounded by natural content height plus modest compositional breathing room. The layout must not enforce `100vh`, `100svh`, or an equivalent viewport lock regardless of content. On a tall display the hero may naturally fill or nearly fill the first screen; that is an outcome of content and spacing, not a requirement.

### Flagship density

Selected technical evidence means at most three concise source-backed labels or one-line statements per flagship. These may identify stack choices, architecture patterns, integrations, or technical decisions, but they do not reproduce a feature list or technology inventory. Complete technical depth remains on the project detail route.

### Portrait differentiation

Scene 01 and Scene 05 may use the same source portrait with different crops, scale, or framing, or different existing portrait sources when available. The opening portrait establishes professional identity; the personal-scene portrait supports human presence. If one source image serves both, Scene 05 must be editorially distinct enough not to read as an accidental duplicate, while both uses remain recognizably Hans.

### Navigation target semantics

The global **Contact** link and chapter **06 Contact** control may resolve to the same homepage scene. Their responsibilities remain distinct: global Contact is a site-level destination action, while `06 Contact` is homepage positional orientation. When simultaneously available, their accessible names distinguish those purposes, for example “Contact — site navigation” and “Go to section 06 Contact.” A future dedicated contact route may change the global target only through a later approved route decision.

### Stable live-provider regions

- Each live provider reserves the footprint required by its healthy-state composition during initial loading and temporary failure.
- GitHub retains its full primary evidence-rail allocation and does not collapse to a line that pulls Spotify or Discord into the primary region.
- Spotify and Discord retain their subordinate positions regardless of GitHub state.
- Provider state changes are announced politely without taking focus, moving scroll position, or interrupting the current reading position.

### Heading identity

The sole page `<h1>` is **Hans Amoguis**, the professional identity. The role statement and approved introduction are subordinate heading or paragraph content. Visual line breaks in the name do not change its accessible text.

## Acceptance checks

A homepage composition conforms to S3 only when all answers are yes:

1. Does the opening immediately identify Hans Amoguis, his role focus, end-to-end ownership, the qualified `75%` and `~80%` outcomes, and a contact path?
2. On mobile, do identity, role/introduction, both proof figures, and contact precede the portrait when space cannot fit all of them in the first viewport?
3. Does the portrait remain recognizable and part of the opening scene without obscuring required evidence?
4. Are Le Doux and Clarift clearly the two flagships inside one shared dossier?
5. Do both flagship records work in normal flow without horizontal scrolling or pinning?
6. Are both experience records equally legitimate without implying a freelance date or chronology?
7. Is the Eskwelabs credential visibly attached to the corresponding experience rather than presented as another job or chapter?
8. Are SimplyNote, The Podium, and HCDC LFMS all visible as distinct records with an explicit `/projects` catalogue route?
9. Does the personal scene prioritize portrait/philosophy and GitHub while keeping Spotify and Discord visible and subordinate?
10. Do provider failures preserve the static personal narrative and stable composition?
11. Are global route navigation and homepage chapter orientation visibly and semantically distinct?
12. Does the chapter rail compact or disappear before it collides with content or short viewport height?
13. Does every scene remain understandable with sticky behavior, smooth scrolling, and animation disabled?
14. Does mobile use native vertical flow without horizontal galleries, side-by-side evidence, or hidden interactions?
15. Does responsive simplification remove geometry before evidence, actions, or orientation?
16. Does light mode use only the hero and contact as broad red anchors with neutral recovery between them?
17. Does dark mode preserve hierarchy through black depth and concentrated ice rather than broad cyan substitution?
18. Do reading order, heading order, focus visibility, touch targets, and non-color state cues remain accessible in every composition mode?

## Downstream constraints established by S3

Subject to written-spec review and docket confirmation:

- S4 must treat the homepage as a six-scene recruiter brief and may not relocate secondary-route density back into homepage compositions.
- S5 may enhance the hero, rails, and scene transitions but must keep complete normal flow, immediate opening evidence, mobile/webview native flow, short-height reachability, and reduced-motion coherence.
- S5 must not introduce horizontal homepage galleries, required pinning, or motion-dependent navigation semantics.
- S6 must support distinct global and homepage chapter navigation responsibilities, 12/8/4-column alignment modes, capability overrides, and stable live-provider footprints without flattening the scenes into generic cards.
- Later implementation must preserve every S1-allocated homepage record at every breakpoint; only decorative structure and spatial arrangement may simplify.

## Outcome

The homepage becomes a six-scene hybrid evidence journey: a bold adaptive Red Signal identity opening, a neutral sequence of flagship work, experience, supporting work, and personal evidence, then a decisive contact close. Desktop uses selective cinematic asymmetry; tablet reduces it; mobile becomes an evidence-first native reading flow. Navigation layers have separate jobs, geometry remains structural, and no composition depends on future motion to be complete.
