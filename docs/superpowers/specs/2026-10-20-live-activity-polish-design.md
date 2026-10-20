# Live activity polish — design

**Date:** 2026-10-20
**Status:** DONE
**Docket:** `docs/dockets/portfolio-refresh-docket.md` · R2
**Scope:** `lib/activity/github.ts`, `lib/activity/spotify.ts`, `lib/activity/discord.ts`, `components/sections/live-activity/WeeklyActivityBars.tsx`, `components/homepage/ScenePresenceClient.tsx`, the three `app/api/activity/*` routes.

## Purpose

All three cards stay (GitHub, Spotify, Discord). The heatmap reads as broken, the cards
leak configuration details, and two labels are wrong. S3's rule that provider failure keeps a
stable footprint still binds.

## 1. Heatmap: diagnosis

Measured on 2026-10-20:

- `getCalendarActivity` flattens GraphQL `weeks[].contributionDays[]`, keeps `slice(-140)`, and
  throws away weekday alignment. The first column starts on whatever weekday came out 140 days
  back, so rows don't mean Sunday through Saturday.
- `GitHubHeatmap` chunks days by 7 and lays the columns out with `flex justify-between` and
  `flex-1 max-w-[12px]`. The gaps stretch with the card width, which is the "spaced" look.
- About 140 Radix tooltips mount, one per cell. There are no month labels, weekday labels, or
  legend. Color comes from shadcn `bg-primary`, not `--cs-signal`.

## 2. Heatmap: design

**Data.** `getCalendarActivity` returns weeks, not days:

```ts
type CalendarWeek = { start: string; days: (CalendarDay | null)[] }; // 7 slots, Sun..Sat
type CalendarDay = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };
```

- Keep the last 20 weeks, including the current partial week. Future days and padding slots
  are `null`.
- Today is resolved in `activityTimezone`, as it is now.
- Levels stay as they are (0, 1–2, 3–5, 6–9, ≥10). They are a property of the data, so they
  stay server-side.

**Layout.** One CSS grid sets the size of every cell:

```css
grid-template-rows: repeat(7, var(--hm-cell));
grid-auto-flow: column;
grid-auto-columns: var(--hm-cell);
gap: var(--hm-gap);
```

- Cell 11px and gap 3px at ≥ 640px. Cell 9px and gap 2px below 640px.
- Cells are square with a 1px radius, so they match the sharp-shape lock.
- The grid hugs its content and sits left-aligned in the card. Extra width stays as ivory, not
  stretched gaps.
- Month labels go above the grid, one at each week where the month changes, in mono 10px.
  Weekday labels "Mon", "Wed", "Fri" go on the left.
- Legend: "Less", five swatches, "More".

**Color.** Five steps, all from tokens:

| Level | Light | Dark |
|---|---|---|
| 0 | `--cs-structural-line` | `--cs-structural-line` |
| 1–4 | `color-mix(in oklab, var(--cs-signal) 25% / 45% / 70% / 100%, var(--cs-reading-surface))` | same formula, ice resolves through `--cs-signal` |

Define these once as `--hm-0` … `--hm-4` in `app/globals.css`, not inline per cell. The current
glow on invalid cells goes. Glow is banned by S2.

**Interaction and accessibility.**

- The grid is `role="img"`, and its `aria-label` summarizes it, e.g. "1,204 contributions in the
  last 20 weeks. Busiest day Oct 3, 41 contributions."
- The same summary is visible as a caption under the grid. Keyboard and screen-reader users
  get the whole meaning without visiting 140 cells.
- Pointer hover shows a single shared tooltip ("12 contributions · Tue, Oct 14"), positioned on
  the hovered cell from `data-date` / `data-count` attributes with one event listener on the
  grid. It replaces the 140 Radix tooltips.
- Touch: tapping a cell shows the same tooltip, and tapping outside dismisses it.

## 3. Card copy and states

| Where | Now | Change |
|---|---|---|
| GitHub stat | "Commits" showing `totalContributions` (4603) | Label it "Contributions" |
| Error text | "GITHUB ACTIVITY IS NOT CONFIGURED: GITHUB_TOKEN", "SPOTIFY AUTHENTICATION FAILED." | One public message per card: "GitHub activity is unavailable right now." The detailed reason goes to `console.error` server-side only. API JSON carries `code`, never the env key |
| Loading | Mixed | A skeleton with the final shape: grid placeholder at full cell size, text bars at real line heights. No pulse under reduced motion (S5) |
| Empty Spotify | — | "Not listening right now" with the last played track if the API returns one |
| Discord status dot | emerald / amber classes | Status colors become semantic tokens `--cs-status-online`, `--cs-status-idle`, `--cs-status-dnd`, `--cs-status-offline`, defined for both themes. A status word sits next to the dot (non-color cue, S2) |
| Discord avatar | Forced grayscale | Full color. A grayscale portrait reads as a broken image |
| Spotify button | `focus-visible:outline-none` with no replacement | Uses the shared `--cs-focus-ring` outline |
| Jargon headers | Mono labels like provider codes | Plain names: "GitHub", "Listening", "Discord". Mono is reserved for timestamps and counts |

## 4. Out of scope

- The Spotify refresh token. Hans regenerates it in Vercel (docket blocker 6).
- New providers.

## Verification — authorized confirmed defects, 2026-10-21

The design remains DRAFT. Hans separately authorized the confirmed heatmap, Contributions-label, and public-error fixes. Those fixes are implemented locally and verified through `.playwright-cli/activity-check.mjs`, `.playwright-cli/confirmed-defects-check.cjs`, and `.playwright-cli/navigation-touch-check.cjs`. The calendar has 20 Sunday-aligned weeks with seven nullable slots each. Browser measurements in both themes are 11px cells/3px gaps at 1440 and 768px, and 9px/2px at 375px. One shared tooltip supports pointer hover, touch tapping, outside dismissal and Escape. Provider checks use captured public calendar data and a synthetic empty environment, without reading real configuration. Remaining card-state, Discord-style and Spotify tickets are not implemented by this authorization.

## Amendment — 2026-10-21, full-width band

Hans asked for a bigger, more expressive heatmap. This replaces §2 Data and Layout:

- `getCalendarActivity` keeps 53 weeks (`CALENDAR_WEEKS`). The query `from` is now 365 days back, not Jan 1, so the PR, issue, and streak stats also cover a rolling year.
- The heatmap is a full-width band above the cards, with the year's total in display type and both streaks next to it. Cells are fluid squares (`minmax(0,1fr)` columns, `aspect-ratio: 1`). Older weeks are hidden: 18 weeks below 640px, 30 below 1024px, 53 above. Gap is 2 / 3 / 4px.
- The busiest day gets a ring plus a crosshair through its row and column. A dimension line names the visible span, and columns stagger in on first view (no motion under reduced motion).
- The cards sit below in an asymmetric split: "Recent work" (7 columns) and Discord (stepped down, with a leader line).

Verified 2026-10-21: `.playwright-cli/r2-cards-check.cjs` shows a 0px skeleton-to-loaded shift for the band, details, and Discord regions at 1440 / 768 / 375. No horizontal overflow and a clean console in both themes. `activity-check.mjs` passes with 53 weeks. The Spotify ticket checks (focus ring, skeleton) stay unverified while the card is commented out.

## Tickets

| Id | Ticket | Done when |
|---|---|---|
| R2-1 | `getCalendarActivity` returns weekday-aligned weeks | A fixture of a real GraphQL response gives column 0 starting on Sunday, with `null` for future days. One small assert-based check in `lib/activity/` |
| R2-2 | Rebuild `GitHubHeatmap` on the fixed grid with labels, legend, tokens, and one shared tooltip | At 1440, 768, and 375px the gap between columns measures 3px / 3px / 2px (browser eval). The DOM has no Radix tooltip per cell |
| R2-3 | Public error messages without env names | `curl -s /api/activity/{github,spotify,discord}` with a missing env returns no `GITHUB_`, `SPOTIFY_`, or `DISCORD_` strings |
| R2-4 | Contributions label, Discord tokens and status words, avatar color, Spotify focus ring | Tabbing to the Spotify button shows the focus ring. The Discord dot has a text label |
| R2-5 | Skeletons for all three cards | With the APIs throttled, card heights match the loaded state within 4px (no layout shift) |
