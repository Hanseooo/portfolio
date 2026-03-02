"use client";

import { useSyncExternalStore } from "react";

const query = "(prefers-reduced-motion: reduce)";

function getSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia(query).matches;
}

function getServerSnapshot() {
  return false;
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};

  const mediaQuery = window.matchMedia(query);
  const handler = () => callback();

  mediaQuery.addEventListener("change", handler);
  return () => mediaQuery.removeEventListener("change", handler);
}

export function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
