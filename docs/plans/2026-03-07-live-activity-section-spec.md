# Live Activity Section Spec

Date: 2026-03-07
Owner: Hanseo Portfolio
Status: Approved for planning

## 1) Goal

Add a new homepage section that shows real-time developer signals:

- GitHub activity (recent commits + mini weekly activity)
- Spotify now playing + collapsible recent tracks
- Discord status via Lanyard

The section should feel intentional, match current portfolio design, and remain fast/reliable.

## 2) Confirmed Decisions

- APIs must be free to use.
- GitHub source: GraphQL API with PAT.
- Spotify source: OAuth flow using refresh token.
- Spotify UI: default now playing + collapsible recent tracks.
- Discord source: Lanyard REST endpoint with polling.

## 3) Scope

### In Scope

- New `Live Activity` section on homepage.
- Three data route handlers under `app/api/activity/*`.
- Client rendering with loading, empty, and error states.
- Polling + cache strategy tuned per provider.

### Out of Scope

- Storing long-term analytics/history in a database.
- Lanyard websocket implementation (phase 2+ only).
- User-configurable dashboard settings.

## 4) Proposed Placement

Recommended position on homepage: between `Projects` and `Experience`.

Rationale: keeps "proof of current activity" after project quality and before timeline sections.

## 5) Data Architecture

### 5.1 Route Handlers

- `app/api/activity/github/route.ts`
- `app/api/activity/spotify/route.ts`
- `app/api/activity/discord/route.ts`

All provider calls happen server-side to protect secrets and normalize payloads.

### 5.2 Normalized Response Contracts

Each endpoint returns a stable envelope:

```ts
type ActivityResponse<T> = {
  ok: boolean;
  source: "live" | "cache" | "fallback";
  updatedAt: string; // ISO
  data: T | null;
  error?: {
    code: string;
    message: string;
  };
};
```

#### GitHub payload

```ts
type GitHubActivity = {
  commits: Array<{
    repo: string;
    message: string;
    url: string;
    committedAt: string;
  }>;
  activeRepos: Array<{
    name: string;
    url: string;
    recentCommitCount: number;
  }>;
  weeklyActivity: Array<{
    day: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
    count: number;
  }>;
};
```

#### Spotify payload

```ts
type SpotifyActivity = {
  nowPlaying: {
    isPlaying: boolean;
    title: string;
    artist: string;
    album: string;
    artworkUrl: string;
    trackUrl: string;
    playedAt?: string;
  } | null;
  recentTracks: Array<{
    title: string;
    artist: string;
    album: string;
    artworkUrl: string;
    trackUrl: string;
    playedAt: string;
  }>;
};
```

#### Discord payload

```ts
type DiscordActivity = {
  user: {
    id: string;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
  };
  status: "online" | "idle" | "dnd" | "offline";
  activeClients: {
    desktop: boolean;
    mobile: boolean;
    web: boolean;
  };
  listeningToSpotify: boolean;
};
```

## 6) API and Caching Strategy

### GitHub GraphQL

- Use PAT with minimal read scopes.
- Query recent commits and contribution context.
- Cache/revalidate: 300-600 seconds.

### Spotify OAuth

- Use refresh token to fetch access token server-side.
- Read now playing + recently played.
- Cache/revalidate: 20-30 seconds.

### Lanyard REST

- Poll `https://api.lanyard.rest/v1/users/{DISCORD_USER_ID}`.
- Cache/revalidate: 20-30 seconds.

## 7) UI Structure

Component proposal:

- `components/sections/LiveActivity.tsx`
- `components/sections/live-activity/GitHubActivityCard.tsx`
- `components/sections/live-activity/SpotifyActivityCard.tsx`
- `components/sections/live-activity/DiscordStatusCard.tsx`

Behavior:

- Mobile: stacked cards.
- Desktop: intentional grid with clear hierarchy.
- Spotify card includes collapsible panel for recent tracks.
- Keep card language consistent with current mobile/desktop card style.

## 8) Edge Cases and Handling

- Missing env vars: card-level error state, section still renders.
- Provider rate limits: show cached/stale-safe state + user-friendly message.
- Spotify not currently playing: show "Not playing now" + recent tracks.
- Lanyard offline/empty activities: show status only.
- GitHub no recent commits: show active repos and weekly activity with zero-safe rendering.
- Partial failure: one provider failing does not break other cards.

## 9) Environment Variables

Required:

- `GITHUB_TOKEN`
- `GITHUB_USERNAME`
- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`
- `SPOTIFY_REFRESH_TOKEN`
- `DISCORD_USER_ID`

Optional:

- `ACTIVITY_GITHUB_REVALIDATE_SECONDS` (default `300`)
- `ACTIVITY_SPOTIFY_REVALIDATE_SECONDS` (default `20`)
- `ACTIVITY_DISCORD_REVALIDATE_SECONDS` (default `20`)

## 10) Implementation Tasks (Spec-Driven)

1. Define shared activity response/types in `lib/activity/*`.
2. Build GitHub route handler + normalization + error mapping.
3. Build Spotify token refresh utility + route handler.
4. Build Discord/Lanyard route handler.
5. Build section container and three card components.
6. Add Spotify collapsible recent-tracks panel.
7. Integrate section into `app/page.tsx` at approved position.
8. Add defensive loading/error/empty states.
9. Validate responsiveness at key breakpoints and short viewports.
10. Run lint, typecheck, and production build.

## 11) Acceptance Criteria

- Homepage shows all three cards with live data when env vars are present.
- Spotify card has working collapsible recent tracks.
- UI remains stable if one or more endpoints fail.
- No secret leakage to client bundle.
- No horizontal overflow on mobile.
- `npm run lint`, `npx tsc --noEmit`, `npm run build` all pass.

## 12) Rollout Notes

- Merge with feature flag style fallback if needed (e.g., hide section when no env vars).
- Verify API quotas after first deployment week and tune revalidate values if required.
