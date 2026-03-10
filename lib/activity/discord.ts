import { ActivityConfigError, getDiscordEnv } from "@/lib/activity/env";
import type {
  ActivityErrorCode,
  ActivityResponse,
  DiscordActivity,
} from "@/lib/activity/types";

type LanyardResponse = {
  success: boolean;
  data?: {
    discord_user?: {
      id: string;
      username: string;
      display_name?: string | null;
      global_name?: string | null;
      avatar?: string | null;
    };
    discord_status?: "online" | "idle" | "dnd" | "offline";
    active_on_discord_desktop?: boolean;
    active_on_discord_mobile?: boolean;
    active_on_discord_web?: boolean;
    listening_to_spotify?: boolean;
    spotify?: {
      song?: string;
      artist?: string;
      album?: string;
      track_id?: string;
      album_art_url?: string;
      timestamps?: {
        start?: number;
      };
    } | null;
    activities?: Array<{
      type?: number;
      application_id?: string;
      name?: string;
      details?: string;
      state?: string;
      platform?: string;
      assets?: {
        large_image?: string;
      };
      timestamps?: {
        start?: number;
      };
    }>;
  };
  error?: {
    message?: string;
  };
};

function buildErrorResponse(
  code: ActivityErrorCode,
  message: string,
  source: ActivityResponse<DiscordActivity>["source"] = "fallback"
): ActivityResponse<DiscordActivity> {
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

function getAvatarUrl(id: string, avatarHash: string | null | undefined) {
  if (!avatarHash) return null;
  const extension = avatarHash.startsWith("a_") ? "gif" : "png";
  return `https://cdn.discordapp.com/avatars/${id}/${avatarHash}.${extension}?size=256`;
}

function getDiscordActivityImageUrl(
  applicationId: string | undefined,
  assetId: string | undefined
) {
  if (!assetId) return null;

  if (assetId.startsWith("mp:")) {
    return `https://media.discordapp.net/${assetId.slice(3)}`;
  }

  if (!applicationId) return null;
  return `https://cdn.discordapp.com/app-assets/${applicationId}/${assetId}.png`;
}

function getActivityTypeLabel(type: number | undefined) {
  switch (type) {
    case 0:
      return "Playing";
    case 1:
      return "Streaming";
    case 2:
      return "Listening";
    case 3:
      return "Watching";
    case 4:
      return "Custom";
    case 5:
      return "Competing";
    default:
      return "Activity";
  }
}

export async function getDiscordActivity(): Promise<ActivityResponse<DiscordActivity>> {
  try {
    const { userId } = getDiscordEnv();
    const response = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);

    if (!response.ok) {
      if (response.status === 429) {
        return buildErrorResponse("rate_limited", "Lanyard API rate limit reached.");
      }

      return buildErrorResponse(
        "provider_unavailable",
        "Lanyard API is currently unavailable."
      );
    }

    const payload = (await response.json()) as LanyardResponse;
    if (!payload.success || !payload.data?.discord_user) {
      return buildErrorResponse(
        "invalid_response",
        payload.error?.message ?? "Lanyard returned an invalid response."
      );
    }

    const user = payload.data.discord_user;
    const spotify = payload.data.spotify;
    const activities = payload.data.activities ?? [];
    const gamingActivity = activities.find(
      (activity) => activity.type === 0 && activity.name
    );
    const otherActivities = activities
      .filter((activity) => {
        if (!activity.name || activity.type === 0) return false;

        const isSpotifyActivity =
          activity.type === 2 &&
          activity.name.toLowerCase() === "spotify" &&
          Boolean(payload.data?.listening_to_spotify || spotify);

        return !isSpotifyActivity;
      })
      .slice(0, 3)
      .map((activity) => ({
        type: activity.type ?? -1,
        typeLabel: getActivityTypeLabel(activity.type),
        name: activity.name ?? "Unknown activity",
        details: activity.details,
        state: activity.state,
        platform: activity.platform,
        imageUrl: getDiscordActivityImageUrl(
          activity.application_id,
          activity.assets?.large_image
        ),
        startedAt: activity.timestamps?.start,
      }));

    return {
      ok: true,
      source: "live",
      updatedAt: new Date().toISOString(),
      data: {
        user: {
          id: user.id,
          username: user.username,
          displayName: user.display_name ?? user.global_name ?? null,
          avatarUrl: getAvatarUrl(user.id, user.avatar),
        },
        status: payload.data.discord_status ?? "offline",
        activeClients: {
          desktop: Boolean(payload.data.active_on_discord_desktop),
          mobile: Boolean(payload.data.active_on_discord_mobile),
          web: Boolean(payload.data.active_on_discord_web),
        },
        listeningToSpotify: Boolean(payload.data.listening_to_spotify),
        live: {
          spotify:
            spotify?.song && spotify.artist
              ? {
                  title: spotify.song,
                  artist: spotify.artist,
                  album: spotify.album ?? "Unknown album",
                  trackUrl: spotify.track_id
                    ? `https://open.spotify.com/track/${spotify.track_id}`
                    : "",
                  albumArtUrl: spotify.album_art_url ?? null,
                  startedAt: spotify.timestamps?.start,
                }
              : null,
          gaming: gamingActivity
            ? {
                name: gamingActivity.name ?? "Unknown game",
                details: gamingActivity.details,
                state: gamingActivity.state,
                imageUrl: getDiscordActivityImageUrl(
                  gamingActivity.application_id,
                  gamingActivity.assets?.large_image
                ),
                startedAt: gamingActivity.timestamps?.start,
              }
            : null,
          otherActivities,
        },
      },
    };
  } catch (error) {
    if (error instanceof ActivityConfigError) {
      return buildErrorResponse(
        "missing_config",
        `Discord activity is not configured: ${error.key}`
      );
    }

    return buildErrorResponse("internal_error", "Unexpected Discord activity error.");
  }
}
