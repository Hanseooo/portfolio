# UX & Interactions

## Scroll Behavior
- **Smooth Scrolling:** Implement Lenis to ensure a buttery smooth, standardized scroll experience across different mice and trackpads.
- **Scroll Hijacking:** Avoid full scroll hijacking. Allow the user to scroll freely, but use GSAP ScrollTrigger to tie animations to the scroll position.

## Reveal Animations
- Elements should be initially hidden (`opacity-0`, `translate-y-8`) and only reveal when they enter the bottom 15% of the viewport.
- Stagger reveals for groups of items (e.g., a list of tools or project cards).

## Section Transitions
- **The Cinematic Fade:** As the user scrolls from one chapter to the next, the background remains solid black, but the content of the new chapter fades and slides up.
- **Chapter Titles:** The large chapter number (e.g., `02`) can be pinned to the background using `position: sticky` or GSAP Pinning while the content scrolls past it, reinforcing the chapter theme.

## Hover States
- Buttons and links should transition smoothly (`duration-300`).
- **Custom Cursor (Optional):** A small, ice-blue dot that follows the mouse, expanding into an outlined circle when hovering over clickable elements. This adds a layer of extreme polish if implemented without lagging.

## Mobile Interaction Behavior
- Remove custom cursors on touch devices.
- Reduce animation complexity (fewer translations, mostly opacity fades) to preserve battery and performance.
- Horizontal scroll areas (snap-x) for project galleries or tool lists to save vertical space.

## Loading / Initial Impression
- **Preloader:** A very brief (1-1.5s) initial loading sequence. Perhaps a minimal Ice Blue line drawing or a counter from 0 to 100%, followed by the Hero text revealing itself character by character or word by word. This sets the stage that the user is about to view an "experience," not just a webpage.
