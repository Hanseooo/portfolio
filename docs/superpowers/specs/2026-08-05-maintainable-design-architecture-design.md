# S6 Maintainable Design Architecture

**Date:** 2026-08-05  
**Session:** S6 · Maintainable design architecture  
**Status:** Approved  
**Docket:** `docs/dockets/portfolio-redesign-docket.md`  
**Upstream contracts:** S1 Portfolio Narrative and Content Allocation; S2 Cross-theme Red Signal Visual Language; S3 Homepage Composition and Responsive Transformation; S4 Secondary Routes and Reusable Page Families; S5 Motion and Interaction Semantics

## 1. Purpose

Define durable ownership seams for the complete portfolio redesign so its content, dual-theme visual system, responsive compositions, page families, and selective cinematic motion can evolve without duplicated policy or a universal template that erases meaningful differences.

The governing architecture is **Layered Semantic Modules**. Reuse follows shared meaning, behavior, and variance rather than superficial visual similarity. Modules should be deep: callers receive a small semantic interface while content selection, omission, theme transformation, capability decisions, lifecycle management, and accessibility safeguards remain local to the responsible implementation.

This specification defines design architecture only. It does not sequence implementation, create tickets, prescribe a migration, install dependencies, or reopen observable behavior approved by S1–S5.

## 2. Governing constraints

This architecture preserves all confirmed docket constraints. In particular:

- existing production content remains the factual source of truth;
- the homepage retains S3's six-scene Evidence Ladder and secondary routes retain S4's adaptive evidence bodies;
- Constructed Signal remains the shared cross-theme grammar;
- light mode remains default ivory/red and dark mode remains black/ice;
- native document flow, visible evidence, semantic navigation, focus, and recovery are the baseline;
- motion remains Selective Cinematic Motion with Signature Moments;
- CSS, Framer Motion, GSAP/ScrollTrigger, native observation, and Lenis retain S5's distinct responsibilities;
- reduced motion and constrained environments receive complete static/native behavior;
- GSAP and Framer Motion never own the same animated property on the same node.

Where current implementation differs from S1–S5, this specification describes the approved future ownership model, not a justification for retaining current behavior.

## 3. Architecture decision: Layered Semantic Modules

### 3.1 Extraction rule

A responsibility earns a shared module when consumers share:

1. the same semantic job;
2. the same behavioral invariants;
3. the same accessibility and failure obligations; and
4. a bounded set of legitimate variations.

Visual resemblance alone is insufficient. A shared module that requires route names, many booleans, or compound visual variants to remain usable is too shallow; the route composition should retain ownership instead.

### 3.2 Layer model

The architecture has six cooperating layers:

1. **Source records** — authoritative factual content.
2. **Content projections** — named, deterministic selections and transformations for approved communication jobs.
3. **Design foundations** — canonical, semantic, and pattern-level tokens.
4. **Semantic frames and evidence patterns** — shared landmarks, orientation, reading, and repeated evidence contracts.
5. **Route and scene compositions** — deliberate page-family and scene-specific spatial arrangements.
6. **Enhancement runtime** — capability policy, motion recipes/controllers, route handoff, scroll enhancement, and lifecycle cleanup.

Dependencies point downward through these layers. Source records and projections do not depend on presentation or motion. Frames do not select content. Motion enhances existing composition and cannot determine content order or existence.

## 4. Content ownership and projection seam

### 4.1 Source records

The factual authorities remain the current production sources, including:

- `lib/projects.ts` for project and case-study evidence;
- `lib/experience.ts` for career records;
- `lib/certificates.ts` for credentials;
- current homepage/about sources for identity and philosophy;
- existing activity sources for GitHub, Spotify, and Discord;
- existing portrait assets and configured contact destinations.

A redesign module may not silently establish a parallel factual catalogue. Approved editorial summaries remain traceable to a source record and to S1 approval.

### 4.2 Named content projections

A content projection is a deterministic view of authoritative records for one approved communication job. Two projection responsibilities remain distinct:

- **factual projections** select, order, relate, deduplicate, and omit evidence from authoritative records without rewriting it;
- **editorial projections** own the exact S1-approved concise summaries and labels keyed to stable source-record identity.

S1-approved editorial copy is not added to factual source records and is not an independent factual catalogue. It lives with the named projection that uses it, carries provenance to the source record and S1 approval, and may change only through explicit editorial approval. A factual change begins in the authoritative source and then requires review of every affected editorial projection; presentation never silently repairs or updates the summary.

Named projections own such decisions as:

- current homepage flagship and supporting-project selection;
- homepage experience summaries and attached Eskwelabs credential;
- complete collection order;
- record position and non-wrapping adjacency;
- project hero/gallery deduplication;
- complete versus concise evidence allocation;
- omission of unavailable links, dates, outcomes, integrations, or verification actions;
- approved provider-state labels and stable-state identity.

A projection returns presentation-ready semantic data without adding unsupported facts. It retains stable source identity so claims, actions, images, and metadata remain traceable.

### 4.3 Presentation contract

Presentation modules render the projection they receive. They do not:

- independently filter, rank, or select homepage content;
- infer missing values;
- calculate record adjacency;
- deduplicate a hero from its gallery;
- borrow a fallback field from another record;
- convert missing optional evidence into empty controls or false statuses;
- reproduce source interpretation in multiple routes.

Interactive provider data is an exception only in timing, not truth: the live-state module owns loading, success, unavailable, and error replacement inside an S3-stable footprint, while the static narrative remains independent.

## 5. Token architecture

Tokens use three levels. The levels are intentionally limited; not every number becomes a token.

### 5.1 Canonical constants

Canonical constants express identity or portfolio-wide physical foundations:

- brand red `#E10600` and brand ice `#00E5FF`;
- approved font families and role assignments;
- the 8-point spacing foundation;
- base rule weights and corner policy;
- shared motion timing, easing, distance, and density budgets.

Canonical values do not encode a theme-specific usage decision.

### 5.2 Semantic roles

Semantic tokens map canonical values and accessible neutrals to meaning in each theme, including:

- foundation and reading surface;
- raised neutral;
- primary and secondary text;
- structural line and strong divider;
- brand signal roles annotated by permitted context—normal text, qualifying large text, non-text graphics/rules, solid-field background, focus, or control state—and their inverse content;
- focus, selection, disabled, and genuine semantic status roles;
- documentary mat and evidence-frame roles.

Theme consumers request roles, not raw red or ice. A semantic color role includes its contrast-qualified usage restrictions, not only a color value. In particular, canonical red on warm ivory is unavailable to normal-size text; consumers must select an approved readable-text role or a signal role explicitly limited to large text or non-text emphasis. Dark mode may not mechanically substitute cyan area for red area; semantic role mapping preserves S2's area-asymmetric transformation.

### 5.3 Pattern contracts

Pattern tokens describe repeated structural relationships with stable meaning, including:

- portfolio and reading gutters;
- 12-, 8-, and 4-column alignment modes;
- readable text measure;
- compact indexed masthead spacing;
- evidence-band and rule rhythm;
- minimum interactive target size;
- persistent-navigation anchor offset;
- recipe-level motion parameters.

Unique portrait crops, deliberate overlaps, record-specific image ratios, local column spans, and one-off offsets remain composition-owned unless repeated use proves they share a semantic contract. This prevents token catalogues from becoming a second styling language.

### 5.4 Token constraints

- Presentation does not introduce raw brand colors.
- Normal text pairings use only contrast-approved semantic roles.
- Structural-line roles are never reused as readable secondary text.
- Motion recipes consume shared budgets rather than creating unreviewed timings.
- Tokens express permitted choices; they do not replace S2's hierarchy and accent-dominance rules.

## 6. Composition architecture

### 6.1 Portfolio frame

The portfolio frame owns concerns that are universal across routes:

- skip-to-main destination and landmark order;
- global navigation and footer relationship;
- theme and route-handoff participation;
- route-level focus-safe entry;
- portfolio gutters and safe-area behavior;
- placement of the branded full-load arrival;
- utility-state continuity with the shared shell.

The frame does not own homepage chapter navigation, project local navigation, content selection, or route-specific layout.

### 6.2 Page-family frames

Page-family frames encode S4's shared editorial spine without forcing identical bodies. Their small interface covers applicable orientation data and semantic regions:

- compact indexed masthead;
- parent or Home orientation;
- reading alignment;
- optional local contents region;
- body region;
- applicable record continuation;
- shared contact/footer transition.

Project collection, certificate register, career ledger, project dossier, certificate documentary record, and utility frame retain distinct internal compositions. There is no universal secondary-page template with visual variant flags.

### 6.3 Homepage scene frame

The homepage scene frame owns only the stable scene contract:

- section landmark and stable ID;
- semantic scene number and heading association;
- surface role;
- chapter-navigation registration;
- standard scene boundary and reading-order guarantees;
- optional structured-reveal boundary.

Each of the six S3 scenes owns its internal projection and composition. Hero overlap, flagship reversal, experience/credential attachment, project-register rhythm, live-provider hierarchy, and Contact signal treatment are not generalized into scene variants.

### 6.4 Evidence-pattern modules

Repeated evidence earns shared modules only where semantics and obligations match. Candidate contracts include:

- indexed evidence unit;
- proof figure with attribution and qualifier;
- full-color screenshot evidence frame;
- documentary artifact frame;
- stable live-provider state region;
- parent and linear record continuation;
- empty-safe optional action group.

A candidate is rejected if sharing it would make project evidence resemble certificate evidence, flatten GitHub/Spotify/Discord priority, or turn editorial registers into generic cards.

### 6.5 Route compositions

Route and scene compositions own:

- DOM order required by S1–S4;
- local columns, asymmetry, controlled alternation, and deliberate grid breaks;
- image and text relationships;
- responsive rearrangement inside the approved hierarchy;
- placement of semantic frames and evidence modules;
- explicit motion-target nesting where enhancement is eligible.

They may vary substantially while consuming the same tokens and frame contracts. Reuse is not measured by identical markup.

## 7. Responsive and capability ownership

### 7.1 CSS owns composition

CSS owns width- and content-fit-driven presentation:

- 12-, 8-, and 4-column alignment;
- wrapping, stacking, reordering only where DOM order remains unchanged, and ordinary flow;
- typography scaling within approved role bounds;
- visible geometry and surface transformation;
- container-sensitive evidence arrangement;
- short-content and overflow behavior.

Responsive intent remains legible in the composition. JavaScript does not return layout class names or recreate CSS breakpoint logic.

### 7.2 Capability policy owns enhancement eligibility

One capability-policy module is the authority for runtime facts and the resulting S5 tier. It evaluates:

- reduced-motion preference;
- pointer precision and coarse input;
- touch dominance;
- usable viewport height and focal-content fit;
- webview or constrained-browser reliability;
- browser restoration state;
- support required by an enhancement.

Consumers request named policy decisions such as eligibility for branded arrival, route handoff, Lenis, parallax, sticky enhancement, structured reveal, or magnetic response. They do not independently query user agents, `matchMedia`, pointer state, or viewport height.

### 7.3 Policy invariants

- Reduced motion overrides all richer tiers.
- Capability uncertainty selects the simpler behavior.
- Pending, delayed, failed, or hydration-mismatched policy initialization exposes the simplest static/native tier. Richer eligibility may be granted only after facts are resolved consistently; consumers never assume enhancement while policy state is unknown.
- Width alone never grants motion eligibility.
- Policy enables enhancement; it never removes content, actions, orientation, or recovery.
- CSS remains authoritative for layout even when the runtime tier changes.
- Native scrolling and immediate visible content are valid without the capability module.

## 8. Motion architecture

There is no universal animation facade. Each engine has an explicit semantic owner and keeps its native strengths behind a small interface.

### 8.1 Shared motion foundations

Shared motion foundations own S5's timing, easing, distance, density, and concurrency budgets. They also define the final-visible baseline and reduced-motion values consumed by recipes.

### 8.2 Framer Motion recipes

Framer recipe modules own:

- presence for menu/dialog and replacement states;
- non-scroll mount entrances;
- structured in-view reveals;
- bounded internal staggering where it clarifies one editorial unit.

A recipe defines its semantic purpose, final visible state, reduced-motion state, replay rule, interruption behavior, and permitted properties. Consumers choose a named recipe rather than constructing arbitrary variants.

### 8.3 GSAP/ScrollTrigger effects

Each GSAP effect module owns a complete continuous scroll-linked relationship:

- required target roles;
- permitted transformed properties;
- capability and content-fit eligibility;
- trigger boundary;
- setup after entrance resolution;
- interruption and final-state resolution;
- scoped timeline/trigger creation;
- teardown and refresh responsibilities.

Effects are attached locally by the composition that owns the visual relationship. Global trigger creation, broad selectors, generated pin spacers, and unbounded page-level timelines are outside the contract.

### 8.4 Route-handoff controller

One route-handoff controller exclusively owns S5's Cover → Navigate → Reveal lifecycle. Its interface accounts for:

- eligible pathname-changing internal navigation;
- external, modified, download, hash-only, and same-route exclusions;
- menu-to-route continuity;
- one-destination resolution under rapid activation;
- the 900ms coverage ceiling and truthful loading-state reveal;
- focus and interruption priority;
- browser Back/Forward and restoration bypass;
- reduced-motion and constrained-environment immediate navigation.

Destination compositions do not start independent route overlays or second opening delays.

### 8.5 Scroll-enhancement controller

One scroll-enhancement controller owns Lenis creation and destruction, synchronization with eligible scroll-linked effects, semantic anchor requests, interruption by user input, and native fallback. No consumer reads a global Lenis instance directly.

The route-handoff controller coordinates scrolling only through this interface: it may request suspension before coverage/navigation and restoration or destination positioning after reveal. It does not manipulate Lenis directly, and failure or absence of the scroll enhancement leaves native navigation and restoration authoritative.

The scroll-enhancement controller does not own section determination, visual element animation, route transitions, or composition.

### 8.6 Branded arrival

The portfolio frame owns the branded-arrival lifecycle and placement; its motion recipe owns presentation. The arrival recipe's interface includes immediate resolution to its valid final state, not merely start and timed completion.

Destination utility frames declare when an error, not-found state, or available recovery action has priority. The portfolio frame observes that destination-state contract and immediately instructs the arrival recipe to resolve; the utility frame does not manipulate arrival motion itself. The same immediate-resolution path applies when capability eligibility is lost or user restoration is detected during arrival. This ownership prevents the arrival recipe, utility frame, and route-handoff controller from racing to control coverage.

Arrival state does not require a global provider unless another cross-route responsibility genuinely consumes that state. The contract preserves S5's recurrence, restoration bypass, truthful non-progress presentation, `0.8–1.2s` target, reduced-motion omission, direct handoff to the destination's settled opening, and immediate utility-state recovery.

## 9. Animation ownership and lifecycle contract

Every animated recipe declares:

1. owning engine;
2. semantic target role;
3. properties it may mutate;
4. trigger and eligibility;
5. resting and final state;
6. interruption behavior;
7. cleanup owner.

A node has one engine owner for each animated property. A composition requiring a Framer entrance and GSAP depth uses separate nested targets; the outer entrance target and inner scroll target have independent transform surfaces. Interactive hit areas remain aligned with their visible controls.

CSS may own hover, focus-visible, pressed, selected, current, and brief theme transitions only on properties not owned by an active Framer or GSAP recipe on that node. Native state determines current sections; Lenis performs interpolation only.

Conflict prevention is structural and reviewable. A runtime registry that discovers or arbitrates competing animations is prohibited because ownership must be correct before execution.

Cleanup is part of each module's interface, not caller folklore. Scoped effects remove their observers, listeners, timelines, triggers, ticker callbacks, temporary hints, and pending completion work on interruption or unmount. Cleanup leaves targets in a valid final or resting state.

## 10. Provider and state scope

A stateful responsibility earns a global provider only when unrelated route families must consume or coordinate it.

### 10.1 Global coordination

The approved global responsibilities are:

- theme state;
- capability policy;
- route-handoff lifecycle;
- capability-gated portfolio-wide scroll enhancement.

These responsibilities may be composed by one portfolio runtime shell, but their interfaces remain independent so consumers do not subscribe to unrelated state.

### 10.2 Route-local state

The following remain local to the route or composition that uses them:

- homepage chapter observation and active state;
- project-detail local-section observation and active state;
- scene and evidence reveal scopes;
- GSAP effect instances;
- live-provider requests and replacement states;
- page-family masthead and continuation rendering;
- family-specific loading and recovery presentation.

Static tokens, content projections, and semantic frames do not become providers merely for convenience.

## 11. Navigation and observation seams

Global route navigation, semantic anchor activation, homepage chapter orientation, and project local-section navigation have separate interfaces.

- A portfolio destination resolver owns stable site-level destination intent. For example, global `Contact` resolves to the homepage Contact fragment without making global navigation depend on the chapter-navigation implementation.
- One semantic anchor-navigation module owns same-route and cross-route fragment activation, persistent-navigation offset, destination focus transfer, URL-fragment behavior, and eligible delegation to scroll enhancement.
- Global navigation passes resolved destination intent to route handoff or semantic anchor navigation as applicable; it does not manipulate chapter active state.
- Homepage and project section controls pass their stable target IDs to the same semantic anchor-navigation interface.
- Homepage and project observation remain route-local and consume stable IDs through separate visible compositions.
- One native observation recipe owns the upper-third heading-crossing rule and passive active-state updates.
- Anchor activation updates the fragment and moves focus to the destination heading.
- Passive observation does not write browser-history entries.
- Lenis may fulfill an eligible scroll request but does not determine the active section.

Global Contact and chapter `06 Contact` may therefore share a destination while retaining S3's distinct accessible names and responsibilities. The shared activation seam does not imply shared visible navigation composition.

## 12. Accessibility contracts

Accessibility is an interface obligation at each owning seam rather than a final-page patch.

### Content projections

- preserve source qualifiers, attribution, order, and omission truthfulness;
- provide stable identity for headings, links, images, and status relationships;
- never fabricate fallback evidence.

### Tokens and frames

- expose only contrast-approved readable roles;
- preserve one `h1`, landmark order, skip access, target offsets, and visible focus space;
- maintain at least 44 by 44 CSS-pixel interactive targets where applicable;
- provide non-color current, status, and interaction cues.

### Compositions

- keep DOM, reading, keyboard, and responsive order aligned;
- keep all evidence and actions available without hover, animation, sticky behavior, or smooth scrolling;
- provide appropriate image alternatives and hide structural decoration from assistive technology.

### Runtime and motion

- begin from a final visible semantic/CSS baseline;
- allow direct focus, anchors, input, cancellation, and recovery to resolve motion immediately;
- preserve focus through menu and route lifecycles;
- expose complete reduced-motion and native fallback behavior;
- avoid repeated announcements of decorative motion steps.

A module that cannot state its focus, reduced-motion, interruption, and semantic-baseline behavior does not have a complete interface.

## 13. Performance contracts

- Server-renderable content and static composition remain outside client runtime unless interaction or enhancement requires otherwise.
- Capability state is centralized to prevent duplicate listeners and contradictory tier decisions.
- Route-local observers and effects are scoped to their owning composition and stop offscreen or on unmount as applicable.
- No more than S5's three simultaneous scroll-linked compositions may run in one viewport frame.
- Scroll-linked effects use compositor-friendly transforms and do not alter document layout.
- Expensive animated filters, blur, large shadows, ambient loops, and global broad selectors remain excluded.
- Provider updates do not force unrelated route families or static evidence trees to subscribe.
- Live-provider replacement preserves stable dimensions and reading position.
- Failure of an enhancement removes the enhancement, not content or navigation.

Performance budgets are enforced by module contracts and acceptance evidence, not by relying on callers to remember cleanup conventions.

## 14. Failure and omission ownership

Failure behavior follows the seam that can resolve it truthfully:

- content projections omit absent static evidence and actions;
- live-state modules own provider loading, success, unavailable, and error replacement;
- page-family utility frames own destination-shaped loading and contextual recovery presentation;
- the route-handoff controller reveals truthful loading or error structure before its coverage ceiling;
- motion recipes resolve interrupted targets to final/resting state;
- the scroll-enhancement controller falls back to native behavior if eligibility or initialization fails.

No lower layer invents content to preserve a composition. No visual frame delays or hides a recovery action.

## 15. Acceptance architecture

Validation uses mandatory representative baselines plus risk-based pairings rather than an impractical full Cartesian product.

### 15.1 Representative surfaces

- homepage;
- project collection index;
- Le Doux detail for maximum capability/gallery density;
- Clarift detail for stack/integration density;
- experience career ledger;
- certificate register;
- certificate detail without an external credential URL;
- loading, rendering-error, and not-found utility states.

### 15.2 Environment baselines

- `320 × 568` narrow mobile;
- taller mobile with touch/coarse input;
- tablet/compact composition;
- full desktop with fine pointer and sufficient height;
- short-height desktop below parallax/sticky eligibility;
- constrained webview/native fallback;
- reduced motion.

### 15.3 Cross-cutting dimensions

Coverage collectively includes:

- light and dark themes;
- keyboard-only and touch interaction;
- full load, eligible internal navigation, same-route anchor, and browser restoration;
- live-provider loading, success, unavailable, and error;
- JavaScript enhancement failure or absence where practical;
- source traceability, optional-field omission, contrast, headings, landmarks, focus, and cleanup.

### 15.4 Mandatory high-risk pairings

Every pairing below is a release-blocking acceptance requirement, not an optional sampling suggestion. At minimum, acceptance explicitly exercises:

- homepage light and dark at `320 × 568` with opening evidence before portrait;
- dense project evidence on mobile without hidden or swipe-only content;
- full desktop hero and selected evidence with eligible enhancement;
- short-height desktop with parallax removed and sticky relationships released;
- reduced motion on full load and internal navigation with no timed decorative delay;
- constrained webview with native scrolling and immediate navigation;
- dark-theme error/recovery without red acting as brand emphasis;
- browser restoration without replayed arrival, route handoff, or structured reveals;
- keyboard anchor navigation with visible focused headings;
- live-provider failure with stable scene footprints and unchanged narrative order;
- route interruption and effect teardown without hidden or transformed remnants.

Not every route must run every combination, but every shared architecture contract must be exercised at least once and every route family must be covered in both themes across the complete matrix.

## 16. Structural review rules

A future implementation conforms architecturally only when all answers are yes:

1. Does shared code represent shared semantics rather than visual coincidence?
2. Can source facts be traced through a named projection without presentation-side inference?
3. Do themes consume semantic roles rather than raw brand colors?
4. Are global tokens limited to stable identity and repeated pattern contracts?
5. Do portfolio, page-family, and scene frames have small interfaces without variant proliferation?
6. Do route-specific compositions retain their approved evidence hierarchy and visual differences?
7. Does CSS own responsive composition while one policy owns enhancement eligibility?
8. Do consumers request named capability decisions instead of reading runtime facts independently?
9. Does every motion recipe declare engine, targets, properties, lifecycle, final state, interruption, and cleanup?
10. Are Framer and GSAP transform responsibilities separated onto nested targets where both are needed?
11. Does route handoff have one lifecycle owner with restoration and native exclusions?
12. Does one controller own Lenis without exposing a global instance to consumers?
13. Are global providers limited to cross-route coordination?
14. Are chapter tracking, project local navigation, live providers, and effect instances route-local?
15. Is final visible native behavior preserved when JavaScript enhancement fails?
16. Are optional evidence and failures handled by the seam that knows their truth?
17. Can every module state its accessibility, reduced-motion, interruption, and cleanup obligations?
18. Does acceptance evidence cover every shared contract and the mandatory risk pairings?

## 17. Rejected architecture directions

### Universal portfolio renderer

A schema-driven renderer for every scene and route would centralize layout but require a broad variant language for S3's six scenes and S4's adaptive evidence bodies. It would expose implementation complexity through a shallow interface and hide route intent.

### Route-owned islands

Keeping data shaping, responsive policy, omission, capability detection, and motion entirely route-local would preserve freedom but duplicate exactly the invariants S6 must centralize. Current repeated runtime checks and section-owned timelines demonstrate this risk.

### Atomic visual extraction

Extracting every repeated split row, border, frame, or offset based on appearance would create generic cards and variant-heavy wrappers. Constructed Signal requires consistency of grammar, not identical visible templates.

### Universal motion facade or runtime conflict registry

A generic facade would either expose engine-specific details or reduce every motion family to the lowest common denominator. Runtime conflict arbitration would conceal invalid ownership rather than prevent it. Engine-specific deep modules and structural target ownership provide clearer locality.

## 18. Existing architecture disposition

This specification does not prescribe migration order, but it establishes these ownership outcomes relative to current architecture:

- factual source files remain authoritative, while ad hoc consumer selection moves behind named projections;
- repeated direct runtime checks become one capability-policy responsibility;
- direct access to a global Lenis instance is outside the target interface;
- pathname-triggered transition coverage gives way to one route-handoff lifecycle owner;
- section-owned ad hoc timelines give way to named Framer or GSAP recipes with scoped cleanup;
- homepage and project section determination use native observation rather than animation engines;
- root-level providers narrow to cross-route coordination;
- route-family reuse centers on the editorial spine and semantic evidence contracts rather than card or template uniformity.

These are architecture constraints, not an implementation sequence.

## 19. Confirmed binding constraints

Confirmed by the user and recorded in the redesign docket:

- The redesign uses Layered Semantic Modules; reuse follows shared semantic responsibility, behavior, and variance rather than visual similarity.
- Authoritative source records feed named content projections before presentation. Factual projections own selection, allocation, adjacency, deduplication, and truthful omission; editorial projections own only S1-approved copy with source and approval provenance; presentation does not reinterpret raw records.
- Tokens use canonical, semantic, and pattern levels. Semantic color roles carry contrast-qualified usage restrictions, raw brand colors do not appear in presentation, and unique composition measurements remain local unless they establish a repeated semantic contract.
- Portfolio, page-family, and homepage-scene frames own shared structure through small semantic interfaces; route and scene compositions retain specific layout. A universal variant-heavy section or page template is prohibited.
- CSS owns responsive composition. One centralized capability policy owns enhancement eligibility, exposes named decisions without supplying layout classes or removing content, and defaults unresolved or failed initialization to the simplest static/native tier.
- Motion uses shared budgets plus engine-specific Framer recipes, GSAP/ScrollTrigger effect modules, one route-handoff controller, one scroll-enhancement controller, and a branded-arrival recipe with immediate utility-state interruption; there is no universal motion facade.
- Every animated recipe declares engine, targets, properties, lifecycle, final state, interruption, and cleanup. Same-node/property conflicts are prevented structurally, with nested targets when Framer entrance and GSAP depth coexist.
- Global providers are limited to state requiring cross-route coordination: theme, capability policy, route handoff, and portfolio-wide scroll enhancement. Chapter tracking, project local navigation, live providers, and effect instances remain route-local.
- A portfolio destination resolver and shared semantic anchor-navigation seam own destination mapping, fragment updates, offsets, and focus transfer; global navigation and route-local section controls remain visibly and semantically distinct consumers.
- Native visible content, semantic anchors, focus, scrolling, route behavior, and recovery are the baseline. Enhancement failure selects valid native/static behavior.
- Accessibility, truthful omission, interruption, and cleanup are obligations of each owning module's interface rather than page-level afterthoughts.
- Acceptance uses mandatory representative surfaces and environment baselines plus risk pairings across themes, input modes, navigation modes, async states, motion preference, and constrained environments.

## Outcome

S6 establishes a maintainable architecture without turning the portfolio into a framework for its own sake. Factual truth is selected once, visual identity is expressed through semantic roles, shared frames preserve orientation, route compositions retain character, and motion engines operate through explicit lifecycle ownership. The result supports the approved Red Signal redesign across all routes and capability tiers while keeping native access, traceability, accessibility, and cleanup as structural guarantees.
