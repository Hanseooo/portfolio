import type { ReactNode } from "react";
import SkipLink from "./SkipLink";
import GlobalNav from "./GlobalNav";
import FooterFrame from "./FooterFrame";
import BrandedArrival from "@/components/motion/BrandedArrival";
import RouteHandoffOverlay from "./RouteHandoffOverlay";

/**
 * Universal portfolio frame — S6 §6.1.
 *
 * Owns:
 * - Skip-to-main destination and landmark order
 * - Global navigation and footer relationship
 * - Portfolio gutters and safe-area behavior
 * - Route-level focus-safe entry point
 * - Mounting point for branded arrival (Plan 5)
 * - Mounting point for route-handoff overlay (Plan 5)
 *
 * Does NOT own:
 * - Homepage chapter navigation
 * - Project local navigation
 * - Content selection or route-specific layout
 */
export default function PortfolioFrame({ children }: { children: ReactNode }) {
  return (
    <>
      <BrandedArrival />
      <RouteHandoffOverlay />
      <SkipLink />
      <GlobalNav />
      <main
        id="main-content"
        className="relative min-h-screen pt-16 md:pt-20"
        tabIndex={-1}
      >
        {children}
      </main>
      <FooterFrame />
    </>
  );
}
