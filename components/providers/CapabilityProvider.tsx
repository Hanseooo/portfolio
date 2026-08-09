"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  resolveCapabilityFacts,
  getCapabilityDecisions,
  type CapabilityDecisions,
} from "@/lib/capability-policy";

/** Default: reduced-motion tier (simplest/safest) */
const DEFAULT_DECISIONS: CapabilityDecisions = getCapabilityDecisions(
  resolveCapabilityFacts() // server-safe: returns reduced-motion defaults
);

export type CapabilityContextValue = CapabilityDecisions & {
  /** False through SSR and the first hydration render; richer enhancements must wait. */
  initialized: boolean;
};

const DEFAULT_VALUE: CapabilityContextValue = {
  ...DEFAULT_DECISIONS,
  initialized: false,
};

const CapabilityContext = createContext<CapabilityContextValue>(DEFAULT_VALUE);

export function CapabilityProvider({ children }: { children: ReactNode }) {
  const [value, setValue] = useState<CapabilityContextValue>(DEFAULT_VALUE);

  useEffect(() => {
    const resolve = () => {
      const next: CapabilityContextValue = {
        ...getCapabilityDecisions(resolveCapabilityFacts()),
        initialized: true,
      };
      // ponytail: shallow compare instead of debouncing resize — resolve() is
      // cheap, and a tier flip is rare, so most resize frames bail out here
      // and never re-render a consumer.
      setValue((prev) =>
        (Object.keys(next) as (keyof CapabilityContextValue)[]).every(
          (key) => prev[key] === next[key]
        )
          ? prev
          : next
      );
    };
    resolve();

    // Tier depends on reduced-motion, pointer type, and viewport height — all
    // three can change mid-session (rotate, split-screen, external monitor).
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = window.matchMedia("(pointer: coarse)");
    mq.addEventListener("change", resolve);
    pointer.addEventListener("change", resolve);
    window.addEventListener("resize", resolve);
    window.addEventListener("orientationchange", resolve);
    return () => {
      mq.removeEventListener("change", resolve);
      pointer.removeEventListener("change", resolve);
      window.removeEventListener("resize", resolve);
      window.removeEventListener("orientationchange", resolve);
    };
  }, []);

  return (
    <CapabilityContext.Provider value={value}>
      {children}
    </CapabilityContext.Provider>
  );
}

/**
 * Access current capability decisions. During SSR/unresolved hydration,
 * initialized=false and every decision remains the simplest static/native tier.
 */
export function useCapability(): CapabilityContextValue {
  return useContext(CapabilityContext);
}
