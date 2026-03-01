# AGENTS.md

This file guides coding agents working in this repository.
Scope: entire repo (`C:\Users\Asus\Desktop\Portfolio\portfolio`).

## Project Snapshot

- Framework: Next.js 16 (App Router) + React 19 + TypeScript (strict mode).
- Styling: Tailwind CSS v4 with CSS variables in `app/globals.css`.
- UI primitives: shadcn/ui conventions (`components.json`, `components/ui/*`).
- Animation/scroll stack: GSAP + ScrollTrigger + Lenis + Framer Motion.
- Package manager: npm (`package-lock.json` is committed).

## Source Layout

- `app/`: routes, layout, global CSS, and route-level pages.
- `components/`: feature UI split by domain (`layout`, `sections`, `projects`, `ui`, `providers`, `utils`).
- `lib/`: typed data/config helpers (projects, certificates, utils, animation constants).
- `public/`: static assets.

## Setup Commands

- Install deps: `npm install`
- Start dev server: `npm run dev`
- Build production: `npm run build`
- Start production server: `npm run start`
- Lint repo: `npm run lint`

## Build / Lint / Test Commands

### Build

- Full build: `npm run build`
- Run build then serve: `npm run build && npm run start`

### Lint

- Project lint: `npm run lint`
- Lint one file: `npx eslint app/page.tsx`
- Lint/fix one file: `npx eslint app/page.tsx --fix`
- Lint whole repo with fixes: `npx eslint . --fix`

### Type Checking

- Type-check without emit: `npx tsc --noEmit`

### Tests (Current Status)

- There is currently no test framework configured (no Jest/Vitest/Playwright config and no `*.test.*` files).
- There is no working `npm test` command at the moment.
- For validation today, use: `npm run lint` and `npx tsc --noEmit` and `npm run build`.

### Running a Single Test (When Tests Are Added)

Use the framework-native single-test command once a runner is introduced:

- Vitest single file: `npx vitest run path/to/file.test.ts`
- Vitest single test name: `npx vitest run -t "test name"`
- Jest single file: `npx jest path/to/file.test.ts`
- Jest single test name: `npx jest -t "test name"`
- Playwright single spec: `npx playwright test tests/example.spec.ts`
- Playwright single test title: `npx playwright test -g "test name"`

If you add a test framework, also add scripts to `package.json`:

- `"test"`: full suite
- `"test:watch"`: watch mode (unit tests)
- `"test:one"`: targeted single file/name helper

## Cursor / Copilot Rules

- `.cursorrules`: not found.
- `.cursor/rules/`: not found.
- `.github/copilot-instructions.md`: not found.
- No external agent-rule files are currently enforced beyond this document and repo configs.

## Code Style Guidelines

### General Principles

- Keep changes minimal and scoped; avoid broad refactors unless requested.
- Preserve existing architecture and naming in the touched area.
- Prefer readability over cleverness; avoid over-abstraction.
- Do not add headers/license blocks unless explicitly requested.

### TypeScript and Types

- `tsconfig` has `strict: true`; keep all new code type-safe.
- Prefer explicit interfaces/types for shared props and domain data.
- Use narrow unions/literal types when values are constrained.
- Avoid `any`; if unavoidable, isolate and document why in-line.
- Prefer typed utility helpers (example pattern: `cn(...inputs: ClassValue[])`).
- For route params in this codebase, follow existing Next 16 pattern used in pages (`params: Promise<{ slug: string }>` + `use(params)`).

### React / Next.js Conventions

- Add `"use client"` only when component needs hooks/browser APIs/event handlers.
- Keep server/client boundaries intentional; do not move large trees to client unnecessarily.
- Prefer small composable components in `components/` over monolithic page files.
- Use `notFound()` for missing dynamic resources where UX should be a 404.
- Keep provider wiring centralized in `app/layout.tsx` unless route-specific behavior is required.

### Imports

- Use `@/*` alias for internal imports (configured in `tsconfig.json`).
- Prefer absolute alias imports across folders; use relative imports for same-folder siblings when already established.
- Group imports in this order when practical:
  1) framework/external packages,
  2) internal alias imports,
  3) local relative imports,
  4) type-only imports.
- Remove unused imports; avoid duplicate import lines.

### Naming

- Components: PascalCase (`ProjectGallery`, `ThemeProvider`).
- Hooks: camelCase with `use` prefix (`useScrollManager`, `useHorizontalDrag`).
- Utility files/functions: descriptive camelCase (`browserInfo`, `getRuntimeEnv`).
- Constants: `UPPER_SNAKE_CASE` only for true compile-time constants; otherwise `const` camelCase.
- Route segment folders should remain lowercase and URL-safe.

### Formatting

- Follow existing file-local style for semicolons/quote usage; do not reformat unrelated files.
- Prefer double quotes in non-shadcn files if creating new code in app/lib/components areas that already use them.
- Keep JSX prop wrapping readable; avoid very long single-line JSX.
- Keep Tailwind class lists logically grouped (layout -> spacing -> typography -> color -> effects).
- Run lint after edits; use `--fix` only if it does not cause broad noisy diffs.

### UI and Styling

- Reuse design tokens and CSS vars from `app/globals.css` (`--primary`, `--background`, etc.).
- Prefer existing utility classes/components before introducing new custom CSS.
- Keep dark-mode behavior compatible with `next-themes` and existing `.dark` tokens.
- Maintain responsiveness and avoid regressions in mobile/webview behavior.

### Data and Domain Objects

- Keep structured content typed in `lib/*` (projects/certificates/etc.).
- Co-locate related type definitions with domain data when practical.
- When extending data models, update all rendering consumers in `app/` and `components/`.

### Error Handling and Edge Cases

- Fail gracefully for missing content: prefer `notFound()` for dynamic routes.
- Guard browser-only APIs with runtime checks when code can execute during SSR.
- For optional links/media, render conditionally rather than assuming existence.
- Avoid swallowing errors silently; at minimum, keep behavior deterministic and user-safe.

### Performance and Animation

- Keep GSAP/Lenis/ScrollTrigger lifecycle cleanup explicit in effects.
- Avoid creating duplicate animation instances on re-render.
- Use `requestAnimationFrame` and cleanup patterns consistent with existing providers/hooks.
- Prefer route-level transitions/components already in repo (`PageTransition`, `TransitionProvider`).

### Accessibility and UX

- Ensure interactive elements remain keyboard accessible.
- Preserve visible focus styles (Tailwind/variant classes already support this in UI primitives).
- Always provide meaningful `alt` text for images.
- Keep motion tasteful; avoid blocking core navigation/content.

## Change Checklist for Agents

- Run `npm run lint`.
- Run `npx tsc --noEmit` for typed changes.
- Run `npm run build` for route/config/provider-level changes.
- Confirm no accidental edits to unrelated files.
- Summarize touched files and behavior changes in your handoff.
