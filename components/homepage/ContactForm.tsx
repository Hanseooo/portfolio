"use client";

import { startTransition, useActionState, useEffect, useId, useRef, useState, type FormEvent } from "react";
import { CircleAlert } from "lucide-react";
import { sendContactMessage, type ContactState, type ContactValues } from "@/app/actions/contact";
import {
  CONTACT_REASONS,
  MESSAGE_MAX,
  findFieldErrors,
  type ContactFieldErrors,
} from "@/lib/contact/validate";
import { EMAIL_ADDRESS } from "@/components/utils/externalLinks";
import TurnstileWidget from "@/components/homepage/TurnstileWidget";

const EMPTY_VALUES: ContactValues = { reason: "", name: "", email: "", message: "" };
const FIELD_ORDER = ["name", "email", "message"] as const;

const labelClass =
  "block font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[color:var(--cs-text-secondary)]";
const inputClass =
  "mt-2 block w-full border border-[color:var(--cs-structural-line-strong)] bg-[color:var(--cs-foundation)] px-3 py-2 text-base text-[color:var(--cs-text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--cs-focus-ring)]";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 flex items-center gap-2 text-sm text-[color:var(--cs-text-primary)]">
      <CircleAlert size={14} aria-hidden="true" className="shrink-0" />
      {message}
    </p>
  );
}

export default function ContactForm() {
  const uid = useId();
  const ids = {
    name: `${uid}-name`,
    email: `${uid}-email`,
    message: `${uid}-message`,
  };
  const errorId = (field: keyof typeof ids) => `${ids[field]}-error`;

  const [values, setValues] = useState<ContactValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [turnstileFailed, setTurnstileFailed] = useState(false);
  const startedAt = useRef(0);
  const sentRef = useRef<HTMLParagraphElement>(null);

  // Render time for the minimum fill-time check. Recorded after mount so server HTML matches,
  // and added to the payload at submit.
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const focusFirstInvalid = (fieldErrors: ContactFieldErrors) => {
    const first = FIELD_ORDER.find((field) => fieldErrors[field]);
    if (first) document.getElementById(ids[first])?.focus();
  };

  const [state, formAction, pending] = useActionState(
    async (prev: ContactState, formData: FormData) => {
      formData.set("started_at", String(startedAt.current));
      const next = await sendContactMessage(prev, formData);
      if (next.status === "invalid") {
        setErrors(next.fieldErrors);
        focusFirstInvalid(next.fieldErrors);
      }
      return next;
    },
    { status: "idle" },
  );

  useEffect(() => {
    if (state.status === "sent") sentRef.current?.focus();
  }, [state.status]);

  const update = (field: keyof ContactValues, value: string) => {
    const next = { ...values, [field]: value };
    setValues(next);
    if (errors[field]) setErrors({ ...errors, [field]: findFieldErrors(next)[field] });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    // Dispatch manually: a form `action` prop makes React reset the form afterwards,
    // which unchecks the controlled reason radio in the Failed state.
    event.preventDefault();
    const fieldErrors = findFieldErrors(values);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) {
      focusFirstInvalid(fieldErrors);
      return;
    }
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  };

  if (state.status === "sent") {
    return (
      <p
        ref={sentRef}
        tabIndex={-1}
        aria-live="polite"
        className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[color:var(--cs-text-primary)]"
      >
        Sent · I&apos;ll reply to {values.email.trim()}
      </p>
    );
  }

  const describedBy = (field: keyof typeof ids) => (errors[field] ? errorId(field) : undefined);

  return (
    <form
      method="post"
      onSubmit={handleSubmit}
      noValidate
      aria-busy={pending}
      aria-label="Contact form"
      className="flex flex-col gap-6 border border-[color:var(--cs-structural-line-strong)] bg-[color:var(--cs-foundation)] p-6 md:p-8"
    >
      <fieldset>
        <legend className={labelClass}>Reason (optional)</legend>
        <div className="mt-2 flex flex-wrap gap-4">
          {CONTACT_REASONS.map((reason) => (
            <label key={reason} className="flex min-h-11 items-center gap-2 text-sm">
              <input
                type="radio"
                name="reason"
                value={reason}
                checked={values.reason === reason}
                onChange={() => update("reason", reason)}
              />
              {reason}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor={ids.name} className={labelClass}>Name</label>
        <input
          id={ids.name}
          name="name"
          type="text"
          autoComplete="name"
          required
          maxLength={100}
          value={values.name}
          onChange={(e) => update("name", e.target.value)}
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={describedBy("name")}
          className={inputClass}
        />
        <FieldError id={errorId("name")} message={errors.name} />
      </div>

      <div>
        <label htmlFor={ids.email} className={labelClass}>Email</label>
        <input
          id={ids.email}
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          value={values.email}
          onChange={(e) => update("email", e.target.value)}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={describedBy("email")}
          className={inputClass}
        />
        <FieldError id={errorId("email")} message={errors.email} />
      </div>

      <div>
        <label htmlFor={ids.message} className={labelClass}>Message</label>
        <textarea
          id={ids.message}
          name="message"
          rows={5}
          required
          maxLength={MESSAGE_MAX}
          value={values.message}
          onChange={(e) => update("message", e.target.value)}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={describedBy("message")}
          className={inputClass}
        />
        <FieldError id={errorId("message")} message={errors.message} />
      </div>

      {/* Honeypot: hidden from people and assistive tech, bots fill it */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${uid}-company-site`}>Company site</label>
        <input id={`${uid}-company-site`} name="company_site" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      {(state.status === "error" || turnstileFailed) && (
        <p role="alert" className="flex items-start gap-2 text-sm text-[color:var(--cs-text-primary)]">
          <CircleAlert size={14} aria-hidden="true" className="mt-0.5 shrink-0" />
          {state.status === "error" && state.reason === "challenge" ? (
            <span>Couldn&apos;t confirm you&apos;re human. Try again.</span>
          ) : (
          <span>
            Couldn&apos;t send. Your message is still here. Try again, or{" "}
            <a href={`mailto:${EMAIL_ADDRESS}`} className="underline">email me directly</a>.
          </span>
          )}
        </p>
      )}

      <TurnstileWidget resetKey={state} onLoadError={() => setTurnstileFailed(true)} />

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-12 items-center self-start border-2 border-[color:var(--cs-text-primary)] bg-[color:var(--cs-text-primary)] px-6 font-[family-name:var(--font-mono)] text-xs font-bold uppercase tracking-widest text-[color:var(--cs-foundation)] disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--cs-focus-ring)]"
      >
        {pending ? "Sending" : "Send"}
      </button>
    </form>
  );
}
