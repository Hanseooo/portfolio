"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { CapabilityProvider } from "@/components/providers/CapabilityProvider";
import { ScrollEnhancementProvider } from "@/components/motion/ScrollEnhancementController";
import { RouteHandoffProvider } from "@/components/motion/RouteHandoffController";

interface PortfolioProvidersProps {
  children: ReactNode;
}

/**
 * Portfolio runtime shell providers — S6 §10.1.
 *
 * Provider order (outer → inner):
 * 1. Theme (must wrap everything for class-based dark mode)
 * 2. Capability (resolves facts, decides enhancement eligibility)
 * 3. ScrollEnhancement (creates/destroys Lenis based on capability)
 * 4. RouteHandoff (needs capability + scroll enhancement context)
 */
export default function PortfolioProviders({ children }: PortfolioProvidersProps) {
  return (
    <ThemeProvider>
      <CapabilityProvider>
        <ScrollEnhancementProvider>
          <RouteHandoffProvider>
            {children}
          </RouteHandoffProvider>
        </ScrollEnhancementProvider>
      </CapabilityProvider>
    </ThemeProvider>
  );
}
