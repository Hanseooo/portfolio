"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import PageOverlay from "./PageOverlay";
import { usePrefersReducedMotion } from "@/components/utils/usePrefersReducedMotion";

// Time before triggering exit: overlay enters (~750ms) + brief hold
const HOLD_MS = 950;

export default function TransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const isFirstRouteRenderRef = useRef(true);
  const reducedMotion = usePrefersReducedMotion();

  // Route change only — Preloader handles the initial-load entrance
  useEffect(() => {
    if (isFirstRouteRenderRef.current) {
      isFirstRouteRenderRef.current = false;
      return;
    }
    if (reducedMotion) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActive(true);
    const timeout = setTimeout(() => setActive(false), HOLD_MS);
    return () => clearTimeout(timeout);
  }, [pathname, reducedMotion]);

  return (
    <>
      {!reducedMotion && <PageOverlay active={active} />}
      {children}
    </>
  );
}
