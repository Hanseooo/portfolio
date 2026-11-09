# Contact form — design

**Date:** 2026-10-24
**Status:** APPROVED (decisions settled in a grilling session on 2026-10-24). Implemented on `feat/contact-form` (#17 to #22). The real send from the deployed preview is still owner-only (see Owner setup).
**Revised 2026-11-09:** after owner review, the section returned to its `main` layout and the form moved into a modal. The 5/7 split, the direct email row and every copy-email control are gone. Decisions 2, 5 and 6 and the Behavior and Design sections below describe the revision.
**Issue:** [#15 Add a contact form and copyable email to the Contact section](https://github.com/Hanseooo/portfolio/issues/15)
**Base commit:** `4f914d2` (merge of PR #14)

## Purpose

Scene 06 (Contact) offers four buttons today: Email (`mailto:`), LinkedIn, GitHub, Resume. Two
problems:

1. **`mailto:` fails silently** on machines with no mail app set up, which includes many work
   laptops. The visitor clicks Email and nothing happens.
2. **People who won't write a cold email have no path.** Freelance clients, event organizers and
   community contacts often won't open their own mail app to reach a stranger.

This work adds a short form that emails Hans (fixes both: a visitor with no mail app can still
write). Recruiters keep the direct path, the Email channel button. They are the DESIGN.md audience
and will mostly use it.

## Decisions

| # | Decision | Chosen | Why |
|---|---|---|---|
| 1 | Who the form serves | Non-recruiters (clients, events, community). Visible craft is a bonus | Recruiters prefer their own outbox. A form only earns its place for this audience |
| 2 | Form or copy-email | The form, opened from a "Write a message" button beside the channels. No copy-email (revised 2026-11-09: the owner preferred the section without the email row) | Covers both audiences, and the form never blocks the direct path |
| 3 | Delivery | Server Action → Resend REST API via `fetch` (no SDK) | The repo already runs secret-backed route handlers on Vercel. Full control of validation, spam checks and every UI state. `Reply-To` makes answering one click |
| 4 | Spam defense | Cloudflare Turnstile (`interaction-only`) + honeypot + minimum fill time | Turnstile is free (20 widgets, 10 hostnames each) and works on sites not hosted on Cloudflare. The honeypot and fill time cost nothing |
| 5 | Layout | The section keeps its `main` layout (full-width title, status line, channel row). The form opens in a native `<dialog>` modal (revised 2026-11-09: the 5/7 sheet layout was rejected on proportions) | The scene stays one calm close. Both paths are one click away |
| 6 | Motif | Transmittal sheet, now the modal (see Design) | Creative through the site's own line vocabulary instead of beside it |
| 7 | Reason field | Optional radios that become the email subject | Mixed audience. Hans can sort messages in Gmail at a glance |
| 8 | Reply promise | None | A promise only goes in the UI if it's always true |
| 9 | Tests | Vitest for validation and the action. One Playwright check for the real flow | Validation is a security path. It is cheap to test in isolation |

**Rejected:** a hosted form backend (Web3Forms, 250 free submissions a month; Formspree, 50).
It needs no server code, but its response shape and CAPTCHA would control the UX. EmailJS sends
from the browser through Gmail with a public key. An auto-reply to the visitor needs a verified
sending domain (Resend's `onboarding@resend.dev` only delivers to the account owner), and the
on-page success state already confirms receipt.

## Out of scope

- An auto-reply to the visitor, storing messages, a submissions dashboard, attachments
- Rate limiting with a datastore. Turnstile plus Resend's free cap (100/day, 3,000/month) is the
  backstop
- A dedicated `/contact` route. Global "Contact" keeps resolving to `/#contact`
  (`lib/destinations.ts`)

## Domain portability

Messages go **to** `CONTACT_TO_EMAIL` (Hans's Gmail). They come **from** `CONTACT_FROM_EMAIL`,
which starts as `Portfolio <onboarding@resend.dev>`, Resend's test sender. That needs no domain,
because it may email the Resend account owner, and Hans is the owner. Switching domains later
means:

- Optional: verify the new domain in Resend and change `CONTACT_FROM_EMAIL`. No code change.
- Required: add the new hostname to the Turnstile widget in the Cloudflare dashboard.

---

## Behavior

### The section and the opener

- Scene 06 is the `main` layout: the full-width `SplitText` title, the status line, then one row
  of buttons. The row leads with the primary **"Write a message"** button (ink fill, same `h-12`
  and mono type as the channels), then Email (`mailto:`), LinkedIn, GitHub, Resume.
- "Write a message" calls `showModal()` on a native `<dialog>`
  (`components/homepage/ContactDialog.tsx`) labelled by its title "Write a message".
- The form mounts on the first open and stays mounted, so a draft survives closing and reopening
  for the rest of the page session. Turnstile loads with it, on that first open.
- Closing: the visible Close button in the dialog header, Escape, or a click on the backdrop (a
  drag that starts inside the sheet doesn't close it). The browser returns focus to the opener.
- While the dialog is open, Lenis is stopped so the page behind doesn't scroll. The dialog body
  scrolls on its own (`data-lenis-prevent`) when the viewport is short.

### Form fields

| Field | Control | Rule | Error copy |
|---|---|---|---|
| Reason | `fieldset` + `legend` "Reason (optional)", 4 native radios: Hiring · Project · Event or community · Just saying hi | Optional. Server accepts only these 4 values | — |
| Name | `input type=text`, `autocomplete=name` | Required, 1 to 100 chars after trim | "Add your name." |
| Email | `input type=email`, `autocomplete=email` | Required, valid address, max 254 | "Enter an email I can reply to." |
| Message | `textarea rows=5`, `maxLength=2000` | Required, 1 to 2000 chars after trim | "Write a message." |
| `company_site` | Honeypot: off-screen, `tabIndex=-1`, `autocomplete=off`, `aria-hidden` | Must be empty | — |
| `started_at` | Hidden, form render time (ms) | Submit at least 3s later | — |
| Turnstile token | Widget, `appearance: interaction-only` | Verified server-side via `siteverify` | "Couldn't confirm you're human. Try again." |

The server re-runs every rule. Client checks are for speed only.

### Submission states

| State | What the visitor sees |
|---|---|
| Idle | Sheet with fields. Send is enabled |
| Field error | On submit, each invalid field gets `aria-invalid`, an error line under it (linked by `aria-describedby`, with an icon so the error doesn't rely on color), and focus moves to the first invalid field. Errors clear as the field becomes valid |
| Verifying | A valid submit made before Turnstile has a token (first load, or a retry right after the widget resets) waits for it. Send is disabled with the label "Verifying", a status region announces "Verifying you're human. Your message sends when that's done.", and the message sends once the token arrives |
| Sending | Send is disabled with the label "Sending", `aria-busy` is set on the form, and fields stay editable but submit is locked |
| Sent | See the success moment below |
| Failed | The sheet stays with everything still typed. An alert line above Send reads "Couldn't send. Your message is still here. Try again, or email me directly." with the address as a plain `mailto:` link under it. Send is re-enabled |
| Bot caught | Honeypot filled or submitted under 3s → the action returns `sent` without calling Resend, so bots learn nothing. A human can't hit this by accident: the 3s check only trips on near-instant submits |

### Server Action

`app/actions/contact.ts` (`"use server"`), used with React 19 `useActionState`.

1. Parse `FormData` with `validateContactSubmission(fields, now)` from `lib/contact/validate.ts`.
   It's a pure function with relative imports only, so Vitest needs no path-alias config. It
   returns `{ kind: "valid", data } | { kind: "invalid", fieldErrors } | { kind: "bot" }`.
2. `bot` → return `{ status: "sent" }`. `invalid` → return field errors and the submitted values.
3. Verify the Turnstile token: POST to
   `https://challenges.cloudflare.com/turnstile/v0/siteverify` with `TURNSTILE_SECRET_KEY`.
   Fails → `{ status: "error", reason: "challenge" }`.
4. POST to `https://api.resend.com/emails` with `RESEND_API_KEY`:
   - `from`: `CONTACT_FROM_EMAIL`, `to`: `CONTACT_TO_EMAIL`, `reply_to`: the visitor's email
   - `subject`: `[Portfolio] {Reason or "Message"} from {name}`, with CR/LF stripped from `name`
   - `text` only, no HTML: name, email, reason, message. No HTML means no markup injection
5. Any non-2xx response (including Resend's 429 at the daily cap), a network error, or a missing
   env var → `{ status: "error", reason: "send" }`. Log the status code server-side, never the
   key or the message body.

Env vars (Vercel + `.env.local`): `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`,
`TURNSTILE_SECRET_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`. Read them at request time, the same way
`lib/activity/env.ts` does. A missing var produces the Failed state, never a crashed page.

### Turnstile loading

Load `https://challenges.cloudflare.com/turnstile/v0/api.js` with `next/script`
(`strategy="lazyOnload"`) when the widget mounts, which is the dialog's first open, so a visitor who
never opens it pays nothing. Render explicitly into a container with
`appearance: "interaction-only"`, `theme` from `next-themes` `resolvedTheme`, and
`refresh-expired: "auto"`. If the script fails to load, show the Failed alert with the `mailto:`
fallback instead of a dead Send button.

---

## Design: the transmittal sheet

An architect sends a drawing set with a **transmittal**: a cover sheet listing who it's from, what
it's about, and the note. The form is that sheet, laid over the page in a modal.

**Zone.** The scene stays "expressive, quiet" (DESIGN.md §2). The modal sheet is a **reading
zone**: grid-aligned, steady sizes, at most one mark inside.

**Chaos moves used (max 3):** scale shock (the 6rem title beside 12px mono labels) and the existing
bleed of the orbit geometry in the scene, and crop marks around the modal sheet. Nothing else.

### Layout

| Width | Section | Modal |
|---|---|---|
| All | `main` layout: title across the grid, status line, a button row that wraps | Centered, `min(42rem, 100vw - 2 × gutter)` wide, at most `100dvh - 2 × gutter` tall |
| `< md` | Buttons wrap to rows | Name and Email stack. On short screens the body scrolls inside the sheet and the header with Close stays put |

- The existing orbit outlines stay behind the section.
- The backdrop is `--cs-text-primary` at 55% in light and `--cs-foundation` at 85% in dark. No
  blur.

### The sheet

- A plate on `--cs-foundation`, 1px `--cs-structural-line-strong` border, square corners, body
  padding `p-6 md:p-8 lg:p-10`. No shadow (§8: don't add new ones). It fades and rises 12px on
  open (`@starting-style`, 200ms, none under reduced motion).
- `CropMarks` just outside its corners from `md` up (`hidden md:block`). The sheet itself is not
  the scroll container (its body is), so the marks are not clipped.
- Header row: the title "Write a message" in the display face at row scale
  (`clamp(1.5rem,2.5vw,2.25rem)`), and a Close button (mono xs, `X` icon, `min-h-11`) on the
  right, over a hairline.
- The reason radios come first as a row of mono xs uppercase chips, `min-h-11`, 1px border,
  wrapping. Checked = ink fill with ivory text (secondary-button hover grammar). Native radios are
  visually hidden but stay focusable; arrow keys move between them, as browsers do natively.
- Name and Email sit side by side from `md` (6/6 inside the sheet is fine for a field pair),
  stacked below.

### Fields as drawn lines

- No boxes. Each input is borderless on a transparent background, with a 1px
  `--cs-structural-line-strong` underline and its label above in mono xs uppercase
  `--cs-text-secondary`. Inputs and textarea use Inter 16px (16px also prevents iOS zoom).
- **Focus draws the line.** A second 2px underline in `--cs-signal` scales from `scaleX(0)` to
  `scaleX(1)` from the left in 180ms with `fastGraphic` easing, and the label turns
  `--cs-signal-text`. Transform only (§10). Keyboard focus also gets the standard
  `focus-visible` outline in `--cs-focus-ring` (§12). The drawn line is a flourish, not the
  only focus signal.
- **Error** turns the underline and the error line `--cs-error`, paired with an icon and
  text (§12: color is never the only signal). Use the existing `--cs-error` in
  `app/globals.css` (`#DC2626` light, `#EF4444` dark), and document it in DESIGN.md §4. Don't
  reuse `--cs-status-dnd` directly:
  §4 reserves status tokens for real live states. In light theme the error red sits close to
  the signal red of a focused field, which is why the icon and text are required, not optional.
- **Reduced motion:** the signal underline appears at full width with no transition.

### The dimension line (the one mark inside the sheet)

Under the textarea is a dimension line (DESIGN.md §7: `M0 0 V12 M100 0 V12 M0 6 H100`,
`preserveAspectRatio="none"`) spanning the field width, with the count centered on it in mono:
`214 / 2000`. This label is a real value, which §7 rule 3 allows. It sits in normal flow, so it
can't overlap text. From 1800 characters the count turns `--cs-signal-text`. The count is linked
to the textarea with `aria-describedby` as "214 of 2000 characters", so it's read on focus, not
announced on every keystroke.

### Send

- A primary button (§9): `h-12`, solid ink, ivory text, `border-2`, mono xs bold uppercase
  "Send", `ArrowUpRight` 14. It's the only primary in the sheet.
- The Turnstile container sits directly above Send, in one block with it. With
  `interaction-only` it takes no space unless Cloudflare asks for a check. Then
  `before-interactive-callback` adds the usual gap above Send.

### The success moment

1. The fields give way to the status line, and the modal shrinks to fit it, so no empty sheet is
   left behind.
2. A **routing line** draws from Send's right edge to the sheet's right edge. That gives it an
   anchor at both ends (§7 rule 1). Use an element with `data-draw="extend-x"`:
   `DrawController`'s MutationObserver picks up the new node and runs the existing
   `draw-extend-x` keyframe (700ms, `decisiveEditorial`). No new animation code.
3. The status line appears in the Contact status-line grammar (§9): signal leader, a 6px
   `--cs-status-online` dot, then mono xs uppercase **"Sent · I'll reply to {email}"**. Line
   breaks only at `·`.
4. A `RegistrationMark` sits partly off the sheet's top-right corner (`-top-8 -right-8`,
   `hidden md:block`), the "received" stamp in the site's own vocabulary.
5. Below it is a secondary text button, "Write another", which resets the form and puts focus on
   Name. The header's Close button closes the modal.

Focus moves to the status line (`tabIndex={-1}`), which is also an `aria-live="polite"` region.
Under reduced motion, or tiers where `DrawController` isn't armed, the routing line is already
drawn and the swap is instant.

### Copy (no em dashes, §11)

Opener and modal title "Write a message" · "Close" · Labels "Reason (optional)", "Name", "Email", "Message" · Button "Send" /
"Sending" · Success "Sent · I'll reply to {email}" · "Write another" · Failure "Couldn't send. Your message is still here. Try again, or email me directly."

### Theme

Light: ivory sheet over an ink backdrop, red signal underline and leader. Dark: `#080909` sheet
over a near-black backdrop, ice signal underline (type and rules only, never a fill). The checked reason chip uses ink and
ivory tokens (`--cs-text-primary` / `--cs-foundation`), which invert correctly in dark. No
`--cs-signal` background anywhere in this work, so no `dark:` field override is needed.

---

## Verification contract

**Vitest** (new dev dependency, `pnpm add -D vitest`, script `"test": "vitest run"`):

- `lib/contact/validate.test.ts`: one valid submission → `valid` with trimmed data. One table of
  hand-written rejection cases (empty name, bad email, 2001-char message, unknown reason value)
  → `invalid` with the matching field key. Honeypot filled, and `started_at` 1s before `now` →
  `bot`.
- `app/actions/contact.test.ts`, with `fetch` stubbed (the outer boundary): a `bot` submission
  → returns `sent` and the stub received zero requests. Resend returns 500 → returns
  `{ status: "error", reason: "send" }` with the submitted values intact.
- Each test goes red first (break the rule it covers) before going green.

**Playwright check** `.playwright-cli/contact-form-check.cjs` against `pnpm dev`, using
Cloudflare's always-pass test keys (site `1x00000000000000000000AA`, secret
`1x0000000000000000000000000000000AA`) and `CONTACT_TO_EMAIL=delivered@resend.dev`:

1. Submit empty → focus lands on Name, and three errors show.
2. Fill valid values, wait 3s, submit → "Sent · I'll reply to …" is visible and focused, with a
   clean console.
3. Tab through the scene, then through the open modal: every control shows a focus outline,
   focus starts on Close, and the radios move with arrow keys.
4. Send before Turnstile has a token: Send shows "Verifying" and the message waits for it.
5. Escape closes the modal, focus returns to "Write a message", and a typed draft is still there
   on reopen.

Every scenario opens the modal first.

**Manual** (DESIGN.md §14): 360, 390, 768, 1024, 1440px with no horizontal scroll and nothing
overlapping text. Light and dark. Reduced motion on: everything visible and still. Then
`pnpm lint && pnpm build`. One real send from the deployed preview to Hans's inbox, then reply
to it to confirm `Reply-To`.

## Owner setup (human-only)

1. Create a Resend account with `amoguishans@gmail.com`. Create an API key with sending access.
2. In Cloudflare, create a Turnstile widget in Managed mode with hostnames `hanseo.tech` and
   `www.hanseo.tech`, plus the Vercel preview hostname if previews should send.
3. Add the five env vars in Vercel (Production + Preview) and in `.env.local`.

## Doc drift to fix in the same PR

- `AGENTS.md` says "No backend — static site". The repo has `app/api/activity/*` route
  handlers, and this adds a Server Action. Also add `pnpm test` under Commands and replace
  "Unit tests: none configured". (`AGENTS.md` was last reviewed 2026-08-05, more than 90 days
  ago.)
- `DESIGN.md` §2 Contact row and §9 Status line: add the modal sheet. §4: add `--cs-error`.

## Delivery

One branch, one PR: `feat/contact-form`. Build order inside it: validation (TDD) → action (TDD)
→ sheet layout and states → Turnstile → success moment → checks → docs.
