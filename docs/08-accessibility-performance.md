# Accessibility & Performance

## Semantic Structure
- Ensure proper use of HTML5 landmarks: `<header>`, `<main>`, `<section>`, `<footer>`, `<nav>`.
- Use a strict heading hierarchy. Only one `<h1>` per page (The Hero title).
- Ensure all interactive elements (buttons, links) are semantic `<button>` or `<a>` tags, not `<div>`s with onClick handlers, to ensure screen reader compatibility.

## Keyboard Navigation
- The visual focus state must be clear. Override default browser outlines with a custom `focus-visible:ring-2 focus-visible:ring-accent-primary` utility.
- Include a visually hidden "Skip to main content" link at the very top of the DOM.

## Contrast Requirements
- While the design is dark and moody, critical text must pass WCAG AA contrast standards (4.5:1 for normal text).
- `text-zinc-600` on black may be borderline; ensure any text meant to be read (not just decorative) is at least `text-zinc-400`.

## Reduced Motion Handling
- **Crucial:** Respect the `prefers-reduced-motion` media query.
- If a user has reduced motion enabled in their OS:
  - Disable Lenis smooth scrolling.
  - Disable GSAP parallax and translations (`y` movement).
  - Fallback animations to simple, quick opacity fades, or disable them entirely.

## Image Optimization
- All project screenshots and visuals must use Next.js `<Image>` component for automatic WebP/AVIF conversion, resizing, and caching.
- Priority loading (`priority={true}`) for Hero images.

## Performance Budget Suggestions
- **Target:** Lighthouse score of 95+ across all categories.
- **Bundle Size:** Heavily monitor the JS bundle size. Lazy load non-critical libraries. GSAP and Lenis add weight, so ensure they are loaded efficiently and not blocking the initial paint.
- **Fonts:** Self-host fonts or use `next/font` to eliminate layout shift (CLS) and optimize loading.
