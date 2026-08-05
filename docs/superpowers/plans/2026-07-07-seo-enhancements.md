# SEO Enhancements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give every route a correct social-share preview image, wire up Person/CreativeWork/EducationalOccupationalCredential structured data, close metadata/sitemap/favicon gaps, and add the Search Console verification hook — per `docs/superpowers/specs/2026-07-07-seo-enhancements-design.md`.

**Architecture:** A single shared `lib/og-image.tsx` renderer (Satori/`next/og` + `sharp` re-encode) is wrapped by six thin `opengraph-image.tsx` route files (root, 3 static indexes, 2 dynamic detail routes). A single `components/seo/JsonLd.tsx` component renders `<script type="application/ld+json">` blocks fed by per-route objects built from the existing `Project`/`Certificate`/`experience` data models. A single `SITE_URL` constant (env-backed, default `https://hanseo.tech`) replaces the 4 separate hardcoded copies of the production domain that currently exist across `app/layout.tsx`, `app/sitemap.ts`, and both `[slug]/layout.tsx` files. No new npm dependencies — `sharp` is already present in `node_modules` (transitive, confirmed), `next/og` is a Next 16 built-in.

**Tech Stack:** Next.js 16.1.6 (App Router file conventions: `opengraph-image.tsx`, `manifest.ts`, `sitemap.ts`), React 19, TypeScript (strict), `next/og` `ImageResponse`, `sharp` 0.34.5.

## Global Constraints

- Package manager is `npm` — no new dependencies are added in this plan (verified: `sharp` already in `node_modules`, `next/og` is a Next 16 built-in).
- No test runner is configured in this repo. Verification per task uses `npx tsc --noEmit`, `pnpm lint`, `pnpm build` (route-type check), and `curl` against a running `next dev` server to inspect real output (PNG bytes, `<head>` tags). No unit-test framework is introduced.
- Confirmed brand tokens (`app/globals.css`): light `--background:#FFFFFF` / `--primary:#e10600` (red); dark `--background:#000000` / `--primary:#00E5FF` (ice blue). The OG image card is a single static asset generated once per route at build time — it is **not** theme-reactive (no viewer preference exists at build time), so it always uses the dark tokens (`#000000` bg, `#00E5FF` accent) per the spec's Section 1 design. This matches the spec verbatim; no change needed there.
- **Single source of truth for the production URL:** `SITE_URL`, exported from `components/utils/externalLinks.ts`, reads `process.env.NEXT_PUBLIC_SITE_URL` with a fallback to the literal `"https://hanseo.tech"` (Task 2). Every file that needs the absolute site origin (`app/layout.tsx`, `app/sitemap.ts`, `app/projects/[slug]/layout.tsx`, `app/certificates/[slug]/layout.tsx`) imports `SITE_URL` instead of hardcoding its own copy of the string. This is a correctness fix, not a speculative abstraction: those 4 files already each hardcode the same literal today, and 3 of them are already being edited by this plan.
- `localhost` must never appear in committed source (`app/**`, `lib/**`, `components/**`) — only in this plan's own dev-server verification commands, which are shell instructions, not shipped code. Task 12 includes a repo grep to confirm this.
- Every new/edited file must keep `pnpm lint && pnpm build` exiting 0 (per project `CLAUDE.md` PR requirements).
- No visible UI change is expected anywhere in this plan (metadata/head/asset-only) — the final task includes a visual sanity check for that.

---

### Task 1: Data model — `ogImageSrc` on `Project` and `Certificate`

**Files:**
- Modify: `lib/projects.ts:111-129` (type), `lib/projects.ts:131-383` (each of 5 project entries)
- Modify: `lib/certificates.ts:9-17` (type), `lib/certificates.ts:19-62` (each of 4 certificate entries)

**Interfaces:**
- Produces: `Project.ogImageSrc: string` and `Certificate.ogImageSrc: string` — repo-relative disk paths, consumed by `lib/og-image.tsx` (Task 3) via `fs.readFile(path.join(process.cwd(), ogImageSrc))`.

Confirmed disk paths for every existing entry (verified via `ls` — all exist):

| Project slug | ogImageSrc |
|---|---|
| `le-doux` | `app/assets/projects/leDoux/hero.webp` |
| `clarift` | `app/assets/projects/clarift/hero.webp` |
| `simply-note` | `app/assets/projects/simplyNote/hero.webp` |
| `the-podium` | `app/assets/projects/ThePodium/hero.webp` |
| `hcdc-lfms` | `app/assets/projects/hcdcLFMS/hero.webp` |

| Certificate slug | ogImageSrc |
|---|---|
| `eskwelabs-ai-solution-development-track` | `app/assets/certificates/eskwelabs-cert.jpg` |
| `introduction-to-modern-ai` | `app/assets/certificates/intro-to-modern-ai.webp` |
| `national-programming-challenge-2024` | `app/assets/certificates/national-programming-challenge-2024.webp` |
| `python-essentials-1` | `app/assets/certificates/pythonEssentials1.webp` |

- [ ] **Step 1: Add `ogImageSrc` to the `Project` type**

In `lib/projects.ts`, edit the type at line 111-129:

```ts
export type Project = {
    slug: string;
    title: string;
    subtitle: string;
    heroImage: StaticImageData;
    ogImageSrc: string;
    year: string;
    problem: string;
    technicalDecisions: string[];
    overview: string;
    features: string[];
    role: string;
    stack: string[];
    integrations?: string[];
    gallery: StaticImageData[];
    github?: string;
    live?: string;
    client?: string;
    clientConsent?: boolean;
}
```

- [ ] **Step 2: Populate `ogImageSrc` on every project entry**

Add the field right after `heroImage:` in each of the 5 entries in `lib/projects.ts`:

```ts
    heroImage: leDouxHero,
    ogImageSrc: "app/assets/projects/leDoux/hero.webp",
```
```ts
    heroImage: clariftHero,
    ogImageSrc: "app/assets/projects/clarift/hero.webp",
```
```ts
    heroImage: simplyNoteHero,
    ogImageSrc: "app/assets/projects/simplyNote/hero.webp",
```
```ts
    heroImage: ThePodiumHero,
    ogImageSrc: "app/assets/projects/ThePodium/hero.webp",
```
```ts
    heroImage: hcdcLFMSHero,
    ogImageSrc: "app/assets/projects/hcdcLFMS/hero.webp",
```

- [ ] **Step 3: Add `ogImageSrc` to the `Certificate` type**

In `lib/certificates.ts`, edit the interface at line 9-17:

```ts
export interface Certificate {
  title: string;
  slug: string;
  issuer: string;
  image: StaticImageData;
  ogImageSrc: string;
  date: string;
  credentialUrl: string | null;
  description?: string;
}
```

- [ ] **Step 4: Populate `ogImageSrc` on every certificate entry**

Add the field right after `image:` in each of the 4 entries in `lib/certificates.ts`:

```ts
    image: eskwelabsAITrackCert,
    ogImageSrc: "app/assets/certificates/eskwelabs-cert.jpg",
```
```ts
    image: introToModernAICert,
    ogImageSrc: "app/assets/certificates/intro-to-modern-ai.webp",
```
```ts
    image: nationalProgrammingChallenge2024,
    ogImageSrc: "app/assets/certificates/national-programming-challenge-2024.webp",
```
```ts
    image: pythonEssentials1Cert,
    ogImageSrc: "app/assets/certificates/pythonEssentials1.webp",
```

- [ ] **Step 5: Type-check**

Run: `npx tsc --noEmit`
Expected: exits 0, no errors about missing `ogImageSrc` properties.

- [ ] **Step 6: Commit**

```bash
git add lib/projects.ts lib/certificates.ts
git commit -m "feat: add ogImageSrc field to Project and Certificate models"
```

---

### Task 2: Centralize the production site URL via `SITE_URL`

**Files:**
- Modify: `.env.example`
- Modify: `components/utils/externalLinks.ts`

**Interfaces:**
- Produces: `SITE_URL: string`, exported from `components/utils/externalLinks.ts` — consumed by Task 6 (`app/layout.tsx`), Task 7 (`app/projects/[slug]/layout.tsx`), Task 8 (`app/certificates/[slug]/layout.tsx`), Task 11 (`app/sitemap.ts`).

`https://hanseo.tech` is a public, non-secret value (it's the site's own domain, already visible in every page's rendered `<head>`), so a hardcoded fallback is safe — the env var exists so the value lives in one place instead of 4 duplicated string literals that could silently drift out of sync (e.g. a typo fixed in one file but not the other three).

- [ ] **Step 1: Document the env var in `.env.example`**

Add this section to `.env.example` (after the existing header comment, before `# GitHub GraphQL`):

```
# Site URL (public, non-secret — used for canonical links, JSON-LD, sitemap, and OG metadata)
# Defaults to https://hanseo.tech in code if unset; only set this to override (e.g. a staging domain).
NEXT_PUBLIC_SITE_URL=https://hanseo.tech
```

- [ ] **Step 2: Add the `SITE_URL` constant**

Edit `components/utils/externalLinks.ts` — add as the first line:

```ts
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hanseo.tech"

export const LINKEDIN_URL = "https://www.linkedin.com/in/hanseooo"

export const GITHUB_URL = "https://github.com/Hanseooo"

export const EMAIL_ADDRESS = "amoguishans@gmail.com"

export const PHONE_NUMBER = "+63 949 100 9113"
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: exits 0.

- [ ] **Step 4: Commit**

```bash
git add .env.example components/utils/externalLinks.ts
git commit -m "feat: add SITE_URL env-backed constant to replace hardcoded domain literals"
```

---

### Task 3: Shared OG image renderer — `lib/og-image.tsx`

**Files:**
- Create: `lib/og-image.tsx`

**Interfaces:**
- Consumes: `sharp` and `next/og` from `node_modules`.
- Produces: `size: { width: 1200, height: 630 }`, `contentType: "image/png"`, `renderOgImage(opts): Promise<ImageResponse>` where `opts` is `{ kicker: string; title: string; subtitle?: string; imagePath?: string }` — consumed by all 6 route files in Tasks 4 and 5. `imagePath`, when present, is one of the `ogImageSrc` values from Task 1.

- [ ] **Step 1: Write the renderer**

```tsx
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function renderOgImage(opts: {
  kicker: string;
  title: string;
  subtitle?: string;
  imagePath?: string;
}) {
  let imageDataUri: string | undefined;

  if (opts.imagePath) {
    const absolutePath = path.join(process.cwd(), opts.imagePath);
    const raw = await readFile(absolutePath);
    const png = await sharp(raw)
      .resize(760, 630, { fit: "cover" })
      .png()
      .toBuffer();
    imageDataUri = `data:image/png;base64,${png.toString("base64")}`;
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "1200px",
          height: "630px",
          background: "#000000",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: imageDataUri ? "440px" : "1200px",
            height: "630px",
            padding: "64px",
            gap: "20px",
          }}
        >
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 22,
              letterSpacing: 4,
              color: "#00E5FF",
              textTransform: "uppercase",
            }}
          >
            {opts.kicker}
          </span>
          <span
            style={{
              fontSize: 54,
              fontWeight: 700,
              color: "#FAFAFA",
              lineHeight: 1.15,
            }}
          >
            {opts.title}
          </span>
          {opts.subtitle && (
            <span
              style={{
                fontSize: 22,
                color: "#A1A1AA",
                lineHeight: 1.4,
              }}
            >
              {opts.subtitle}
            </span>
          )}
          <span
            style={{
              display: "flex",
              marginTop: "auto",
              fontSize: 18,
              color: "#71717A",
            }}
          >
            Hans Amoguis — hanseo.tech
          </span>
        </div>
        {imageDataUri && (
          <div
            style={{
              display: "flex",
              position: "relative",
              width: "760px",
              height: "630px",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageDataUri}
              width={760}
              height={630}
              style={{ objectFit: "cover" }}
            />
            <div
              style={{
                display: "flex",
                position: "absolute",
                top: 0,
                left: 0,
                width: "300px",
                height: "630px",
                background:
                  "linear-gradient(to right, #000000, rgba(0,0,0,0))",
              }}
            />
          </div>
        )}
      </div>
    ),
    { ...size }
  );
}
```

Note: the "Hans Amoguis — hanseo.tech" footer line is a fixed brand label, not a live link — it deliberately doesn't read from `SITE_URL` (Task 2) since it's plain text baked into a rasterized image, not a clickable URL.

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add lib/og-image.tsx
git commit -m "feat: add shared OG image renderer"
```

---

### Task 4: Static OG image routes — root, projects, certificates, experience

**Files:**
- Create: `app/opengraph-image.tsx`
- Create: `app/projects/opengraph-image.tsx`
- Create: `app/certificates/opengraph-image.tsx`
- Create: `app/experience/opengraph-image.tsx`

**Interfaces:**
- Consumes: `renderOgImage`, `size`, `contentType` from `lib/og-image.tsx` (Task 3).

- [ ] **Step 1: Root route**

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

- [ ] **Step 2: `/projects` index route**

```tsx
import { renderOgImage, size, contentType } from "@/lib/og-image";

export const runtime = "nodejs";
export { size, contentType };

export default async function Image() {
  return renderOgImage({
    kicker: "HANS AMOGUIS",
    title: "Projects",
    imagePath: "app/assets/myImages/hans.webp",
  });
}
```

- [ ] **Step 3: `/certificates` index route**

```tsx
import { renderOgImage, size, contentType } from "@/lib/og-image";

export const runtime = "nodejs";
export { size, contentType };

export default async function Image() {
  return renderOgImage({
    kicker: "HANS AMOGUIS",
    title: "Certificates",
    imagePath: "app/assets/myImages/hans.webp",
  });
}
```

- [ ] **Step 4: `/experience` index route**

```tsx
import { renderOgImage, size, contentType } from "@/lib/og-image";

export const runtime = "nodejs";
export { size, contentType };

export default async function Image() {
  return renderOgImage({
    kicker: "HANS AMOGUIS",
    title: "Experience",
    imagePath: "app/assets/myImages/hans.webp",
  });
}
```

- [ ] **Step 5: Verify each route renders a real PNG**

Run in one terminal: `pnpm dev` (leave running — this dev server is local-only tooling for this verification step, not something shipped in source)

Run in another:
```bash
curl -s -o /tmp/og-root.png -w "%{http_code} %{content_type}\n" http://localhost:3000/opengraph-image
curl -s -o /tmp/og-projects.png -w "%{http_code} %{content_type}\n" http://localhost:3000/projects/opengraph-image
curl -s -o /tmp/og-certificates.png -w "%{http_code} %{content_type}\n" http://localhost:3000/certificates/opengraph-image
curl -s -o /tmp/og-experience.png -w "%{http_code} %{content_type}\n" http://localhost:3000/experience/opengraph-image
file /tmp/og-root.png /tmp/og-projects.png /tmp/og-certificates.png /tmp/og-experience.png
```
Expected: each `curl` prints `200 image/png`; `file` reports `PNG image data, 1200 x 630`.

- [ ] **Step 6: Verify `og:image`/`twitter:image` meta tags appear in each page's `<head>`**

```bash
curl -s http://localhost:3000/ | grep -o '<meta property="og:image[^>]*>\|<meta name="twitter:image[^>]*>'
curl -s http://localhost:3000/projects | grep -o '<meta property="og:image[^>]*>'
curl -s http://localhost:3000/certificates | grep -o '<meta property="og:image[^>]*>'
curl -s http://localhost:3000/experience | grep -o '<meta property="og:image[^>]*>'
```
Expected: each page shows an `og:image` meta tag pointing at its own `opengraph-image` route (e.g. `/opengraph-image?<hash>` for root, `/projects/opengraph-image?<hash>` for `/projects`), auto-injected by the Next.js file convention — no manual `openGraph.images` needed in any `metadata` export. The root page also shows a `twitter:image` tag (Twitter falls back to `og:image` per spec; Next mirrors it automatically once `twitter: { card: "summary_large_image" }` is set, which `app/layout.tsx` already has).

- [ ] **Step 7: Commit**

```bash
git add app/opengraph-image.tsx app/projects/opengraph-image.tsx app/certificates/opengraph-image.tsx app/experience/opengraph-image.tsx
git commit -m "feat: add OG image routes for root and index pages"
```

---

### Task 5: Dynamic OG image routes — project & certificate detail pages

**Files:**
- Create: `app/projects/[slug]/opengraph-image.tsx`
- Create: `app/certificates/[slug]/opengraph-image.tsx`

**Interfaces:**
- Consumes: `renderOgImage`/`size`/`contentType` (Task 3), `projects`/`Project` (`lib/projects.ts`), `certificates`/`Certificate` (`lib/certificates.ts`), each item's `ogImageSrc` (Task 1).

- [ ] **Step 1: Project detail OG route**

```tsx
import { renderOgImage, size, contentType } from "@/lib/og-image";
import { projects } from "@/lib/projects";

export const runtime = "nodejs";
export { size, contentType };

export async function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    return renderOgImage({ kicker: "PROJECT", title: "Project" });
  }

  return renderOgImage({
    kicker: "PROJECT",
    title: project.title,
    subtitle: project.subtitle,
    imagePath: project.ogImageSrc,
  });
}
```

- [ ] **Step 2: Certificate detail OG route**

```tsx
import { renderOgImage, size, contentType } from "@/lib/og-image";
import { certificates } from "@/lib/certificates";

export const runtime = "nodejs";
export { size, contentType };

export async function generateStaticParams() {
  return certificates.map((certificate) => ({ slug: certificate.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const certificate = certificates.find((item) => item.slug === slug);

  if (!certificate) {
    return renderOgImage({ kicker: "CERTIFICATE", title: "Certificate" });
  }

  return renderOgImage({
    kicker: "CERTIFICATE",
    title: certificate.title,
    subtitle: `${certificate.issuer} — ${certificate.date}`,
    imagePath: certificate.ogImageSrc,
  });
}
```

- [ ] **Step 3: Verify with 2 sample slugs each**

With `pnpm dev` still running:
```bash
curl -s -o /tmp/og-le-doux.png -w "%{http_code} %{content_type}\n" http://localhost:3000/projects/le-doux/opengraph-image
curl -s -o /tmp/og-clarift.png -w "%{http_code} %{content_type}\n" http://localhost:3000/projects/clarift/opengraph-image
curl -s -o /tmp/og-cert1.png -w "%{http_code} %{content_type}\n" http://localhost:3000/certificates/eskwelabs-ai-solution-development-track/opengraph-image
curl -s -o /tmp/og-cert2.png -w "%{http_code} %{content_type}\n" http://localhost:3000/certificates/python-essentials-1/opengraph-image
file /tmp/og-le-doux.png /tmp/og-clarift.png /tmp/og-cert1.png /tmp/og-cert2.png
```
Expected: all `200 image/png`, all report `PNG image data, 1200 x 630`.

- [ ] **Step 4: Verify `og:image` meta tags on real detail pages**

```bash
curl -s http://localhost:3000/projects/le-doux | grep -o '<meta property="og:image[^>]*>\|<meta property="og:title[^>]*>\|<meta property="og:description[^>]*>'
curl -s http://localhost:3000/certificates/python-essentials-1 | grep -o '<meta property="og:image[^>]*>\|<meta property="og:title[^>]*>\|<meta property="og:description[^>]*>'
```
Expected: each page shows `og:image` pointing at its own `/projects/le-doux/opengraph-image` / `/certificates/python-essentials-1/opengraph-image` route, plus `og:title`/`og:description` matching the existing `generateMetadata` output in `app/projects/[slug]/layout.tsx` / `app/certificates/[slug]/layout.tsx`.

- [ ] **Step 5: Commit**

```bash
git add app/projects/[slug]/opengraph-image.tsx app/certificates/[slug]/opengraph-image.tsx
git commit -m "feat: add OG image routes for project and certificate detail pages"
```

---

### Task 6: JSON-LD component + global Person/WebSite + Search Console verification

**Files:**
- Create: `components/seo/JsonLd.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: `SITE_URL` from `components/utils/externalLinks.ts` (Task 2).
- Produces: `JsonLd({ data: object })` — a React component, consumed here and by Tasks 7 & 8.

- [ ] **Step 1: Write the JSON-LD component**

```tsx
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
```

- [ ] **Step 2: Add Person + WebSite JSON-LD and verification field to `app/layout.tsx`**

Edit `app/layout.tsx`. Add imports after the existing ones (after line 9):

```tsx
import JsonLd from "@/components/seo/JsonLd";
import { GITHUB_URL, LINKEDIN_URL, SITE_URL } from "@/components/utils/externalLinks";
import hansPortrait from "@/app/assets/myImages/hans.webp";
```

Replace the existing top-level constant (line 21):

```ts
const siteUrl = "https://hanseo.tech";
```

with:

```ts
const siteUrl = SITE_URL;
```

This keeps every other `siteUrl` reference in the file (`metadataBase: new URL(siteUrl)`, `openGraph.url: siteUrl`) unchanged — only the source of the value changes, from a locally hardcoded literal to the shared `SITE_URL` constant.

Add `verification` to the `metadata` object (after the `robots` block, before `openGraph`, i.e. after line 55):

```ts
  verification: {
    google: "REPLACE_WITH_GOOGLE_SEARCH_CONSOLE_CODE",
  },
```

Add the JSON-LD data objects and render them, replacing the `RootLayout` function (lines 73-91):

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

const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Hans Amoguis Portfolio",
  url: siteUrl,
  author: personLd,
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} font-sans`} suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased min-h-screen cursor-none">
        <JsonLd data={personLd} />
        <JsonLd data={websiteLd} />
        <CustomCursor />
        <AppProviders>
          <Preloader />
          <Navbar />
          {children}
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: exits 0.

- [ ] **Step 4: Verify JSON-LD renders in the actual HTML**

With `pnpm dev` running:
```bash
curl -s http://localhost:3000/ | grep -o '<script type="application/ld+json">[^<]*</script>'
```
Expected: two `<script type="application/ld+json">` blocks, one containing `"@type":"Person"` and `"name":"Hans Amoguis"`, one containing `"@type":"WebSite"`. Both should contain `"https://hanseo.tech"` (from the `SITE_URL` default), never `localhost`.

- [ ] **Step 5: Commit**

```bash
git add components/seo/JsonLd.tsx app/layout.tsx
git commit -m "feat: add Person/WebSite JSON-LD and Search Console verification field"
```

---

### Task 7: Project detail — BreadcrumbList + CreativeWork JSON-LD + static generation

**Files:**
- Modify: `app/projects/[slug]/layout.tsx`

**Interfaces:**
- Consumes: `JsonLd` (Task 6), `SITE_URL` (Task 2), `projects`/`Project` (`lib/projects.ts`).
- Produces: `generateStaticParams` on this route segment — makes `app/projects/[slug]/page.tsx` (a `"use client"` component reading `params` via `use()`) build as static HTML, since it has no other dynamic data source.

- [ ] **Step 1: Rewrite the layout**

```tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { projects } from "@/lib/projects";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_URL } from "@/components/utils/externalLinks";

const baseUrl = SITE_URL;

export async function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    return {
      title: "Project",
      description: "Project details from Hans Amoguis' portfolio.",
      alternates: {
        canonical: `/projects/${slug}`,
      },
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  const title = `${project.title} | Hans Amoguis`;
  const description = project.subtitle;
  const url = `${baseUrl}/projects/${project.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: `/projects/${project.slug}`,
    },
    openGraph: {
      type: "article",
      url,
      title,
      description,
      siteName: "Hans Amoguis Portfolio",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ProjectSlugLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    return children;
  }

  const url = `${baseUrl}/projects/${project.slug}`;

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "Projects", item: `${baseUrl}/projects` },
      { "@type": "ListItem", position: 3, name: project.title, item: url },
    ],
  };

  const creativeWorkLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.subtitle,
    image: new URL(project.heroImage.src, baseUrl).toString(),
    url,
    author: { "@type": "Person", name: "Hans Amoguis", url: baseUrl },
    keywords: project.stack.join(", "),
  };

  return (
    <>
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={creativeWorkLd} />
      {children}
    </>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: exits 0.

- [ ] **Step 3: Verify JSON-LD renders for a real project page**

With `pnpm dev` running:
```bash
curl -s http://localhost:3000/projects/le-doux | grep -o '<script type="application/ld+json">[^<]*</script>'
```
Expected: two blocks — one `"@type":"BreadcrumbList"` with 3 `ListItem`s, one `"@type":"CreativeWork"` with `"name":"Le Doux"`. Every `item`/`url`/`image` value should start with `https://hanseo.tech`, never `localhost`.

- [ ] **Step 4: Commit**

```bash
git add "app/projects/[slug]/layout.tsx"
git commit -m "feat: add BreadcrumbList/CreativeWork JSON-LD and static params to project detail route"
```

---

### Task 8: Certificate detail — BreadcrumbList + EducationalOccupationalCredential JSON-LD + static generation

**Files:**
- Modify: `app/certificates/[slug]/layout.tsx`

**Interfaces:**
- Consumes: `JsonLd` (Task 6), `SITE_URL` (Task 2), `certificates`/`Certificate` (`lib/certificates.ts`).
- Produces: `generateStaticParams` on this route segment — same static-generation effect as Task 7, for `app/certificates/[slug]/page.tsx`.

- [ ] **Step 1: Rewrite the layout**

```tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { certificates } from "@/lib/certificates";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_URL } from "@/components/utils/externalLinks";

const baseUrl = SITE_URL;

export async function generateStaticParams() {
  return certificates.map((certificate) => ({ slug: certificate.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const certificate = certificates.find((item) => item.slug === slug);

  if (!certificate) {
    return {
      title: "Certificate",
      description: "Certificate details from Hans Amoguis' portfolio.",
      alternates: {
        canonical: `/certificates/${slug}`,
      },
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  const title = `${certificate.title} | Hans Amoguis`;
  const description = `${certificate.issuer} - ${certificate.date}`;
  const url = `${baseUrl}/certificates/${certificate.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: `/certificates/${certificate.slug}`,
    },
    openGraph: {
      type: "article",
      url,
      title,
      description,
      siteName: "Hans Amoguis Portfolio",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function CertificateSlugLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const certificate = certificates.find((item) => item.slug === slug);

  if (!certificate) {
    return children;
  }

  const url = `${baseUrl}/certificates/${certificate.slug}`;

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "Certificates", item: `${baseUrl}/certificates` },
      { "@type": "ListItem", position: 3, name: certificate.title, item: url },
    ],
  };

  const credentialLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalCredential",
    name: certificate.title,
    recognizedBy: { "@type": "Organization", name: certificate.issuer },
    dateCreated: certificate.date,
    ...(certificate.credentialUrl ? { url: certificate.credentialUrl } : {}),
  };

  return (
    <>
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={credentialLd} />
      {children}
    </>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: exits 0.

- [ ] **Step 3: Verify JSON-LD renders for a real certificate page**

With `pnpm dev` running:
```bash
curl -s http://localhost:3000/certificates/python-essentials-1 | grep -o '<script type="application/ld+json">[^<]*</script>'
```
Expected: two blocks — one `"@type":"BreadcrumbList"`, one `"@type":"EducationalOccupationalCredential"` with `"name":"Python Essentials 1"`. Every `item`/`url` value should start with `https://hanseo.tech`, never `localhost`.

- [ ] **Step 4: Commit**

```bash
git add "app/certificates/[slug]/layout.tsx"
git commit -m "feat: add BreadcrumbList/EducationalOccupationalCredential JSON-LD and static params to certificate detail route"
```

---

### Task 9: Per-page metadata for `/projects`, `/certificates`, `/experience`

**Files:**
- Modify: `app/projects/page.tsx`
- Modify: `app/certificates/page.tsx`
- Modify: `app/experience/page.tsx`

All three are server components today (no `"use client"` directive — confirmed), so a top-level `metadata` export is valid in each.

- [ ] **Step 1: Add metadata to `app/projects/page.tsx`**

Add after the existing imports (after line 5):

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Selected full-stack and AI product engineering projects by Hans Amoguis, including Le Doux, Clarift, and SimplyNote.",
  alternates: {
    canonical: "/projects",
  },
};
```

- [ ] **Step 2: Add metadata to `app/certificates/page.tsx`**

Add after the existing imports (after line 5):

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Certificates",
  description:
    "Certifications and credentials earned by Hans Amoguis, including Cisco Networking Academy and competitive programming credentials.",
  alternates: {
    canonical: "/certificates",
  },
};
```

- [ ] **Step 3: Add metadata to `app/experience/page.tsx`**

Add after the existing imports (after line 3):

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Professional experience of Hans Amoguis — AI Solutions Development Intern at Eskwelabs and freelance full-stack development work.",
  alternates: {
    canonical: "/experience",
  },
};
```

- [ ] **Step 4: Type-check**

Run: `npx tsc --noEmit`
Expected: exits 0.

- [ ] **Step 5: Verify distinct titles/canonicals via view-source**

With `pnpm dev` running:
```bash
curl -s http://localhost:3000/projects | grep -o '<title>[^<]*</title>\|rel="canonical" href="[^"]*"'
curl -s http://localhost:3000/certificates | grep -o '<title>[^<]*</title>\|rel="canonical" href="[^"]*"'
curl -s http://localhost:3000/experience | grep -o '<title>[^<]*</title>\|rel="canonical" href="[^"]*"'
```
Expected: each shows its own `<title>Projects | Hans Amoguis</title>` / `Certificates | Hans Amoguis` / `Experience | Hans Amoguis`, and a canonical `href` ending in `/projects`, `/certificates`, `/experience` respectively (not `/`). These `alternates.canonical` values are relative paths resolved against `metadataBase` (which is `SITE_URL`), so they'll render as `https://hanseo.tech/projects` etc. in production — never `localhost`, regardless of what host you happen to be curling in dev.

- [ ] **Step 6: Commit**

```bash
git add app/projects/page.tsx app/certificates/page.tsx app/experience/page.tsx
git commit -m "feat: add distinct per-page metadata to projects/certificates/experience index pages"
```

---

### Task 10: Favicon replacement + web manifest

**Files:**
- Create: `app/icon.png`
- Create: `app/apple-icon.png`
- Create: `app/manifest.ts`
- Delete: `app/icon.svg`

The current `app/icon.svg` is 321,458 bytes (confirmed) — an oversized SVG wrapping a base64 PNG. It's replaced by two properly-sized PNGs generated from the existing portrait (`app/assets/myImages/hans.webp`).

- [ ] **Step 1: Generate the two icon PNGs with a one-off script**

Write a temporary script (not committed to the repo — scratchpad only):

`C:\Users\Asus\AppData\Local\Temp\claude\C--Users-Asus-Desktop-Portfolio-portfolio\338464b1-752f-4bc3-b9b6-49085e39acb1\scratchpad\generate-icons.mjs`:

```js
import sharp from "sharp";
import path from "node:path";

const projectRoot = process.cwd();
const source = path.join(projectRoot, "app/assets/myImages/hans.webp");

await sharp(source)
  .resize(512, 512, { fit: "cover" })
  .png({ palette: true, colors: 64 })
  .toFile(path.join(projectRoot, "app/icon.png"));

await sharp(source)
  .resize(180, 180, { fit: "cover" })
  .png({ palette: true, colors: 64 })
  .toFile(path.join(projectRoot, "app/apple-icon.png"));

console.log("icons written");
```

Run it from the project root (so `process.cwd()` resolves correctly and `sharp` resolves from the project's `node_modules`):

```bash
node "C:\Users\Asus\AppData\Local\Temp\claude\C--Users-Asus-Desktop-Portfolio-portfolio\338464b1-752f-4bc3-b9b6-49085e39acb1\scratchpad\generate-icons.mjs"
```
Expected: prints `icons written`; `app/icon.png` and `app/apple-icon.png` now exist.

- [ ] **Step 2: Verify combined size is under 50KB**

```bash
ls -la app/icon.png app/apple-icon.png
```
Expected: combined size under 50KB. If it exceeds 50KB, rerun the script with `colors: 32` (or drop `icon.png` to 256×256) and re-check — palette-quantized PNGs at these dimensions are well within budget for a photographic source, but if the source portrait is unusually high-contrast this is the fallback.

- [ ] **Step 3: Delete the oversized SVG icon**

```bash
rm app/icon.svg
```

- [ ] **Step 4: Add the web manifest**

```ts
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Hans Amoguis — Full-Stack Engineer",
    short_name: "Hans Amoguis",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
    theme_color: "#00E5FF",
    background_color: "#000000",
  };
}
```

- [ ] **Step 5: Verify favicon and manifest are linked in `<head>`**

With `pnpm dev` running (restart it if it was already running, so the new file-convention icons are picked up):
```bash
curl -s http://localhost:3000/ | grep -o '<link rel="[^"]*icon[^"]*"[^>]*>\|<link rel="manifest"[^>]*>'
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/manifest.webmanifest
```
Expected: `<link rel="icon" ...>`, `<link rel="apple-touch-icon" ...>` (auto-generated by Next from the file convention), and `<link rel="manifest" href="/manifest.webmanifest">`; the manifest URL returns `200`.

- [ ] **Step 6: Commit**

```bash
git add app/icon.png app/apple-icon.png app/manifest.ts
git rm app/icon.svg
git commit -m "feat: replace oversized SVG favicon with sized PNG icons and add web manifest"
```

---

### Task 11: Sitemap — add missing index routes

**Files:**
- Modify: `app/sitemap.ts`

**Interfaces:**
- Consumes: `SITE_URL` from `components/utils/externalLinks.ts` (Task 2).

- [ ] **Step 1: Replace the hardcoded `baseUrl` with `SITE_URL`**

Replace line 5:

```ts
const baseUrl = "https://hanseo.tech";
```

with:

```ts
import { SITE_URL } from "@/components/utils/externalLinks";

const baseUrl = SITE_URL;
```

(add the `import` at the top of the file alongside the existing `projects`/`certificates` imports; keep the local `baseUrl` name so the rest of the file is untouched).

- [ ] **Step 2: Add `/projects`, `/certificates`, `/experience` to `staticRoutes`**

Replace the `staticRoutes` array (lines 10-17):

```ts
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/certificates`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/experience`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: exits 0.

- [ ] **Step 4: Verify sitemap output**

With `pnpm dev` running:
```bash
curl -s http://localhost:3000/sitemap.xml | grep -o '<loc>[^<]*</loc>'
```
Expected: includes `https://hanseo.tech/`, `/projects`, `/certificates`, `/experience`, all 5 `/projects/<slug>` routes, and all 4 `/certificates/<slug>` routes — every `<loc>` starts with `https://hanseo.tech`, never `localhost`.

- [ ] **Step 5: Commit**

```bash
git add app/sitemap.ts
git commit -m "feat: add projects/certificates/experience index routes to sitemap; source domain from SITE_URL"
```

---

### Task 12: Full verification pass

**Files:** none (verification only)

- [ ] **Step 1: Lint**

Run: `pnpm lint`
Expected: exits 0.

- [ ] **Step 2: Build**

Run: `pnpm build`
Expected: exits 0.

- [ ] **Step 3: Confirm static generation of dynamic routes**

Inspect the build output route table (printed by `pnpm build`) for these rows:
```
app/projects/[slug]
app/certificates/[slug]
app/projects/[slug]/opengraph-image
app/certificates/[slug]/opengraph-image
```
Expected: each is marked as a static/SSG route (`●` or `○` in the Next 16 build summary), not `ƒ` (dynamic/server-rendered on demand).

- [ ] **Step 4: Confirm no hardcoded domain drift and no `localhost` in shipped source**

```bash
grep -rln "https://hanseo.tech" app lib components --include="*.ts" --include="*.tsx"
grep -rn "localhost" app lib components --include="*.ts" --include="*.tsx"
```
Expected: the first command returns only `components/utils/externalLinks.ts` (the single source of truth); every other file that needs the domain now goes through `SITE_URL`. The second command returns no matches — `localhost` must never appear in committed source.

- [ ] **Step 5: Validate JSON-LD with a schema validator**

Start `pnpm start` (production server) after the build, then fetch and check each page type has valid, parseable JSON-LD:
```bash
pnpm start &
sleep 2
curl -s http://localhost:3000/ | grep -oP '(?<=application/ld\+json">)[^<]*' | node -e "process.stdin.on('data', d => JSON.parse(d.toString()))"
curl -s http://localhost:3000/projects/le-doux | grep -oP '(?<=application/ld\+json">)[^<]*' | while read -r line; do echo "$line" | node -e "process.stdin.on('data', d => JSON.parse(d.toString()))"; done
curl -s http://localhost:3000/certificates/python-essentials-1 | grep -oP '(?<=application/ld\+json">)[^<]*' | while read -r line; do echo "$line" | node -e "process.stdin.on('data', d => JSON.parse(d.toString()))"; done
```
Expected: no `JSON.parse` errors (each line is valid JSON). For a fuller check, paste one page's raw JSON-LD block into Google's Rich Results Test (manual, outside this repo) — confirm zero errors, per the spec's Definition of Done. This manual step is not blocking; the automated `JSON.parse` check above is the repo-side gate.

- [ ] **Step 6: Visual regression check — no UI should change**

With the dev or prod server running, open in browser (or use the `agent-browser` skill):
- `/` — compare against current deployed look; layout, colors, animations identical.
- `/projects/le-doux` — same check.
- `/certificates/python-essentials-1` — same check.

Expected: pixel-identical to pre-change state (this plan only touches `<head>` metadata and net-new asset routes — zero visible-body changes).

- [ ] **Step 7: Stop dev/prod servers**

```bash
kill %1 2>/dev/null || true
```

- [ ] **Step 8: Final commit (if any stray formatting/lint fixes were needed)**

```bash
git status
```
If clean (all prior task commits already cover everything), no further commit needed. If `pnpm lint`/`build` required fixes not yet committed, commit them:
```bash
git add -A
git commit -m "fix: address lint/build issues found in SEO enhancements verification pass"
```

---

## Post-plan manual step (not part of this plan's scope)

Per the spec: once deployed, the user must manually verify the property in Google Search Console (replacing the `REPLACE_WITH_GOOGLE_SEARCH_CONSOLE_CODE` placeholder in `app/layout.tsx` with the real verification code from Settings → Ownership verification → HTML tag method) and submit `https://hanseo.tech/sitemap.xml`. This is explicitly out of this plan's scope — no code change is blocked on it.

If a staging/preview domain is ever needed, set `NEXT_PUBLIC_SITE_URL` in that environment's `.env.local` (or Vercel/Netlify environment variables) — every file that needs the origin already reads from `SITE_URL` (Task 2), so no code changes would be required.
