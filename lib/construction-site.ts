// Footer construction site: one 16s crane cycle. The crane lifts a floor from
// the yard, carries it to the roof, sets it down (it shows as the new top
// floor), then returns empty while the next floor appears in the yard.

export const CYCLE_S = 16;
/** Frame shown when motion is off: the floor just set on the roof. */
export const STILL_T = 12.6;

export interface CraneStops {
  xYard: number;
  xRoof: number;
  hookYard: number;
  hookHigh: number;
  hookRoof: number;
}

export interface CraneState {
  /** Trolley x along the jib */
  x: number;
  hookY: number;
  /** Load still hangs from the hook */
  attached: boolean;
  roofOpacity: number;
  yardOpacity: number;
  /** 1 while the load may swing freely, 0 once it is lowered onto the roof */
  calm: number;
}

export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function trolleyX(t: number, s: CraneStops): number {
  if (t < 3.2) return s.xYard;
  if (t < 6.4) return lerp(s.xYard, s.xRoof, ease((t - 3.2) / 3.2));
  if (t < 12.6) return s.xRoof;
  if (t < 15.2) return lerp(s.xRoof, s.xYard, ease((t - 12.6) / 2.6));
  return s.xYard;
}

export function craneState(t: number, s: CraneStops): CraneState {
  const x = trolleyX(t, s);
  if (t < 1.2) return { x, hookY: s.hookYard, attached: true, roofOpacity: 0, yardOpacity: 0, calm: 1 };
  if (t < 3.2) return { x, hookY: lerp(s.hookYard, s.hookHigh, ease((t - 1.2) / 2)), attached: true, roofOpacity: 0, yardOpacity: 0, calm: 1 };
  if (t < 8) return { x, hookY: s.hookHigh, attached: true, roofOpacity: 0, yardOpacity: 0, calm: 1 };
  if (t < 9.8) {
    const e = ease((t - 8) / 1.8);
    return { x, hookY: lerp(s.hookHigh, s.hookRoof, e), attached: true, roofOpacity: 0, yardOpacity: 0, calm: 1 - e };
  }
  if (t < 11) {
    const attached = t < 10.3;
    return { x, hookY: s.hookRoof, attached, roofOpacity: attached ? 0 : 1, yardOpacity: 0, calm: 0 };
  }
  if (t < 12.6) return { x, hookY: lerp(s.hookRoof, s.hookHigh, ease((t - 11) / 1.6)), attached: false, roofOpacity: 1, yardOpacity: 0, calm: 0 };
  if (t < 15.2) {
    return {
      x, hookY: s.hookHigh, attached: false, calm: 0,
      roofOpacity: 1 - clamp((t - 13) / 1.6, 0, 1),
      yardOpacity: clamp((t - 14) / 1.2, 0, 1),
    };
  }
  return { x, hookY: lerp(s.hookHigh, s.hookYard, ease((t - 15.2) / 0.8)), attached: false, roofOpacity: 0, yardOpacity: 1, calm: 0 };
}
