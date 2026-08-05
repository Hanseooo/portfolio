> **Agent: read this before anything else.**
> This docket governs a multi-session design. You are working ONE session.
> - Do not widen scope past the current session's cluster, and do not
>   re-decompose it. If it should split, append an amendment — don't split it
>   in-session.
> - "Binding constraints" are decided. To challenge one, append a NEW session.
>   Never edit a DONE session.
> - Something real but outside this session's cluster: if it belongs to a later
>   session, add it to that session's open questions; otherwise one line under
>   `## Found & parked`. Never fix it. Never open a file or a tracker for it.
> - Stop at an approved spec. Do NOT continue to writing-plans or implementation.
> - To end the session, in this order: record the spec path, propose the
>   constraints it establishes, wait for the user to confirm them, write them in.
>   Only then set the session to DONE, and flip every session blocked on it to
>   READY. A session is not DONE until its constraints are confirmed.

# Full portfolio redesign — session docket

**Goal:** redesign the complete portfolio around the approved Red Signal direction while preserving the existing content as the source of truth, supporting light ivory/red and dark black/ice-blue themes, and treating responsive behavior, motion, and maintainable component architecture as first-class design concerns.

**Cut rationale:** narrative and content allocation constrain the visual system and every route; the visual system then constrains page composition. Motion needs settled compositions across homepage and secondary routes, while maintainable component and animation boundaries need all observable behavior settled first. This produces six decision-dependent sessions rather than repeatedly reopening theme, layout, content, or motion choices on each surface.

**Spec path convention:** `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md`

**Existing reference:** `docs/superpowers/specs/2026-08-04-homepage-redesign-prototype-design.md` and `prototypes/homepage-redesign-variations.html`

## Binding constraints

Decided before docket creation. Later sessions treat these as given, not open.

- [Brief] Red Signal is the redesign's visual starting point, including its geometric lines, visible grid, distinctive editorial composition, and personal character.
- [Brief] Light mode is the default and uses an ivory/light foundation with red as its signal accent.
- [Brief] Dark mode remains available and uses a dark/black foundation with ice blue as its signal accent.
- [Brief] Existing production portfolio content is the source of truth. A session may propose additional copy, but no new claim or wording enters the design without explicit user approval.
- [Brief] The redesign must avoid visual wordiness: paragraphs and labels remain organized, scannable, and free from unnecessary clutter.
- [Brief] The redesign covers the whole portfolio, including the homepage, project index and case studies, experience, certificates, shared navigation/footer, transitions, and utility states.
- [Brief] The experience must be mobile-friendly and responsive rather than a desktop composition merely compressed onto a narrow screen.
- [Brief] Motion remains part of the portfolio, including initial loading, route transition overlays, and appropriate scroll-entry animation for content such as headings, imagery, and cards.
- [Brief] Parallax is excluded on mobile for performance. Mobile may retain appropriate Framer Motion entrance animation.
- [Brief] Lenis and desktop parallax may be used where the later motion session finds them appropriate; their presence is not mandatory on every route or element.
- [Repo] `prefers-reduced-motion` must be respected across loading, navigation, scrolling, parallax, and content entrances.
- [Repo] GSAP and Framer Motion must not control the same animated property on the same element.
- [Repo] Production content currently lives in homepage section copy plus `lib/projects.ts`, `lib/experience.ts`, and `lib/certificates.ts`; redesign sessions must account for these existing sources rather than silently inventing a parallel content source.

- [S1] The homepage follows this Evidence Ladder: Identity & Immediate Proof; Flagship Work; Experience & Corroboration; More Selected Work; Personal & Live Presence; Contact.
- [S1] The opening identifies Hans Amoguis as a “Full-stack engineer focused on AI product engineering” and communicates end-to-end ownership, the source-backed 75% and ~80% outcomes, and contact access. “Senior” is not used as a current title.
- [S1] Hans Amoguis is the primary professional name. Hanseo is used only where personally applicable and is not combined with the main name in the opening.
- [S1] The homepage currently shows Le Doux and Clarift as flagships plus SimplyNote, The Podium, and HCDC LFMS as supporting work, with an explicit route to the complete `/projects` catalogue. Future homepage selections remain capped at five and are curated by relevance, evidence, recency, and range.
- [S1] Both existing experience records appear concisely on the homepage, with full bullets on `/experience`. Only the Eskwelabs AI Solution Development Track receives homepage emphasis; all four credentials remain on `/certificates`.
- [S1] The homepage preserves a real portrait, concise working philosophy, GitHub, Spotify, and Discord. GitHub acts as professional evidence; Spotify and Discord provide human presence. Live-provider failure cannot remove or contradict the static narrative.
- [S1] Approach, stack, and credentials are not standalone homepage chapters. Approach and technology support relevant work, and the Eskwelabs credential supports its related experience.
- [S1] Summaries may become clearer, shorter, and more personal, but must remain traceable to existing sources, preserve attribution and qualifiers, introduce no new claims, and omit unknown facts rather than infer them.
- [S1] The homepage is the recruiter brief; `/projects` is the complete catalogue; project details hold full case-study evidence; `/experience` holds complete experience; `/certificates` and certificate details hold complete credential evidence.

- [S2] Constructed Signal is the shared structure-first visual grammar across all routes and both themes, defined by exposed structure, editorial scale, semantic indexing, truthful imagery, and controlled human irregularity.
- [S2] Light mode uses warm ivory/paper with canonical red `#E10600`; dark mode uses true black/near-black with canonical ice blue `#00E5FF`. These are the only brand accents.
- [S2] Theme transformation is role-equivalent but not area-equivalent. Broad red fields normally translate to black tonal depth with concentrated ice typography, rules, edges, or smaller fields rather than broad cyan substitution.
- [S2] Large signal fields require a semantic purpose and neutral recovery. Dense evidence and long-form reading remain on neutral surfaces, and adjacent dominant signal fields are prohibited.
- [S2] Typography uses Anton only for short display statements, Inter for reading and interface text, and JetBrains Mono for genuine indexing and evidence metadata.
- [S2] The grid is structurally constant but selectively exposed. Geometry must frame, divide, align, crop, connect, or focus real content; fabricated schematics, decorative telemetry, gradients, glass, and ambient glow are excluded.
- [S2] The real portrait remains recognizable and visually stable while its structural frame responds to theme. Project screenshots remain full-color evidence, and certificates use restrained documentary treatment.
- [S2] Surfaces are flat architectural planes with sharp rules and only rare hard-offset emphasis. Repeated records must not collapse into generic card grids.
- [S2] Interaction states use sharp graphic changes, visible keyboard focus, and non-color cues. Extra semantic colors are allowed only for genuine statuses; red in dark mode is limited to error/destructive meaning and never acts as a brand accent.
- [S2] Personal character comes from controlled irregularity—purposeful overlap, candid cropping, asymmetric captions, offset frames, and deliberate grid breaks—not novelty decoration.
- [S2] Older black/ice-only guidance is scoped to dark-mode brand accents. The authoritative portfolio-wide system is default ivory/red light mode plus optional black/ice dark mode.
- [S2] WCAG contrast restrictions govern every text, icon, focus, and state pairing. In particular, canonical red on warm ivory is not permitted for normal-size text.

- [S4] Secondary routes share an editorial orientation and reading spine, while project, certificate, career, and utility bodies deliberately adapt to their evidence demands rather than using one identical template.
- [S4] Every non-home route uses a compact indexed masthead in normal document flow; secondary routes do not use full-viewport chapter openings.
- [S4] `/projects` is an equal-rank, full-width editorial catalogue. Homepage flagship hierarchy does not produce unequal project-index sizing or a generic card grid.
- [S4] `/certificates` is a continuous documentary register, while `/experience` is a career ledger preserving every source bullet and omitting unknown period data.
- [S4] Project details follow the claim-to-proof sequence: orientation, contained full-color hero evidence, brief, technical decisions, system index, complete capability register, screenshot record, and continuation.
- [S4] Project evidence remains directly visible rather than hidden behind tabs, accordions, or “Show all.” Project details alone receive local section navigation.
- [S4] Project galleries do not repeat a hero asset or invent feature meanings for uncatalogued screenshots. Stack and integrations remain complete structured lists rather than chip clouds.
- [S4] Certificate details are compact documentary records with one undistorted artifact and no blurred full-bleed hero, project-level section ceremony, or image-heavy continuation.
- [S4] Detail navigation links directly to the parent collection and uses source-ordered, non-wrapping previous/next destinations rather than browser-history semantics.
- [S4] Responsive composition preserves evidence order and content. Mobile removes no evidence and does not make galleries, records, or navigation swipe-only; short viewports use ordinary top-aligned flow.
- [S4] Loading, error, and not-found presentations retain the shared portfolio frame and expose recovery actions without fabricated content or delayed access.
- [S4] Missing links, dates, outcomes, integrations, credential URLs, and other optional evidence are omitted without empty controls, inferred replacements, or false verification states.

- [S3] The homepage uses six scenes in this order: Identity & Immediate Proof; Flagship Work; Experience & Corroboration; More Selected Work; Personal & Live Presence; Contact.
- [S3] The homepage uses a hybrid evidence rhythm: only the hero is viewport-aware; evidence scenes use content-sized editorial flow; Contact is a compact close. No scene requires horizontal scrolling, pinning, scroll hijacking, or animation to remain understandable.
- [S3] The adaptive hero preserves Red Signal impact on desktop, reduces overlap on tablet, and becomes evidence-first on mobile. Hans Amoguis, role/introduction, qualified `75%` and `~80%` proof, and contact precede the portrait when space is constrained.
- [S3] Hero height follows content rather than a viewport lock. At `320 × 568px`, required opening evidence must fit before portrait and decoration; unusually short viewports remain naturally scrollable without hiding content, shrinking body text, or reducing touch targets.
- [S3] Le Doux and Clarift form one neutral shared flagship dossier. Both work in normal document flow, use truthful full-color screenshots, and receive no more than three concise technical-evidence statements each.
- [S3] Eskwelabs and freelance work appear as a non-chronological evidence ledger with equal legitimacy. No freelance date is inferred, and the Eskwelabs credential remains directly attached as corroboration.
- [S3] SimplyNote, The Podium, and HCDC LFMS appear in a numbered editorial register—not a generic card grid or horizontal carousel—followed by a prominent `/projects` catalogue action.
- [S3] The personal scene prioritizes portrait and philosophy, then GitHub as professional evidence, with Spotify and Discord subordinate. Provider loading or failure preserves stable spatial footprints and cannot reorder or collapse the static narrative.
- [S3] Global navigation owns routes and universal controls; homepage chapter navigation owns only in-page orientation. Desktop may use a six-stage rail, tablet a compact stage marker, and mobile/touch/webviews numbered headings without persistent chapter navigation.
- [S3] Responsive composition uses 12-column wide, 8-column compact/tablet, and 4-column mobile alignment modes, with short-height, touch, and webview capability overrides. Breakpoint simplification removes decorative geometry before evidence, actions, orientation, or any S1-allocated record.
- [S3] Light mode uses two broad red anchors—hero and Contact—with all evidence scenes providing neutral recovery. Dark mode uses black/near-black depth and concentrated ice emphasis rather than broad cyan substitution.
- [S3] The sole homepage `<h1>` is “Hans Amoguis.” Reading order, focus order, section hierarchy, and complete comprehension remain intact with sticky behavior, smooth scrolling, and all animation disabled.

- [S5] The portfolio uses Selective Cinematic Motion with Signature Moments. Motion may orient, sequence, connect, or add depth, but may not gate evidence, navigation, focus, or recovery.
- [S5] Every full document load uses a truthful branded arrival lasting approximately `0.8–1.2s`, without fake progress or a second hero delay. Reduced motion and browser restoration bypass it; known utility states interrupt it.
- [S5] Eligible pathname-changing internal navigation uses one Cover → Navigate → Reveal handoff. Desktop completes within `600–900ms`, mobile within `350–500ms`, and the cover never waits beyond `900ms` for complete data.
- [S5] Structured reveals operate on meaningful editorial units, run once per route visit, and use bounded heading/list accents. Direct focus, anchors, restoration, interruption, or failed enhancement leave content immediately visible.
- [S5] Parallax is limited to the hero and selected flagship/personal evidence on capable desktop environments. Critical text and controls remain stable.
- [S5] Sticky behavior is bounded and native. It releases to ordinary flow when height or capability is insufficient. Horizontal storytelling, scroll locking, wheel interception, and generated pin spacers are prohibited.
- [S5] Lenis is a capability-gated portfolio-wide enhancement. Reduced-motion, mobile, touch-dominant, webview, and constrained environments use complete native scrolling behavior.
- [S5] CSS owns direct state transitions; Framer Motion owns presence and structured entrances; GSAP/ScrollTrigger owns continuous scroll-linked effects; native state owns section determination; Lenis owns interpolation only. One animated node has one engine owner.
- [S5] Reduced motion is a complete static mode with no timed preloader, route wipe, smooth scrolling, parallax, spatial reveal, stagger, magnetic response, or animated loading pulse.
- [S5] Mobile/touch keeps lightweight branded arrival, shorter route handoff, and restrained entrances; short-height and webview tiers progressively remove depth, sticky evidence, and cinematic coverage without changing content or actions.
- [S5] Global-menu navigation forms one continuous handoff into eligible route changes. Same-route anchors close the menu and navigate semantically without a route overlay.
- [S5] Homepage chapter and project local-section navigation use semantic anchors, upper-third heading tracking, stable non-color active feedback, correct focus transfer, and native fallback.
- [S5] The native cursor remains. Graphic hover/focus feedback replaces the continuous custom cursor; magnetic movement is limited to a few large eligible desktop CTAs.
- [S5] Loading and provider motion is calm, truthful, and spatially stable. Errors and not-found recovery appear without decorative delay.
- [S5] Motion uses hybrid easing and strict budgets: no more than three simultaneous scroll-linked compositions, no animated blur/filter or ambient loops, bounded staggers, and immediate interruption by navigation, focus, recovery, or new input.

- [S6] The redesign uses Layered Semantic Modules; reuse follows shared semantic responsibility, behavior, and bounded variance rather than visual similarity.
- [S6] Authoritative source records feed named content projections before presentation. Factual projections own selection, allocation, adjacency, deduplication, and truthful omission; editorial projections own only approved copy with source and approval provenance.
- [S6] Tokens use canonical, semantic, and pattern levels. Semantic color roles carry contrast-qualified usage restrictions, raw brand colors stay out of presentation, and unique composition values remain local unless they form a repeated semantic contract.
- [S6] Portfolio, page-family, and homepage-scene frames expose small structural interfaces while route and scene compositions retain specific layouts; a universal variant-heavy section or page template is prohibited.
- [S6] CSS owns responsive composition. One centralized capability policy owns enhancement eligibility, exposes named decisions, and defaults unresolved or failed initialization to the simplest static/native tier.
- [S6] Motion uses shared budgets, engine-specific Framer recipes, GSAP/ScrollTrigger effect modules, one route-handoff controller, one scroll-enhancement controller, and an interruptible branded-arrival recipe; no universal motion facade is used.
- [S6] Every animated recipe declares engine, targets, properties, lifecycle, final state, interruption, and cleanup. Same-node/property conflicts are prevented structurally, with nested targets where Framer entrance and GSAP depth coexist.
- [S6] Global providers are limited to cross-route coordination for theme, capability policy, route handoff, and portfolio-wide scroll enhancement. Chapter tracking, project local navigation, live providers, and effect instances remain route-local.
- [S6] A portfolio destination resolver and shared semantic anchor-navigation seam own destination mapping, fragments, offsets, and focus transfer while global navigation and route-local section controls remain distinct consumers.
- [S6] Native visible content, semantic anchors, focus, scrolling, route behavior, and recovery are the baseline; enhancement failure selects valid native/static behavior.
- [S6] Accessibility, truthful omission, interruption, and cleanup are obligations of each owning module's interface rather than page-level afterthoughts.
- [S6] Acceptance uses mandatory representative surfaces and environment baselines plus release-blocking risk pairings across themes, input modes, navigation modes, asynchronous states, motion preference, and constrained environments.

## Sessions

Statuses: DONE (spec linked **and** constraints confirmed) · PARTIAL (stopped early, resumable) · READY · BLOCKED (needs Sn)

### S1 · Portfolio narrative & content allocation — DONE

**Spec:** `docs/superpowers/specs/2026-08-04-portfolio-narrative-content-allocation-design.md`

**Cluster:** the recruiter-facing story the portfolio tells; the responsibility of the homepage versus list and detail routes; which existing facts, claims, projects, credentials, live signals, and personal material appear at each stage; how long source content is summarized without changing its meaning; where any proposed new copy requires an explicit user decision.

**Explicitly out:** typography, color, geometric styling, exact layouts, breakpoint behavior, motion, component APIs, and implementation sequencing.

**Stance:** information-contract session — done means every route and homepage chapter has a defined communication job and a traceable allocation of existing source content, with no unapproved copy treated as final.

**Open questions:** What must a recruiter understand in the first viewport, after the homepage, and only inside a detail page? Which current homepage chapters remain distinct, combine, move, or leave the homepage? How are long project, experience, certificate, and live-activity sources represented without becoming cluttered? Which projects and credentials receive homepage emphasis, and by what content rule? What personal material already present in the portfolio belongs in the narrative? Which suggested additions, if any, should be presented to the user for approval rather than assumed?

**Engine:** `brainstorming`

**Hardeners:** `grill-with-docs` before the engine to stabilize narrative and route terminology; `grill-me` after the draft to test whether the allocation is concise and complete.

### S2 · Cross-theme Red Signal visual language — DONE

**Spec:** `docs/superpowers/specs/2026-08-04-cross-theme-red-signal-visual-language-design.md`

**Cluster:** the visual grammar shared across the portfolio; what is essential versus incidental in the Red Signal prototype; the relationship among grid, geometric lines, red fields, ivory reading surfaces, portrait and project imagery, typography, rules, numbering, spacing, and interaction states; how that grammar translates into black/ice-blue dark mode without becoming a separate brand.

**Explicitly out:** final homepage section layout, route-specific templates, animation choreography, component implementation, and migration steps.

**Stance:** visual-system session — done means the two themes share one named visual grammar with explicit transformation rules, hierarchy rules, and boundaries on where signal color and geometry may dominate.

**Open questions:** Which Red Signal prototype characteristics define identity across all routes? How much red can occupy a light-mode surface before reading space suffers? What is the dark-mode equivalent of each light-mode role without introducing red as its active accent? How should portraits, project screenshots, certificate imagery, and abstract geometry be treated in each theme? What typography and grid behavior preserve personality without creating clutter? How should the stale ice-blue-only statement in `AGENTS.md` be reconciled with the user-approved dual-theme direction, `docs/05-design-system.md`, and current tokens? Which visual tokens or state distinctions must be documented for later page sessions?

**Engine:** `brainstorming`

**Hardeners:** `grill-with-docs` before the engine to settle theme and visual-system vocabulary; `grill-me` after the draft to challenge consistency across both themes.

### S3 · Homepage composition & responsive transformation — DONE

**Spec:** `docs/superpowers/specs/2026-08-04-homepage-composition-responsive-transformation-design.md`

**Cluster:** the homepage's scene sequence and hierarchy; the spatial relationship among navigation, portrait, identity, proof, selected work, experience, credentials, live signals, and contact; how the desktop editorial composition transforms for tablet, mobile, short viewports, touch, and webviews while retaining narrative clarity.

**Explicitly out:** detailed secondary-route layouts, animation timing and engine ownership, reusable component internals, source-code structure, and implementation tasks.

**Stance:** responsive-composition session — done means every homepage scene has a chosen purpose and composition at desktop, tablet, and mobile, including what transforms, stacks, simplifies, or disappears without changing the approved story.

**Open questions:** What is the final homepage order under S1's content contract? How closely does the hero preserve the prototype's red field, overlapping display type, portrait, actions, and evidence strip? Which scenes use full viewport framing, editorial flow, pinning candidates, or ordinary document flow? How do global navigation and chapter navigation coexist at each viewport? How are geometric lines and the grid used as structure rather than decoration? What happens at narrow widths and short heights? Which information remains visible versus moves to detail routes? How should touch and webview contexts change composition without becoming a separate design?

**Engine:** `brainstorming`

**Hardeners:** `grill-me` after the draft to pressure-test scanning, responsive transformations, and content density.

### S4 · Secondary routes & reusable page families — DONE

**Spec:** `docs/superpowers/specs/2026-08-04-secondary-routes-reusable-page-families-design.md`

**Cluster:** the composition shared by project, experience, and certificate indexes and details; the relationship between evidence, imagery, long-form content, navigation between records, and utility states; where route families share a template and where their information demands require deliberate divergence.

**Explicitly out:** changing approved source content, homepage composition, global animation choreography, component code, data migration, and implementation order.

**Stance:** template-family session — done means each non-home route has a chosen information hierarchy and responsive composition, with explicit shared patterns and explicit justified exceptions.

**Open questions:** How should index pages introduce and organize their records without falling back to generic card grids? What common editorial frame can projects, experience, and certificates share? How should project case studies pace problem, solution, role, stack, features, technical decisions, gallery, outcomes, and adjacent navigation using existing data? How should dense experience bullets remain readable and non-wordy? How much ceremony should certificate detail pages receive relative to projects? How do navigation, footer, back behavior, loading, error, and not-found states visually belong to the same portfolio? Which route-family differences are content-driven rather than accidental?

**Engine:** `brainstorming`

**Hardeners:** `grill-with-docs` before the engine to stabilize route-family and evidence terminology; `grill-me` after the draft to test template reuse against real content extremes.

### S5 · Motion & interaction semantics — DONE

**Spec:** `docs/superpowers/specs/2026-08-04-motion-interaction-semantics-design.md`

**Cluster:** the meaning, choreography, and observable behavior of initial loading, route transitions, scroll entrances, parallax, pinned or horizontal sequences, Lenis scrolling, navigation feedback, hover and focus responses, mobile motion, webview fallbacks, and reduced-motion alternatives across the settled page compositions.

**Explicitly out:** changing page hierarchy or visual identity, assigning final React component boundaries, writing animation code, selecting implementation tickets, and performance fixes unrelated to the approved motion design.

**Stance:** motion-language session — done means every recurring motion family has a named purpose, trigger, lifecycle, platform fallback, and reduced-motion equivalent, with no element left ambiguously owned by both GSAP and Framer Motion.

**Open questions:** What narrative purpose justifies each motion family? Which settled scenes warrant scroll-linked GSAP behavior versus Framer Motion entrances? Where is parallax appropriate on desktop, and what static or entrance-only state replaces it on mobile? Which pages use Lenis, and how does native scrolling remain reliable where it does not? How do the existing preloader and route overlay relate without duplicating delay or visual meaning? Should entrances replay or run once, and how do they behave when navigating back? What are the semantics for hover, focus, menu, chapter-navigation, and next/previous transitions? What exact experience remains under reduced motion, touch, short viewports, and in-app webviews? What performance limits prevent motion from obscuring content or degrading interaction?

**Engine:** `brainstorming`

**Hardeners:** `grill-with-docs` before the engine to define motion-family vocabulary and ownership; `grill-me` after the draft to stress-test lifecycle, fallback, and performance semantics.

### S6 · Maintainable design architecture — DONE

**Spec:** `docs/superpowers/specs/2026-08-05-maintainable-design-architecture-design.md`

**Cluster:** the durable boundaries that let the approved visual, responsive, route, and motion systems evolve without duplication; ownership of content, theme tokens, layout primitives, section variants, route templates, motion recipes, GSAP lifecycles, provider responsibilities, and accessibility/performance contracts.

**Explicitly out:** implementation sequencing, ticket breakdown, code changes, dependency installation, migration execution, and reopening any observable design decision settled by S1–S5.

**Stance:** design-architecture session — done means every repeated design or motion responsibility has one clear owner and a stable contract, while route-specific exceptions remain possible without copy-paste systems.

**Open questions:** Which visual patterns are true reusable primitives versus intentionally route-specific compositions? Where should content selection stop and presentation begin? Which tokens must express both themes, geometry, typography, spacing, and motion? What contracts should homepage scenes and route templates expose? Where do Framer variants, GSAP timelines, ScrollTrigger setup/cleanup, Lenis integration, and reduced-motion logic live? How are animation ownership and same-element conflicts prevented by design? Which providers remain global versus route-local? How should responsive and runtime capability decisions be centralized without hiding layout intent? What acceptance matrix must implementation later satisfy across routes, themes, breakpoints, input modes, and motion preferences?

**Engine:** `brainstorming`

**Hardeners:** `grill-with-docs` before the engine to settle architectural vocabulary; `grill-me` after the draft to challenge ownership boundaries and exceptions.

## Found & parked

Turned up mid-session, belongs to no session here. Recorded so it is not lost, and not this docket's work.

- None.

## Amendments

- None.
