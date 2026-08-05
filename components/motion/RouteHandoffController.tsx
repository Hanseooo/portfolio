"use client";

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { useCapability } from "@/components/providers/CapabilityProvider";
import { useScrollEnhancement } from "@/components/motion/ScrollEnhancementController";

type HandoffPhase = "idle" | "covering" | "navigating" | "revealing";

interface RouteHandoffAPI {
  /** Trigger an eligible internal route handoff */
  navigate: (href: string) => void;
  /** Current handoff phase */
  phase: HandoffPhase;
  /** Whether handoff is active (cover visible) */
  isActive: boolean;
}

const DEFAULT_API: RouteHandoffAPI = {
  navigate: () => {},
  phase: "idle",
  isActive: false,
};

const RouteHandoffContext = createContext<RouteHandoffAPI>(DEFAULT_API);

/** Max time the cover can remain opaque (ms) — S5 §20 */
const COVER_CEILING_MS = 900;
/** Cover-enter duration (ms) */
const COVER_ENTER_MS = 300;
/** Reveal duration after navigation (ms) */
const REVEAL_MS = 400;

export function RouteHandoffProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { routeHandoff, tier } = useCapability();
  const { stop: suspendScroll, resume: resumeScroll } = useScrollEnhancement();
  const [phase, setPhase] = useState<HandoffPhase>("idle");
  const phaseRef = useRef<HandoffPhase>("idle");
  const targetRef = useRef<string | null>(null);
  const timersRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());
  const ceilingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setHandoffPhase = useCallback((next: HandoffPhase) => {
    phaseRef.current = next;
    setPhase(next);
  }, []);

  const schedule = useCallback((callback: () => void, delayMs: number) => {
    const timer = setTimeout(() => {
      timersRef.current.delete(timer);
      callback();
    }, delayMs);
    timersRef.current.add(timer);
    return timer;
  }, []);

  const cleanup = useCallback(() => {
    for (const timer of timersRef.current) clearTimeout(timer);
    timersRef.current.clear();
    ceilingTimerRef.current = null;
    targetRef.current = null;
    setHandoffPhase("idle");
    resumeScroll();
  }, [resumeScroll, setHandoffPhase]);

  useEffect(() => cleanup, [cleanup]);

  /**
   * Pathname-driven reveal — fires when Next.js has actually committed the
   * new page to the DOM. This replaces the old fixed 150ms timer which caused
   * the overlay to exit before the destination page was ready, producing a
   * blank flash between overlay-gone and new-content-visible.
   */
  useEffect(() => {
    if (phaseRef.current !== "navigating") return;

    // Cancel the ceiling timer — we got a real pathname change.
    if (ceilingTimerRef.current) {
      clearTimeout(ceilingTimerRef.current);
      timersRef.current.delete(ceilingTimerRef.current);
      ceilingTimerRef.current = null;
    }

    setHandoffPhase("revealing");
    schedule(cleanup, REVEAL_MS);
  // pathname is the dependency that drives this — fires each time Next.js
  // commits a new route while we're in the navigating phase.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const navigate = useCallback(
    (href: string) => {
      const destination = new URL(href, window.location.href);
      if (destination.origin !== window.location.origin) {
        window.location.assign(destination.href);
        return;
      }
      if (destination.pathname === pathname) {
        // Hash/search-only changes are never covered by a route plane.
        if (destination.hash || destination.search) {
          router.push(`${destination.pathname}${destination.search}${destination.hash}`);
        }
        return;
      }

      if (!routeHandoff || tier === "reduced-motion" || tier === "webview-constrained") {
        router.push(href);
        return;
      }

      // Read the mutable lifecycle ref, not render-state, so rapid activations
      // coalesce even before React has committed the first phase update.
      if (phaseRef.current === "covering" || phaseRef.current === "navigating") {
        targetRef.current = href;
        return;
      }

      targetRef.current = href;
      suspendScroll();
      setHandoffPhase("covering");

      // Hard ceiling: reveal a truthful destination/loading state by 900ms.
      // Only fires if pathname never changes (e.g. navigation stalled).
      ceilingTimerRef.current = schedule(() => {
        ceilingTimerRef.current = null;
        setHandoffPhase("revealing");
        schedule(cleanup, REVEAL_MS);
      }, COVER_CEILING_MS);

      // Wait for the cover plane to finish entering, then push the route.
      // The reveal is no longer triggered here — it's driven by the pathname
      // useEffect above, which fires only when Next.js has rendered the page.
      schedule(() => {
        const target = targetRef.current;
        if (!target) return;

        router.push(target);
        setHandoffPhase("navigating");
      }, COVER_ENTER_MS);
    },
    [pathname, routeHandoff, tier, router, schedule, cleanup, suspendScroll, setHandoffPhase]
  );

  const api: RouteHandoffAPI = {
    navigate,
    phase,
    isActive: phase !== "idle",
  };

  return (
    <RouteHandoffContext.Provider value={api}>
      {children}
    </RouteHandoffContext.Provider>
  );
}

export function useRouteHandoff(): RouteHandoffAPI {
  return useContext(RouteHandoffContext);
}
