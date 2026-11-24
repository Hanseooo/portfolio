import { describe, expect, it } from "vitest";
import { legEnd, pointerAngle } from "./hero-compass";

describe("hero compass geometry", () => {
  it("measures the pointer angle from straight down toward the left, clamped to 6–84°", () => {
    expect(pointerAngle(100, 100, 0, 200)).toBeCloseTo(45);
    expect(pointerAngle(100, 100, 100, 300)).toBe(6);
    expect(pointerAngle(100, 100, -50, 100)).toBe(84);
  });

  it("places the leg end R away from the origin at that angle", () => {
    const end = legEnd(100, 100, 10, 90);
    expect(end.x).toBeCloseTo(90);
    expect(end.y).toBeCloseTo(100);
  });
});
