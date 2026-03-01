"use client";

import { useLayoutEffect } from "react";

export function useResetScrollTop() {
  useLayoutEffect(() => {
    const lenis = window.__lenis;

    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
      return;
    }

    window.scrollTo(0, 0);
  }, []);
}
