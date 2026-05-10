# Visual Direction

## Visual Moodboard Description
**"Cyber-Editorial"**
Imagine a high-end architecture magazine merged with a futuristic tech interface. The foundation is deep, inky black. Typography is sharp, massive, and confident. Content is organized on a strict grid but intentionally breaks the grid for emphasis. The primary accent, Ice Blue, is used sparingly—like a laser cutting through the dark—for hover states, progress indicators, and key interactions.

## Layout Style
- **Asymmetric and Structured:** Use a strong underlying grid (e.g., 12-column) but place content asymmetrically to create visual interest.
- **Generous Black Space:** Sections should breathe. Elements shouldn't feel cramped. Use massive padding (`py-32` or `py-48`) between major chapters.
- **Cinematic Framing:** Treat each homepage section as a distinct "scene" that occupies the full viewport (`min-h-screen`) before allowing the user to scroll to the next.

## Motion Style
- **Silky and Deliberate:** Animations must feel expensive. No bouncing, no frantic snapping.
- **Scroll-Tied Progression:** Use Lenis for smooth scrolling. Use GSAP for elements that fade in and translate up slightly (`y: 20`, `opacity: 0` to `1`) as they enter the viewport.
- **Parallax:** Very subtle parallax on background elements or large typographic watermarks.

## Imagery Approach
- **Desaturated or Tinted:** Project screenshots should be high-resolution but perhaps slightly desaturated or treated with a subtle blue/dark overlay to match the dark theme, revealing full color on hover.
- **Abstract Tech Visuals:** If lacking a high-res personal portrait, use sleek, abstract geometric shapes or wireframe data visualizations (canvas/WebGL) to represent the AI/Architecture focus.

## Spacing and Hierarchy Principles
- **8pt Grid System:** All spacing should be multiples of 8.
- **Exaggerated Contrast:** Huge headers paired with small, readable body copy. There should be no ambiguity about what the user should read first.

## Adapting Inspiration Without Copying
- **The Charles Leclerc Site:** Uses stark full-bleed images, tight red accents, and a distinct numbered sidebar.
- **Hanseo Implementation:** We adopt the *numbered sidebar* and *full-bleed pacing*, but swap the photography-heavy approach for a *typography-heavy* and *UI-heavy* approach. The red becomes Ice Blue, the racing imagery becomes sleek code snippets, architectural diagrams, or polished product mockups.
