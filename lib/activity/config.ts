const DEFAULT_GITHUB_REVALIDATE_SECONDS = 300;
const DEFAULT_SPOTIFY_REVALIDATE_SECONDS = 20;
const DEFAULT_DISCORD_REVALIDATE_SECONDS = 20;

function readNumberEnv(
  value: string | undefined,
  fallback: number,
  min: number,
  max: number
) {
  if (!value) return fallback;

  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) return fallback;

  return Math.min(max, Math.max(min, parsed));
}

export const activityConfig = {
  githubRevalidateSeconds: readNumberEnv(
    process.env.ACTIVITY_GITHUB_REVALIDATE_SECONDS,
    DEFAULT_GITHUB_REVALIDATE_SECONDS,
    60,
    3600
  ),
  spotifyRevalidateSeconds: readNumberEnv(
    process.env.ACTIVITY_SPOTIFY_REVALIDATE_SECONDS,
    DEFAULT_SPOTIFY_REVALIDATE_SECONDS,
    10,
    120
  ),
  discordRevalidateSeconds: readNumberEnv(
    process.env.ACTIVITY_DISCORD_REVALIDATE_SECONDS,
    DEFAULT_DISCORD_REVALIDATE_SECONDS,
    10,
    120
  ),
};
