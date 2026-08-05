# Cross-theme Red Signal Visual Language Design

**Date:** 2026-08-04  
**Session:** S2 · Cross-theme Red Signal visual language  
**Status:** Approved  
**Grammar name:** Constructed Signal

## Purpose

Define one visual grammar for the complete portfolio that carries the approved Red Signal identity across light and dark themes. The system must preserve strong editorial impact, recruiter-readable evidence, and personal character without allowing accent color, geometry, or metadata to become clutter.

This specification constrains later composition, route-family, motion, and architecture sessions. It does not choose final page layouts or implementation boundaries.

## Governing context

This specification inherits all binding constraints in `docs/dockets/portfolio-redesign-docket.md` and the S1 content contract in `docs/superpowers/specs/2026-08-04-portfolio-narrative-content-allocation-design.md`.

The approved Red Signal prototype remains a visual reference, not a production template. Its essential contribution is the tension among editorial scale, visible construction, high-impact signal color, disciplined reading surfaces, portrait presence, and concise evidence. Its exact homepage layout, placeholder portrait, prototype copy, and isolated interaction demo are not binding.

A real portrait exists at `app/assets/myImages/hans.webp`. This supersedes the earlier prototype assumption that only a placeholder was available.

## Scope

S2 defines:

- the named cross-theme visual grammar;
- semantic color roles and theme transformation rules;
- accent-dominance boundaries;
- typography roles;
- grid, rule, and geometric vocabulary;
- spacing and density rhythm;
- portrait, project, certificate, and diagram treatment;
- recurring static interaction-state appearance;
- accessibility constraints on visual treatment;
- visual decisions that later page sessions must preserve.

S2 does not define:

- final homepage section composition;
- route-specific templates or responsive arrangements;
- animation choreography, duration, easing, or engine ownership;
- React components, CSS architecture, dependencies, or migration steps;
- new portfolio claims, copy, or content selection;
- implementation tasks or sequencing.

## 1. Constructed Signal

Constructed Signal is a structure-first editorial grammar. Its identity is not a red theme with a separate blue alternative. Both themes use the same five constants:

1. **Exposed structure:** selected grid lines, rules, frames, and intersections reveal how content is organized.
2. **Editorial scale:** extreme contrast between short display statements, readable text, and compact metadata creates hierarchy.
3. **Semantic indexing:** numbering and labels orient the reader or identify evidence; they never simulate technical complexity.
4. **Truthful imagery:** portrait, product, certificate, and diagram treatments preserve the identity and informational value of their sources.
5. **Controlled irregularity:** occasional overlap, offset, crop, caption asymmetry, or deliberate grid-breaking introduces human character inside a disciplined system.

Color reinforces these constants but does not replace them. A page must still read as Constructed Signal when viewed in grayscale.

### Rejected calibrations

- **Poster Signal:** frequent Anton display text, broad accent fields, and repeated overlap would produce short-term impact but exhaust long routes and compete with evidence.
- **Quiet Signal:** mostly neutral surfaces with minor accent marks would improve calmness but retreat too far from the approved Red Signal direction.

Constructed Signal occupies the controlled middle: unmistakable emphasis followed by clear reading relief.

## 2. Cross-theme color system

### Canonical roles

| Role | Light theme | Dark theme | Purpose |
|---|---|---|---|
| Foundation | Warm ivory, anchored at `#F3F0E9` | True black, anchored at `#000000` | Default environmental surface |
| Reading surface | Light paper, near `#FBFAF7` | Raised near-black, near `#09090B` | Long-form copy and dense evidence |
| Primary text | Ink, near `#151515` | Soft white, near `#FAFAFA` | Main readable content |
| Secondary text | Accessible warm gray | Accessible cool gray | Supporting copy and metadata |
| Structural line | Ink-derived low-emphasis line | White- or ice-derived low-emphasis line | Grid, rules, and frames |
| Brand signal | Red `#E10600` | Ice blue `#00E5FF` | Emphasis, active state, focus, and orientation |
| Inverse signal text | Accessible light neutral or ink, selected per contrast | Black | Text/icons on solid signal fields |
| Raised neutral | Slight tonal shift from ivory/paper | Slight tonal shift from black/near-black | Hierarchy without shadow |

`#E10600` and `#00E5FF` are the only brand accents. Tonal support may use transparency or neutral mixing for subtle borders and backgrounds, but must not create additional competing reds or blues.

Exact secondary-neutral values may be finalized during design architecture only if they preserve the roles and contrast requirements defined here. The canonical foundations and signal values may not change without reopening S2.

### Role-equivalent transformation

Theme transformation preserves semantic role and visual hierarchy, not equal accent area.

- Red text, rules, focus indicators, active marks, and small signal controls map directly to ice-blue equivalents.
- A broad red light-mode field normally maps to black or near-black tonal depth with ice-blue typography, edges, indexing, or a smaller concentrated ice field.
- Dark mode does not replace every red pixel with cyan. Large cyan planes are exceptional because their emitted brightness would reverse the intended reading hierarchy.
- Neutral reading surfaces remain neutral in both themes.
- Project screenshots and certificate images do not recolor when the theme changes.
- The portrait remains visually stable; only its structural framing changes accent.
- Red may appear in dark mode for genuine error or destructive meaning. It may not act as brand emphasis, active navigation, selection, or decoration.

### Accent-dominance boundary

Signal color is contextual rather than governed by an arbitrary page-area percentage.

Large red fields are reserved for one of four semantic jobs:

- identity or chapter emphasis;
- featured evidence;
- a decisive transition in hierarchy;
- a strong closing action or statement.

The following boundaries apply:

- Long-form reading and dense evidence use neutral reading surfaces.
- Two large signal fields may not be adjacent; a meaningful neutral recovery region must separate them.
- Small repeated records do not each receive independent solid-red panels.
- Only one visual element should hold dominant signal-color emphasis within a single reading cluster.
- Dark mode follows the same hierarchy while normally concentrating ice blue in type, rules, edges, and smaller fields.
- Accent use must clarify hierarchy; color added only to make a region feel less empty is prohibited.

## 3. Typography

Constructed Signal uses three explicit typographic roles.

### Anton — display signal

Anton is reserved for short, high-impact display statements such as identity marks, major chapter openings, and concise project-impact headlines.

- Prefer one to three lines.
- Do not use Anton for paragraphs, dense evidence, navigation, controls, or routine subheadings.
- Do not copy the prototype's extreme tracking values literally. Anton is already condensed; tracking and line height must preserve letter recognition.
- Overlap or cropping may be used only when the complete phrase remains understandable.
- Display text must not obscure faces, essential screenshot content, or interactive labels.

### Inter — reading and interface

Inter carries body copy, summaries, ordinary headings, navigation, controls, captions requiring sustained reading, and long-form case-study content. It is the default when a text role does not require display impact or technical indexing.

### JetBrains Mono — indexing and evidence metadata

JetBrains Mono carries two-digit chapter and record numbers, dates, evidence types, concise technical labels, and real interface states.

- Mono text must remain large and contrasted enough to read; it is not decorative microtext.
- Labels must identify hierarchy, provenance, category, or state.
- Fake coordinates, simulated terminal output, decorative system statuses, and redundant tags are prohibited.

### Hierarchy rule

A reading cluster should not present all three voices at equal strength. Anton establishes the dominant statement, Inter explains it, and JetBrains Mono indexes it. If no display statement is needed, Inter leads and mono remains subordinate.

## 4. Grid, rules, and geometry

### Underlying grid

All routes use a consistent underlying column logic. S3 and S4 will define route-specific and responsive arrangements, but they must preserve deliberate alignment and shared gutters.

The grid is selectively exposed:

- show construction lines at meaningful boundaries, image rails, evidence strips, chapter transitions, or editorial fields;
- keep long-form reading surfaces quiet;
- allow an element to cross columns when the break establishes one clear focal point;
- resume alignment around and after a deliberate break;
- avoid multiple competing grid breaks in one emphasis area.

The grid must never become continuous graph-paper wallpaper.

### Geometric vocabulary

Allowed recurring forms are:

- straight horizontal and vertical rules;
- rectangular fields and frames;
- offset rectangular frames;
- structural intersections and registration-style marks;
- occasional circles used as a focal, crop, or indexing device.

Geometry must divide, align, frame, crop, connect, or focus real content. Unsupported wireframes, node diagrams, random coordinates, fake measurements, floating shapes, gradients, glass effects, and decorative glow are excluded.

Actual architecture diagrams or technical illustrations are allowed only when they communicate source-backed project information. Their visual treatment must use the same typography, rules, and theme roles without inventing evidence.

### Rule hierarchy

Use line weight and contrast semantically:

- fine low-contrast lines expose structure;
- standard 1px rules separate readable groups;
- a heavier rule may mark a major hierarchy change or active state;
- repeated thick borders around ordinary records are prohibited.

## 5. Spacing and density

Spacing follows an 8-point base rhythm, with optical adjustment allowed for display typography, image crops, and 1px rules.

Constructed Signal uses contrast rhythm:

- **Expansive zones:** identity statements, chapter emphasis, major imagery, and featured evidence receive generous space.
- **Reading zones:** paragraphs and supporting evidence use moderate, consistent spacing that preserves association.
- **Dense zones:** metadata rails, evidence strips, navigation, and controls use compact but accessible spacing.

Large empty space must establish hierarchy or pacing. It may not be used uniformly as a substitute for composition. Long routes alternate emphasis and recovery rather than treating every region as a full-viewport scene.

## 6. Imagery and evidence treatment

### Portrait

The real Hans portrait remains recognizable and visually stable across themes.

- Use a high-contrast monochrome or lightly desaturated treatment rather than red or ice duotone skin.
- Use an editorial rectangular crop with square or nearly square corners.
- Theme-reactive rules, labels, offset frames, and geometric overlays carry red or ice emphasis.
- Cropping may feel candid and asymmetrical but must not obscure the face or turn the person into an anonymous silhouette.
- A rare hard-offset print-registration shadow may emphasize the portrait; soft photographic drop shadows are excluded.

### Project screenshots

Project imagery is full-color evidence.

- Preserve source colors, text legibility, and meaningful UI details.
- Do not require hover to reveal accurate color or information.
- Theme identity belongs to the surrounding frame, caption rail, numbering, rules, and background.
- Do not apply a global red, blue, monochrome, or desaturation filter that makes different products appear artificially identical.
- Crops must support the claim or feature being discussed and must not imply unavailable functionality.

### Certificates

Certificates are documentary artifacts and remain subordinate to project evidence.

- Preserve original colors, issuer marks, and complete meaningful content.
- Present them on a quiet paper or near-black mat with a sharp rule and concise issuer/date metadata.
- A small red or ice marker may provide orientation or verification emphasis.
- Do not use dramatic tinting, illegible thumbnailing, arbitrary cropping, or full-bleed cinematic treatment.

### Diagrams and abstract visuals

Real project diagrams may use the Constructed Signal frame. Abstract geometry may support identity only when it obeys the structural-purpose rule. Abstract graphics must never masquerade as project evidence or replace an available real image.

## 7. Surfaces and depth

The system uses flat architectural planes.

- Corners are square or minimally rounded only where usability requires differentiation.
- Tonal surface changes, rules, overlap, and spacing establish depth.
- Soft drop shadows, blurred glow, glassmorphism, and nested card containers are excluded.
- A hard offset shadow is allowed rarely for a focal portrait or featured artifact and must not become a repeated card style.
- Repeated records should read as an editorial sequence or structured field, not a generic card grid.

## 8. Interaction-state appearance

This section defines static visual semantics only. S5 owns timing, motion, and choreography.

| State | Visual treatment |
|---|---|
| Rest | Neutral text and sharp rule or boundary |
| Hover | Theme accent appears in text, border, underline, or directional mark |
| Current/selected | Concentrated theme-accent field or strong accent rule with accessible inverse text |
| Keyboard focus | Explicit outer accent ring or outline, visually distinct from hover |
| Pressed | Stronger graphic inversion or offset without changing layout dimensions |
| Disabled | Muted neutral treatment; no accent and no false active affordance |
| Error/destructive | Restrained semantic red plus explicit text/icon cue |
| Success/warning/info | Restrained accessible semantic color only for a real state, plus text/icon cue |

Interaction states use sharp graphic change rather than ambient glow. Color is never the only state indicator. Focus remains visible on both neutral and signal surfaces.

Theme controls and navigation use only the active theme's brand signal. A dark-theme control may not use red merely to preview or advertise light mode.

## 9. Controlled human irregularity

Personal character comes from disciplined exceptions rather than novelty decoration.

Allowed methods include:

- candid portrait cropping;
- one purposeful type or image overlap in an emphasis area;
- asymmetrical captions;
- offset frames;
- concise first-person annotations sourced through the S1 content rules;
- a deliberate grid break that returns to alignment.

Stickers, doodles, frequent rotation, handwritten fonts, novelty cursor decoration, and arbitrary scrapbook layering are not part of the grammar. Personal character must not weaken evidence clarity or senior-engineering credibility.

## 10. Accessibility requirements

- All readable text and meaningful icons must meet WCAG AA contrast for their size and use.
- Canonical red `#E10600` on warm ivory `#F3F0E9` measures approximately `4.36:1`; it is allowed for large text, meaningful graphical marks, rules, focus indicators, and non-text emphasis, but not normal-size body or metadata text.
- Canonical red `#E10600` on paper `#FBFAF7` measures approximately `4.76:1` and may carry normal-size text when the final font weight and rendering remain legible.
- White on canonical red measures approximately `4.97:1` and is the default normal-text pairing for a solid red field. Ink near `#151515` on canonical red measures approximately `3.68:1` and is limited to qualifying large text or non-text graphics, not normal-size copy.
- Ice blue `#00E5FF` on black measures approximately `13.65:1`; black is the default text color on a solid ice field.
- Signal color on any other neutral foundation must be tested as a foreground/background pair; canonical brand values do not automatically authorize every pairing.
- Inverse text on signal fields must use the accessible neutral defined for that theme and text size.
- Secondary text may not use the low-contrast structural-line token.
- Metadata remains readable and cannot be reduced to ornamental microtype.
- Focus indicators remain visible against ivory, paper, red, black, near-black, ice, and full-color imagery.
- Meaning conveyed through color must also appear through wording, iconography, position, or rule treatment.
- Project and certificate images require context-appropriate alternative text or nearby descriptions; decorative geometry is hidden from assistive technology.
- Visual design must remain coherent under reduced motion; no essential hierarchy may depend on animation.

## 11. Documentation reconciliation

The statements in `AGENTS.md`, `CLAUDE.md`, `docs/01-project-brief.md`, and `docs/04-visual-direction.md` that describe deep black and ice blue as the only palette are stale as portfolio-wide guidance.

For this redesign they are interpreted as the dark-theme invariant:

- dark foundation: black;
- dark brand signal: ice blue;
- no red as a dark-theme active or decorative brand accent.

The complete authoritative direction is dual-theme:

- default light: warm ivory plus red;
- optional dark: black plus ice blue;
- one Constructed Signal grammar across both.

This specification records the reconciliation but does not perform guardrail-document migration, which is outside S2.

## 12. Constraints for later sessions

S3 and S4 may choose compositions but must:

- preserve Constructed Signal's structure-first identity;
- use role-equivalent, area-asymmetric theme transformation;
- reserve broad red fields for semantic emphasis and provide neutral recovery;
- avoid broad cyan substitution as the default dark-mode translation;
- preserve the Anton, Inter, and JetBrains Mono role boundaries;
- keep the grid selectively exposed and geometry purposeful;
- keep the portrait stable while its frame transforms;
- preserve full-color project evidence and documentary certificate treatment;
- use semantic indexing rather than decorative telemetry;
- use flat architectural planes and graphic interaction states;
- introduce personality through controlled irregularity;
- preserve accessible contrast, visible focus, and non-color cues.

S5 may animate these visual roles but may not change their hierarchy or make accurate imagery, readable content, or state meaning depend on motion.

S6 may define tokens and ownership boundaries but may not merge the two accents into one cross-theme color, change canonical signal values, or turn route-specific composition into a generic card system.

## 13. Design acceptance checks

A later composition conforms to S2 when all answers are yes:

1. Does it remain recognizably Constructed Signal in grayscale?
2. Is light mode ivory/red and dark mode black/ice without red acting as dark brand emphasis?
3. Does dark mode preserve hierarchy without mechanically replacing large red areas with large cyan areas?
4. Is there neutral recovery between dominant signal fields?
5. Are Anton, Inter, and JetBrains Mono used only for their defined roles?
6. Do visible grid lines and geometric forms serve content structure?
7. Does every number or metadata label communicate real hierarchy, provenance, category, or state?
8. Is the portrait recognizable and stable across themes?
9. Are project screenshots truthful and full color?
10. Are certificates treated as legible documentary evidence?
11. Are surfaces flat and architectural rather than glassy or card-heavy?
12. Are hover, selected, focus, disabled, and semantic states visually distinguishable without color alone?
13. Does controlled irregularity add character without obscuring evidence?
14. Do all text, focus, and state pairings satisfy accessibility requirements?

## Outcome

Constructed Signal becomes the shared visual language for the full redesign. Light and dark modes are two transformations of one system: warm editorial impact in ivory/red and technical cinematic depth in black/ice. Structure, evidence, and human presence remain constant while signal color changes role-equivalently rather than area-equivalently.
