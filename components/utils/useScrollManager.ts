"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import ScrollTrigger from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { usePrefersReducedMotion } from "@/components/utils/usePrefersReducedMotion";

interface ScrollManagerOptions {
  lenis?: Lenis | null;
}


export function useScrollManager({ lenis }: ScrollManagerOptions = {}) {
  const pathname = usePathname();
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {

    window.history.scrollRestoration = "manual";

    const isProjectSlug = pathname.startsWith("/projects/");
    const scrollTarget = sessionStorage.getItem("scrollTarget");


    if (scrollTarget) {
      sessionStorage.removeItem("scrollTarget");
    }

    requestAnimationFrame(() => {
      // Let HomeScrollHandler own navigation scrolls

      if (isProjectSlug) {
        ScrollTrigger.killAll(false);

        if (lenis) {
          lenis.scrollTo(0, { immediate: true });
        } else {
          window.scrollTo(0, 0);
        }
      }

      if (!isProjectSlug && scrollTarget) {
        scrollToElement(scrollTarget, lenis, reducedMotion);
      }

      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 60);
    });
  }, [pathname, lenis, reducedMotion]);
}

function scrollToElement(id: string, lenis?: Lenis | null, reducedMotion = false) {
  const attemptScroll = (attempts = 0) => {
    const el = document.getElementById(id);

    if (el) {
      if (lenis) {
        lenis.scrollTo(el, { duration: reducedMotion ? 0 : 1.2 });
      } else {
        el.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
      }
    } else if (attempts < 12) {
      requestAnimationFrame(() => attemptScroll(attempts + 1));
    }
  };

  attemptScroll();
}
