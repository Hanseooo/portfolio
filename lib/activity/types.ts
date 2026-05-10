export type ActivitySource = "live" | "cache" | "fallback";

export type ActivityErrorCode =
  | "missing_config"
  | "auth_failed"
  | "rate_limited"
  | "provider_unavailable"
  | "invalid_response"
  | "internal_error";

export type ActivityResponse<T> = {
  ok: boolean;
  source: ActivitySource;
  updatedAt: string;
  data: T | null;
  error?: {
    code: ActivityErrorCode;
    message: string;
  };
};

export type GitHubActivity = {
  commits: Array<{
    repo: string;
    repoUrl: string;
    isPrivate: boolean;
    message: string;
    url: string;
    committedAt: string;
  }>;
  activeRepos: Array<{
    name: string;
    url: string;
    isPrivate: boolean;
    recentCommitCount: number;
  }>;
  stats: {
    currentStreak: number;
    longestStreak: number;
    totalContributions: number;
    prOpened: number;
    prMerged: number;
    issuesOpened: number;
  };
  topLanguages: Array<{
    name: string;
    ratio: number;
  }>;
  calendar: Array<{
    date: string;
    count: number;
    level: 0 | 1 | 2 | 3 | 4;
  }>;
};

export type SpotifyActivity = {
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
  topTracks: Array<{
    title: string;
    artist: string;
    album: string;
    artworkUrl: string;
    trackUrl: string;
  }>;
  topArtists: Array<{
    name: string;
    artworkUrl: string;
    artistUrl: string;
  }>;
};

export type DiscordActivity = {
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
  live: {
    spotify: {
      title: string;
      artist: string;
      album: string;
      trackUrl: string;
      albumArtUrl: string | null;
      startedAt?: number;
    } | null;
    gaming: {
      name: string;
      details?: string;
      state?: string;
      imageUrl?: string | null;
      startedAt?: number;
    } | null;
    otherActivities: Array<{
      type: number;
      typeLabel: string;
      name: string;
      details?: string;
      state?: string;
      platform?: string;
      imageUrl?: string | null;
      startedAt?: number;
    }>;
  };
};
