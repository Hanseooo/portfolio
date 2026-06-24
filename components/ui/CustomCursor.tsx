"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const isTouchDevice =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(pointer: coarse)").matches;

    if (isTouchDevice) {
      cursor.style.display = "none";
      return;
    }

    const setX = gsap.quickSetter(cursor, "x", "px");
    const setY = gsap.quickSetter(cursor, "y", "px");

    const interactiveSelector = "a, button, input, textarea, select, [role='button']";

    const onMouseMove = (e: MouseEvent) => {
      setX(e.clientX);
      setY(e.clientY);
    };

    const onMouseOver = (e: MouseEvent) => {
      // Only fire when crossing INTO an interactive element from a non-interactive one
      if (!(e.target as Element).closest?.(interactiveSelector)) return;
      if ((e.relatedTarget as Element | null)?.closest?.(interactiveSelector)) return;
      gsap.to(cursor, {
        scale: 2.5,
        backgroundColor: "transparent",
        border: "1px solid var(--primary)",
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const onMouseOut = (e: MouseEvent) => {
      // Only fire when crossing OUT OF an interactive element to a non-interactive one
      if (!(e.target as Element).closest?.(interactiveSelector)) return;
      if ((e.relatedTarget as Element | null)?.closest?.(interactiveSelector)) return;
      gsap.to(cursor, {
        scale: 1,
        backgroundColor: "var(--primary)",
        border: "none",
        duration: 0.3,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed left-0 top-0 z-[9999] h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_10px_var(--primary-glow)]"
    />
  );
}
