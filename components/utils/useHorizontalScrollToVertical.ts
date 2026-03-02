"use client";

import { useGesture } from "@use-gesture/react";

export function useHorizontalScrollToVertical() {
  return useGesture(
    {
      onDrag: ({ delta: [dx] }) => {
        // Tune this value (feel)
        const SCROLL_MULTIPLIER = 1.2;

        const scrollAmount = -dx * SCROLL_MULTIPLIER;

        const lenis = window.__lenis;

        if (lenis) {
          lenis.scrollTo(lenis.scroll + scrollAmount, {
            immediate: true,
          });
        } else {
          window.scrollBy({
            top: scrollAmount,
            behavior: "auto",
          });
        }
      },
    },
    {
      drag: {
        axis: "x",
        pointer: { touch: true },
        preventScroll: true,
        filterTaps: true,
      },
    }
  );
}
