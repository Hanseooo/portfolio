export class ContactConfigError extends Error {
  constructor(public key: string) {
    super(`Missing required environment variable: ${key}`);
    this.name = "ContactConfigError";
  }
}

function readRequiredEnv(key: string) {
  const value = process.env[key];
  if (!value || value.trim().length === 0) {
    throw new ContactConfigError(key);
  }
  return value;
}

export function getResendEnv() {
  return {
    apiKey: readRequiredEnv("RESEND_API_KEY"),
    to: readRequiredEnv("CONTACT_TO_EMAIL"),
    from: readRequiredEnv("CONTACT_FROM_EMAIL"),
  };
}
