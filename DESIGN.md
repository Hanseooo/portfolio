# DESIGN.md

The design rules for this portfolio. Read this before you change anything a visitor sees.

**Name:** Constructed Signal.
**In one line:** an architect's drawing sheet that a red signal runs through. Ivory paper, ink type, fine construction lines, and a few loud red or ink fields placed on purpose.
**Last verified against code:** 2026-10-22.

Where this file and older docs disagree, this file wins, and the code beats both (see §15).

---

## 1. Who it is for

A recruiter or engineering lead opens the site on a laptop at work. They give it about a minute to decide whether Hans is worth an interview. The page has two jobs:

1. **Stop them.** Make the page memorable and visibly crafted, with character.
2. **Prove it.** Put the evidence (projects, numbers, experience) where they can read it without effort.

Every design choice serves one of these two jobs. If a choice serves neither, cut it.

---

## 2. The core rule: chaos where it stops, discipline where it reads

Every region of a page is either **expressive** or **reading**. Decide which before you design it.

| | Expressive zone | Reading zone |
|---|---|---|
| Job | Stop the visitor | Let them read the proof |
| Surface | Red field, ink field, or ivory with heavy geometry | Ivory (`--cs-foundation`) or paper (`--cs-reading-surface`) |
| Type | Display face at large scale, overlap, bleed | Inter body, mono indexes, steady sizes |
| Geometry | Arcs, registration marks, crop marks, routing lines, crossing rules | Hairline rules and indexes only |
| Layout | Asymmetry, tilt, offset, grid breaks | Grid-aligned, predictable, scannable |
| Motion | Marquees, parallax, peel and clip reveals | Simple fade-up, or none |

**Where each zone lives today:**

| Surface | Zone | What it does |
|---|---|---|
| Hero (`SceneIdentity`) | Expressive | Red ribbon at 45% width, overlapping 13rem name, portrait with hard ink offset, orbit geometry |
| Hero proof strip | Reading inside an ink band | Three proof figures on `bg-zinc-900` |
| Flagships (`SceneFlagships`) | Mixed | Each project's 7-column title plate is expressive (red, CompassArc); its 5-column copy column is reading. Sides alternate |
| Stack (`TechStackSection`) | Expressive | Tilted ink marquees, a red lead plate, IndexMark rows, asymmetric 5/7 bento |
| Experience (`SceneExperience`) | Reading, with a small field at each end | Ledger in the middle, an ink credential plate on the left, a red link pillar on the right |
| Presence (`ScenePresence`) | Reading | Live data stays neutral. The portrait carries one geometry cluster |
| Contact (`SceneContact`) | Expressive, quiet | Large split-text title, ghost geometry, a signal-leader status line |

**The test.** Take one paragraph or one list of proof. If you can't read it in a single calm pass, you are in a reading zone and you've let chaos in. Move the loud element to the edge of the content. Don't put it under the text.

---

## 3. Chaos budget

Chaos is allowed. It is rationed, and every piece must look intentional.

**Per expressive zone, pick at most three of these moves:**

- **Tilt:** a band rotated ±2° (`-rotate-2`, `rotate-2`) with `scale-[1.05]` so the edges never show. Tilt only full-bleed bands. Never tilt a block of text someone has to read.
- **Overlap:** display type crossing a field edge, or a screenshot crossing its plate edge.
- **Bleed:** a field or title running off the viewport edge.
- **Hard offset:** a solid ink block behind a focal frame (`translate-x-3 translate-y-3`, `md:translate-x-5 md:translate-y-5`). Use it for the portrait or one featured artifact only.
- **Grid break:** an element leaves the 12-column grid, then the next element returns to it.
- **Dense line work:** stacked tick marks, crossing rules, registration marks.
- **Scale shock:** display type at 10rem or more next to 12px mono.

**Hard limits:**

- One dominant field per scene. Never put two red fields next to each other. A neutral region always sits between them.
- Small repeated records never each get their own red panel. Give the first or featured record the field and keep the rest neutral. The Stack lead plate plus IndexMark rows is the reference.
- Chaos never touches the content of a reading zone. It may frame the zone from outside.
- Every irregular move has a reason you can name: frame, divide, connect, focus, or stop. "It looked empty" is not a reason.
- On mobile, decoration goes before content. Hide geometry (`hidden md:block`, `hidden sm:block`) before you shrink or crop any text.

**Not in the grammar:** stickers, doodles, handwritten fonts, emoji, novelty cursors, rotated paragraphs, scrapbook layering, gradient text, glassmorphism, neon glow.

---

## 4. Color

### Tokens (`app/globals.css`)

Use the `--cs-*` variables. Never write hex values in components.

| Token | Light | Dark | Use |
|---|---|---|---|
| `--cs-foundation` | `#F3F0E9` ivory | `#080909` | Page base |
| `--cs-reading-surface` | `#FBFAF7` paper | `#111111` | Reading sections, contact |
| `--cs-raised-neutral` | `#EDE9E3` | `#18181B` | Quiet raised plane |
| `--cs-text-primary` | `#151515` ink | `#FAFAFA` | Headings, body |
| `--cs-text-secondary` | `#52524E` | `#A1A1AA` | Supporting text, metadata |
| `--cs-structural-line` | ink 15% | white 10% | Hairlines, grid |
| `--cs-structural-line-strong` | ink 40% | white 25% | Rules that separate groups, geometry strokes |
| `--cs-signal` / `--cs-signal-text` | `#E10600` red | `#00E5FF` ice | Accent: fields (light), type, rules, index numerals |
| `--cs-signal-inverse` | `#FFFFFF` | `#080909` | Text on a solid signal fill |
| `--cs-focus-ring` | `#E10600` | `#00E5FF` | Focus outlines |
| `--cs-status-online` etc. | green, amber, red, gray | brighter equivalents | Real live states only |

### Field recipes (what the code does today)

| Field | Classes | Dark mode |
|---|---|---|
| Red field | `bg-[color:var(--cs-signal)] dark:bg-zinc-800 text-white` | Gray plate (Hans asked for gray). Ice is never used as a large field |
| Ink field | `bg-zinc-900 dark:bg-zinc-800 text-white` | Same gray plate |
| Hero ribbon | `bg-[color:var(--cs-signal)] dark:bg-zinc-800/80` | Slightly translucent gray |

Add the dark override every time you use `--cs-signal` as a background. Without it, the field turns ice blue in dark mode.

In dark mode, ice blue appears only in type, rules, index numerals, and focus rings. It is never a large fill.

### Inside a field

- Text is `text-white`. Supporting text is `text-white/80`.
- Geometry is `text-white/20` to `text-white/40` on `currentColor`.
- The focus outline is `outline-white`. The red focus ring disappears on a red field.

### Contrast (WCAG AA, measured in the S2 spec)

| Pair | Ratio | Allowed for |
|---|---|---|
| White on red `#E10600` | 4.97:1 | All text |
| Red on paper `#FBFAF7` | 4.76:1 | Normal text, bold preferred |
| Red on ivory `#F3F0E9` | 4.36:1 | Large text (24px or larger, bold), rules, marks. **Not body text** |
| Ink on red | 3.68:1 | Large text and graphics only |
| Ice on black | 13.65:1 | All text |

Never use `--cs-structural-line` as a text color.

---

## 5. Typography

Fonts are loaded in `app/fonts.ts`.

| Role | Font | Variable | Use | Never |
|---|---|---|---|---|
| Display | **Bricolage Grotesque 800** | `--font-display` | Name, scene titles, project names, proof values, index numerals. Six words or fewer | Paragraphs, long labels |
| Reading | Inter | `--font-sans` (default) | Everything someone reads in sentences: summaries, bullets, descriptions | |
| Index / label | JetBrains Mono | `--font-mono` | Numbers, dates, counts, PR refs, eyebrows, uppercase button labels, tech names in lists, status lines | Sentences, paragraphs, headings |

Older specs say Anton. The site uses Bricolage. Don't add Anton.

**Display.** `font-black uppercase`, leading 0.72 to 0.95, tracking from `tracking-tight` down to `-0.105em` at hero size. Size with `clamp()`. The scales in use:

- Hero name: `clamp(4.5rem, 13vw, 13rem)`
- Chapter title: `clamp(2.75rem, 8vw, 6rem)` to `clamp(3rem, 10vw, 7rem)`
- Plate or lead title: `clamp(2rem, 4vw, 3.5rem)`
- Row or record title: `clamp(1.5rem, 2.5vw, 2.25rem)`

Neighboring levels should differ in size by at least 1.25×. Contrast is the point: a giant display line next to a 12px mono line.

**Mono labels.** Use `font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest`. Go down to 10px only for true metadata. Don't go smaller, and don't use mono labels as decoration.

**Reading text.** Use 15px or 16px at `leading-relaxed` in `--cs-text-secondary`. Keep lines to 65ch or less (`max-w-2xl`, `max-w-prose`).

---

## 6. Grid and layout

`.hp-grid` has 4 columns at base, 8 from `md`, and 12 from `lg`. The gap is 16px, then 24px. The maximum width is 1400px, with side padding of `--cs-gutter-portfolio` (`clamp(20px, 4vw, 48px)`).

**Asymmetric splits.** Use these. A 6/6 split is almost never right.

- **5/7:** the Stack bento and the "What I build" row. The plate sits beside the list.
- **7/5:** the Flagship plate beside its copy. The side alternates per project with `reversed`.
- **3/9 or 3/6/3:** a sticky index rail beside the content, or the Experience ledger.
- **12, then broken:** the hero name across 11 columns, with the portrait pulled into the right third.

**Rhythm.** Vary padding on purpose: `p-8 lg:p-12 xl:p-16` on plates, tighter on rows. Expressive zones get generous space. Reading zones get steady, moderate space. Dense zones (rails, strips, navigation) get compact space that you can still tap: a minimum target of `min-h-11`, or 44px.

**Bento cells** share borders (`gap-0` plus `border-b` and `border-r`). They are cells of one drawing sheet, not separate cards.

---

## 7. Geometry vocabulary

The lines are what make the site look architectural. Draw them as real constructions.

### Primitives (`components/geometry/index.tsx`)

| Component | Drawing | Where it sits |
|---|---|---|
| `CropMarks` | Four corner brackets just outside a box | Around a framed artifact. The parent must not clip |
| `RegistrationMark` | Ring, crosshair, center dot | Partly off a corner of a field (`-top-16 -right-16`) |
| `CompassArc` | Swung arc, dashed inner arc, radius line, origin tick | From a field corner across its space (`text-white/20`) |
| `IndexMark` | Display numeral in signal color plus a 48px leader | Leads each record in a register |

All primitives stroke with `currentColor` at 1px and `vector-effect: non-scaling-stroke`, and are `aria-hidden`. Set the color with a `text-*` class.

### Inline marks (fine inside a component)

- **Dimension line:** an SVG path `M0 0 V12 M100 0 V12 M0 6 H100` with `preserveAspectRatio="none"`. Keep it in normal flow so it can't overlap text.
- **Crossing rules:** 1px divs at `bg-white/10` or `bg-[color:var(--cs-structural-line)]`, made 120% to 150% long so they cross the edges.
- **Tick clusters:** 1px verticals of 8px, 16px, and 32px in a group of three.
- **Signal leader:** an `h-px w-8 md:w-12 bg-[color:var(--cs-signal)]` line that introduces a status line or eyebrow.
- **Orbit outlines:** in the hero and contact, a circle, an arched rectangle (`borderRadius: 48% 48% 12% 12%`), and a dashed circle at 30% to 60% opacity.

### Rules

1. Every mark attaches to a content edge, or crosses one. A mark floating in the middle of nothing is clutter.
2. Use 2 to 4 marks per expressive zone and 0 to 1 per reading zone.
3. Labels on marks show real values only (a year, "20 weeks"). Never use invented codes like "FIG.1A", "EL.02", or "Directory / 01".
4. Line weight carries meaning: hairline for structure, 1px strong for groups, heavier only for an active state or a major change in hierarchy. Never put thick borders around ordinary records.
5. Use SVG for anything curved. Use divs for straight rules.

### Drawn on entry (`data-draw`, `components/motion/DrawController.tsx`)

Marks are constructed once as they enter the viewport, at the same edge as register reveals (bottom 15%), and only after the arrival or a route handoff lifts. `CompassArc` and `RegistrationMark` carry the attribute already; inline marks opt in.

| `data-draw` | Construction |
|---|---|
| `compass` | Arc swings 90° open from its origin corner |
| `ring` | Full turn from 12 o'clock (`--draw-from` changes the start) |
| `settle` | Crop-mark corners close in 6px from outside the box. On hover of a `.group` they tighten 3px |
| `extend-x` / `extend-y` | A straight rule grows out from its `origin-*` crossing point |

Stagger a sequence with `--draw-delay`. Marks already on screen when no cover is up render finished.

---

## 8. Surfaces and depth

- Use flat planes. Show depth with tone changes, rules, overlap, and the hard offset.
- Corners are square. `rounded-full` is for dots and circles only. Use `rounded-[2px]` only where a control needs it.
- **Shadows already in the code** (`shadow-xl` and `shadow-2xl` on plates and marquee bands, `blur-2xl` signal orbs behind portraits) are part of the current look. Keep them where they are. Don't add new ones, and never put them on reading-zone records.
- Avoid cards. A list of records is a register: rows divided by rules and led by an `IndexMark`. Never nest cards. Never build grids of identical icon-plus-heading cards.

---

## 9. Components and patterns

### Buttons (hero is the reference)

All buttons are `h-12`, mono `text-xs font-bold uppercase tracking-widest`, `px-5`, with an `ArrowUpRight` at size 14.

| Rank | Rest | Hover |
|---|---|---|
| Primary | Solid ink with ivory text, `border-2` | Shifts up-left 1px. The arrow nudges up-right |
| Secondary | Transparent, 1px ink border | Fills with ink. Same shift |
| Inside a field | White text, white border | Fills with white, field-color text |

Use one primary per cluster.

### Proof link (Stack, `ProofLinks`)

A mono xs uppercase link with `min-h-11` and an `ArrowUpRight` that nudges on hover. Labels wrap; they are never truncated. Use the inverse variant on fields.

### Register row

`IndexMark` → title (display, row scale) → description (Inter, secondary) → links. On desktop the grid is `[auto_minmax(0,1fr)_auto]`; on small screens it stacks. Rows are separated by `border-b`, and the last row has none.

### Status line (Contact)

Signal leader, then a 6px dot in `--cs-status-online`, then mono xs uppercase text. Line breaks happen only at the `·` separators. Each segment is `whitespace-nowrap`, and each separator stays on the segment before it.

### Marquee band

Full-bleed, ink (`bg-zinc-900 dark:bg-zinc-800`), tilted ±2°, edges faded with `ticker-fade`. Use them in pairs with opposite tilt and direction. The words are real workflow terms, not filler. The band stops moving under reduced motion (`animation: none`).

### Theme portrait (`components/evidence/ThemePortrait.tsx`)

The About portrait (homepage Presence and `/about`) shows `hans.webp` in light and `hans2.webp` in dark. The dark image covers the light one, so the theme toggle's circle reveal carries the swap. No grayscale on it in dark. The hero keeps `hans.webp` in both themes.

### Separators in copy

Use `·` between list-like facts ("AI Engineer · Full-Stack Developer").

---

## 10. Motion

Budgets are in `lib/motion-budget.ts` and recipes in `lib/motion.ts`.

- **Easing:** `decisiveEditorial` `[0.16, 1, 0.3, 1]` for entrances, `fastGraphic` for hover and focus. No bounce, no elastic.
- **Timing:** interactions take 120 to 240ms. Editorial entrances take 350 to 700ms.
- **Recipes:** `fadeUpReveal(reducedMotion, delay)` for rows, `clipReveal` and `peelReveal` for plates, `SplitText` for the contact title, `StructuredReveal` for scene blocks. Stagger by 0.08s, with at most 8 staggered items.
- **Parallax:** only through `data-parallax-speed` inside the hero (`HeroDepthEffect`). Never put a mask on the moving element.
- Animate only `transform` and `opacity`. Never animate layout properties. One exception: the drawn-mark sweep (§7) animates a conic `mask-image` angle once per mark, 700ms, and drops the mask when done. Stroke-dash drawing is not used because dashes ignore `pathLength` under `non-scaling-stroke`.
- **Reduced motion is a full design state.** Every element ends visible at opacity 1, marquees stand still, and parallax is off. Pass `usePrefersReducedMotion()` into every recipe. No part of the hierarchy should depend on an animation finishing.

---

## 11. Copy rules that affect design

- Only real labels. An eyebrow names the content ("What I build"), never a code.
- No hype words, no "Corroborated track record". State the fact and give its proof.
- Numbers need attribution when they are claims ("Client-reported, Le Doux").
- Every word must earn its place. Don't restate a heading in the line beneath it.
- No em dashes in UI copy.

---

## 12. Accessibility (not negotiable)

- AA contrast for every text pair. See the table in §4.
- Every interactive element has a visible `focus-visible` outline: `--cs-focus-ring` on neutral surfaces, white on fields.
- Touch targets are 44px or larger.
- Geometry is `aria-hidden` and `pointer-events-none`.
- Color is never the only signal. Pair it with text, an icon, or a position.
- No horizontal scroll from 360px up. Tilted bands need `overflow-hidden` on their parent.
- Every image has real alt text.

---

## 13. Anti-patterns (rewrite on sight)

- Two red fields next to each other, or a red panel on every record.
- Identical card grids. Icon + heading + text, repeated.
- Side-stripe accent borders thicker than 1px on cards or callouts.
- Gradient text, glass blur cards, neon glow.
- Geometry floating with no anchor, or labeled with fake codes.
- Mono paragraphs. Display-face sentences.
- Red body text on ivory.
- `bg-[color:var(--cs-signal)]` without a `dark:` override.
- Shadcn tokens (`bg-primary`, `text-primary`, `bg-border`) in new homepage code. Use `--cs-*`.
- Truncated labels that hide real names.
- Decoration that stays while content is hidden on mobile.

---

## 14. Before you ship a visual change

1. Name the zone (expressive or reading) and the moves you used. No more than three chaos moves.
2. Check it at 360, 390, 768, 1024, and 1440px. No horizontal scroll, and nothing overlaps text.
3. Check light and dark. Fields should be gray in dark mode, with no ice-blue fills.
4. Turn on reduced motion. Everything should be visible and still.
5. Tab through it. Focus must be visible on every surface it crosses.
6. Run `pnpm lint && pnpm build`.

---

## 15. Known drift (code is the truth)

| Source | Says | The code does |
|---|---|---|
| S2 and R3 specs | Display face is Anton | Bricolage Grotesque 800 |
| R3 spec §2 | No mono on CTAs or eyebrows | Mono uppercase is the standard button and eyebrow style |
| R3 spec §3 | Fields use `.hp-signal-field` (dark = foundation black) | Inline `dark:bg-zinc-800` gray, as Hans asked. `.hp-signal-field` exists but no component uses it |
| S2 §7 | No soft shadows or blur | `shadow-xl`/`2xl` and `blur-2xl` orbs exist and are kept, but not extended |
| `docs/04-visual-direction.md`, `docs/05-design-system.md` | Black background, Ice Blue, Inter/Roobert | Ivory and red light theme, the token set above |
| `TechStackSection.tsx` | (should use `--cs-*` only) | Still uses `bg-border`, `bg-primary/40`, `bg-muted/10`, `text-primary` in older cells |

If you move these fields to a single shared class later, add a gray dark variant so the look stays the same.
