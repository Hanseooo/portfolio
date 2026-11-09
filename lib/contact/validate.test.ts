import { describe, expect, it } from "vitest";
import { validateContactSubmission } from "./validate";

const NOW = 1_700_000_010_000;
const TEN_SECONDS_AGO = "1700000000000";

const validFields = {
  reason: "Project",
  name: "  Ada Lovelace  ",
  email: " ada@example.com ",
  message: "  Hello there.  ",
  company_site: "",
  started_at: TEN_SECONDS_AGO,
};

describe("validateContactSubmission", () => {
  it("accepts a valid submission and trims the data", () => {
    expect(validateContactSubmission(validFields, NOW)).toEqual({
      kind: "valid",
      data: {
        reason: "Project",
        name: "Ada Lovelace",
        email: "ada@example.com",
        message: "Hello there.",
      },
    });
  });

  it.each([
    ["empty name", { name: "   " }, "name", "Add your name."],
    ["bad email", { email: "ada@" }, "email", "Enter an email I can reply to."],
    ["2001-char message", { message: "a".repeat(2001) }, "message", "Write a message."],
    ["unknown reason", { reason: "Spam" }, "reason", "Choose one of the listed reasons."],
  ])("rejects %s", (_label, override, field, error) => {
    const result = validateContactSubmission({ ...validFields, ...override }, NOW);
    expect(result).toEqual({ kind: "invalid", fieldErrors: { [field]: error } });
  });

  it("flags a filled honeypot as a bot", () => {
    const result = validateContactSubmission({ ...validFields, company_site: "https://spam.example" }, NOW);
    expect(result).toEqual({ kind: "bot" });
  });

  it("flags a submit 1s after render as a bot", () => {
    const result = validateContactSubmission({ ...validFields, started_at: "1700000009000" }, NOW);
    expect(result).toEqual({ kind: "bot" });
  });
});
