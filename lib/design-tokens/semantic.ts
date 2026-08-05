// lib/design-tokens/semantic.ts

import {
  BRAND_RED,
  BRAND_ICE,
  FOUNDATION_IVORY,
  READING_PAPER,
  FOUNDATION_BLACK,
  RAISED_NEAR_BLACK,
} from "./canonical";

export type ContrastContext =
  | "normal-text"
  | "large-text"
  | "non-text-graphics"
  | "decorative"
  | "solid-field-bg"
  | "focus-indicator"
  | "control-state";

export interface SemanticColorRole {
  /** CSS custom property name (without --) */
  token: string;
  /** Resolved hex or rgba value for this theme */
  value: string;
  /** Human description */
  purpose: string;
  /** Permitted usage contexts — consumers MUST respect these */
  permittedContexts: ContrastContext[];
  /** What foreground this role expects when used as a background */
  inverseForeground?: string;
}

export const LIGHT_ROLES: SemanticColorRole[] = [
  {
    token: "cs-foundation",
    value: FOUNDATION_IVORY,
    purpose: "Default environmental surface",
    permittedContexts: ["solid-field-bg"],
  },
  {
    token: "cs-reading-surface",
    value: READING_PAPER,
    purpose: "Long-form copy and dense evidence background",
    permittedContexts: ["solid-field-bg"],
  },
  {
    token: "cs-text-primary",
    value: "#151515",
    purpose: "Main readable content",
    permittedContexts: ["normal-text"],
  },
  {
    token: "cs-text-secondary",
    value: "#52524E",
    purpose: "Supporting copy and metadata — accessible warm gray",
    permittedContexts: ["normal-text"],
  },
  {
    token: "cs-structural-line",
    value: "#15151526",
    purpose: "Grid, rules, and frames — NOT readable text",
    permittedContexts: ["decorative", "non-text-graphics"],
  },
  {
    token: "cs-structural-line-strong",
    value: "#15151566",
    purpose: "Strong divider or active rule",
    permittedContexts: ["non-text-graphics"],
  },
  {
    token: "cs-signal",
    value: BRAND_RED,
    purpose: "Brand emphasis — NOT normal-size text on ivory",
    permittedContexts: ["large-text", "non-text-graphics", "solid-field-bg", "focus-indicator", "control-state"],
    inverseForeground: "#FFFFFF",
  },
  {
    token: "cs-signal-text",
    value: BRAND_RED,
    purpose: "Signal color for text on paper (#FBFAF7) only — ~4.76:1",
    permittedContexts: ["normal-text"],
  },
  {
    token: "cs-signal-inverse",
    value: "#FFFFFF",
    purpose: "Text/icons on solid signal (red) fields — ~4.97:1",
    permittedContexts: ["normal-text", "non-text-graphics"],
  },
  {
    token: "cs-raised-neutral",
    value: "#EDE9E3",
    purpose: "Slight tonal shift from ivory for hierarchy without shadow",
    permittedContexts: ["solid-field-bg"],
  },
  {
    token: "cs-focus-ring",
    value: BRAND_RED,
    purpose: "Keyboard focus indicator",
    permittedContexts: ["focus-indicator"],
  },
  {
    token: "cs-error",
    value: "#DC2626",
    purpose: "Error/destructive — semantic, not brand",
    permittedContexts: ["normal-text", "non-text-graphics", "control-state"],
  },
];

export const DARK_ROLES: SemanticColorRole[] = [
  {
    token: "cs-foundation",
    value: FOUNDATION_BLACK,
    purpose: "Default environmental surface",
    permittedContexts: ["solid-field-bg"],
  },
  {
    token: "cs-reading-surface",
    value: RAISED_NEAR_BLACK,
    purpose: "Long-form copy and dense evidence background",
    permittedContexts: ["solid-field-bg"],
  },
  {
    token: "cs-text-primary",
    value: "#FAFAFA",
    purpose: "Main readable content — soft white",
    permittedContexts: ["normal-text"],
  },
  {
    token: "cs-text-secondary",
    value: "#A1A1AA",
    purpose: "Supporting copy and metadata — accessible cool gray",
    permittedContexts: ["normal-text"],
  },
  {
    token: "cs-structural-line",
    value: "#FAFAFA1A",
    purpose: "Grid, rules, and frames — NOT readable text",
    permittedContexts: ["decorative", "non-text-graphics"],
  },
  {
    token: "cs-structural-line-strong",
    value: "#FAFAFA40",
    purpose: "Strong divider or active rule",
    permittedContexts: ["non-text-graphics"],
  },
  {
    token: "cs-signal",
    value: BRAND_ICE,
    purpose: "Brand emphasis — ice blue on black ~13.65:1",
    permittedContexts: ["normal-text", "large-text", "non-text-graphics", "solid-field-bg", "focus-indicator", "control-state"],
    inverseForeground: "#000000",
  },
  {
    token: "cs-signal-text",
    value: BRAND_ICE,
    purpose: "Signal color safe for all text on black",
    permittedContexts: ["normal-text"],
  },
  {
    token: "cs-signal-inverse",
    value: "#000000",
    purpose: "Text/icons on solid signal (ice) fields",
    permittedContexts: ["normal-text", "non-text-graphics"],
  },
  {
    token: "cs-raised-neutral",
    value: "#18181B",
    purpose: "Slight tonal shift from black for hierarchy without shadow",
    permittedContexts: ["solid-field-bg"],
  },
  {
    token: "cs-focus-ring",
    value: BRAND_ICE,
    purpose: "Keyboard focus indicator",
    permittedContexts: ["focus-indicator"],
  },
  {
    token: "cs-error",
    value: "#EF4444",
    purpose: "Error/destructive — genuine semantic red allowed in dark",
    permittedContexts: ["normal-text", "non-text-graphics", "control-state"],
  },
];
