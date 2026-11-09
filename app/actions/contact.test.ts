import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { sendContactMessage } from "./contact";

function submission(overrides: Record<string, string> = {}) {
  const fields: Record<string, string> = {
    reason: "Hiring",
    name: "Ada Lovelace",
    email: "ada@example.com",
    message: "Hello there.",
    company_site: "",
    started_at: String(Date.now() - 10_000),
    "cf-turnstile-response": "turnstile-token",
    ...overrides,
  };
  const formData = new FormData();
  for (const [key, value] of Object.entries(fields)) formData.set(key, value);
  return formData;
}

const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const RESEND_URL = "https://api.resend.com/emails";

const fetchStub = vi.fn<typeof fetch>();

function respondWith(siteverify: { success: boolean }, resend: Response) {
  fetchStub.mockImplementation(async (input) =>
    String(input) === SITEVERIFY_URL ? Response.json(siteverify) : resend,
  );
}

const callsTo = (url: string) => fetchStub.mock.calls.filter(([input]) => String(input) === url);

beforeEach(() => {
  vi.stubGlobal("fetch", fetchStub);
  vi.stubEnv("RESEND_API_KEY", "re_test_key");
  vi.stubEnv("CONTACT_TO_EMAIL", "delivered@resend.dev");
  vi.stubEnv("CONTACT_FROM_EMAIL", "Portfolio <onboarding@resend.dev>");
  vi.stubEnv("TURNSTILE_SECRET_KEY", "turnstile_test_secret");
});

afterEach(() => {
  fetchStub.mockReset();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("sendContactMessage", () => {
  it("answers a bot with sent and never calls Resend", async () => {
    const result = await sendContactMessage({ status: "idle" }, submission({ company_site: "spam" }));

    expect(result).toEqual({ status: "sent" });
    expect(fetchStub.mock.calls).toEqual([]);
  });

  it("keeps the submitted values when Resend returns 500", async () => {
    respondWith({ success: true }, new Response("{}", { status: 500 }));
    vi.spyOn(console, "error").mockImplementation(() => {});

    const result = await sendContactMessage({ status: "idle" }, submission());

    expect(result).toEqual({
      status: "error",
      reason: "send",
      values: {
        reason: "Hiring",
        name: "Ada Lovelace",
        email: "ada@example.com",
        message: "Hello there.",
      },
    });
  });

  it("returns the challenge error and never calls Resend when siteverify fails", async () => {
    respondWith({ success: false }, new Response("{}", { status: 200 }));
    vi.spyOn(console, "error").mockImplementation(() => {});

    const result = await sendContactMessage({ status: "idle" }, submission());

    expect(result).toEqual({
      status: "error",
      reason: "challenge",
      values: {
        reason: "Hiring",
        name: "Ada Lovelace",
        email: "ada@example.com",
        message: "Hello there.",
      },
    });
    expect(callsTo(SITEVERIFY_URL)).toHaveLength(1);
    expect(callsTo(RESEND_URL)).toEqual([]);
  });
});
