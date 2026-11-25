"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Construction for a framed artifact: two rules through its top-left corner and
 * a dimension line under it, labelled with the frame's real rendered width.
 * Drawn once on scroll-in and then erased (data-draw="construct"), redrawn
 * while the parent `.group` is hovered or keyboard-focused. Invisible at rest.
 * Place inside the frame's `relative` wrapper, beside CropMarks.
 */
export function ConstructMarks({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <span ref={ref} aria-hidden="true" data-draw="construct" className={`construct pointer-events-none absolute inset-0 ${className}`}>
      <span className="construct-x" />
      <span className="construct-y" />
      <span className="construct-dim">
        <span className="construct-tick" />
        <span className="construct-line" />
        <span className="construct-label">{width !== null && `${width} px`}</span>
        <span className="construct-line" />
        <span className="construct-tick" />
      </span>
    </span>
  );
}
