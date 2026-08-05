// lib/design-tokens/patterns.ts

import { SPACING_BASE } from "./canonical";

/** Column alignment modes */
export const GRID_MODES = {
  /** Wide desktop: ~1280px+ */
  wide: { columns: 12, label: "wide-desktop" },
  /** Compact desktop / tablet: ~768–1279px */
  compact: { columns: 8, label: "compact-tablet" },
  /** Mobile: <768px, min 320px */
  mobile: { columns: 4, label: "mobile" },
} as const;

/** Portfolio and reading gutters (px) */
export const GUTTERS = {
  portfolioDesktop: SPACING_BASE * 6,   // 48px
  portfolioTablet: SPACING_BASE * 4,    // 32px
  portfolioMobile: SPACING_BASE * 2.5,  // 20px
  columnDesktop: SPACING_BASE * 3,      // 24px
  columnMobile: SPACING_BASE * 2,       // 16px
} as const;

/** Readable text measure */
export const READABLE_MEASURE = {
  prose: 68,
  meta: 45,
} as const;

/** Compact indexed masthead spacing */
export const MASTHEAD_SPACING = {
  top: SPACING_BASE * 4,       // 32px
  bottom: SPACING_BASE * 6,    // 48px
  metaGap: SPACING_BASE * 2,   // 16px
} as const;

/** Evidence band and rule rhythm */
export const EVIDENCE_RHYTHM = {
  bandGapDesktop: SPACING_BASE * 8,   // 64px
  bandGapMobile: SPACING_BASE * 5,    // 40px
  ruleMargin: SPACING_BASE * 3,       // 24px
} as const;

/** Minimum interactive target size (px) */
export const INTERACTIVE_TARGET = {
  min: 44,
} as const;

/** Persistent-navigation anchor offset */
export const NAV_ANCHOR_OFFSET = {
  desktop: SPACING_BASE * 10,  // 80px
  mobile: SPACING_BASE * 8,    // 64px
} as const;
