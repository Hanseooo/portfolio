# Contact form — design

**Date:** 2026-10-24
**Status:** APPROVED (decisions settled in a grilling session on 2026-10-24). Not implemented.
**Issue:** [#15 Add a contact form and copyable email to the Contact section](https://github.com/Hanseooo/portfolio/issues/15)
**Base commit:** `4f914d2` (merge of PR #14)

## Purpose

Scene 06 (Contact) offers four buttons today: Email (`mailto:`), LinkedIn, GitHub, Resume. Two
problems:

1. **`mailto:` fails silently** on machines with no mail app set up, which includes many work
   laptops. The visitor clicks Email and nothing happens.
2. **People who won't write a cold email have no path.** Freelance clients, event organizers and
   community contacts often won't open their own mail app to reach a stranger.

This work adds a visible email address with a copy button (fixes 1) and a short form that emails
Hans (fixes 2). Recruiters keep the direct path. They are the DESIGN.md audience and will mostly
use it.

## Decisions

| # | Decision | Chosen | Why |
|---|---|---|---|
| 1 | Who the form serves | Non-recruiters (clients, events, community). Visible craft is a bonus | Recruiters prefer their own outbox. A form only earns its place for this audience |
| 2 | Form or copy-email | Both. The direct email row is primary, the form sits beside it | Covers both audiences, and the form never blocks the direct path |
| 3 | Delivery | Server Action → Resend REST API via `fetch` (no SDK) | The repo already runs secret-backed route handlers on Vercel. Full control of validation, spam checks and every UI state. `Reply-To` makes answering one click |
| 4 | Spam defense | Cloudflare Turnstile (`interaction-only`) + honeypot + minimum fill time | Turnstile is free (20 widgets, 10 hostnames each) and works on sites not hosted on Cloudflare. The honeypot and fill time cost nothing |
| 5 | Layout | 5/7 split from `lg`. Stacked below `lg`, direct email first | DESIGN.md §6 asymmetric split. Both paths visible without a click |
| 6 | Motif | Transmittal sheet (see Design) | Creative through the site's own line vocabulary instead of beside it |
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

### Direct email row (left column)

- The address `amoguishans@gmail.com` (`EMAIL_ADDRESS` in `components/utils/externalLinks.ts`)
  is shown as text in mono. The address itself is the `mailto:` link.
- Next to it is a **Copy** button (secondary button grammar, `h-12`). On click it calls
  `navigator.clipboard.writeText`. The label changes to "Copied" with a check icon for 2s, and a
  polite `aria-live` region announces "Email address copied". If the clipboard API is missing or
  rejects, it selects the address text so the visitor can copy it by hand, and the label reads
  "Press Ctrl+C" (or "⌘C" on Apple platforms).
- The Email button leaves the channel list, which keeps LinkedIn, GitHub, Resume.
  `HomepageContactProjection` gains an `email` field and `ContactChannel["type"]` drops `"email"`
  (`lib/content/types.ts`). Grep the type before changing it.

### Form fields (right column)

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
| Sending | Send is disabled with the label "Sending", `aria-busy` is set on the form, and fields stay editable but submit is locked |
| Sent | See the success moment below |
| Failed | The sheet stays with everything still typed. An alert line above Send reads "Couldn't send. Your message is still here. Try again, or email me directly." with a Copy email button inline. Send is re-enabled |
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
(`strategy="lazyOnload"`) only after the form sheet first nears the viewport (IntersectionObserver,
`rootMargin: 200px`), so the hero and other scenes pay nothing. Render explicitly into a container
with `appearance: "interaction-only"`, `theme` from `next-themes` `resolvedTheme`, and
`refresh-expired: "auto"`. If the script fails to load, show the Failed alert with the copy-email
fallback instead of a dead Send button.

---

## Design: the transmittal sheet

An architect sends a drawing set with a **transmittal**: a cover sheet listing who it's from, what
it's about, and the note. The form is that sheet, placed on the scene's drawing sheet.

**Zone.** The scene stays "expressive, quiet" (DESIGN.md §2). The title column is expressive. The
form sheet is a **reading zone**: grid-aligned, steady sizes, at most one mark inside.

**Chaos moves used (max 3):** scale shock (the 6rem title beside 12px mono labels), dense line
work (crop marks around the sheet), and the existing bleed of the orbit geometry. Nothing else.

### Layout

| Width | Arrangement |
|---|---|
| `lg`+ | `.hp-grid` 5/7. Left (5): title, status line, direct email row, channel buttons. Right (7): the sheet, top-aligned with the title |
| `< lg` | One column: title → status → direct email row → channels → sheet. The direct path stays above the fold on phones |

- The title keeps `SplitText` and wraps to "Let's / connect." in 5 columns. Measure at 1024px: if
  "CONNECT." overflows 5 columns, lower the upper `clamp()` bound until it fits. Don't let it
  bleed into the sheet.
- The existing orbit outlines stay. The sheet has an opaque `--cs-foundation` background on the
  `--cs-reading-surface` scene, so the outlines pass behind it and frame it from outside. Chaos
  never touches the content (§3).

### The sheet

- A plate on `--cs-foundation`, 1px `--cs-structural-line-strong` border, square corners,
  `p-6 md:p-8 lg:p-10`. No shadow (§8: don't add new ones).
- `CropMarks` just outside its corners from `md` up (`hidden md:block`). The scene's
  `overflow-hidden` must not clip them, so keep the marks inside the section's padding.
- Header row: a mono eyebrow "Or write here" led by the signal leader
  (`h-px w-8 md:w-12 bg-[color:var(--cs-signal)]`). The eyebrow names the content (§11).
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
- **Error** turns the underline and the error line `--cs-field-error`, paired with an icon and
  text (§12: color is never the only signal). No error token exists today. Add
  `--cs-field-error` to `app/globals.css` with the `--cs-status-dnd` values (`#DC2626` light,
  `#EF4444` dark), and document it in DESIGN.md §4. Don't reuse `--cs-status-dnd` directly:
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
- The Turnstile container sits directly above Send. With `interaction-only` it takes no space
  unless Cloudflare asks for a check.

### The success moment

1. The fields fade out (opacity, 240ms) and the sheet keeps its height, so nothing jumps.
2. A **routing line** draws from Send's right edge to the sheet's right edge and past it. That
   gives it an anchor and a crossing (§7 rule 1). Use an element with `data-draw="extend-x"`:
   `DrawController`'s MutationObserver picks up the new node and runs the existing
   `draw-extend-x` keyframe (700ms, `decisiveEditorial`). No new animation code.
3. The status line appears in the Contact status-line grammar (§9): signal leader, a 6px
   `--cs-status-online` dot, then mono xs uppercase **"Sent · I'll reply to {email}"**. Line
   breaks only at `·`.
4. A `RegistrationMark` sits partly off the sheet's top-right corner (`-top-8 -right-8`,
   `hidden md:block`), the "received" stamp in the site's own vocabulary.
5. Below it is a secondary text button, "Write another", which resets the form and puts focus on
   Name.

Focus moves to the status line (`tabIndex={-1}`), which is also an `aria-live="polite"` region.
Under reduced motion, or tiers where `DrawController` isn't armed, the routing line is already
drawn and the swap is instant.

### Copy (no em dashes, §11)

Eyebrow "Or write here" · Labels "Reason (optional)", "Name", "Email", "Message" · Button "Send" /
"Sending" · Success "Sent · I'll reply to {email}" · "Write another" · Copy button "Copy" /
"Copied" · Failure "Couldn't send. Your message is still here. Try again, or email me directly."

### Theme

Light: ivory sheet on paper, red signal underline and leader. Dark: `#080909` sheet on `#111111`,
ice signal underline (type and rules only, never a fill). The checked reason chip uses ink and
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
3. Tab through the scene: every control shows a focus outline, and the radios move with arrow
   keys.

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
- `DESIGN.md` §2 Contact row and §9 Status line: add the sheet and the direct email row. §4: add
  `--cs-field-error`.

## Delivery

One branch, one PR: `feat/contact-form`. Build order inside it: validation (TDD) → action (TDD)
→ direct email row → sheet layout and states → Turnstile → success moment → checks → docs.
