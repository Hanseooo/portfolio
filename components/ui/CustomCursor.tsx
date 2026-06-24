"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Check if device supports hover
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

    const onMouseMove = (e: MouseEvent) => {
      setX(e.clientX);
      setY(e.clientY);
    };

    window.addEventListener("mousemove", onMouseMove);

    // Add hover states for interactive elements
    const interactiveSelector = "a, button, input, textarea, select, [role='button']";
    const interactiveElements = document.querySelectorAll(interactiveSelector);

    const onMouseEnter = () => {
      gsap.to(cursor, {
        scale: 2.5,
        backgroundColor: "transparent",
        border: "1px solid var(--primary)",
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const onMouseLeave = () => {
      gsap.to(cursor, {
        scale: 1,
        backgroundColor: "var(--primary)",
        border: "none",
        duration: 0.3,
        ease: "power2.out",
      });
    };

    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", onMouseEnter);
      el.addEventListener("mouseleave", onMouseLeave);
    });

    // Handle dynamically added elements
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof HTMLElement) {
              const elements = node.querySelectorAll?.(interactiveSelector);
              elements?.forEach((el) => {
                el.addEventListener("mouseenter", onMouseEnter);
                el.addEventListener("mouseleave", onMouseLeave);
              });
              if (node.matches?.(interactiveSelector)) {
                node.addEventListener("mouseenter", onMouseEnter);
                node.addEventListener("mouseleave", onMouseLeave);
              }
            }
          });
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      const currentElements = document.querySelectorAll(interactiveSelector);
      currentElements.forEach((el) => {
        el.removeEventListener("mouseenter", onMouseEnter);
        el.removeEventListener("mouseleave", onMouseLeave);
      });
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed left-0 top-0 z-[9999] h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_10px_var(--primary-glow)]"
    />
  );
}
