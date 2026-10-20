# `/resources` page — design

**Date:** 2026-10-20
**Status:** DRAFT
**Docket:** `docs/dockets/portfolio-refresh-docket.md` · R5
**Scope:** new route `app/resources/`, new `lib/resources.ts`, a projection in `lib/content/collection-projections.ts`, `lib/destinations.ts`, global nav, `app/sitemap.ts`.

## Purpose

A lean page showing what Hans learns from and works with: creators, agent skills, and tools.
It is personal context for a recruiter or peer. It is not a link farm and it adds no project
claims.

## Out of scope

- Blog, newsletter, or affiliate links.
- Descriptions of other people's work beyond one line.

## 1. Content

All URLs were checked on 2026-10-20. Notes in quotes are **draft copy, pending Hans's okay**.
An entry ships without a note rather than with an unapproved one.

**Creators**

| Name | Primary link | Also | Draft note |
|---|---|---|---|
| Matt Pocock | youtube.com/@mattpocockuk | github.com/mattpocock | "TypeScript and agent workflows. My skills setup starts from Matt's." |
| Lauren Tan | x.com/poteto | github.com/poteto | "React Compiler core team." The X URL returned 404 to curl, which X does to bots, so check it in a browser |
| Better Stack | youtube.com/@betterstack | — | "Infra and observability explained fast." |
| IBM Technology | youtube.com/@IBMTechnology | — | "Clear whiteboard explainers on AI and systems." |
| Nate Herk | youtube.com/@nateherk | — | "AI automation builds." |
| Codehead | youtube.com/@codehead01 | — | — |
| The AI Automators | youtube.com/@theaiautomators | — | "RAG and agent pipelines in practice." |

**Skills.** These are two groups that share one heading, each with a repo link.

- Matt Pocock's skills, at github.com/mattpocock/skills: `grill-me`, `to-tickets`, `wayfinder`,
  `grill-with-docs`, `to-spec`. Each links to its folder (`skills/engineering/…` or
  `skills/productivity/…`).
- Hans's adapted skills, at github.com/Hanseooo/hanseo-skills: `han-grill`, `han-to-spec`,
  `han-to-tickets`. Optionally also `charter`, `docket`, `product-discovery`, and `stint`, which
  are in the same repo. Hans picks which ones to list.

**Tools**

| Name | Plan | Link |
|---|---|---|
| Claude Code | Pro | claude.com/claude-code |
| Codex | Plus | openai.com/codex |
| Orca | — | onorca.dev |
| herdr | — | herdr.dev |

## 2. Data module

`lib/resources.ts` is the single source of truth and follows the shape of the existing `lib/*.ts`
records:

```ts
export type ResourceGroupId = "creators" | "skills" | "tools";

export type ResourceEntry = {
  name: string;
  href: string;
  note?: string;         // approved one-liner, or absent
  meta?: string;         // real metadata only: "Pro plan", "YouTube", repo path
  secondary?: { label: string; href: string };
};

export type ResourceGroup = {
  id: ResourceGroupId;
  title: string;
  entries: ResourceEntry[];
  sources?: { label: string; href: string }[]; // repo links for Skills
};

export const resourceGroups: ResourceGroup[] = [ /* … */ ];
```

`getResourceGroups()` in `collection-projections.ts` passes the groups through unchanged. It
exists because S6 routes pages through projections. Don't add a second layer.

## 3. Layout

The page uses the S4 page family: `PageFamilyFrame` + `CompactMasthead` (parent "Home", title
"Resources", metadata "3 lists"). It should not read like a template, so the body is asymmetric:

- **Desktop (12 col):** a sticky left rail (cols 1–4) holds the three group titles in Anton.
  Each title links to its group, and the active one gets a red rule. One `Arc` (R3 geometry)
  swings from the rail toward the first list. Lists take cols 6–12, so col 5 stays empty as a
  gutter.
- **Groups:** each group is an indexed register: mono `01`, `02`, … per row, the name in Inter
  600, the note in Inter secondary, and `meta` in mono on the right. Rows are separated by
  `divide-y` rules. No cards (S2).
- **Zones (R3 §3):** the rail is the expressive zone: Anton titles, the `Arc`, and optionally a
  red or ink field behind the active title. The lists are reading zones and stay ivory.
- **Tablet (8 col):** the rail becomes a horizontal in-page index above the lists and stops being
  sticky.
- **Mobile (4 col):** one column. Group titles inline. Geometry removed.

## 4. Show three, fade the fourth, expand

Hans asked for this behavior. It applies to every group with more than four entries:

- Rows 1–3 show in full. Row 4 renders under a mask (`mask-image: linear-gradient(to bottom,
  black, transparent)`) and has `aria-hidden="true"` and `inert` while collapsed. Rows 5 and up
  stay in the DOM with the `hidden` attribute, so the markup always holds the full list.
- Below it sits a `<button aria-expanded="false" aria-controls="<group>-list">` labeled
  "Show all 7 creators". On expand the button reads "Show fewer", row 4 loses the mask and
  `inert`, the rest of the rows appear, and focus stays on the button.
- With four entries or fewer there is no button and no fade.
- Motion: row height animates with Framer `AnimatePresence` (S5 presence ownership). Under
  reduced motion it switches instantly.
- This does not conflict with S4's "no Show all". That rule covers project evidence, and this
  page is not evidence.

One component owns this: `components/routes/ResourceGroupList.tsx`. It is a client leaf. The
page itself stays a server component.

## 5. Wiring

- `lib/destinations.ts`: add `"resources"` to `DestinationId` and `DESTINATIONS`, pathname
  `/resources`, label "Resources".
- Global nav and mobile menu: add "Resources" after Certificates. Both read `DESTINATIONS`, so
  check that nothing else hardcodes the list (`rg "certificates" components/shell`).
- `app/sitemap.ts`: add `/resources`.
- `app/resources/opengraph-image.tsx`: reuse `lib/og-image.tsx` like `app/experience`.
- Metadata: title "Resources", description "Creators, agent skills, and tools Hans Amoguis
  learns from and works with.", canonical `/resources`.
- External links: `target="_blank" rel="noopener noreferrer"`, with a visually hidden
  "(opens in new tab)".

## Tickets

| Id | Ticket | Done when |
|---|---|---|
| R5-1 | `lib/resources.ts` with the §1 content (approved notes only) | `pnpm build` passes. Every `href` returns < 400 in a curl loop, except x.com, which is checked by hand |
| R5-2 | `/resources` route with masthead, rail, and registers | Renders at 1440, 768, and 375 in light and dark. Tab order: masthead, rail, groups, buttons |
| R5-3 | `ResourceGroupList` show-3, fade-4, expand | Keyboard: Enter on the button expands, `aria-expanded` flips, and focus stays. The faded row is not reachable by Tab while collapsed. Reduced motion has no animation |
| R5-4 | Destination, nav, sitemap, OG, metadata | `/resources` is in the nav on desktop and mobile, in `sitemap.xml`, and the OG image renders |
