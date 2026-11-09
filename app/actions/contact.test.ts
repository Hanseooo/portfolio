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
    ...overrides,
  };
  const formData = new FormData();
  for (const [key, value] of Object.entries(fields)) formData.set(key, value);
  return formData;
}

const fetchStub = vi.fn<typeof fetch>();

beforeEach(() => {
  vi.stubGlobal("fetch", fetchStub);
  vi.stubEnv("RESEND_API_KEY", "re_test_key");
  vi.stubEnv("CONTACT_TO_EMAIL", "delivered@resend.dev");
  vi.stubEnv("CONTACT_FROM_EMAIL", "Portfolio <onboarding@resend.dev>");
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
    fetchStub.mockResolvedValue(new Response("{}", { status: 500 }));
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
});
