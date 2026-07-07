# SEO Enhancements — Design Spec

Date: 2026-07-07
Status: Approved, ready for implementation planning

## Goal

Improve the portfolio's discoverability and link-share quality, split evenly between two objectives:
1. **Branded search** — "Hans Amoguis" / "Hanseo" should resolve clearly to this site and its owner.
2. **Social share quality** — links to the homepage, any project, or any certificate should render a real preview card (image + title) in Messenger, LinkedIn, Twitter/X, Discord, Slack, iMessage, etc., instead of a bare text link.

No analytics/traffic tracking is in scope. Backlink building, content/blog strategy, and ranking for competitive unbranded terms (e.g. "full-stack engineer portfolio") are explicitly **out of scope** — those are driven by off-page activity (other sites linking in, content cadence, domain authority), not by anything fixable in this repo. See "Is this enough?" below.

## Is this enough for name discoverability?

Yes, for the branded-name goal. Person schema + `sameAs` links to GitHub/LinkedIn + consistent per-page canonical/titles + Search Console verification (added per Section 4) cover the standard signals Google uses to associate a name query with a specific entity site. No further code changes are proposed for this goal — the remaining lever is a manual one: after deploying, verify the property in Search Console and submit `sitemap.xml` so Google is prompted to index rather than discovering it passively. That's a one-time manual action, not part of this spec's code changes.

---

## Section 1: OG/Twitter preview images

**Mechanism:** Next.js file-convention `opengraph-image.tsx` routes, rendered via `next/og`'s `ImageResponse` (Satori + resvg), generated once at `next build` time per static route (not per-request).

**Why screenshots need pre-conversion:** Satori embeds images as opaque `<image>` tags in an SVG for resvg to rasterize; resvg's `.webp` decoding is not reliably bundled. Every source hero/certificate image is `.webp` (one certificate is `.jpg`). To avoid depending on resvg's format support, each generator reads the source file straight off disk via `fs.readFile` and re-encodes it to PNG with `sharp` (already present as a transitive dependency of Next's image pipeline — no new package) before handing it to Satori as a base64 data URI.

**Twitter cards:** no separate `twitter-image.tsx` files. Per the Twitter Card spec, when `twitter:image` is absent the parser falls back to `og:image` — standard behavior across Twitter/X, and mirrored by Discord/Slack/iMessage unfurlers. The existing `twitter: { card: "summary_large_image" }` block in each metadata object is sufficient; adding the OG image file is enough to populate both platforms.

**Shared renderer — `lib/og-image.tsx`:**
```ts
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function renderOgImage(opts: {
  kicker: string;        // small label, e.g. "PROJECT" / "CERTIFICATE" / "HANS AMOGUIS"
  title: string;
  subtitle?: string;
  imagePath?: string;    // repo-relative path to a screenshot/portrait; omit for text-only
}): Promise<ImageResponse>
```
Layout: dark card (`#000000` background, matching the site's dark theme), left ~440px panel with kicker (monospace, ice-blue `#00E5FF`) / title (bold, `#FAFAFA`) / subtitle (muted gray) / "Hans Amoguis — hanseo.tech" footer line; right ~760px panel is the source image (`object-fit: cover`, resized via `sharp`) with a left-edge gradient scrim (`#000000` → transparent) so text stays legible regardless of the screenshot's own colors. When `imagePath` is omitted, the text panel expands to the full 1200px width.

**Data model change:** add `ogImageSrc: string` to the `Project` type (`lib/projects.ts`) and `Certificate` type (`lib/certificates.ts`) — the repo-relative disk path to the raw hero/certificate file (e.g. `"app/assets/projects/leDoux/hero.webp"`, `"app/assets/certificates/eskwelabs-cert.jpg"`). Required field, so TypeScript forces it to be filled in for any new entry. Needed because `fs.readFile` requires a real filesystem path, and the existing `StaticImageData` import only exposes a bundler-relative URL at runtime, not a disk path.

**New route files (all thin wrappers around `renderOgImage`):**
| File | kicker | title | subtitle | imagePath | generateStaticParams |
|---|---|---|---|---|---|
| `app/opengraph-image.tsx` | "HANS AMOGUIS" | "Full-Stack Engineer" | site tagline | `app/assets/myImages/hans.webp` | n/a |
| `app/projects/opengraph-image.tsx` | "HANS AMOGUIS" | "Projects" | — | same portrait | n/a |
| `app/certificates/opengraph-image.tsx` | "HANS AMOGUIS" | "Certificates" | — | same portrait | n/a |
| `app/experience/opengraph-image.tsx` | "HANS AMOGUIS" | "Experience" | — | same portrait | n/a |
| `app/projects/[slug]/opengraph-image.tsx` | "PROJECT" | `project.title` | `project.subtitle` | `project.ogImageSrc` | yes, from `projects` |
| `app/certificates/[slug]/opengraph-image.tsx` | "CERTIFICATE" | `certificate.title` | `certificate.issuer` + date | `certificate.ogImageSrc` | yes, from `certificates` |

Without their own file, `/projects`, `/certificates`, `/experience` would otherwise inherit the root `opengraph-image.tsx` and all look identical to the homepage share card when linked — the four index-level files above fix that by swapping only kicker/title text on the same portrait background.

---

## Section 2: Structured data (JSON-LD)

**Shared component — `components/seo/JsonLd.tsx`:** renders `<script type="application/ld+json">{JSON.stringify(data)}</script>` from a passed-in object. No dependency needed.

**Global, in `app/layout.tsx`:**
- **Person** — `name: "Hans Amoguis"`, `alternateName: "Hanseo"`, `jobTitle: "Full-Stack Engineer"`, `url: "https://hanseo.tech"`, `sameAs: [GITHUB_URL, LINKEDIN_URL]` (reusing `components/utils/externalLinks.ts`), `image` (portrait).
- **WebSite** — `name`, `url`, `author` referencing the Person node above.

**Per project detail page (`app/projects/[slug]/layout.tsx`), alongside the existing `generateMetadata`:**
- **BreadcrumbList** — Home → Projects → `{project.title}`.
- **CreativeWork** — `name`, `description` (subtitle), `image`, `url`, `author` (Person ref), `keywords` (from `project.stack`). Generic-but-correct type for a case study; schema.org has no more specific "software project" type.

**Per certificate detail page (`app/certificates/[slug]/layout.tsx`):**
- **BreadcrumbList** — Home → Certificates → `{certificate.title}`.
- **EducationalOccupationalCredential** — the schema.org type built specifically for this: `name`, `recognizedBy` (Organization, from `certificate.issuer`), `dateCreated` (from `certificate.date`), `url` (`certificate.credentialUrl` if present).

---

## Section 3: Metadata & infrastructure cleanup

**Per-page metadata** — add `export const metadata` to `app/projects/page.tsx`, `app/certificates/page.tsx`, `app/experience/page.tsx`: own title (e.g. `"Projects | Hans Amoguis"`), own description, and `alternates.canonical` pointing to that page's own path instead of inheriting the root's `/` (currently a canonical mismatch/duplicate-content signal).

**Static pre-rendering** — add `generateStaticParams` (returning all slugs) to `app/projects/[slug]/layout.tsx` and `app/certificates/[slug]/layout.tsx`, so these routes build as static HTML rather than relying purely on client hydration. Matching `generateStaticParams` also needed on the two `[slug]/opengraph-image.tsx` files from Section 1.

**Favicon & manifest:**
- Replace `app/icon.svg` (321KB — an SVG wrapping a base64-encoded PNG with leftover Adobe XMP metadata) with a properly sized, stripped icon: `app/icon.png` + `app/apple-icon.png`, generated from the same source portrait.
- Add `app/manifest.ts` (Next file-convention: `MetadataRoute.Manifest`) — `name`, `short_name`, `icons`, `theme_color: "#00E5FF"`, `background_color: "#000000"`.

**Sitemap** (`app/sitemap.ts`): add the missing `/projects`, `/certificates`, `/experience` index routes (currently only project/certificate detail routes and `/` are listed). `lastModified` stays `new Date()` — none of the data models track a real "last updated" timestamp, and adding one is scope creep beyond this pass (flagged, not fixed).

---

## Section 4: Google Search Console verification

Add `verification: { google: "<VERIFICATION_CODE>" }` to the root `metadata` export in `app/layout.tsx`. The verification code itself must come from the user's own Search Console property setup (Settings → Ownership verification → HTML tag method) — it's a public, non-secret string, safe to hardcode directly in the metadata object (no env var needed). This spec ships the field wired up with a placeholder; the user fills in the real code before/after deploy and then manually submits `https://hanseo.tech/sitemap.xml` in Search Console.

---

## Definition of Done

- [ ] `lib/og-image.tsx` shared renderer exists; `Project`/`Certificate` types have `ogImageSrc`, populated for every existing entry (5 projects, 4 certificates).
- [ ] Visiting each of these routes' `opengraph-image` output (via `next build` + checking `.next` output, or a debug fetch in dev) renders a 1200×630 PNG with legible text over the correct background image, for: `/`, `/projects`, `/certificates`, `/experience`, at least 2 sample `/projects/[slug]`, at least 2 sample `/certificates/[slug]`.
- [ ] Pasting any of the above URLs into a social-preview debugger (e.g. Facebook Sharing Debugger / Twitter Card Validator, or a local `curl` inspection of the rendered `<head>`) shows the correct `og:image`, `og:title`, `og:description` tags, and Twitter falls back to the same image.
- [ ] `app/layout.tsx` includes Person + WebSite JSON-LD; validated with Google's Rich Results Test (or schema.org validator) with zero errors.
- [ ] Each project detail page includes valid BreadcrumbList + CreativeWork JSON-LD; each certificate detail page includes valid BreadcrumbList + EducationalOccupationalCredential JSON-LD.
- [ ] `/projects`, `/certificates`, `/experience` each have a distinct `<title>`, `<meta name="description">`, and self-referencing canonical (verified via view-source, not inherited from `/`).
- [ ] `app/projects/[slug]` and `app/certificates/[slug]` (and their og-image routes) are statically generated at build time — confirmed via `next build` output listing them as static (`●`/`○`) rather than dynamic (`λ`) routes.
- [ ] `app/icon.svg` is replaced; new favicon files are under 50KB combined; `app/manifest.ts` exists and is linked (verify via browser devtools Application tab or view-source `<link rel="manifest">`).
- [ ] `sitemap.xml` includes `/`, `/projects`, `/certificates`, `/experience`, and every project/certificate detail route.
- [ ] `verification.google` field present in root metadata (placeholder acceptable if user hasn't obtained the real code yet; task isn't blocked on it).
- [ ] `npm run lint && npm run build` both exit 0.
- [ ] Manual verification in browser: homepage and at least one project/certificate page visually unaffected (this is a metadata/head-only change; no visible UI should change).

## Out of scope (flagged, not built)

- Analytics / page-view tracking.
- Backlink building, guest posts, portfolio-directory submissions.
- Blog/content section for ranking unbranded search terms.
- `lastModified` accuracy in the sitemap (would require an `updatedAt` field on every project/certificate).
- Screenshot art-direction beyond a simple cover-fit crop (no manual per-image cropping pass).
