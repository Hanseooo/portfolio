import { describe, expect, it } from "vitest";
import { getHomepageIdentity } from "./homepage-projections";

describe("hero proof", () => {
  it("reads client outcome, live products, then the year building started", () => {
    const proof = getHomepageIdentity().immediateProof.map(({ attribution, value, label }) => [attribution, value, label]);
    expect(proof).toEqual([
      ["Client-reported, Le Doux", "75%", "faster order processing"],
      ["Projects", "5", "live products, more on GitHub"],
      ["Building since", "2023", "from coursework to client work"],
    ]);
  });
});
