# Design System

## Color Tokens
We utilize a highly restricted, high-contrast palette.

- **Backgrounds:**
  - `bg-black`: `#000000` (Main background)
  - `bg-zinc-950`: `#09090B` (Elevated cards/sections)
  - `bg-zinc-900`: `#18181B` (Hover states for cards)
- **Typography:**
  - `text-white`: `#FFFFFF` (Primary headers, high emphasis)
  - `text-zinc-400`: `#A1A1AA` (Body text, secondary information)
  - `text-zinc-600`: `#52525B` (Muted text, metadata, borders)
- **Accents (Ice Blue / Red):**
  - `accent-primary`: `#00E5FF` in Dark Mode, `#e10600` in Light Mode. Used for active navigation states, primary buttons, and key hover highlights.
  - `accent-glow`: Contextual subtle box-shadows based on the active accent color.

## Typography Scale
- **Font Families:**
  - *Primary (Sans):* Inter, Roobert, or Geist (clean, neo-grotesque).
  - *Secondary (Mono):* JetBrains Mono, Fira Code (used for metadata, numbers, code snippets).
- **Scale (Mobile / Desktop):**
  - `h1`: 3.5rem / 6rem (Hero headline, tightly tracked).
  - `h2`: 2.5rem / 4rem (Chapter headers).
  - `h3`: 1.5rem / 2rem (Card titles).
  - `body`: 1rem / 1.125rem (Paragraphs, high line-height for readability).
  - `mono/meta`: 0.875rem (Uppercase, tracked out).

## UI Elements

### Buttons
- **Primary:** Transparent background, 1px solid `text-zinc-600` border. On hover: Border shifts to `accent-primary`, text shifts to `accent-primary`, subtle glow effect.
- **Icon Buttons:** Simple, clean SVGs. Scale to 1.1 on hover.

### Card Styles
- No heavy box shadows in resting state.
- 1px solid border (`border-zinc-800` or `border-zinc-900`).
- Sharp corners or very minimal rounding (`rounded-sm`, 2px to 4px max) to maintain the technical, architectural feel.
- On hover: Border illuminates slightly, inner image slowly scales up (1.02x).

### Icon Style
- Sharp, un-rounded icons. Phosphor Icons (Thin/Light variants) or Lucide (stroke-width 1.5).

### Theme & Modes
- This site supports both **Light Mode** and **Dark Mode**. 
- **Light Mode:** White background with Red accents (`#e10600`).
- **Dark Mode:** Deep black background with Ice Blue accents (`#00E5FF`).
- The dual-theme setup maintains the cinematic cyber-editorial vibe across both viewing preferences.
