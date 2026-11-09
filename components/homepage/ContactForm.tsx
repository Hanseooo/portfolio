"use client";

import { startTransition, useActionState, useEffect, useId, useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, CircleAlert } from "lucide-react";
import { sendContactMessage, type ContactState, type ContactValues } from "@/app/actions/contact";
import {
  CONTACT_REASONS,
  MESSAGE_MAX,
  findFieldErrors,
  type ContactFieldErrors,
} from "@/lib/contact/validate";
import { EMAIL_ADDRESS } from "@/components/utils/externalLinks";
import TurnstileWidget from "@/components/homepage/TurnstileWidget";
import { RegistrationMark } from "@/components/geometry";
import { CopyEmailButton } from "./ContactEmailRow";

const EMPTY_VALUES: ContactValues = { reason: "", name: "", email: "", message: "" };
const FIELD_ORDER = ["name", "email", "message"] as const;
/** From this many characters the message count turns signal. */
const MESSAGE_WARN = 1800;

const labelClass =
  "block font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[color:var(--cs-text-secondary)]";
const fieldLabelClass = `${labelClass} transition-colors group-focus-within:text-[color:var(--cs-signal-text)]`;
// Fields are drawn lines: no box, a 1px underline that turns field-error when invalid.
const inputClass =
  "peer mt-2 block w-full rounded-none border-0 border-b border-[color:var(--cs-structural-line-strong)] bg-transparent px-0 py-2 font-sans text-base text-[color:var(--cs-text-primary)] aria-invalid:border-[color:var(--cs-field-error)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--cs-focus-ring)]";

/** Focus draws the line: a 2px signal underline scales in from the left. */
function DrawnUnderline() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-[color:var(--cs-signal)] transition-transform duration-[180ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] peer-focus:scale-x-100 peer-aria-invalid:bg-[color:var(--cs-field-error)] motion-reduce:transition-none"
    />
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 flex items-center gap-2 text-sm text-[color:var(--cs-field-error)]">
      <CircleAlert size={14} aria-hidden="true" className="shrink-0" />
      {message}
    </p>
  );
}

/**
 * "Write another" remounts the sheet: empty values, a fresh `started_at`, and a new Turnstile
 * widget, since each token is single-use.
 */
export default function ContactForm() {
  const [round, setRound] = useState(0);
  return <ContactSheetForm key={round} focusName={round > 0} onWriteAnother={() => setRound((r) => r + 1)} />;
}

function ContactSheetForm({ focusName, onWriteAnother }: { focusName: boolean; onWriteAnother: () => void }) {
  const uid = useId();
  const ids = {
    name: `${uid}-name`,
    email: `${uid}-email`,
    message: `${uid}-message`,
  };
  const countId = `${uid}-message-count`;
  const errorId = (field: keyof typeof ids) => `${ids[field]}-error`;

  const [values, setValues] = useState<ContactValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [turnstileFailed, setTurnstileFailed] = useState(false);
  const startedAt = useRef(0);
  const sentRef = useRef<HTMLParagraphElement>(null);
  const failedAddressRef = useRef<HTMLSpanElement>(null);

  // Render time for the minimum fill-time check. Recorded after mount so server HTML matches,
  // and added to the payload at submit.
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  useEffect(() => {
    if (focusName) document.getElementById(ids.name)?.focus();
  }, [focusName, ids.name]);

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

  const sent = state.status === "sent";
  const describedBy = (field: keyof typeof ids) => (errors[field] ? errorId(field) : undefined);

  return (
    <form
      method="post"
      onSubmit={handleSubmit}
      noValidate
      aria-busy={pending}
      aria-label="Contact form"
      className="flex flex-col gap-8"
    >
      {/* The fields fade but keep their space, so the sheet holds its height through the swap */}
      <div className="relative">
        <div
          inert={sent}
          className={`flex flex-col gap-8 transition-opacity duration-[240ms] motion-reduce:transition-none ${sent ? "opacity-0" : ""}`}
        >
          <fieldset>
            <legend className={labelClass}>Reason (optional)</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {CONTACT_REASONS.map((reason) => (
                <label
                  key={reason}
                  className="inline-flex min-h-11 cursor-pointer items-center border border-[color:var(--cs-structural-line-strong)] px-4 font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[color:var(--cs-text-primary)] transition-colors hover:border-[color:var(--cs-text-primary)] has-checked:border-[color:var(--cs-text-primary)] has-checked:bg-[color:var(--cs-text-primary)] has-checked:text-[color:var(--cs-foundation)] has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-[color:var(--cs-focus-ring)]"
                >
                  <input
                    className="sr-only"
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

          <div className="grid gap-8 md:grid-cols-2 md:gap-6">
            <div className="group">
              <label htmlFor={ids.name} className={fieldLabelClass}>Name</label>
              <div className="relative">
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
                <DrawnUnderline />
              </div>
              <FieldError id={errorId("name")} message={errors.name} />
            </div>

            <div className="group">
              <label htmlFor={ids.email} className={fieldLabelClass}>Email</label>
              <div className="relative">
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
                <DrawnUnderline />
              </div>
              <FieldError id={errorId("email")} message={errors.email} />
            </div>
          </div>

          <div className="group">
            <label htmlFor={ids.message} className={fieldLabelClass}>Message</label>
            <div className="relative">
              <textarea
                id={ids.message}
                name="message"
                rows={5}
                required
                maxLength={MESSAGE_MAX}
                value={values.message}
                onChange={(e) => update("message", e.target.value)}
                aria-invalid={errors.message ? true : undefined}
                aria-describedby={[describedBy("message"), countId].filter(Boolean).join(" ")}
                className={`${inputClass} resize-y`}
              />
              <DrawnUnderline />
            </div>
            <FieldError id={errorId("message")} message={errors.message} />
            {/* Dimension line with the live count: read on focus via aria-describedby, not announced */}
            <div className="relative mt-3 flex h-4 items-center justify-center text-[color:var(--cs-structural-line-strong)]">
              <svg
                aria-hidden="true"
                viewBox="0 0 100 12"
                preserveAspectRatio="none"
                className="absolute inset-x-0 top-1/2 h-3 w-full -translate-y-1/2"
              >
                <path d="M0 0 V12 M100 0 V12 M0 6 H100" fill="none" stroke="currentColor" strokeWidth={1} vectorEffect="non-scaling-stroke" />
              </svg>
              <span
                id={countId}
                className={`relative bg-[color:var(--cs-foundation)] px-2 font-[family-name:var(--font-mono)] text-xs tabular-nums ${
                  values.message.length >= MESSAGE_WARN
                    ? "text-[color:var(--cs-signal-text)]"
                    : "text-[color:var(--cs-text-secondary)]"
                }`}
              >
                <span aria-hidden="true">{values.message.length} / {MESSAGE_MAX}</span>
                <span className="sr-only">{values.message.length} of {MESSAGE_MAX} characters</span>
              </span>
            </div>
          </div>

          {/* Honeypot: hidden from people and assistive tech, bots fill it */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label htmlFor={`${uid}-company-site`}>Company site</label>
            <input id={`${uid}-company-site`} name="company_site" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
          </div>
        </div>

        {sent && (
          <div className="absolute inset-x-0 top-0 flex flex-col items-start gap-6">
            {/* Contact status-line grammar: signal leader, live dot, wraps only at the separator */}
            <p
              ref={sentRef}
              tabIndex={-1}
              aria-live="polite"
              className="flex items-start gap-3 font-[family-name:var(--font-mono)] text-xs uppercase leading-relaxed tracking-widest text-[color:var(--cs-text-primary)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--cs-focus-ring)]"
            >
              <span aria-hidden="true" className="mt-[0.6rem] h-px w-8 shrink-0 bg-[color:var(--cs-signal)] md:w-12" />
              <span aria-hidden="true" className="mt-[0.4rem] size-1.5 shrink-0 rounded-full bg-[color:var(--cs-status-online)]" />
              <span className="min-w-0">
                <span className="whitespace-nowrap">Sent ·</span>{" "}
                <span className="whitespace-nowrap">I&apos;ll reply to </span>
                {/* An address too long for the line breaks inside itself, never before it */}
                <span className="[overflow-wrap:anywhere]">{values.email.trim()}</span>
              </span>
            </p>
            <button
              type="button"
              onClick={onWriteAnother}
              className="inline-flex min-h-11 items-center font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[color:var(--cs-text-secondary)] underline decoration-[color:var(--cs-structural-line-strong)] underline-offset-4 transition-colors hover:text-[color:var(--cs-text-primary)] hover:decoration-[color:var(--cs-text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--cs-focus-ring)]"
            >
              Write another
            </button>
          </div>
        )}
      </div>

      {!sent && (state.status === "error" || turnstileFailed) &&
        (state.status === "error" && state.reason === "challenge" ? (
          <p role="alert" className="flex items-start gap-2 text-sm text-[color:var(--cs-text-primary)]">
            <CircleAlert size={14} aria-hidden="true" className="mt-0.5 shrink-0" />
            <span>Couldn&apos;t confirm you&apos;re human. Try again.</span>
          </p>
        ) : (
          <div>
            <p role="alert" className="flex items-start gap-2 text-sm text-[color:var(--cs-text-primary)]">
              <CircleAlert size={14} aria-hidden="true" className="mt-0.5 shrink-0" />
              <span>Couldn&apos;t send. Your message is still here. Try again, or email me directly.</span>
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
              <span ref={failedAddressRef} className="break-all font-[family-name:var(--font-mono)] text-sm text-[color:var(--cs-text-primary)]">
                {EMAIL_ADDRESS}
              </span>
              <CopyEmailButton email={EMAIL_ADDRESS} addressRef={failedAddressRef} />
            </div>
          </div>
        ))}

      <TurnstileWidget resetKey={state} onLoadError={() => setTurnstileFailed(true)} />

      <div className="flex items-center">
        <button
          type="submit"
          disabled={pending}
          inert={sent}
          className="group inline-flex h-12 shrink-0 items-center gap-2 self-start border-2 border-[color:var(--cs-text-primary)] bg-[color:var(--cs-text-primary)] px-5 font-[family-name:var(--font-mono)] text-xs font-bold uppercase tracking-widest text-[color:var(--cs-foundation)] transition-transform enabled:hover:-translate-x-px enabled:hover:-translate-y-px disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--cs-focus-ring)]"
        >
          {pending ? "Sending" : "Send"}
          <ArrowUpRight size={14} aria-hidden="true" className="transition-transform group-enabled:group-hover:translate-x-px group-enabled:group-hover:-translate-y-px" />
        </button>
        {/* Routing line: from Send's right edge across the sheet's right edge (sheet padding + 2rem).
            Mounted only once sent, so DrawController draws it as a new mark. */}
        {sent && (
          <span
            aria-hidden="true"
            data-draw="extend-x"
            className="-mr-14 h-px flex-1 origin-left bg-[color:var(--cs-signal)] md:-mr-16 lg:-mr-18"
          />
        )}
      </div>

      {sent && (
        <RegistrationMark className="absolute -top-8 -right-8 hidden size-16 text-[color:var(--cs-structural-line-strong)] md:block" />
      )}
    </form>
  );
}
