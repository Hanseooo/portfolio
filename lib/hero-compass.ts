// Live compass in the hero ribbon. Angles are in degrees: 0° points straight
// down from the origin, 90° points straight left.

export const COMPASS_MIN_DEG = 6;
export const COMPASS_MAX_DEG = 84;
/** Leg angle where motion is off (reduced motion, touch, unarmed). */
export const COMPASS_REST_DEG = 42;

/** Angle of the pointer seen from the compass origin, clamped to the drawable range. */
export function pointerAngle(cx: number, cy: number, px: number, py: number): number {
  const deg = (Math.atan2(cx - px, py - cy) * 180) / Math.PI;
  return Math.min(COMPASS_MAX_DEG, Math.max(COMPASS_MIN_DEG, deg));
}

/** End of a compass leg of length `r` swung `deg` from straight down. */
export function legEnd(cx: number, cy: number, r: number, deg: number): { x: number; y: number } {
  const t = (deg * Math.PI) / 180;
  return { x: cx - r * Math.sin(t), y: cy + r * Math.cos(t) };
}
