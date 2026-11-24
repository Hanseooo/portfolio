import { describe, expect, it } from "vitest";
import { backToTopShown } from "./back-to-top";

// 800px viewport on a 10000px page: "deep" starts past 1200, "near end" past 8400.
const page = { viewport: 800, pageHeight: 10000 };

describe("backToTopShown", () => {
  it("stays hidden near the top, even scrolling up", () => {
    expect(backToTopShown({ ...page, y: 1000, delta: -50 })).toBe(false);
  });

  it("shows when scrolling up deep in the page", () => {
    expect(backToTopShown({ ...page, y: 3000, delta: -50 })).toBe(true);
  });

  it("steps aside when scrolling down mid-page", () => {
    expect(backToTopShown({ ...page, y: 3000, delta: 50 })).toBe(false);
  });

  it("shows near the end even while scrolling down", () => {
    expect(backToTopShown({ ...page, y: 8500, delta: 50 })).toBe(true);
  });
});
