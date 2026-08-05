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
      const facts = resolveCapabilityFacts();
      setValue({ ...getCapabilityDecisions(facts), initialized: true });
    };
    resolve();

    // Listen for reduced-motion changes
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    mq.addEventListener("change", resolve);
    return () => mq.removeEventListener("change", resolve);
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
