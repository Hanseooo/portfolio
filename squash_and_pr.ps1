git add .
git commit -m "temp"

# Ensure we are fully up to date with tracking (assuming origin/main is the base)
git reset --soft origin/main
git restore --staged .

# Group 1: Core
git add app/fonts.ts app/globals.css lib/
git commit -m "feat(core): implement design tokens, capability policies, and content runtime"

# Group 2: Motion
git add components/motion/ components/shell/ components/transitions/ components/ui/ components/frames/ components/layout/
git commit -m "feat(motion): motion primitives, shell, and transitions"

# Group 3: Homepage
git add components/homepage/ components/sections/ app/assets/
git commit -m "feat(homepage): redesign homepage scenes and visual components"

# Group 4: Routes
git add app/page.tsx app/certificates/ components/routes/
git commit -m "feat(routes): secondary route templates and project pages"

# Group 5: Docs
git add docs/
git commit -m "docs: clean up legacy plans and update documentation"

# Group 6: Remaining (SEO and any other files)
git add .
git commit -m "feat(seo): enhance metadata, share cards, and remaining layout adjustments"

# Branching
git checkout -b feature/portfolio-redesign-2026
git push -u origin feature/portfolio-redesign-2026

# Create PR Body
$prBody = @"
## Overview
This PR introduces a comprehensive redesign and visual overhaul of the portfolio.

## Key Changes
- **Core:** Implemented new design tokens, capability policies, and a content runtime layer.
- **Motion & Transitions:** Added motion primitives, robust shell navigation, and page transitions for a smoother experience.
- **Homepage:** Completely redesigned homepage scenes and visual components.
- **Routes:** Updated secondary route templates and project case study layouts.
- **SEO & Docs:** Enhanced SEO metadata, JSON-LD, share cards, and cleaned up legacy documentation plans.

## Notes
The commit history has been squashed into semantic domains to ensure a clean commit log.
"@
Set-Content -Path pr_body.md -Value $prBody -Encoding UTF8

# Create PR
gh pr create --title "feat: Portfolio Redesign Overhaul" --body-file pr_body.md

# Cleanup
Remove-Item pr_body.md
