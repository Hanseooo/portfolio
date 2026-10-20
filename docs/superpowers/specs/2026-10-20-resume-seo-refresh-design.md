# Resume access and SEO refresh — design

**Date:** 2026-10-20
**Status:** DRAFT
**Docket:** `docs/dockets/portfolio-refresh-docket.md` · R6
**Scope:** `public/AMOGUIS_RESUME.pdf`, `components/shell/GlobalNav*.tsx`, `MobileMenu.tsx`, `SceneIdentity`, `SceneContact`, `lib/content/homepage-projections.ts`, `app/layout.tsx`, `app/sitemap.ts`, route metadata.
**Follows:** `2026-07-07-seo-enhancements-design.md` and `2026-08-05-seo-share-cards-design.md`. Their decisions stand unless changed here.

## 1. Resume access

**Phone number:** decided. Publish a web copy without the phone line. Hans exports it from the resume
source and replaces `public/AMOGUIS_RESUME.pdf`. The full version stays for direct
applications. Check: the PDF text has no `+63`.

**Placement.** There are three entry points, and every one reads a single constant:

| Where | Control |
|---|---|
| Global nav (desktop) | A text link "Resume" after the route links, with a ↗ glyph |
| Mobile menu | The same link, last item before the theme control |
| Hero actions | A secondary button "Resume" next to the existing contact action |
| Contact | A fourth channel next to email, LinkedIn, and GitHub |

- Add `RESUME_URL = "/AMOGUIS_RESUME.pdf"` to `components/utils` beside `GITHUB_URL` and
  `LINKEDIN_URL`. Add `{ type: "resume", label: "Resume", href: RESUME_URL }` to
  `getHomepageContact().channels`. `ContactChannel["type"]` widens by one member.
- Open in a new tab (`target="_blank" rel="noopener"`). The accessible name is "Resume (PDF,
  opens in new tab)". Don't use `download`: recruiters preview first, and the browser viewer
  has its own download.
- The route handoff overlay must skip this link, since it is not an internal route. Check
  `HandoffLink` eligibility: a `.pdf` path under `/` could be treated as internal.

## 2. Headline

Decided: match the resume. `SITE_HEADLINE = "AI Engineer · Full-Stack Developer"`, defined once in
the identity projection. It feeds:
- the hero role line
- `metadata.title`
- OG and Twitter titles
- JSON-LD `jobTitle`

Today these four are typed separately in `app/layout.tsx` (lines 29, 64, 74, 85).

"Applied AI" carries the positioning in prose. Draft home description, pending approval: "Hans
Amoguis builds applied AI products end to end, from LangGraph pipelines and RAG to the
Next.js and FastAPI apps around them." No metrics.

## 3. Structured data

- `Person` JSON-LD:
  - `jobTitle` comes from `SITE_HEADLINE`.
  - `knowsAbout` comes from `lib/skills.ts` (R3 §6), not a hand list.
  - `alumniOf` is `{ "@type": "CollegeOrUniversity", name: "Holy Cross of Davao College" }`.
  - `affiliation` is DurianPy.
  - Keep `sameAs`.
- One `CreativeWork` (`SoftwareSourceCode` where a repo exists) per project detail page:
  `name`, `description` (the subtitle), `url`, `codeRepository`, `author` → the Person `@id`.
  Use the existing `components/seo/JsonLd`.
- Don't add `Review`, `AggregateRating`, or metrics markup.

## 4. Metadata and sitemap

- `app/experience/page.tsx` description names only Eskwelabs and freelance. Add DurianPy.
- `/projects/story-buddy` gets metadata and an OG image through the existing per-project
  generator.
- `app/sitemap.ts` sets `lastModified: now` on every entry, so every crawl sees "everything
  changed". Use a fixed date per source: a `updated` field on each project record, falling back
  to the release date of the latest content change. Static routes get a single
  `CONTENT_UPDATED` constant that is bumped by hand when copy changes.
- Add `/resources` (R5).
- Home description: rewrite from the R1 register after the headline decision. No ~80%.

## 5. Out of scope

- Blog or articles for SEO.
- Search Console setup (outside the repo).

## Tickets

| Id | Ticket | Done when |
|---|---|---|
| R6-1 | Resume link in nav, mobile menu, hero, and contact from one constant | `rg "AMOGUIS_RESUME" components lib` shows one definition. Clicking it opens the PDF in a new tab with no route overlay |
| R6-2 | `SITE_HEADLINE` single source | `rg "Full-Stack Engineer|AI Engineer" app components lib` returns only the constant |
| R6-3 | JSON-LD updates and per-project `SoftwareSourceCode` | Google Rich Results test (manual) parses Person and a project page without errors |
| R6-4 | Metadata and sitemap per §4 | Two `curl /sitemap.xml` calls a minute apart return identical `lastmod` values |
