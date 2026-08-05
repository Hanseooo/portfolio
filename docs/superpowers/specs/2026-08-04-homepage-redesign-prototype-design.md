# Homepage Redesign Prototype Design

**Date:** 2026-08-04  
**Status:** Approved for prototype specification review  
**Scope:** Standalone homepage comparison only. The live Next.js homepage, routes, and shared production components remain unchanged.

## Goal

Create an HTML comparison that helps select a hiring-focused homepage direction for Hanseo, a senior full-stack and AI product engineer. The prototype must make the portfolio feel more personal without weakening technical credibility.

## Audience and success criteria

Primary viewers are hiring managers, recruiters, and engineering leaders. In the first viewport, they should understand who Hanseo is, what he builds, and how to make contact. The selected direction should feel distinctive, calm enough to scan, and credible as a demonstration of product-engineering taste.

## Shared visual system

- **Default theme:** warm ivory surfaces with saturated signal red (`#e10600`). Red may occupy large hero or chapter fields; ivory provides reading space and relief.
- **Dark counterpart:** near-black surfaces with ice blue (`#00E5FF`), preserving the site’s established two-theme intent.
- **Composition:** structured editorial grid, oversized display typography, compact mono metadata, sharp rules, minimal corner radii, and no decorative glass effects or generic card grids.
- **Tone:** assured, specific, and human. Use a first-person sentence and concise proof points rather than an impersonal agency voice.
- **Motion in the prototype:** CSS-only, subtle opacity and transform reveals. A `prefers-reduced-motion` media query disables nonessential animation.

## Two compared directions

### A. Red Signal, recommended

A full red hero carries the immediate identity statement. A large portrait treatment intersects the type, followed by an ivory evidence surface. The layout uses the most red and gives the strongest first impression, while project outcomes and architecture proof quickly anchor it in senior-level substance.

### B. Editorial Red

Ivory dominates. Red appears through oversized chapter numbers, typographic crops, rules, and selected project fields. The portrait reads as a magazine feature within the grid. This variation is warmer and more personal, but quieter than Red Signal.

Both variations retain a numbered-storytelling motif and include a compact dark-mode hero preview. The prototype will identify the recommended direction and give visible comparison notes.

## Prototype structure

The standalone file will be `prototypes/homepage-redesign-variations.html` and will contain:

1. A short comparison header explaining the audience and theme system.
2. A complete desktop-oriented Red Signal homepage scene: nav, hero, credibility strip, selected-work evidence, and contact close.
3. A complete Editorial Red homepage scene with the same information order for fair comparison.
4. A compact dark/ice-blue theme counterpart preview.
5. Responsive styles for narrow screens, where visual panels stack and large display type scales down without horizontal overflow.

The repository contains no personal portrait asset. To avoid fabricating a photograph or fetching an external image, the prototype will use an explicit art-directed portrait placeholder. It will be designed as a photograph slot, not presented as Hanseo’s likeness, and can be replaced with an approved image later without layout changes.

## Content and data

All copy is static, realistic prototype content. No API calls, live activity data, analytics, or new dependencies are used. Existing project-page data is not modified.

## Accessibility and failure handling

The HTML will use semantic landmarks, descriptive labels, visible focus states, sufficient contrast, keyboard-reachable links, and the reduced-motion fallback. If the portrait image is unavailable, the placeholder remains intentionally legible and does not collapse the layout.

## Validation

Validate the standalone prototype by opening it in a browser at desktop and mobile widths, checking the light and dark sections, keyboard focus visibility, absence of overflow, and reduced-motion behavior. Run the repository lint and production build afterward to verify the added static artifact does not affect the existing application.
