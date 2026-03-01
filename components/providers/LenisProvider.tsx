"use client";

import Lenis from "lenis";
import { useEffect, type ReactNode, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";
import { getRuntimeEnv } from "../utils/browserInfo";

gsap.registerPlugin(ScrollTrigger);

interface LenisProviderProps {
  children: ReactNode;
}

export function LenisProvider({ children }: LenisProviderProps) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    const isMobile = getRuntimeEnv().isMobile;

    if (isMobile) return;

    const lenis = new Lenis({
      smoothWheel: true,
      duration: 1.2,
    });

    lenisRef.current = lenis;
    window.__lenis = lenis;

    const raf = (time: number) => {
      lenis.raf(time);
      ScrollTrigger.update();
      rafIdRef.current = requestAnimationFrame(raf);
    };

    rafIdRef.current = requestAnimationFrame(raf);

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }

      window.__lenis = undefined;
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    const isProjectSlug = pathname.startsWith("/projects/");

    if (!isProjectSlug) return;

    if (typeof window !== "undefined") {
      ScrollTrigger.clearScrollMemory();
      window.history.scrollRestoration = "manual";
    }

    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const animationFrameId = requestAnimationFrame(() => {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo(0, 0);
      }

      timeoutId = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 50);
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [pathname]);

  return <>{children}</>;
}
