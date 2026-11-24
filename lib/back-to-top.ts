/** Offered once the reader is this many viewports down the page. */
export const SHOW_AFTER_VIEWPORTS = 1.5;

export interface ScrollSample {
  /** Current scroll offset. */
  y: number;
  /** Change since the last sample; negative is scrolling up. */
  delta: number;
  viewport: number;
  pageHeight: number;
}

/**
 * Back to top shows past 1.5 viewports while the reader scrolls up or nears the end
 * (within two viewports of the bottom), and steps aside while they scroll down.
 */
export function backToTopShown({ y, delta, viewport, pageHeight }: ScrollSample): boolean {
  const deep = y > viewport * SHOW_AFTER_VIEWPORTS;
  const nearEnd = y + viewport * 2 > pageHeight;
  return deep && (delta < 0 || nearEnd);
}
