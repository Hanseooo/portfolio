// lib/design-tokens/canonical.ts

/** Brand signal colors — the only two brand accents */
export const BRAND_RED = "#E10600" as const;
export const BRAND_ICE = "#00E5FF" as const;

/** Foundation surfaces */
export const FOUNDATION_IVORY = "#F3F0E9" as const;
export const READING_PAPER = "#FBFAF7" as const;
export const FOUNDATION_BLACK = "#000000" as const;
export const RAISED_NEAR_BLACK = "#09090B" as const;

/** Approved font families (CSS variable references) */
export const FONT_FAMILIES = {
  /** Inter — reading and interface */
  sans: "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
  /** JetBrains Mono — indexing and evidence metadata */
  mono: "var(--font-jetbrains), ui-monospace, SFMono-Regular, monospace",
  /** Anton — display signal (installed in Plan 2) */
  display: "var(--font-anton), var(--font-inter), sans-serif",
} as const;

/** 8-point spacing foundation */
export const SPACING_BASE = 8 as const;

/** Rule weight hierarchy (px) */
export const RULE_WEIGHTS = {
  /** Fine low-contrast structure lines */
  fine: 0.5,
  /** Standard separators */
  standard: 1,
  /** Major hierarchy change or active state */
  heavy: 2,
} as const;

/** Corner policy — square or minimal */
export const CORNER_POLICY = {
  none: "0px",
  /** Only where usability requires differentiation */
  minimal: "2px",
  /** Interactive controls only */
  control: "4px",
} as const;
