"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type Lenis from "lenis";
import { useCapability } from "@/components/providers/CapabilityProvider";
import { computeScrollTarget } from "@/lib/anchor-navigation";

interface ScrollEnhancementAPI {
  /** Whether Lenis is active and ready */
  isReady: boolean;
  /** Scroll to a fragment target with offset */
  scrollToFragment: (fragment: string, offsetPx: number) => void;
  /** Scroll to a numeric position */
  scrollToPosition: (top: number, immediate?: boolean) => void;
  /** Suspend interpolation until the owning lifecycle explicitly resumes it */
  stop: () => void;
  /** Resume interpolation after an owning lifecycle has settled */
  resume: () => void;
}

const DEFAULT_API: ScrollEnhancementAPI = {
  isReady: false,
  scrollToFragment: (fragment, offsetPx) => {
    // Native fallback
    const target = computeScrollTarget(fragment, offsetPx);
    if (target) window.scrollTo({ top: target.top, behavior: "instant" });
  },
  scrollToPosition: (top, immediate) => {
    window.scrollTo({ top, behavior: immediate ? "instant" : "auto" });
  },
  stop: () => {},
  resume: () => {},
};

const ScrollEnhancementContext = createContext<ScrollEnhancementAPI>(DEFAULT_API);

export function ScrollEnhancementProvider({ children }: { children: ReactNode }) {
  const { lenisEligible } = useCapability();
  const lenisRef = useRef<Lenis | null>(null);
  /** A stop() that lands before Lenis loads still applies once it does. */
  const suspendedRef = useRef(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!lenisEligible) return;

    let cancelled = false;
    let teardown: (() => void) | undefined;

    // Loaded on demand: tiers without smooth scroll never download Lenis or GSAP.
    Promise.all([import("lenis"), import("@/lib/gsap")]).then(
      ([{ default: LenisClass }, { gsap, ScrollTrigger }]) => {
        if (cancelled) return;

        const lenis = new LenisClass({
          smoothWheel: true,
          duration: 1.2,
        });
        if (suspendedRef.current) lenis.stop();

        lenisRef.current = lenis;

        // Sync with GSAP ticker for ScrollTrigger
        lenis.on("scroll", ScrollTrigger.update);

        const update = (time: number) => {
          lenis.raf(time * 1000);
        };

        gsap.ticker.add(update);
        gsap.ticker.lagSmoothing(0);
        setIsReady(true);

        teardown = () => {
          gsap.ticker.remove(update);
          lenis.destroy();
          lenisRef.current = null;
          setIsReady(false);
        };
      }
    );

    return () => {
      cancelled = true;
      teardown?.();
    };
  }, [lenisEligible]);

  const scrollToFragment = useCallback((fragment: string, offsetPx: number) => {
    const target = computeScrollTarget(fragment, offsetPx);
    if (!target) return;

    if (lenisRef.current) {
      lenisRef.current.scrollTo(target.top, { duration: 0.8 });
    } else {
      window.scrollTo({ top: target.top, behavior: "smooth" });
    }
  }, []);

  const scrollToPosition = useCallback((top: number, immediate?: boolean) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(top, { immediate: immediate ?? false });
    } else {
      window.scrollTo({ top, behavior: immediate ? "instant" : "smooth" });
    }
  }, []);

  const stop = useCallback(() => {
    suspendedRef.current = true;
    lenisRef.current?.stop();
  }, []);

  const resume = useCallback(() => {
    suspendedRef.current = false;
    lenisRef.current?.start();
  }, []);

  const api = useMemo<ScrollEnhancementAPI>(
    () => ({ isReady, scrollToFragment, scrollToPosition, stop, resume }),
    [isReady, scrollToFragment, scrollToPosition, stop, resume]
  );

  return (
    <ScrollEnhancementContext.Provider value={api}>
      {children}
    </ScrollEnhancementContext.Provider>
  );
}

export function useScrollEnhancement(): ScrollEnhancementAPI {
  return useContext(ScrollEnhancementContext);
}
