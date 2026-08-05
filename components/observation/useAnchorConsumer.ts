"use client";

import { useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  DESTINATIONS,
  getDestinationHref,
  isRouteChange,
  type DestinationId,
} from "@/lib/destinations";
import {
  buildAnchorRequest,
  performNativeAnchorNavigation,
} from "@/lib/anchor-navigation";
import { useScrollEnhancement } from "@/components/motion/ScrollEnhancementController";

/**
 * Hook consuming semantic anchor-navigation interface — S5 §13.
 *
 * When scroll enhancement (Lenis) is ready, uses smooth scrolling.
 * Falls back to native instant scroll otherwise.
 * Always updates fragment and transfers focus.
 */
export function useAnchorConsumer() {
  const pathname = usePathname();
  const router = useRouter();
  const { isReady, scrollToFragment } = useScrollEnhancement();

  const navigateToSection = useCallback(
    (destId: DestinationId) => {
      const dest = DESTINATIONS[destId];
      if (!dest) return;

      if (isRouteChange(dest, pathname)) {
        router.push(getDestinationHref(dest));
        return;
      }

      if (dest.fragment) {
        const request = buildAnchorRequest(dest, pathname);
        if (!request) return;

        if (isReady) {
          // Use Lenis-enhanced smooth scroll
          scrollToFragment(request.fragment, request.offsetPx);
          // Update fragment and focus
          if (request.updateFragment) {
            history.replaceState(null, "", `#${request.fragment}`);
          }
          if (request.transferFocus) {
            const el = document.getElementById(request.fragment);
            if (el) {
              if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
              el.focus({ preventScroll: true });
            }
          }
        } else {
          // Native fallback
          performNativeAnchorNavigation(request);
        }
      }
    },
    [pathname, router, isReady, scrollToFragment]
  );

  return { navigateToSection };
}
