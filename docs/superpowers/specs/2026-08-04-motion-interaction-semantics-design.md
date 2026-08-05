# S5 Motion and Interaction Semantics Design

**Date:** 2026-08-04  
**Session:** S5 · Motion & interaction semantics  
**Status:** Approved  
**Docket:** `docs/dockets/portfolio-redesign-docket.md`  
**Upstream contracts:** S1 Portfolio Narrative and Content Allocation; S2 Cross-theme Red Signal Visual Language; S3 Homepage Composition and Responsive Transformation; S4 Secondary Routes and Reusable Page Families

## 1. Purpose

Define the portfolio-wide motion language and the observable behavior of initial loading, route changes, scroll entrances, parallax, sticky relationships, smooth scrolling, menus, section navigation, direct interaction feedback, live-provider updates, utility states, platform fallbacks, and reduced motion.

The governing posture is **Selective Cinematic Motion with Signature Moments**. The portfolio retains a cinematic personality, but evidence, navigation, focus, and recovery never wait for motion or depend on it for comprehension.

## 2. Governing context

This specification inherits all confirmed docket constraints, especially:

- S3's six-scene homepage, complete canonical normal flow, evidence-first mobile opening, and prohibition on required horizontal scrolling, pinning, or animation;
- S3's native mobile/webview flow, short-height reachability, and distinction between global navigation and homepage chapter orientation;
- S4's compact secondary-route mastheads, visible evidence, project-only local section navigation, deterministic record continuation, and immediately available utility recovery;
- S2's Constructed Signal grammar, sharp graphic states, controlled irregularity, flat architectural planes, and prohibition on ambient glow or novelty decoration;
- the repository requirements to respect `prefers-reduced-motion` and prevent GSAP and Framer Motion from controlling the same animated property on the same element.

Older guidance in `docs/06-ux-interactions.md` is superseded where it prescribes initially hidden content, mobile horizontal rails, pervasive pinned chapter titles, or a fixed-duration preloader. S3 and S4 establish native vertical flow, complete visible evidence, and motion-independent comprehension.

Canonical S5 vocabulary is recorded in `CONTEXT.md`: motion family, signature moment, structured reveal, route handoff, scroll-linked effect, and capability tier.

## 3. Scope

### In scope

- The purpose, trigger, lifecycle, fallback, and reduced-motion equivalent of every recurring motion family.
- Initial full-load presentation and its relationship to destination entrance.
- Internal route-cover, navigation, destination-reveal, and menu handoff semantics.
- Scroll entrances, replay behavior, direct-anchor behavior, and browser restoration behavior.
- Desktop parallax and bounded sticky relationships.
- Lenis eligibility and native-scroll guarantees.
- Homepage chapter and project local-section tracking feedback.
- Hover, focus, pressed, selected, theme, loading, error, not-found, and live-provider state changes.
- Engine ownership at the behavior-family level.
- Mobile, touch, short-height, webview, constrained-browser, and reduced-motion behavior.
- Timing, density, interruption, and performance limits.

### Out of scope

- Changing S1 content, S2 visual identity, S3 homepage hierarchy, or S4 route-family composition.
- Assigning final React component boundaries, hooks, providers, file locations, selectors, or data structures.
- Writing animation code or selecting implementation tickets.
- Choosing migration order or producing an implementation plan.
- Performance work unrelated to the approved motion behavior.

## 4. Motion principles

### 4.1 Permitted purposes

Every effect must perform at least one named job:

1. **Orient** — establish arrival, departure, menu context, route context, or current section.
2. **Sequence** — clarify the intended reading order of one editorial unit.
3. **Connect** — show continuity between menu and route, or between adjacent records.
4. **Add depth** — reinforce a focal image or structural relationship without changing hierarchy.

An effect without one of these purposes is excluded.

### 4.2 Evidence is never gated

- Motion may emphasize evidence but may not determine whether evidence exists, is readable, or is reachable.
- Required identity, proof, actions, headings, project evidence, experience evidence, credential evidence, provider states, and utility recovery render in their final semantic order.
- No route requires scrolling through choreography before normal reading can continue.
- Direct focus, direct anchor navigation, restoration, and new user input may resolve an effect immediately to its final state.

### 4.3 Scarcity establishes significance

Signature moments are deliberately scarce:

- initial full-load arrival;
- eligible internal route handoff;
- the homepage hero;
- selected flagship or personal evidence relationships.

Routine paragraphs, metadata, bullets, and repeated records do not each receive signature treatment.

### 4.4 Hybrid easing grammar

- **Fast graphic response:** hover, focus-adjacent visual feedback, pressed, selected, active indicators, and small controls.
- **Decisive editorial response:** heading masks, rule extensions, block wipes, and evidence-region entrances.
- **Fluid cinematic response:** route planes, large portraits, screenshot depth, and bounded parallax.
- Bounce, elastic springs, ambient drift, sluggish luxury easing, and ornamental continuous movement are excluded.

## 5. Motion-family summary

| Motion family | Purpose | Trigger | Normal lifecycle | Simplified fallback | Reduced-motion equivalent |
| --- | --- | --- | --- | --- | --- |
| Branded arrival | Orient | Full document load | Brief brand sequence, then direct page handoff | Static/omitted in constrained webviews | No timed hold; page immediately available |
| Route handoff | Orient and connect | Eligible internal route activation | Cover → navigate → reveal | Shorter mobile handoff; immediate webview navigation | Immediate navigation |
| Menu presence | Orient | Menu open/close | Signal plane plus concise label sequence | Shorter touch sequence | Immediate open/close |
| Structured reveal | Sequence | Meaningful unit enters eligibility region | Runs once during route visit | Smaller mobile entrance | Final visible state |
| Scroll-linked depth | Add depth | Eligible desktop scroll progress | Bounded transform relationship | Static composition | Static composition |
| Sticky relationship | Orient/connect | Eligible viewport enters bounded region | Native sticky hold and clean release | Ordinary flow | Ordinary flow where sticky would feel animated or obstructive |
| Section tracking | Orient | Reading position changes | Stable active-state change | Same state with reduced transition | Immediate state change |
| Direct interaction | Orient/confirm | Hover, focus, press, selection | Fast graphic state | Resting and pressed touch states | Immediate state change |
| Loading/provider state | Orient/confirm | Async state changes | Calm bounded indication/crossfade | Static state text | Static replacement |
| Theme state | Confirm | Theme control activation | Brief role-preserving surface transition | Same or immediate | Immediate change |

## 6. Initial full-load arrival

### 6.1 Recurrence and purpose

The branded preloader remains part of the portfolio's personality. It appears on every full document load or explicit refresh, including direct entry to a secondary route. Client-side route changes do not replay it; they use the route handoff.

Its purpose is to establish identity and visual language, not to pretend that known progress is being measured.

### 6.2 Presentation

- Use Constructed Signal typography, indexing, rules, masks, or planes.
- Do not display a simulated percentage, fake determinate counter, or false readiness claim.
- The target duration is approximately **0.8–1.2 seconds**.
- The sequence hands directly into the destination's settled opening composition.
- Hero or masthead content does not wait through a second delayed entrance after the preloader clears.
- The preloader must not conceal a known error, not-found state, or available recovery action merely to complete its choreography.

### 6.3 Lifecycle exceptions

- Back/forward-cache restoration bypasses the sequence.
- Reduced-motion preference omits the preloader and brand frame entirely; destination content is present from first paint.
- Constrained webviews use an immediate static brand frame or omit the preloader.
- If an error or not-found utility state becomes known while arrival is in progress, the arrival resolves immediately and reveals its recovery controls.
- If the environment cannot reliably support the sequence, destination content wins.

## 7. Internal route handoff

### 7.1 Core lifecycle

Eligible client-side internal navigation uses one continuous **Cover → Navigate → Reveal** event. An eligible activation changes the pathname to a different portfolio route. Hash-only changes, search-parameter-only changes, and auxiliary or intercepted route-surface changes do not trigger a full route handoff.

1. user activates an internal destination;
2. a signal plane quickly covers the current route;
3. navigation occurs once visual coverage is established;
4. the destination becomes ready behind the plane;
5. the plane reveals the destination;
6. the destination masthead or opening region is already in its settled readable state or participates only in that same reveal.

The target total perceived duration is approximately **600–900ms**. There is no independent post-transition entrance delay. The opaque cover does not remain beyond the 900ms upper bound waiting for complete destination data; it reveals the destination's truthful rendered or family-specific loading state.

### 7.2 Native-behavior exclusions

The custom handoff does not intercept:

- external destinations;
- downloads;
- modified clicks;
- new-tab or new-window actions;
- browser Back or Forward restoration, including a back/forward-cache hit in either direction;
- same-route controls that do not change destination.

Rapid repeated activation resolves to one destination decision rather than queuing multiple route timelines. Navigation and focus correctness take precedence over finishing the visual sequence.

### 7.3 Record direction

- Next-record navigation uses a subtle forward rule or edge cue.
- Previous-record navigation mirrors the cue.
- Parent-collection navigation uses the standard neutral handoff.
- Destination names remain explicit; motion never carries direction alone.
- Mobile shortens and simplifies the cue. Reduced motion navigates immediately.

## 8. Global menu choreography

- Opening expands a structural signal plane and reveals route labels in a concise ordered sequence.
- Focus moves into the menu immediately and does not wait for label animation.
- Background content is inert while the menu is open.
- Escape and explicit close respond promptly and restore focus to the trigger.
- Activating the current route closes the menu without a route handoff.
- Activating a same-route anchor closes the menu and performs semantic anchor navigation without a route-cover handoff.
- Activating another eligible internal route lets the menu plane become, or hand directly into, the route-cover plane. The menu does not fully close before a second overlay begins.
- Reduced motion opens and closes immediately.

## 9. Structured reveals

### 9.1 Eligible units

Structured reveals apply to meaningful editorial units, including:

- scene or route-family headings;
- primary portrait or project image regions;
- immediate-proof or evidence bands;
- complete ledger/register records;
- bounded groups of technical decisions or capabilities;
- screenshot groups;
- record-continuation regions.

Paragraphs, labels, bullets, and metadata normally move with their parent unit rather than receiving separate timelines.

### 9.2 Editorial accents

- Headings may use block wipes, moving masks, clipped line reveals, or restrained line/word staggering.
- Short lists may stagger by row when the sequence clarifies reading order.
- Long project capabilities, screenshot records, certificate registers, and career evidence reveal by region or bounded visible batch.
- A long source list never creates a multi-second queue that withholds later evidence.
- Different reveal forms correspond to different semantic roles; the portfolio does not repeat one generic fade-up for every element.

### 9.3 Replay and restoration

- A structured reveal runs once during a route visit.
- It does not replay when the user scrolls back upward.
- A fresh intentional navigation to the route may begin a new route visit and replay eligible entrances.
- Browser-restored pages preserve restored content and scroll position without replaying entrances over the reader.
- Direct anchor or focus navigation resolves the target unit immediately to its final state.
- Provider data that resolves before its containing unit becomes eligible is incorporated into that unit's first reveal. Data that resolves after the unit has revealed crossfades within its stable footprint and does not replay the surrounding scene reveal.

### 9.4 Visibility contract

The semantic and CSS baseline is the final readable state. Motion is progressive enhancement. Initial CSS leaves every eligible unit visible; a capable JavaScript motion layer may apply a temporary clipped or translated start state only after eligibility is confirmed. Failure to apply that start state correctly leaves the unit visible, which is the required fallback. A failed script, cancelled timeline, reduced-motion setting, direct focus event, or unsupported browser cannot leave content hidden, clipped, translated away, or non-interactive.

## 10. Scroll-linked depth

### 10.1 Hero

The homepage hero is the primary depth composition.

- Portrait, oversized professional name, signal plane, and structural rules may move at restrained relative speeds.
- Role/introduction, qualified proof figures, and contact actions remain comparatively stable.
- Motion begins only after the initial arrival or route handoff has resolved.
- Depth must not obscure the portrait, change reading order, move controls away from their hit areas, or create a viewport-height dependency.

### 10.2 Selected evidence moments

Smaller depth relationships may appear in:

- one or more flagship screenshot/frame relationships;
- the personal-scene portrait, frame, or caption relationship.

These are accents, not a portfolio-wide treatment. Dense reading surfaces, certificate artifacts, utility controls, and long evidence lists remain stable.

### 10.3 Eligibility

Scroll-linked depth requires all of the following:

- no reduced-motion preference;
- a reliable non-webview browser;
- sufficient usable viewport height: approximately 700px or more, with the complete focal composition fitting without clipping; content fit overrides the numeric threshold;
- a fine-pointer, non-touch-dominant environment;
- a wide composition in which movement does not compromise reading or crop integrity.

Mobile, touch-dominant, short-height, webview, and reduced-motion presentations use the exact static final composition.

## 11. Sticky and pinned behavior

- Homepage chapter orientation and project-detail local navigation may use bounded sticky positioning established by S3 and S4.
- A flagship screenshot or evidence rail may briefly remain sticky beside its associated text on eligible desktop layouts.
- Every sticky region has an explicit containing boundary and releases at that boundary.
- Sticky behavior uses ordinary layout; scroll locking, wheel interception, generated pin spacers, and required GSAP pinning are prohibited.
- A sticky relationship becomes ordinary flow when its contents do not fit the usable height, its release would jump, or browser capability is uncertain.
- No homepage or secondary-route sequence becomes horizontal.
- Reduced motion does not automatically prohibit ordinary orientation stickiness, but any sticky behavior that feels like staged movement or risks obscuring focus becomes static.

## 12. Lenis and native scrolling

Lenis is a capability-gated portfolio-wide enhancement rather than a route requirement.

### 12.1 Eligible behavior

On reliable desktop-class environments, Lenis may normalize wheel and trackpad interpolation across homepage and secondary routes. It must preserve:

- expected travel distance and user control;
- keyboard scrolling;
- semantic anchor navigation;
- focus movement and focus visibility;
- browser history and restoration semantics;
- immediate interruption by new input.

Lenis does not create horizontal conversion, scroll locking, mandatory progress sequences, or artificially prolonged travel.

### 12.2 Native guarantee

Lenis is disabled for:

- reduced motion;
- mobile or coarse-pointer environments;
- touch-dominant devices even at wide widths;
- webviews and constrained browsers;
- any environment in which initialization or synchronization is unreliable.

Every anchor, route, and scrolling behavior has an immediate native fallback. A missing or failed smooth-scroll layer cannot break navigation.

## 13. Section navigation semantics

This applies to homepage chapter orientation and project-detail local section navigation.

- Controls are semantic anchor links to stable section IDs.
- User activation updates the URL fragment.
- Passive scroll tracking updates only the visible current-section state and does not create browser-history entries.
- Current-section state advances when the next section heading crosses a threshold in the upper third of the usable viewport and remains on the prior section until that crossing. Short sections still become current when their heading crosses the same threshold; this heading-crossing rule supplies the hysteresis and prevents boundary flicker.
- Active appearance combines semantic number/label emphasis, rule treatment, and position rather than color alone.
- Eligible desktop activation may use Lenis; all other modes use native scrolling.
- Keyboard and assistive activation moves focus to the destination heading.
- Scroll offsets ensure persistent navigation does not cover the heading or its focus indication.
- Progress scrubbing, continuously morphing labels, and decorative counters are excluded.

## 14. Direct interaction feedback

### 14.1 Pointer policy

The portfolio retains the native cursor. The existing continuous custom cursor follower and glow are not part of the approved design.

### 14.2 Graphic response

Hover, focus, pressed, selected, and current states may use:

- rule extension or contraction;
- flat field inversion;
- hard-offset or frame shift;
- concise label movement;
- directional arrow movement;
- image-frame emphasis that does not conceal evidence.

A subtle magnetic response may be reserved for at most a few large desktop calls to action. It is excluded from text links, global navigation, dense records, and evidence controls.

### 14.3 Input equivalence

- Hover reveals no information or action absent from the resting state.
- Keyboard focus is immediate, unobscured, and at least as prominent as hover.
- Touch has clear resting and pressed feedback without depending on hover simulation.
- Reduced motion removes magnetic and spatial feedback while retaining strong static state distinction.

## 15. Theme-change behavior

- Theme changes preserve layout, focus, reading position, and interaction state.
- Surface and text roles may transition briefly without replaying route, page, or section entrances.
- Theme change does not trigger parallax, a full-screen wipe, or a second loading sequence.
- Light ivory/red and dark black/ice remain role-equivalent according to S2; motion does not introduce red as a dark-mode brand accent.
- Reduced motion changes theme immediately.

## 16. Loading, provider, error, and not-found states

### 16.1 Route-family loading

- Loading placeholders approximate the destination family's real S4 hierarchy.
- They contain no fabricated titles, labels, metadata, claims, or progress values.
- Loading may be indicated by one restrained signal rule or low-frequency opacity pulse.
- Gradient shimmer and expressive repeating skeleton choreography are excluded.
- Placeholder movement never changes layout and stops immediately when content resolves.

### 16.2 Live providers

- GitHub, Spotify, and Discord retain their S3-defined stable footprints and priority.
- Loading, success, unavailable, and error states replace one another inside those footprints.
- Updates may crossfade but do not slide surrounding content, move scroll position, take focus, or replay the scene entrance.
- State announcements remain polite and non-interruptive.

### 16.3 Recovery

- Errors expose Retry and parent escape routes immediately when applicable.
- Not-found routes expose portfolio destinations immediately.
- Neither waits for an entrance, route flourish, or repeated preloader once the state is known.
- Reduced motion uses static placeholders and direct state replacement.

## 17. Engine ownership

Ownership is role-separated and must remain unambiguous.

| Owner | Approved responsibility | Excluded responsibility |
| --- | --- | --- |
| CSS transitions | Hover, focus-visible, pressed, selected, current, and brief theme-role transitions | Scroll-linked choreography and route lifecycle orchestration |
| Framer Motion | Presence, menu/dialog choreography, non-scroll mount entrances, and structured in-view reveals | Continuous scroll-linked parallax on a GSAP-owned target |
| GSAP + ScrollTrigger | Continuous scroll-linked parallax and bounded scroll-progress emphasis | Routine CSS interaction states and Framer-owned entrance properties |
| Native observation/state | Current chapter/section determination and capability facts | Decorative visual tween ownership |
| Lenis | Eligible scroll interpolation | Visual element animation, section detection, or route-transition state |

One animated node has one engine owner. When one composition needs both a Framer entrance and GSAP scroll-linked depth, separate nested targets own those behaviors. Scroll-linked movement begins only after entrance resolution. An ownership boundary may not produce compounded transforms that move interactive hit areas away from their visible controls.

S6 will define durable component and provider boundaries; it may not reopen this observable ownership policy.

## 18. Capability tiers

Width alone does not grant motion eligibility. User preference, input mode, usable height, and browser reliability may select a simpler tier.

### 18.1 Full desktop

May receive:

- recurring full-load branded arrival;
- complete route handoff and menu handoff;
- structured reveals with editorial accents;
- approved hero and selected-evidence parallax;
- eligible sticky orientation/evidence relationships;
- portfolio-wide Lenis;
- subtle magnetic response on a few large calls to action.

### 18.2 Mobile and touch

Retains:

- branded preloader;
- shorter route handoff;
- heading masks or line treatments;
- concise list staggering;
- small Framer entrance movement.

Removes:

- Lenis;
- parallax;
- sticky evidence relationships;
- custom cursor behavior;
- magnetic movement;
- any interaction requiring hover.

### 18.3 Short-height desktop

Retains route and ordinary entrance personality but removes parallax and releases sticky evidence whenever content cannot fit comfortably. Navigation rails compact or become static according to S3 and S4 before readable content or focus space is compromised.

### 18.4 Webview and constrained browser

Uses native scrolling and immediate navigation. Content is static, with at most a brief opacity or line entrance when reliable. The full branded preloader, route-cover choreography, parallax, sticky evidence, and Lenis are omitted.

### 18.5 Reduced motion

Reduced motion is a complete, functional static mode:

- no timed preloader hold;
- no route-cover wipe;
- no Lenis or native smooth-scroll request;
- no parallax;
- no translation, scale, block wipe, stagger, or magnetic response;
- no cursor follower;
- no delayed hero or masthead entrance;
- immediate menu, dialog, theme, active-state, and recovery updates; theme changes have no transition;
- provider replacement may use only a near-instant opacity change when needed for comprehension;
- loading indicators are static and never pulse continuously;
- when reduced motion and another capability-tier simplification both apply, reduced motion takes precedence;
- all content present in final visible state from first paint.

## 19. Timing and density limits

These are semantic ranges, not permission to animate every eligible unit.

- Direct interaction feedback: approximately **120–240ms**.
- Editorial entrances: approximately **350–700ms**.
- Branded full-load arrival: approximately **0.8–1.2s**.
- Complete route handoff: approximately **600–900ms**.
- Mobile route handoffs target approximately **350–500ms**; mobile entrances use the shorter end of the editorial range.
- Staggering is capped by the parent unit's communication need; a long list cannot accumulate a multi-second entrance queue.
- One route may contain many reveal opportunities, but no more than three scroll-linked compositions may animate simultaneously within one viewport frame.

## 20. Performance contract

- Interaction should remain smooth at the active display refresh rate; effects that cannot sustain it are simplified or removed.
- Scroll-linked movement uses compositor-friendly transforms and does not change document layout.
- Animated blur, large animated shadows, background filters, and continuously moving decorative geometry are prohibited.
- Structural masks or planes may create block wipes without repeatedly recalculating text layout.
- Offscreen timelines, progress updates, and loading indicators stop visual work.
- Optimization hints are temporary and scoped to active effects.
- Scroll observation does not create feedback loops among native scrolling, Lenis, ScrollTrigger, and React state.
- Route coverage never extends past the 900ms handoff ceiling to wait for complete data; a truthful destination loading structure is preferable to an opaque stalled cover.
- New user input, direct focus, route cancellation, and recovery actions may interrupt or finish motion immediately.
- Capability uncertainty selects the simpler tier.
- Performance degradation never removes content, orientation, actions, or focus visibility; it removes enhancement.

## 21. Accessibility and interruption contract

- No essential content, control, current state, loading state, error, or destination is communicated only by motion.
- Focus is never trapped behind a departing overlay or delayed until animation completion.
- Route and menu overlays are non-interactive except for the active menu controls and cannot leave invisible focusable content exposed.
- Screen-reader announcements do not repeat decorative preloader text or every animated step.
- Anchor targets and focused headings remain visible beneath persistent navigation.
- User input always outranks choreography.
- Motion cancellation leaves every element in a valid final or resting state.

## 22. Existing-behavior disposition

S5 establishes the following redesign outcomes relative to current behavior:

- Keep the personality of the preloader, but shorten it, remove fake progress, eliminate reduced-motion delay, and remove the compounded hero wait.
- Replace pathname-triggered post-navigation coverage with a true cover–navigate–reveal handoff.
- Keep selected parallax, but make reduced-motion, touch, height, and webview eligibility explicit.
- Keep smooth scrolling only as a capability-gated enhancement rather than globally enabling it for every non-mobile environment.
- Replace pervasive initially hidden reveals with progressive structured reveals whose baseline is visible.
- Remove the continuous custom cursor follower and ambient glow.
- Restrict magnetic behavior to a few large eligible calls to action.
- Preserve menu personality while merging menu-to-route navigation into one continuous event.
- Replace required pinned/horizontal storytelling with native flow, bounded sticky relationships, and static fallbacks.

These are design dispositions, not implementation instructions.

## 23. Acceptance checks

A later design or implementation conforms to S5 only when all answers are yes:

1. Does every recurring effect have a stated purpose, trigger, lifecycle, capability fallback, and reduced-motion equivalent?
2. Does every full document load retain a brief branded arrival without fake progress or a second hero delay?
3. Can reduced-motion users access the page immediately without a timed preloader hold?
4. Do eligible internal routes use one cover–navigate–reveal handoff rather than post-navigation coverage plus a separate destination delay?
5. Do external links, modified clicks, browser restoration, and same-route controls retain appropriate native behavior?
6. Does menu-to-route navigation avoid serial menu-close and route-overlay animations?
7. Do structured reveals run once per route visit and resolve immediately for focus, direct anchors, restoration, or interruption?
8. Do long evidence sequences avoid granular multi-second stagger queues?
9. Is parallax limited to the hero and selected evidence moments while critical text and controls remain stable?
10. Are mobile, touch, short-height, webview, and reduced-motion compositions complete without parallax?
11. Do sticky relationships remain bounded, release cleanly, and fall back to normal flow without pin spacers or scroll locking?
12. Is horizontal storytelling absent across homepage and secondary routes?
13. Is Lenis capability-gated, interruptible, and backed by complete native scrolling behavior?
14. Are homepage chapter and project local-section controls semantic anchors with stable tracking and visible target focus?
15. Does pointer personality rely on graphic state changes rather than a continuous custom cursor follower?
16. Are provider and route-family loading states truthful, spatially stable, and calm?
17. Are errors and not-found recovery actions available without decorative delay?
18. Does each animated node have one engine owner, with entrance and scroll depth separated when both are needed?
19. Does reduced motion remove spatial and timed decorative effects while preserving every function and state distinction?
20. Can user input, navigation, focus, and recovery interrupt motion without leaving invalid hidden or transformed states?
21. Are continuous effects scarce, offscreen work stopped, and expensive animated filters excluded?
22. Do both themes preserve identical interaction meaning without introducing a second motion language?

## 24. Downstream constraints established by S5

Subject to written-spec review and docket confirmation:

- S6 must treat Selective Cinematic Motion with Signature Moments as the portfolio-wide motion posture.
- S6 must provide one durable owner for capability-tier selection, reduced-motion policy, route-handoff lifecycle, and each engine's cleanup contract without changing their observable behavior.
- S6 must preserve role-separated ownership: CSS for direct state transitions, Framer Motion for presence and structured entrances, GSAP/ScrollTrigger for continuous scroll-linked effects, native state for section determination, and Lenis for eligible interpolation only.
- S6 must prevent same-node engine conflicts and support separate entrance and scroll-depth targets where one composition needs both.
- S6 must support recurring full-load branded arrival, continuous menu-to-route handoff, browser-restoration bypass, and interruption-safe destination resolution.
- S6 must centralize capability decisions sufficiently to keep mobile, touch, short-height, webview, constrained-browser, and reduced-motion behavior consistent across page families.
- S6 must preserve native scrolling, anchors, focus, and route behavior as the baseline when enhancement is unavailable.
- Later implementation must remove compounded preloader/hero delays, fake progress, post-navigation route coverage, reduced-motion scroll smoothing, pervasive hidden baselines, continuous custom-cursor motion, and unbounded pin/horizontal behavior.
- Later acceptance must verify motion behavior across route family, theme, viewport, usable height, input mode, browser capability, navigation type, async state, and motion preference.

## 25. Outcome

The portfolio gains a coherent motion language rather than a collection of effects. Branded arrival and route handoffs provide personality; editorial reveals clarify evidence; restrained desktop depth creates cinematic signature moments; graphic interaction states preserve Constructed Signal character. Native document flow, immediate evidence, semantic navigation, stable recovery, and a fully functional reduced-motion mode remain authoritative. Motion enhances confidence and craft without making the recruiter wait for the portfolio to perform.
