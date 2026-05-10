# Responsive Behavior

## Mobile-First Layout Strategy
- All base CSS classes in Tailwind will target mobile devices first (`< 768px`).
- The mobile experience must feel native: large touch targets (min 44x44px), legible typography (16px minimum for body text), and simplified navigation (hamburger menu or bottom bar).

## Tablet Adjustments (md: >= 768px)
- **Layouts:** Single columns transition to 2-column grids for project lists or skill categories.
- **Typography:** Headlines scale up.
- **Navigation:** The mobile menu transitions into standard inline links if space permits.

## Desktop Enhancements (lg: >= 1024px, xl: >= 1280px)
- **The Cinematic Experience:** This is where the asymmetric layouts, pinned chapter navigations, and complex hover states come alive.
- **Grids:** Expand to 3 or 4 columns for dense data (like the tools list or certificates).
- **Whitespace:** Maximize margins and padding. The design should utilize the large canvas without filling every pixel.

## What Must Change at Each Breakpoint

| Component | Mobile (<768px) | Tablet (768px - 1024px) | Desktop (>1024px) |
| :--- | :--- | :--- | :--- |
| **Hero Title** | 3.5rem, stacked | 4.5rem, stacked | 6rem+, potential single line |
| **Navigation** | Hamburger overlay | Inline top nav | Top nav + Pinned Side Chapter Nav |
| **Project Cards** | Vertical stack or horizontal snap | 2-column grid | Asymmetric layout, distinct sizes |
| **Animations** | Simple fades | Fades + slight translations | Full GSAP ScrollTrigger orchestration |
| **Custom Cursor** | Disabled | Disabled | Enabled (if implemented) |
