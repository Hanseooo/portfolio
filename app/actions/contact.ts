"use server";

import { getResendEnv, getTurnstileSecret } from "../../lib/contact/env";
import {
  validateContactSubmission,
  type ContactData,
  type ContactFieldErrors,
  type ContactFields,
} from "../../lib/contact/validate";

export type ContactValues = ContactData;

export type ContactState =
  | { status: "idle" }
  | { status: "sent" }
  | { status: "invalid"; fieldErrors: ContactFieldErrors; values: ContactValues }
  | { status: "error"; reason: "send" | "challenge"; values: ContactValues };

const RESEND_URL = "https://api.resend.com/emails";
const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

async function passesChallenge(token: string, secret: string) {
  const response = await fetch(SITEVERIFY_URL, {
    method: "POST",
    body: new URLSearchParams({ secret, response: token }),
    cache: "no-store",
  });
  if (!response.ok) return false;
  const outcome = (await response.json()) as { success?: boolean };
  return outcome.success === true;
}

function readFields(formData: FormData): ContactFields {
  const read = (key: keyof ContactFields) => {
    const value = formData.get(key);
    return typeof value === "string" ? value : "";
  };
  return {
    reason: read("reason"),
    name: read("name"),
    email: read("email"),
    message: read("message"),
    company_site: read("company_site"),
    started_at: read("started_at"),
  };
}

function buildEmail(data: ContactData, from: string, to: string) {
  const name = data.name.replace(/[\r\n]+/g, " ");
  return {
    from,
    to,
    reply_to: data.email,
    subject: `[Portfolio] ${data.reason || "Message"} from ${name}`,
    text: [
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Reason: ${data.reason || "None given"}`,
      "",
      data.message,
    ].join("\n"),
  };
}

export async function sendContactMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const fields = readFields(formData);
  const values: ContactValues = {
    reason: fields.reason,
    name: fields.name,
    email: fields.email,
    message: fields.message,
  };

  const result = validateContactSubmission(fields, Date.now());
  if (result.kind === "bot") return { status: "sent" };
  if (result.kind === "invalid") return { status: "invalid", fieldErrors: result.fieldErrors, values };

  try {
    const token = formData.get("cf-turnstile-response");
    const human = await passesChallenge(typeof token === "string" ? token : "", getTurnstileSecret());
    if (!human) {
      console.error("[contact] Turnstile check failed");
      return { status: "error", reason: "challenge", values };
    }

    const env = getResendEnv();
    const response = await fetch(RESEND_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(buildEmail(result.data, env.from, env.to)),
      cache: "no-store",
    });
    if (!response.ok) {
      console.error(`[contact] Resend responded ${response.status}`);
      return { status: "error", reason: "send", values };
    }
  } catch (error) {
    // Name only: never log the key, the payload, or the message body.
    console.error(`[contact] Send failed: ${error instanceof Error ? error.name : "unknown error"}`);
    return { status: "error", reason: "send", values };
  }

  return { status: "sent" };
}
