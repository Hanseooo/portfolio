import { describe, expect, it } from "vitest";
import { isFresh, recall, remember } from "./client-cache";

describe("activity client cache", () => {
  it("returns the last payload for a url and ages it", () => {
    remember("/api/a", { ok: true }, 1_000);
    const entry = recall("/api/a");
    expect(entry?.payload).toEqual({ ok: true });
    expect(isFresh(entry, 60_000, 60_999)).toBe(true);
    expect(isFresh(entry, 60_000, 61_000)).toBe(false);
  });

  it("has nothing for a url never fetched", () => {
    expect(recall("/api/never")).toBeUndefined();
    expect(isFresh(undefined, 60_000, 0)).toBe(false);
  });
});
