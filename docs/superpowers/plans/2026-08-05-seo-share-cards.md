# SEO & Share Card Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the homepage share card a screenshot of the real site, give every share card alt text, correct the root metadata, and enrich the Person entity graph.

**Architecture:** Everything rides on Next's App Router file conventions. Swapping the homepage card from generated to static is a file swap (`opengraph-image.tsx` → `opengraph-image.png` + `opengraph-image.alt.txt`) — Next emits `og:image`, `twitter:image`, `og:image:width/height/type` identically for both. The other five routes keep calling `renderOgImage` from `lib/og-image.tsx` and gain a static `alt` export. Metadata and JSON-LD changes are confined to `app/layout.tsx` plus two new constants in `components/utils/externalLinks.ts`.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, `next/og` `ImageResponse`, `sharp`, pnpm.

## Global Constraints

- **Package manager is `pnpm`.** Never use `npm`, `yarn`, or `bun` (`AGENTS.md` § Tooling Lock).
- **No test runner exists.** "Passing" means `pnpm lint` exits 0, `pnpm build` exits 0, and the result is verified visually in the browser (`AGENTS.md` § Testing Contract). Every task below substitutes a runnable verification command for the usual failing-test step.
- **No new dependencies.** `sharp` and `next/og` are already installed.
- **Surgical changes only.** Every changed line traces to this plan. Do not reformat, rename, or improve adjacent code.
- **Do not delete `public/preview.png`.** It appears to be an orphan; it was flagged for the owner, not scoped for removal.
- **Do not delete `lib/og-image.tsx`.** Five routes still import `renderOgImage` from it.
- **Do not change the `760, 630` resize dimensions** in `lib/og-image.tsx` — they are load-bearing for the card layout at `lib/og-image.tsx:42`.
- **`app/layout.tsx` is a critical path** (`AGENTS.md` § Critical Paths) — changes there affect every page. Verify the site still renders after touching it.
- **The homepage card is light, the five generated cards are dark. This is deliberate** (spec § Section 1). Do not harmonize them.
- **`app/sitemap.ts`, `app/robots.ts`, `app/manifest.ts`, and `metadata.keywords` are out of scope.** They are already correct.
- Exact literal values that must be copied verbatim:
  - light `themeColor`: `#F3F0E9` — dark `themeColor`: `#080909`
  - X handle: `@hansamoguis` — `X_URL = "https://x.com/hansamoguis"`
  - Instagram: `INSTAGRAM_URL = "https://www.instagram.com/hanseooo"`
  - `components/utils/externalLinks.ts` uses **no trailing semicolons** — match that style in that file only.

---

### Task 1: `og:image:alt` on the five generated cards

**Files:**
- Modify: `app/projects/opengraph-image.tsx`
- Modify: `app/projects/[slug]/opengraph-image.tsx`
- Modify: `app/certificates/opengraph-image.tsx`
- Modify: `app/certificates/[slug]/opengraph-image.tsx`
- Modify: `app/experience/opengraph-image.tsx`
- Test: none (no test runner — verified via rendered `<head>`)

**Interfaces:**
- Consumes: `renderOgImage`, `size`, `contentType` from `lib/og-image.tsx` (already imported in all five files; unchanged).
- Produces: a module-level `export const alt: string` in each of the five files. Next reads this export to emit `<meta property="og:image:alt">`.

**Why `[slug]` routes get generic alt text:** Next requires `alt` to be a *static* module export, evaluated without route params. The two `[slug]` files therefore cannot name the specific project or certificate. This is a framework limit, not a shortcut — do not try to compute it inside the default export.

- [ ] **Step 1: Capture the current (missing) state**

Run:

```powershell
pnpm build
Select-String -Path .next\server\app\projects.html -Pattern 'og:image:alt'
```

Expected: `pnpm build` exits 0, and the `Select-String` prints **nothing** — `og:image:alt` is not emitted today. That absence is the failure this task fixes.

If `.next\server\app\projects.html` does not exist, list what did get emitted and search there instead:

```powershell
Get-ChildItem .next\server\app -Filter *.html -Recurse | Select-Object FullName
```

- [ ] **Step 2: Add `alt` to `app/projects/opengraph-image.tsx`**

Insert after the `export { size, contentType };` line:

```tsx
export const alt = "Share card for the projects index of Hans Amoguis' portfolio";
```

Resulting file:

```tsx
import { renderOgImage, size, contentType } from "@/lib/og-image";

export const runtime = "nodejs";
export { size, contentType };
export const alt = "Share card for the projects index of Hans Amoguis' portfolio";

export default async function Image() {
  return renderOgImage({
    kicker: "HANS AMOGUIS",
    title: "Projects",
    imagePath: "app/assets/myImages/hans.webp",
  });
}
```

- [ ] **Step 3: Add `alt` to `app/projects/[slug]/opengraph-image.tsx`**

Insert after the `export { size, contentType };` line:

```tsx
export const alt = "Share card for a project from Hans Amoguis' portfolio";
```

Change nothing else in the file — `generateStaticParams` and the default export stay exactly as they are.

- [ ] **Step 4: Add `alt` to `app/certificates/opengraph-image.tsx`**

Insert after the `export { size, contentType };` line:

```tsx
export const alt = "Share card for the certificates index of Hans Amoguis' portfolio";
```

- [ ] **Step 5: Add `alt` to `app/certificates/[slug]/opengraph-image.tsx`**

Insert after the `export { size, contentType };` line:

```tsx
export const alt = "Share card for a certificate from Hans Amoguis' portfolio";
```

- [ ] **Step 6: Add `alt` to `app/experience/opengraph-image.tsx`**

Insert after the `export { size, contentType };` line:

```tsx
export const alt = "Share card for the experience page of Hans Amoguis' portfolio";
```

- [ ] **Step 7: Verify all five now emit `og:image:alt`**

Run:

```powershell
pnpm lint
pnpm build
Select-String -Path .next\server\app\*.html -Pattern 'og:image:alt' -Recurse
```

Expected: `pnpm lint` exits 0, `pnpm build` exits 0, and `og:image:alt` now appears for the projects, certificates, and experience pages.

If the prerendered HTML is not on disk (routes rendered dynamically), verify through a running server instead:

```powershell
Start-Process -NoNewWindow pnpm -ArgumentList 'dev'
(Invoke-WebRequest http://localhost:3000/projects).Content | Select-String 'og:image:alt'
```

Expected output contains: `Share card for the projects index of Hans Amoguis&#x27; portfolio` (the apostrophe is HTML-escaped — that is correct, not a bug).

- [ ] **Step 8: Commit**

```bash
git add "app/projects/opengraph-image.tsx" "app/projects/[slug]/opengraph-image.tsx" "app/certificates/opengraph-image.tsx" "app/certificates/[slug]/opengraph-image.tsx" "app/experience/opengraph-image.tsx"
git commit -m "feat(seo): emit og:image:alt on generated share cards"
```

Note: the working tree contains ~32 unrelated modified files from the homepage overhaul. **Stage only the paths listed above** — never `git add -A`. This applies to every commit in this plan.

---

### Task 2: Correct `themeColor` and add authorship metadata

**Files:**
- Modify: `app/layout.tsx:13-15` (the `viewport` export)
- Modify: `app/layout.tsx:57-62` (the `metadata.twitter` block)
- Modify: `app/layout.tsx:17-63` (add `authors`, `creator`, `publisher` to `metadata`)
- Test: none (verified via rendered `<head>`)

**Interfaces:**
- Consumes: the `Viewport` and `Metadata` types already imported at `app/layout.tsx:2`. No new imports.
- Produces: nothing consumed by later tasks. Task 3 also edits `app/layout.tsx` — if both tasks run in the same session, apply Task 2 first and let Task 3 edit the file afterward.

**Why:** `themeColor` is hardcoded `"#FFFFFF"`, which is wrong in *both* themes. On mobile Chrome and Safari this paints white browser chrome above the page. The correct values are the `--cs-foundation` tokens: `#F3F0E9` at `app/globals.css:71` (light) and `#080909` at `app/globals.css:109` (dark).

- [ ] **Step 1: Confirm the current wrong value is what ships**

Run:

```powershell
pnpm dev
```

In a second shell:

```powershell
(Invoke-WebRequest http://localhost:3000).Content | Select-String 'theme-color'
```

Expected: exactly one `theme-color` meta tag with `content="#FFFFFF"`. That single white entry is the defect.

- [ ] **Step 2: Replace the `viewport` export**

Replace `app/layout.tsx:13-15`:

```tsx
export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};
```

with:

```tsx
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F3F0E9" },
    { media: "(prefers-color-scheme: dark)", color: "#080909" },
  ],
};
```

- [ ] **Step 3: Add the X handles to the `twitter` block**

Replace the `twitter` block at `app/layout.tsx:57-62`:

```tsx
  twitter: {
    card: "summary_large_image",
    title: "Hans Amoguis | Full-Stack Engineer focused on AI Product Engineering",
    description:
      "Portfolio of Hans Amoguis, building production-minded full-stack and AI-enabled products with Next.js, LangChain, and FastAPI.",
  },
```

with:

```tsx
  twitter: {
    card: "summary_large_image",
    site: "@hansamoguis",
    creator: "@hansamoguis",
    title: "Hans Amoguis | Full-Stack Engineer focused on AI Product Engineering",
    description:
      "Portfolio of Hans Amoguis, building production-minded full-stack and AI-enabled products with Next.js, LangChain, and FastAPI.",
  },
```

- [ ] **Step 4: Add authorship fields**

Insert these three fields into the `metadata` object immediately after the `alternates: { canonical: "/" },` line (`app/layout.tsx:36`):

```tsx
  authors: [{ name: "Hans Amoguis", url: siteUrl }],
  creator: "Hans Amoguis",
  publisher: "Hans Amoguis",
```

`siteUrl` is already in scope from `app/layout.tsx:11`.

- [ ] **Step 5: Verify the rendered `<head>`**

Run:

```powershell
pnpm lint
pnpm build
```

Expected: both exit 0.

Then with `pnpm dev` running:

```powershell
$head = (Invoke-WebRequest http://localhost:3000).Content
$head | Select-String 'theme-color'
$head | Select-String 'twitter:creator'
$head | Select-String 'twitter:site'
$head | Select-String '"author"'
```

Expected:
- **two** `theme-color` tags — one `media="(prefers-color-scheme: light)" content="#F3F0E9"`, one `media="(prefers-color-scheme: dark)" content="#080909"`
- `twitter:creator` and `twitter:site` both `@hansamoguis`
- an `author` meta tag naming Hans Amoguis

- [ ] **Step 6: Visual check (required — `app/layout.tsx` is a critical path)**

With `pnpm dev` running, open `http://localhost:3000`, toggle light and dark theme, and confirm the page still renders and scroll/animation behavior is unchanged. `AGENTS.md` § Testing Contract requires this for every change to the root layout.

- [ ] **Step 7: Commit**

```bash
git add app/layout.tsx
git commit -m "fix(seo): theme-aware themeColor pair and X/authorship metadata"
```

---

### Task 3: Entity graph — external links and enriched Person JSON-LD

**Files:**
- Modify: `components/utils/externalLinks.ts`
- Modify: `app/layout.tsx:8` (import line)
- Modify: `app/layout.tsx:65-74` (the `personLd` object)
- Test: none (verified via rendered JSON-LD + Google Rich Results Test)

**Interfaces:**
- Consumes: `EMAIL_ADDRESS` (already exported from `components/utils/externalLinks.ts:7`, not yet imported by `app/layout.tsx`), plus the existing `GITHUB_URL`, `LINKEDIN_URL`, `SITE_URL`.
- Produces: two new exported constants — `X_URL: string` and `INSTAGRAM_URL: string` — from `components/utils/externalLinks.ts`. No later task consumes them; `app/layout.tsx` is their only consumer.
- `personLd` is consumed by `websiteLd` at `app/layout.tsx:81` (`author: personLd`). Enriching `personLd` automatically enriches the WebSite node too — that is intended, no change needed at line 81.

**Why:** Google resolves "Hans Amoguis" to an entity rather than a string when `sameAs` links to profiles it can cross-reference. Every field below traces to data already in the repo — no invented facts.

- [ ] **Step 1: Confirm the current thin Person node**

With `pnpm dev` running:

```powershell
(Invoke-WebRequest http://localhost:3000).Content | Select-String 'application/ld\+json'
```

Expected: the Person node contains only `name`, `alternateName`, `jobTitle`, `url`, `image`, and a two-entry `sameAs`. No `description`, `knowsAbout`, `email`, or `address`.

- [ ] **Step 2: Add the two constants**

Append to `components/utils/externalLinks.ts`, matching the file's existing no-semicolon, blank-line-separated style:

```ts
export const X_URL = "https://x.com/hansamoguis"

export const INSTAGRAM_URL = "https://www.instagram.com/hanseooo"
```

Place them after `GITHUB_URL` (line 5) so the social URLs stay grouped, before `EMAIL_ADDRESS`.

- [ ] **Step 3: Update the import in `app/layout.tsx`**

Replace `app/layout.tsx:8`:

```tsx
import { GITHUB_URL, LINKEDIN_URL, SITE_URL } from "@/components/utils/externalLinks";
```

with:

```tsx
import {
  EMAIL_ADDRESS,
  GITHUB_URL,
  INSTAGRAM_URL,
  LINKEDIN_URL,
  SITE_URL,
  X_URL,
} from "@/components/utils/externalLinks";
```

- [ ] **Step 4: Enrich `personLd`**

Replace `app/layout.tsx:65-74`:

```tsx
const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Hans Amoguis",
  alternateName: "Hanseo",
  jobTitle: "Full-Stack Engineer",
  url: siteUrl,
  image: new URL(hansPortrait.src, siteUrl).toString(),
  sameAs: [GITHUB_URL, LINKEDIN_URL],
};
```

with:

```tsx
const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Hans Amoguis",
  alternateName: "Hanseo",
  jobTitle: "Full-Stack Engineer",
  description:
    "Portfolio of Hans Amoguis, a full-stack engineer focused on AI product engineering with Next.js, TypeScript, LangChain, and FastAPI.",
  url: siteUrl,
  image: new URL(hansPortrait.src, siteUrl).toString(),
  email: EMAIL_ADDRESS,
  address: {
    "@type": "PostalAddress",
    addressCountry: "PH",
  },
  knowsAbout: [
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "FastAPI",
    "Python",
    "LangChain",
    "PostgreSQL",
    "Supabase",
    "retrieval-augmented generation",
  ],
  sameAs: [GITHUB_URL, LINKEDIN_URL, X_URL, INSTAGRAM_URL],
};
```

The `description` string is copied **verbatim** from `metadata.description` at `app/layout.tsx:23-24`. Do not write a new claim. If `metadata.description` is ever edited, these two must stay in sync.

- [ ] **Step 5: Verify**

```powershell
pnpm lint
pnpm build
```

Expected: both exit 0. A TypeScript error here almost certainly means a missing or misspelled import from Step 3.

With `pnpm dev` running:

```powershell
(Invoke-WebRequest http://localhost:3000).Content | Select-String 'knowsAbout'
```

Expected: the Person node now includes `description`, `email`, `address`, `knowsAbout`, and a four-entry `sameAs`.

- [ ] **Step 6: Validate the structured data**

Paste the rendered page source into Google's Rich Results Test (<https://search.google.com/test/rich-results>) using the "Code" tab. Expected: the Person and WebSite items parse with **zero errors**. Warnings about optional recommended properties are acceptable.

- [ ] **Step 7: Commit**

```bash
git add components/utils/externalLinks.ts app/layout.tsx
git commit -m "feat(seo): enrich Person JSON-LD with sameAs, knowsAbout, and contact"
```

---

### Task 4: Homepage share card becomes a static screenshot

**Files:**
- Delete: `app/opengraph-image.tsx`
- Create: `app/opengraph-image.png` (binary, 1200×630)
- Create: `app/opengraph-image.alt.txt`
- Test: none (verified via rendered `<head>` + fetching the emitted image URL)

**Interfaces:**
- Consumes: nothing. Removing `app/opengraph-image.tsx` drops the last homepage-only import of `renderOgImage` — **`lib/og-image.tsx` stays**, since the five routes from Task 1 still import it.
- Produces: nothing consumed by later tasks.

**Ordering gate:** do **not** delete `app/opengraph-image.tsx` until `app/opengraph-image.png` exists. Between the two, the homepage has no share card at all. If the screenshot is not ready, stop and report — do not proceed with a half-applied task.

**This task requires a human.** Steps 1–2 are a manual capture the implementing agent cannot perform. If you are an agent, complete Step 3 onward only after the owner confirms the PNG is in place.

- [ ] **Step 1: Capture the screenshot (owner)**

1. Run `pnpm dev`.
2. Open `http://localhost:3000` and force **light theme** (ivory base `#F3F0E9`, red signal accents).
3. Set the viewport to exactly **1200×630** (DevTools → device toolbar → Responsive → type the dimensions).
4. Screenshot the `SceneIdentity` hero with the chapter nav (`HomepageChapterNav`) in frame.
5. Save as `app/opengraph-image.png`.

- [ ] **Step 2: Legibility check at thumbnail size (owner) — this is the risk the screenshot approach accepts**

View `app/opengraph-image.png` scaled to roughly **200px wide** — Messenger's thumbnail size. The hero text must still be readable.

If it is not readable: re-capture zoomed in on the hero type, or crop tighter, rather than shipping an illegible card. Do not proceed to Step 3 until this passes. Per spec § Verification item 4, this must be checked, not assumed.

- [ ] **Step 3: Verify the PNG is 1200×630**

```powershell
Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile((Resolve-Path 'app\opengraph-image.png'))
"$($img.Width)x$($img.Height)"
$img.Dispose()
```

Expected output: `1200x630`. Anything else means re-capture — Next reports the file's real dimensions in `og:image:width`/`og:image:height`, and a mismatch with the 1.91:1 ratio makes platforms crop the card.

- [ ] **Step 4: Add the alt text file**

Create `app/opengraph-image.alt.txt` containing exactly one line, no trailing newline needed:

```
Hans Amoguis' portfolio homepage: the identity hero introducing a full-stack engineer focused on AI product engineering.
```

Next reads this sibling file to emit `og:image:alt` for static images. The filename must match the image basename exactly.

- [ ] **Step 5: Delete the generated homepage card**

```bash
git rm app/opengraph-image.tsx
```

The deleted file's contents, for reference if a rollback is needed:

```tsx
import { renderOgImage, size, contentType } from "@/lib/og-image";

export const runtime = "nodejs";
export { size, contentType };

export default async function Image() {
  return renderOgImage({
    kicker: "HANS AMOGUIS",
    title: "Full-Stack Engineer",
    subtitle:
      "Full-stack engineer focused on AI product engineering with Next.js, TypeScript, LangChain, and FastAPI.",
    imagePath: "app/assets/myImages/hans.webp",
  });
}
```

- [ ] **Step 6: Confirm `lib/og-image.tsx` is still needed**

```powershell
Select-String -Path app -Pattern 'renderOgImage' -Recurse
```

Expected: five remaining matches (projects, projects/[slug], certificates, certificates/[slug], experience). If this returns zero, something went wrong in Task 1 — stop. `lib/og-image.tsx` must **not** be deleted either way.

- [ ] **Step 7: Verify the homepage now serves the static card**

```powershell
pnpm lint
pnpm build
```

Expected: both exit 0.

With `pnpm dev` running:

```powershell
$head = (Invoke-WebRequest http://localhost:3000).Content
$head | Select-String 'og:image'
$head | Select-String 'twitter:image'
```

Expected: `og:image` points at a `/opengraph-image.png` URL (Next appends a content hash), `og:image:width` is `1200`, `og:image:height` is `630`, `og:image:type` is `image/png`, `og:image:alt` carries the Step 4 sentence, and `twitter:image` mirrors `og:image`.

Then fetch the emitted image URL itself and confirm it returns 200 with `Content-Type: image/png`:

```powershell
(Invoke-WebRequest 'http://localhost:3000/opengraph-image.png').Headers['Content-Type']
```

- [ ] **Step 8: Commit**

```bash
git add app/opengraph-image.png app/opengraph-image.alt.txt
git rm --cached app/opengraph-image.tsx 2>/dev/null; true
git commit -m "feat(seo): use a real site screenshot as the homepage share card"
```

If `git rm` in Step 5 already staged the deletion, the `git rm --cached` line is a no-op — that is fine.

---

### Task 5: Verify the portrait crop on the generated cards

**Files:**
- Inspect: the OG PNGs in the `pnpm build` output
- Modify **only if the crop is bad**: `lib/og-image.tsx:20-23`
- Test: none (visual inspection)

**Interfaces:**
- Consumes: the five generated cards from Task 1.
- Produces: nothing. This task's likely outcome is **no code change**.

**Why:** `lib/og-image.tsx:20` resizes the portrait with `.resize(760, 630, { fit: "cover" })`. `cover` crops to fill and centers by default. The replacement `hans.webp` is framed differently from the original, so this can silently cut off the top of the head across all five generated cards. Nothing fails loudly — it just looks wrong on every shared link.

- [ ] **Step 1: Build and locate the generated PNGs**

```powershell
pnpm build
Get-ChildItem .next -Filter 'opengraph-image*' -Recurse | Select-Object FullName, Length
```

If the PNGs are not written to disk (routes rendered on demand), fetch them from a running server instead:

```powershell
pnpm dev
Invoke-WebRequest 'http://localhost:3000/projects/opengraph-image.png' -OutFile "$env:TEMP\og-projects.png"
Invoke-WebRequest 'http://localhost:3000/experience/opengraph-image.png' -OutFile "$env:TEMP\og-experience.png"
```

(The exact URL includes a content hash — read it out of the rendered `og:image` meta tag on `/projects` and `/experience` if the plain path 404s.)

- [ ] **Step 2: Inspect the portrait**

Open the PNGs. Confirm: the face is intact, the top of the head is not cut off, and the subject is sensibly positioned inside the right-hand 760px panel.

Check at least the `/projects` card (uses `hans.webp`) and one `/projects/[slug]` card (uses a per-project `ogImageSrc`, a different source image with different framing).

- [ ] **Step 3a: If the crop looks fine — stop here**

No code change. Record "crop verified, no change needed" in the completion report and skip to Task 6. This is the expected outcome.

- [ ] **Step 3b: If the crop cuts off the head — add a `position`**

Change `lib/og-image.tsx:20-23`:

```tsx
    const png = await sharp(raw)
      .resize(760, 630, { fit: "cover" })
      .png()
      .toBuffer();
```

to:

```tsx
    const png = await sharp(raw)
      .resize(760, 630, { fit: "cover", position: "top" })
      .png()
      .toBuffer();
```

**Do not change `760, 630`.** Those dimensions are load-bearing for the card layout at `lib/og-image.tsx:42` (the text panel is sized `1200 - 760 = 440px`). Only the `position` option may be added.

Then re-run Steps 1–2 and confirm the crop is now correct on all five cards. Note that `position` applies to *every* generated card, including per-project images — verify it did not make a different card worse.

- [ ] **Step 4: Commit (only if Step 3b was needed)**

```bash
git add lib/og-image.tsx
git commit -m "fix(seo): anchor OG portrait crop to the top"
```

---

### Task 6: Final verification and post-deploy cache purge

**Files:** none — this is verification and a release procedure.

**Interfaces:**
- Consumes: the completed Tasks 1–5.
- Produces: the completion report.

**Why the purge matters:** Messenger, LinkedIn, and X cache share cards indefinitely. **After deploying, the old card will keep appearing until each platform is purged.** This is the single most likely reason for "I updated it but sharing still shows the old image" — the code is correct and the platform is serving a stale copy.

- [ ] **Step 1: Full pre-merge verification**

```powershell
pnpm lint
pnpm build
```

Expected: both exit 0. This is the `AGENTS.md` § Commands pre-merge gate. Paste the actual output into the completion report — do not claim it passed without showing it.

- [ ] **Step 2: Walk the spec's six success criteria**

Confirm each, and record verified-vs-not for every one:

1. `pnpm lint` exits 0 — Step 1
2. `pnpm build` exits 0 — Step 1
3. Generated OG PNGs inspected, face intact — Task 5
4. `app/opengraph-image.png` legible at ~200px wide — Task 4 Step 2
5. Rendered `<head>` on `/` contains `og:image`, `og:image:alt`, `twitter:image`, `twitter:creator`, and **both** `theme-color` entries — run the combined check below
6. Person JSON-LD passes Google's Rich Results Test with no errors — Task 3 Step 6

Combined check for criterion 5, with `pnpm dev` running:

```powershell
$head = (Invoke-WebRequest http://localhost:3000).Content
foreach ($p in 'og:image','og:image:alt','twitter:image','twitter:creator','theme-color') {
  $n = ([regex]::Matches($head, [regex]::Escape($p))).Count
  "$p : $n"
}
```

Expected: every count ≥ 1, and `theme-color` = 2.

- [ ] **Step 3: Deploy**

Deploy as normal (Vercel). **Nothing below works before the changes are live** — every debugger fetches the public URL.

- [ ] **Step 4: Purge the cached share cards**

Run all three. Each is a manual browser step by the owner.

| Platform | Tool | Action |
|---|---|---|
| Facebook / Messenger | Sharing Debugger — <https://developers.facebook.com/tools/debug/> | Enter `https://hanseo.tech`, click **Scrape Again**. Repeat until the preview shows the new screenshot. |
| LinkedIn | Post Inspector — <https://www.linkedin.com/post-inspector/> | Enter `https://hanseo.tech` and inspect. LinkedIn re-fetches automatically on inspection. |
| X | Card Validator — <https://cards-dev.twitter.com/validator> | Enter `https://hanseo.tech`. If the validator is unavailable, post the link in a draft to preview the card. |

Also purge `https://hanseo.tech/projects` and `https://hanseo.tech/experience` on Facebook if those links have been shared before — their cards changed too (they gained alt text).

- [ ] **Step 5: Confirm in a real chat app**

Paste `https://hanseo.tech` into a Messenger conversation with yourself. Confirm the new light homepage screenshot appears, not the old black generated card. This is the end-to-end check the entire plan exists to satisfy.

- [ ] **Step 6: Write the completion report**

Per `AGENTS.md` § Definition of Done, include: commands run with their output, key results, what was verified vs not, and residual risks. Name explicitly:

- whether Task 5 required a code change or confirmed no change was needed
- the thumbnail-legibility judgment from Task 4 Step 2 (subjective — say who made the call)
- that `public/preview.png` remains flagged as a likely orphan, **not deleted** — the owner's call
- that `personLd.description` now duplicates `metadata.description`; the two must be edited together
