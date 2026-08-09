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
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
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
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!lenisEligible) return;

    const lenis = new Lenis({
      smoothWheel: true,
      duration: 1.2,
    });

    lenisRef.current = lenis;

    // Sync with GSAP ticker for ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    const update = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    // ponytail: sync setState after external setup — intentional
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsReady(true);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
      lenisRef.current = null;
      setIsReady(false);
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
    lenisRef.current?.stop();
  }, []);

  const resume = useCallback(() => {
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
