# SEO & Share Card Refresh — Design

- **Date:** 2026-08-05
- **Owner:** Hans Amoguis (`amoguishans@gmail.com`)
- **Supersedes (partially):** `docs/superpowers/specs/2026-07-07-seo-enhancements-design.md`

## Context

A large homepage overhaul replaced the previous section components with server-rendered
`Scene*` components and swapped the portrait image. This spec covers the SEO follow-up.

### What was already correct (verified, not work)

Three assumptions behind the request turned out to be false. Recording them so the
implementation does not "fix" things that are not broken:

1. **OG images already regenerate.** `lib/og-image.tsx` reads `app/assets/myImages/hans.webp`
   at build time across six routes. The replacement photo ships automatically on next build.
   No manual regeneration step exists or is needed.
2. **Metadata copy is not stale.** `app/layout.tsx` describes Hans as a "full-stack engineer
   focused on AI product engineering" — verbatim the current
   `getHomepageIdentity().roleStatement` in `lib/content/homepage-projections.ts`.
3. **The overhaul did not break crawlability.** `SceneFlagships`, `SceneExperience`,
   `SceneMoreWork`, `ScenePresence`, and `SceneContact` are server components. Only
   `SceneIdentity` and `ScenePresenceClient` carry `"use client"`. Homepage content is in the
   SSR payload.

`app/sitemap.ts` and `app/robots.ts` are correct and are not modified by this spec.

## Goals

- The homepage share card shows the actual website, not a generated card.
- Every share card carries alt text.
- Mobile browser chrome matches the site's theme.
- Google can resolve "Hans Amoguis" to an entity rather than a string.
- Stale cached cards get purged after deploy.

## Non-Goals

- **`keywords` metadata** — left as-is. Google has ignored the keywords meta tag since 2009,
  and the current list is accurate anyway.
- **`app/sitemap.ts`, `app/robots.ts`, `app/manifest.ts`** — already correct.
- **New dependencies** — none. `sharp` and `next/og` are already installed.
- **`public/preview.png`** — appears to be an orphan from a pre-`opengraph-image`-convention
  setup; no code references it. Flagged for the owner, **not deleted** by this work
  (`AGENTS.md` § Surgical Changes).
- **Per-record screenshots** — dynamic slug routes keep generated cards.

---

## Section 1 — Homepage share card becomes a screenshot

**Decision:** the homepage OG image becomes a committed screenshot of the real site. All other
routes keep their generated cards.

| Route | Card |
|---|---|
| `/` | **static screenshot** |
| `/projects` | generated |
| `/projects/[slug]` | generated (names the project) |
| `/certificates` | generated |
| `/certificates/[slug]` | generated (names the certificate) |
| `/experience` | generated |

**Changes:**

- Delete `app/opengraph-image.tsx`.
- Add `app/opengraph-image.png` — 1200×630.
- Add `app/opengraph-image.alt.txt` — Next reads this file for `og:image:alt` when the image
  is static.

Next's file convention treats a static image identically to a generated one: it emits
`og:image`, `twitter:image`, `og:image:width`, `og:image:height`, and `og:image:type` with no
code. No build-time browser, no CI screenshot step.

**Capture procedure (manual, repeated only when the hero is redesigned):**

1. `pnpm dev`
2. Force **light theme** (ivory base `#F3F0E9`, red signal accents).
3. Set viewport to exactly 1200×630.
4. Screenshot `SceneIdentity` with the chapter nav (`HomepageChapterNav`) in frame.
5. Save as `app/opengraph-image.png`.

**`lib/og-image.tsx` is not deleted.** Only the homepage route file is removed; the remaining
five routes still call `renderOgImage`.

**Accepted inconsistency:** the homepage card will be light (ivory/red) while the five
generated cards remain dark (`#000000` background, ice-blue kicker). The homepage is the link
that actually gets pasted into chat apps, so it wins. This is a deliberate choice, not an
oversight — do not "harmonize" it without a new decision.

## Section 2 — `og:image:alt` on the five generated cards

None of the six `opengraph-image` files currently export `alt`, so `og:image:alt` is never
emitted and screen readers on X and Mastodon announce nothing for the card.

Add an exported `alt` string to each of:

- `app/projects/opengraph-image.tsx`
- `app/projects/[slug]/opengraph-image.tsx`
- `app/certificates/opengraph-image.tsx`
- `app/certificates/[slug]/opengraph-image.tsx`
- `app/experience/opengraph-image.tsx`

**Constraint:** Next requires `alt` to be a static module export. The two `[slug]` routes
therefore **cannot** interpolate the project or certificate name. They get an accurate generic
string (e.g. "Share card for a project from Hans Amoguis' portfolio") rather than a per-record
one. This is a framework limit, not a shortcut.

## Section 3 — `app/layout.tsx` metadata corrections

**`themeColor`** — currently hardcoded `"#FFFFFF"`, which is wrong in both themes. On mobile
Chrome and Safari this paints white browser chrome above a dark page. Replace with a
media-query pair using the real foundation tokens from `app/globals.css`:

| Scheme | Token source | Value |
|---|---|---|
| light | `--cs-foundation` (`app/globals.css:71`) | `#F3F0E9` |
| dark | `--cs-foundation` (`app/globals.css:109`) | `#080909` |

**Twitter/X attribution** — add to the existing `metadata.twitter` block:

- `creator: "@hansamoguis"`
- `site: "@hansamoguis"`

**Authorship** — add `authors`, `creator`, and `publisher` naming Hans Amoguis.

## Section 4 — Entity graph

**`components/utils/externalLinks.ts`** — add two constants alongside the existing
`GITHUB_URL` and `LINKEDIN_URL`, following the same style:

- `X_URL = "https://x.com/hansamoguis"`
- `INSTAGRAM_URL = "https://www.instagram.com/hanseooo"`

**Person JSON-LD in `app/layout.tsx`** — currently only `name`, `alternateName`, `jobTitle`,
`url`, `image`, `sameAs`. Add:

- `sameAs` → GitHub, LinkedIn, **X, Instagram**
- `description` — reuse the existing `metadata.description` string; do not write a new claim.
- `knowsAbout` — derived from technologies that actually appear in `lib/projects.ts` stack
  arrays: Next.js, React, TypeScript, Tailwind CSS, FastAPI, Python, LangChain, PostgreSQL,
  Supabase, retrieval-augmented generation.
- `email` — from the existing `EMAIL_ADDRESS` constant.
- `address` — `{ "@type": "PostalAddress", addressCountry: "PH" }`.

Every field traces to data already in the repo. No invented facts.

## Section 5 — Verify the new photo's crop

`lib/og-image.tsx:20` resizes the portrait with `.resize(760, 630, { fit: "cover" })`. `cover`
crops to fill, centered by default. The replacement `hans.webp` has different framing from the
original, so this can silently cut off the top of the head across all five generated cards.

**Check:** after `pnpm build`, open the generated PNGs and confirm the face is intact and
sensibly positioned.

**If it crops badly:** add a `position` option to the sharp resize call (e.g.
`{ fit: "cover", position: "top" }`). Do not change the output dimensions — 760×630 is load
bearing for the card layout in `lib/og-image.tsx:42`.

## Section 6 — Release checklist

Messenger, LinkedIn, and X cache share cards indefinitely. **After deploying, the old card will
keep appearing until each platform is purged.** This is the single most likely reason for
"I updated it but sharing still shows the old image".

Ship a short checklist (in the implementation plan, not a new doc) covering:

- Facebook / Messenger — Sharing Debugger, "Scrape Again"
- LinkedIn — Post Inspector
- X — Card Validator

---

## Verification

Success criteria, all required:

1. `pnpm lint` exits 0.
2. `pnpm build` exits 0.
3. Generated OG PNGs inspected from the build output — face intact (Section 5).
4. `app/opengraph-image.png` viewed at ~200px wide (Messenger thumbnail size) — hero text still
   legible. This is the risk the screenshot approach accepts; it must be checked, not assumed.
5. Rendered `<head>` on `/` contains `og:image`, `og:image:alt`, `twitter:image`,
   `twitter:creator`, and both `theme-color` entries.
6. Person JSON-LD passes Google's Rich Results Test with no errors.

No test runner exists in this project (`AGENTS.md` § Testing Contract); verification is
`pnpm lint && pnpm build` plus the manual checks above.

## Files Touched

| File | Change |
|---|---|
| `app/opengraph-image.tsx` | deleted |
| `app/opengraph-image.png` | added (binary) |
| `app/opengraph-image.alt.txt` | added |
| `app/projects/opengraph-image.tsx` | export `alt` |
| `app/projects/[slug]/opengraph-image.tsx` | export `alt` |
| `app/certificates/opengraph-image.tsx` | export `alt` |
| `app/certificates/[slug]/opengraph-image.tsx` | export `alt` |
| `app/experience/opengraph-image.tsx` | export `alt` |
| `app/layout.tsx` | `themeColor` pair, twitter handles, authorship, Person JSON-LD |
| `components/utils/externalLinks.ts` | add `X_URL`, `INSTAGRAM_URL` |
| `lib/og-image.tsx` | **only if** Section 5 finds a bad crop |
