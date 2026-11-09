export const CONTACT_REASONS = ["Hiring", "Project", "Event or community", "Just saying hi"] as const;

export const NAME_MAX = 100;
export const EMAIL_MAX = 254;
export const MESSAGE_MAX = 2000;
export const MIN_FILL_MS = 3000;

export const CONTACT_ERRORS = {
  reason: "Choose one of the listed reasons.",
  name: "Add your name.",
  email: "Enter an email I can reply to.",
  message: "Write a message.",
} as const;

export type ContactFields = {
  reason: string;
  name: string;
  email: string;
  message: string;
  company_site: string;
  started_at: string;
};

export type ContactData = {
  reason: string;
  name: string;
  email: string;
  message: string;
};

export type ContactFieldErrors = Partial<Record<keyof ContactData, string>>;

export type ContactValidation =
  | { kind: "valid"; data: ContactData }
  | { kind: "invalid"; fieldErrors: ContactFieldErrors }
  | { kind: "bot" };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function lengthBetween(value: string, max: number) {
  return value.length >= 1 && value.length <= max;
}

export function validateContactSubmission(fields: ContactFields, now: number): ContactValidation {
  // A missing or non-numeric started_at fails this check too (NaN comparisons are false).
  const startedAt = Number(fields.started_at);
  const filledFastEnough = fields.started_at !== "" && now - startedAt >= MIN_FILL_MS;
  if (fields.company_site !== "" || !filledFastEnough) return { kind: "bot" };

  const data: ContactData = {
    reason: fields.reason.trim(),
    name: fields.name.trim(),
    email: fields.email.trim(),
    message: fields.message.trim(),
  };

  const fieldErrors = findFieldErrors(data);
  if (Object.keys(fieldErrors).length > 0) return { kind: "invalid", fieldErrors };
  return { kind: "valid", data };
}

/** Field rules only, no bot checks. The form reuses this for instant client feedback. */
export function findFieldErrors(values: ContactData): ContactFieldErrors {
  const data: ContactData = {
    reason: values.reason.trim(),
    name: values.name.trim(),
    email: values.email.trim(),
    message: values.message.trim(),
  };
  const fieldErrors: ContactFieldErrors = {};
  if (data.reason && !(CONTACT_REASONS as readonly string[]).includes(data.reason)) {
    fieldErrors.reason = CONTACT_ERRORS.reason;
  }
  if (!lengthBetween(data.name, NAME_MAX)) fieldErrors.name = CONTACT_ERRORS.name;
  if (data.email.length > EMAIL_MAX || !EMAIL_PATTERN.test(data.email)) {
    fieldErrors.email = CONTACT_ERRORS.email;
  }
  if (!lengthBetween(data.message, MESSAGE_MAX)) fieldErrors.message = CONTACT_ERRORS.message;
  return fieldErrors;
}
