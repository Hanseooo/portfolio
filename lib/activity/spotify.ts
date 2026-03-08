import { ActivityConfigError, getSpotifyEnv } from "@/lib/activity/env";
import type {
  ActivityErrorCode,
  ActivityResponse,
  SpotifyActivity,
} from "@/lib/activity/types";

type SpotifyArtist = {
  name: string;
  external_urls?: {
    spotify?: string;
  };
  images?: SpotifyImage[];
};

type SpotifyImage = {
  url: string;
};

type SpotifyTrack = {
  name: string;
  external_urls?: {
    spotify?: string;
  };
  album?: {
    name: string;
    images?: SpotifyImage[];
  };
  artists?: SpotifyArtist[];
};

type SpotifyNowPlayingResponse = {
  is_playing: boolean;
  item: SpotifyTrack | null;
};

type SpotifyRecentTracksResponse = {
  items?: Array<{
    played_at: string;
    track: SpotifyTrack;
  }>;
};

type SpotifyTopTracksResponse = {
  items?: SpotifyTrack[];
};

type SpotifyTopArtistsResponse = {
  items?: SpotifyArtist[];
};

type SpotifyDetailScope = "none" | "recent" | "top" | "all";

type RecentData = Pick<SpotifyActivity, "recentTracks">;
type TopData = Pick<SpotifyActivity, "topTracks" | "topArtists">;

const SPOTIFY_TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const SPOTIFY_NOW_PLAYING_ENDPOINT =
  "https://api.spotify.com/v1/me/player/currently-playing";
const SPOTIFY_RECENTLY_PLAYED_ENDPOINT =
  "https://api.spotify.com/v1/me/player/recently-played?limit=10";
const SPOTIFY_TOP_TRACKS_ENDPOINT =
  "https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=5";
const SPOTIFY_TOP_ARTISTS_ENDPOINT =
  "https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=5";

const recentTtlSeconds = Number.parseInt(
  process.env.ACTIVITY_SPOTIFY_DETAILS_REVALIDATE_SECONDS ?? "600",
  10
);
const RECENT_DATA_TTL_MS = Number.isFinite(recentTtlSeconds)
  ? Math.max(60, recentTtlSeconds) * 1000
  : 600_000;

const topTtlSeconds = Number.parseInt(
  process.env.ACTIVITY_SPOTIFY_TOP_REVALIDATE_SECONDS ?? "21600",
  10
);
const TOP_DATA_TTL_MS = Number.isFinite(topTtlSeconds)
  ? Math.max(600, topTtlSeconds) * 1000
  : 21_600_000;

let recentCache: { data: RecentData; expiresAt: number } | null = null;
let topCache: { data: TopData; expiresAt: number } | null = null;

function emptySpotifyData(nowPlaying: SpotifyActivity["nowPlaying"]): SpotifyActivity {
  return {
    nowPlaying,
    recentTracks: [],
    recentArtists: [],
    topTracks: [],
    topArtists: [],
  };
}

function buildErrorResponse(
  code: ActivityErrorCode,
  message: string,
  source: ActivityResponse<SpotifyActivity>["source"] = "fallback"
): ActivityResponse<SpotifyActivity> {
  return {
    ok: false,
    source,
    updatedAt: new Date().toISOString(),
    data: null,
    error: {
      code,
      message,
    },
  };
}

function mapTrack(
  track: SpotifyTrack,
  playedAt?: string,
  isPlaying = false
): SpotifyActivity["nowPlaying"] {
  if (!track.name) return null;

  const artworkUrl = track.album?.images?.[0]?.url ?? "";
  const artists = track.artists?.map((artist) => artist.name).filter(Boolean) ?? [];

  return {
    isPlaying,
    title: track.name,
    artist: artists.join(", "),
    album: track.album?.name ?? "Unknown album",
    artworkUrl,
    trackUrl: track.external_urls?.spotify ?? "",
    playedAt,
  };
}

function toErrorCode(error: unknown): ActivityErrorCode {
  if (!(error instanceof Error)) return "internal_error";

  if (error.message === "auth_failed") return "auth_failed";
  if (error.message === "rate_limited") return "rate_limited";
  if (error.message === "provider_unavailable") return "provider_unavailable";
  if (error.message === "invalid_response") return "invalid_response";

  return "internal_error";
}

async function getSpotifyAccessToken() {
  const { clientId, clientSecret, refreshToken } = getSpotifyEnv();
  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch(SPOTIFY_TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }).toString(),
  });

  if (!response.ok) {
    if (response.status === 400 || response.status === 401) {
      throw new Error("auth_failed");
    }
    if (response.status === 429) {
      throw new Error("rate_limited");
    }
    throw new Error("provider_unavailable");
  }

  const payload = (await response.json()) as {
    access_token?: string;
  };

  if (!payload.access_token) {
    throw new Error("invalid_response");
  }

  return payload.access_token;
}

async function fetchSpotifyEndpoint(accessToken: string, url: string) {
  return fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

async function fetchNowPlaying(accessToken: string): Promise<SpotifyActivity["nowPlaying"]> {
  const response = await fetchSpotifyEndpoint(accessToken, SPOTIFY_NOW_PLAYING_ENDPOINT);

  if (response.status === 204) return null;
  if (response.status === 429) throw new Error("rate_limited");
  if (!response.ok) return null;

  const payload = (await response.json()) as SpotifyNowPlayingResponse;
  if (!payload.item) return null;
  return mapTrack(payload.item, undefined, payload.is_playing);
}

async function fetchRecentData(accessToken: string): Promise<{ data: RecentData; source: "live" | "cache" }> {
  if (recentCache && Date.now() < recentCache.expiresAt) {
    return { data: recentCache.data, source: "cache" };
  }

  const response = await fetchSpotifyEndpoint(accessToken, SPOTIFY_RECENTLY_PLAYED_ENDPOINT);
  if (response.status === 429 && recentCache) {
    return { data: recentCache.data, source: "cache" };
  }
  if (!response.ok) {
    return { data: recentCache?.data ?? { recentTracks: [] }, source: recentCache ? "cache" : "live" };
  }

  const payload = (await response.json()) as SpotifyRecentTracksResponse;
  const recentTracks = (payload.items ?? [])
    .map((item) => {
      const mapped = mapTrack(item.track, item.played_at, false);
      if (!mapped?.playedAt) return null;

      return {
        title: mapped.title,
        artist: mapped.artist,
        album: mapped.album,
        artworkUrl: mapped.artworkUrl,
        trackUrl: mapped.trackUrl,
        playedAt: mapped.playedAt,
      };
    })
    .filter((track): track is SpotifyActivity["recentTracks"][number] => Boolean(track))
    .slice(0, 5);

  const data = { recentTracks };
  recentCache = {
    data,
    expiresAt: Date.now() + RECENT_DATA_TTL_MS,
  };

  return { data, source: "live" };
}

async function fetchTopData(accessToken: string): Promise<{ data: TopData; source: "live" | "cache" }> {
  if (topCache && Date.now() < topCache.expiresAt) {
    return { data: topCache.data, source: "cache" };
  }

  const [topTracksResult, topArtistsResult] = await Promise.allSettled([
    fetchSpotifyEndpoint(accessToken, SPOTIFY_TOP_TRACKS_ENDPOINT),
    fetchSpotifyEndpoint(accessToken, SPOTIFY_TOP_ARTISTS_ENDPOINT),
  ]);

  if (
    topTracksResult.status === "fulfilled" &&
    topTracksResult.value.status === 429 &&
    topCache
  ) {
    return { data: topCache.data, source: "cache" };
  }

  if (
    topArtistsResult.status === "fulfilled" &&
    topArtistsResult.value.status === 429 &&
    topCache
  ) {
    return { data: topCache.data, source: "cache" };
  }

  let topTracks: SpotifyActivity["topTracks"] = [];
  let topArtists: SpotifyActivity["topArtists"] = [];
  let hasFreshData = false;

  if (topTracksResult.status === "fulfilled" && topTracksResult.value.status === 200) {
    const payload = (await topTracksResult.value.json()) as SpotifyTopTracksResponse;
    topTracks = (payload.items ?? [])
      .map((track) => {
        const mapped = mapTrack(track);
        if (!mapped) return null;

        return {
          title: mapped.title,
          artist: mapped.artist,
          album: mapped.album,
          artworkUrl: mapped.artworkUrl,
          trackUrl: mapped.trackUrl,
        };
      })
      .filter((track): track is SpotifyActivity["topTracks"][number] => Boolean(track))
      .slice(0, 5);
    hasFreshData = true;
  }

  if (topArtistsResult.status === "fulfilled" && topArtistsResult.value.status === 200) {
    const payload = (await topArtistsResult.value.json()) as SpotifyTopArtistsResponse;
    topArtists = (payload.items ?? [])
      .map((artist) => ({
        name: artist.name,
        artworkUrl: artist.images?.[0]?.url ?? "",
        artistUrl: artist.external_urls?.spotify ?? "",
      }))
      .slice(0, 5);
    hasFreshData = true;
  }

  if (!hasFreshData && topCache) {
    return { data: topCache.data, source: "cache" };
  }

  const data = { topTracks, topArtists };
  topCache = {
    data,
    expiresAt: Date.now() + TOP_DATA_TTL_MS,
  };

  return { data, source: "live" };
}

function deriveRecentArtists(
  recentTracks: SpotifyActivity["recentTracks"],
  topArtists: SpotifyActivity["topArtists"]
): SpotifyActivity["recentArtists"] {
  const artistMetaByName = new Map(topArtists.map((artist) => [artist.name.toLowerCase(), artist]));
  const frequency = new Map<string, { count: number; artworkUrl: string; artistUrl: string }>();

  recentTracks.forEach((track) => {
    track.artist
      .split(",")
      .map((name) => name.trim())
      .filter(Boolean)
      .forEach((artistName) => {
        const key = artistName.toLowerCase();
        const current = frequency.get(key);
        const topArtistMeta = artistMetaByName.get(key);

        if (!current) {
          frequency.set(key, {
            count: 1,
            artworkUrl: topArtistMeta?.artworkUrl || track.artworkUrl,
            artistUrl: topArtistMeta?.artistUrl || "",
          });
          return;
        }

        frequency.set(key, {
          count: current.count + 1,
          artworkUrl: current.artworkUrl || topArtistMeta?.artworkUrl || track.artworkUrl,
          artistUrl: current.artistUrl || topArtistMeta?.artistUrl || "",
        });
      });
  });

  return Array.from(frequency.entries())
    .map(([name, meta]) => ({
      name,
      artworkUrl: meta.artworkUrl,
      artistUrl: meta.artistUrl,
      playCount: meta.count,
    }))
    .sort((a, b) => b.playCount - a.playCount)
    .slice(0, 5)
    .map((artist) => ({
      ...artist,
      name: artist.name
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
    }));
}

export async function getSpotifyActivity(
  detailScope: SpotifyDetailScope = "none"
): Promise<ActivityResponse<SpotifyActivity>> {
  try {
    const accessToken = await getSpotifyAccessToken();
    const nowPlaying = await fetchNowPlaying(accessToken).catch(() => null);

    const data = emptySpotifyData(nowPlaying);
    let source: ActivityResponse<SpotifyActivity>["source"] = "live";

    if (detailScope === "recent" || detailScope === "all") {
      const recent = await fetchRecentData(accessToken);
      data.recentTracks = recent.data.recentTracks;
      if (recent.source === "cache") source = "cache";
    } else if (recentCache) {
      data.recentTracks = recentCache.data.recentTracks;
    }

    if (detailScope === "top" || detailScope === "all") {
      const top = await fetchTopData(accessToken);
      data.topTracks = top.data.topTracks;
      data.topArtists = top.data.topArtists;
      if (top.source === "cache") source = "cache";
    } else if (topCache) {
      data.topTracks = topCache.data.topTracks;
      data.topArtists = topCache.data.topArtists;
    }

    data.recentArtists = deriveRecentArtists(data.recentTracks, data.topArtists);

    return {
      ok: true,
      source,
      updatedAt: new Date().toISOString(),
      data,
    };
  } catch (error) {
    if (error instanceof ActivityConfigError) {
      return buildErrorResponse(
        "missing_config",
        `Spotify activity is not configured: ${error.key}`
      );
    }

    const code = toErrorCode(error);
    if (code === "auth_failed") {
      return buildErrorResponse(code, "Spotify authentication failed.");
    }
    if (code === "rate_limited") {
      return buildErrorResponse(code, "Spotify API rate limit reached.");
    }
    if (code === "provider_unavailable") {
      return buildErrorResponse(code, "Spotify API is currently unavailable.");
    }
    if (code === "invalid_response") {
      return buildErrorResponse(code, "Spotify returned an invalid response.");
    }

    return buildErrorResponse("internal_error", "Unexpected Spotify activity error.");
  }
}
