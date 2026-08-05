# Homepage Redesign Variations — Geometric & Asymmetrical Grid Integration Design

## Executive Summary
This design document specifies the architectural integration of visual concepts from `prototypes/homepage-redesign-variations.html` into the live Next.js portfolio website. The integration merges Option 1 (Red Signal Hybrid) and Option 2 (Full Blueprint Grid System) into a cohesive visual identity featuring 12-column coordinate background grid lines, asymmetrical shape outlines, circular aperture rings, high-contrast section rhythm (Ivory, Paper, Signal Red, Deep Black), and the removal of deprecated system tags (`SYS // H-01` & `H / 01`).

---

## 1. Objectives & Invariants

### Objectives
1. **Geometric & Asymmetrical Shape Integration**: Add circular aperture lines, asymmetrical rounded shape containers (`48% 48% 12% 12%`), offset drop shadow frames (`12px 12px 0 var(--cs-text-primary)`), and geometric rule dividers.
2. **Architectural Grid System**: Introduce continuous 12-column background coordinate grid lines across Hero, Flagships, Experience, and Contact scenes.
3. **High-Contrast Color Rhythm**: Implement explicit surface role switching across homepage scenes:
   - **Identity (01)**: Ivory base + Signal Red hero ribbon field + paper reading surface card.
   - **Flagships (02)**: Paper surface + Signal Red case study visual block with circular/rectangular geometric shape overlays.
   - **Experience & More Work (03–04)**: Clean Ivory grid surface + structural rule dividers.
   - **Presence (05)**: Raised neutral surface + orbital shape accents.
   - **Contact (06)**: Deep Black closing block + Signal Red key typography.
4. **Tag Cleanup**: Remove all hardcoded `SYS // H-01` and `H / 01` tag labels from `SceneIdentity.tsx` and related components.
5. **Strict Content Integrity**: Retain all authentic copy from `homepage-projections.ts` with zero made-up or hallucinated text.

---

## 2. Component Design & Architectural Updates

### A. CSS Utility & Token System (`app/globals.css`)
- `.hp-canvas-grid`:
  - Light mode: 12-column background grid (`linear-gradient(rgba(21, 21, 21, 0.1) 1px, transparent 1px)`).
  - Dark mode: Dark background grid (`linear-gradient(rgba(243, 240, 233, 0.08) 1px, transparent 1px)`).
- `.hp-asymmetric-slot`: Shape backdrop styling using `border-radius: 48% 48% 12% 12%` with structural border stroke.
- `.hp-circular-aperture`: Orbital outline backdrops (`border-radius: 50%` with opacity strokes).
- `.hp-card-offset`: Brutalist offset shadow card frame (`box-shadow: 10px 10px 0 var(--cs-text-primary)`).

### B. Scene 01: Identity (`components/homepage/SceneIdentity.tsx`)
- **Grid backdrop**: Apply `.hp-canvas-grid` container to the scene.
- **Red Ribbon**: Broad `bg-[color:var(--cs-signal)]` ribbon spanning the right 50% on desktop.
- **Portrait Backdrop Shapes**:
  - Asymmetrical border box (`border-radius: 48% 48% 12% 12%`) inside the portrait slot.
  - Orbital aperture circles positioned behind portrait slot.
  - Geometric rule overlays (`3` horizontal blueprint rules).
  - Signal orb element (`portrait-orb`).
- **Removals**: Delete `SYS // H-01` and `H / 01` span elements.
- **Text & Actions**: Retain `data.roleStatement`, `data.introduction`, "Hans Amoguis" heading, and CTA buttons.

### C. Scene 02: Flagships (`components/homepage/SceneFlagships.tsx`)
- **Background Grid**: Apply `.hp-canvas-grid`.
- **Flagship Visual Containers**:
  - Flagship 1: Signal Red visual backdrop featuring square border (`before`) and circular border (`after`) geometric line overlays matching prototype `.work-visual`.
  - Flagship 2: Paper/Ink high contrast visual container with asymmetric rule borders.

### D. Scene 03–05: Experience, More Work, Presence (`components/homepage/`)
- Apply subtle coordinate grid lines and asymmetric vertical/horizontal structural dividers to ground timeline records and presence cards.

### E. Scene 06: Contact (`components/homepage/SceneContact.tsx`)
- High contrast Deep Black background (`var(--cs-text-primary)` / `#080909`).
- Structural 12-column grid overlay (`rgba(243, 240, 233, 0.1)` grid lines).
- Highlighted Signal Red typography and offset border buttons.

---

## 3. Verification Criteria
1. `pnpm lint` exits with code 0.
2. `pnpm build` exits with code 0.
3. No `SYS // H-01` or `H / 01` labels remain in rendered markup.
4. Visual verification: Grid patterns, orbital circular lines, asymmetrical shapes, red ribbon, and section color transitions render smoothly.
5. All text matches authentic content projections without hallucinated text.
