/**
 * Last successful activity payload per URL, kept in memory for the browser tab.
 * Lets a scene remounted by client navigation paint its last data instead of a
 * skeleton. A full reload starts empty, which keeps server and client renders equal.
 */
type Entry = { payload: unknown; at: number };

const entries = new Map<string, Entry>();

export function remember(url: string, payload: unknown, now = Date.now()): void {
  entries.set(url, { payload, at: now });
}

export function recall(url: string): Entry | undefined {
  return entries.get(url);
}

export function isFresh(entry: Entry | undefined, maxAgeMs: number, now = Date.now()): boolean {
  return entry !== undefined && now - entry.at < maxAgeMs;
}
