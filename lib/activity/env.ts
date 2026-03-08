export class ActivityConfigError extends Error {
  constructor(public key: string) {
    super(`Missing required environment variable: ${key}`);
    this.name = "ActivityConfigError";
  }
}

function readRequiredEnv(key: string) {
  const value = process.env[key];
  if (!value || value.trim().length === 0) {
    throw new ActivityConfigError(key);
  }
  return value;
}

export function getGitHubEnv() {
  return {
    token: readRequiredEnv("GITHUB_TOKEN"),
    username: readRequiredEnv("GITHUB_USERNAME"),
  };
}

export function getSpotifyEnv() {
  return {
    clientId: readRequiredEnv("SPOTIFY_CLIENT_ID"),
    clientSecret: readRequiredEnv("SPOTIFY_CLIENT_SECRET"),
    refreshToken: readRequiredEnv("SPOTIFY_REFRESH_TOKEN"),
  };
}

export function getDiscordEnv() {
  return {
    userId: readRequiredEnv("DISCORD_USER_ID"),
  };
}
