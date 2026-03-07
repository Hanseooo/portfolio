# Live Activity UI Spec

Date: 2026-03-07  
Related engineering spec: `docs/plans/2026-03-07-live-activity-section-spec.md`

## 1) UI Objective

Design a new homepage section called **Live Activity** that feels aligned with the portfolio's intentional editorial style while remaining easy to scan on mobile.

The section should communicate three real-time signals:

- GitHub activity (primary)
- Spotify now playing + recent tracks (secondary)
- Discord status via Lanyard (supporting)

## 2) Visual Direction

### 2.1 Design Language

- Use the current sharp card system across all breakpoints.
- No soft/glassy card drift for this section.
- Keep corners restrained (`rounded-xl` max).
- Maintain border-forward hierarchy and selective accent usage.

### 2.2 Card Styling Rules

Base card shell:

- Border: `border border-foreground/20`
- Surface: `bg-background/85` to `bg-background/90`
- Radius: `rounded-xl`
- Accent shadow: `shadow-primary-sharp` only on key cards (not all nested blocks)
- Internal spacing: `p-5 sm:p-6`

Text contrast:

- Body copy target: `text-foreground/85`
- Meta copy target: `text-foreground/70`
- Avoid low-opacity-only styling for important labels/data.

## 3) Section Structure

### 3.1 Header Block

- Eyebrow: `Live Signals`
- Title: `Live Activity`
- Supporting line: "What I am building, listening to, and where I am active right now."

Header should mirror existing section rhythm used by Projects/Experience/Certificates.

### 3.2 Card Hierarchy

1. **GitHub Activity Card** (largest, primary)
2. **Spotify Activity Card** (medium)
3. **Discord Presence Card** (compact)

## 4) Responsive Layout Blueprint

### 4.1 Mobile (<= 767)

- Single-column stack.
- Order: GitHub -> Spotify -> Discord.
- Keep cards concise; prevent long unbroken content.

### 4.2 Tablet / iPad (768-1023)

- Two-column grid.
- GitHub spans full width first row.
- Spotify and Discord split second row.

### 4.3 Desktop (>= 1024)

- Structured bento-style layout (intentional, not decorative).
- Recommended 12-column split:
  - GitHub: `col-span-8`
  - Right rail: `col-span-4` with Spotify above Discord

Rationale: supports strong information hierarchy and portfolio editorial tone.

## 5) Component-Level Specs

## 5.1 GitHub Activity Card

Top row:

- Title: `GitHub Activity`
- Status/meta: last update timestamp
- Optional external link to profile

Body:

- Recent commits list (5-8 items)
  - Commit message (clamped)
  - Repo name
  - Relative time
- Mini weekly activity (Mon-Sun tiny bar strip)
- Active repos chips (secondary content)

Micro chart:

- Use custom tiny bars via Tailwind/CSS (MVP), not full chart lib.
- Keep bars minimal and readable in both light/dark themes.

## 5.2 Spotify Activity Card

Default (always visible):

- Card title: `Now Playing`
- Album artwork (compact)
- Track title, artist, optional album
- Playing state badge (`Playing` / `Not Playing`)

Collapsible panel:

- Label: `Recent tracks`
- Content: last 8-10 tracks with played time
- Persist open/closed state while polling updates

Fallback behavior:

- If no current playback, keep card useful with recent tracks summary.

## 5.3 Discord Presence Card

Top:

- Avatar + display name
- Status badge (`online`, `idle`, `dnd`, `offline`)

Body:

- Active client indicators (desktop/mobile/web)
- Optional line for Lanyard Spotify flag (`Listening on Spotify`) when true

Keep this card compact and quick to parse.

## 6) Interaction and Motion Rules

- Section entrance animation follows existing subtle motion tokens.
- Polling updates should not replay entrance animations.
- Use small opacity/color transitions for status changes only.
- Collapsible expands/collapses with short duration and reduced-motion fallback.
- Respect `prefers-reduced-motion` globally.

## 7) Content Rules and Data Formatting

- Clamp long commit messages and track titles to prevent overflow.
- Relative time format for freshness (e.g., `5m ago`, `2h ago`).
- Show explicit empty states instead of blank cards.
- Keep labels short and avoid dense metadata lines.

## 8) States and Edge Cases

Each card should support:

- Loading state (skeleton with fixed card height)
- Success state
- Empty state
- Error state (soft error messaging)

Edge case handling:

- One provider fails: other cards still render normally.
- Missing env/config: show card-level unavailable message.
- Narrow phones: no horizontal scroll from chips or timestamps.
- Short-height viewports: avoid oversized content blocks.

## 9) Accessibility Checklist

- All controls keyboard accessible.
- Collapsible has `aria-expanded` and clear labels.
- External links include descriptive labels.
- Color contrast remains readable in light/dark themes.
- Status is never conveyed by color alone (include text labels).

## 10) Implementation Mapping (UI only)

Proposed UI files:

- `components/sections/LiveActivity.tsx`
- `components/sections/live-activity/GitHubActivityCard.tsx`
- `components/sections/live-activity/SpotifyActivityCard.tsx`
- `components/sections/live-activity/DiscordStatusCard.tsx`
- Optional: `components/sections/live-activity/WeeklyActivityBars.tsx`

Integration point:

- `app/page.tsx` (recommended placement between Projects and Experience)

## 11) Definition of Done (UI)

- Section reads as one coherent system, not three unrelated widgets.
- Mobile and desktop both feel intentional and consistent.
- No overflow at target breakpoints: 360, 390, 768, 1024, 1366 widths.
- Card hierarchy remains clear at all sizes.
- All interaction states and accessibility checks pass.
