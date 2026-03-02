"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import PageOverlay from "./PageOverlay";
import { motionTokens } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/components/utils/usePrefersReducedMotion";

export default function TransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [active, setActive] = useState(true);
  const isFirstRouteRenderRef = useRef(true);
  const reducedMotion = usePrefersReducedMotion();

  // Initial load
  useEffect(() => {
    if (reducedMotion) return;

    const timeout = setTimeout(() => {
      setActive(false);
    }, motionTokens.duration.feature * 1000 + 120);

    return () => clearTimeout(timeout);
  }, [reducedMotion]);

  // Route change
  useEffect(() => {
    if (isFirstRouteRenderRef.current) {
      isFirstRouteRenderRef.current = false;
      return;
    }

    if (reducedMotion) return;

    const openTimeout = setTimeout(() => {
      setActive(true);
    }, 0);

    const timeout = setTimeout(() => {
      setActive(false);
    }, motionTokens.duration.feature * 1000 + 120);

    return () => {
      clearTimeout(openTimeout);
      clearTimeout(timeout);
    };
  }, [pathname, reducedMotion]);

  return (
    <>
      {!reducedMotion && <PageOverlay active={active} />}
      {children}
    </>
  );
}
