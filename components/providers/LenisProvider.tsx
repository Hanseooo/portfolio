"use client";

import Lenis from "lenis";
import { useEffect, ReactNode, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";

gsap.registerPlugin(ScrollTrigger);

interface LenisProviderProps {
    children : ReactNode
}

export function LenisProvider({ children } : LenisProviderProps ) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (window.innerWidth < 1024) return;
    const lenis = new Lenis({
      smoothWheel: true,
      duration: 1.2,
    });

     (window as any).__lenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      ScrollTrigger.update();
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  useEffect(() => {
    const isProjectSlug = pathname.startsWith("/projects/");

    if (isProjectSlug) {
      if (typeof window !== "undefined") {
        ScrollTrigger.clearScrollMemory();
        window.history.scrollRestoration = "manual";
      }

      requestAnimationFrame(() => {
        if (lenisRef.current) {
          lenisRef.current.scrollTo(0, { immediate: true });
        } else {
          window.scrollTo(0, 0);
        }

        setTimeout(() => {
          ScrollTrigger.refresh();
        }, 50);
      });
    }
  }, [pathname]);

  return <>{children}</>;
}
