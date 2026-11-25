import { describe, expect, it } from "vitest";
import { craneState } from "./construction-site";

// Stops: yard x=100, roof x=300. Hook heights: yard 200, high 60, roof 150.
const stops = { xYard: 100, xRoof: 300, hookYard: 200, hookHigh: 60, hookRoof: 150 };

describe("crane cycle", () => {
  it("lifts a floor from the yard, carries it to the roof and sets it there", () => {
    expect(craneState(0, stops)).toMatchObject({ x: 100, hookY: 200, attached: true, roofOpacity: 0 });
    expect(craneState(7, stops)).toMatchObject({ x: 300, hookY: 60, attached: true });
    expect(craneState(10.5, stops)).toMatchObject({ x: 300, hookY: 150, attached: false, roofOpacity: 1 });
  });

  it("returns empty to the yard while the next floor appears there", () => {
    expect(craneState(15.6, stops)).toMatchObject({ x: 100, attached: false, roofOpacity: 0, yardOpacity: 1 });
  });
});
