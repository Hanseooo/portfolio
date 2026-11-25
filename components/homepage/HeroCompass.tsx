"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import { useCapability } from "@/components/providers/CapabilityProvider";
import { COMPASS_REST_DEG, legEnd, pointerAngle } from "@/lib/hero-compass";

// Origin = the ribbon's existing crossing (right 15%, top 15%).
const ORIGIN_X = 0.85;
const ORIGIN_Y = 0.15;
const RADIUS = 0.24; // of ribbon width: keeps the leg, tick and label above the portrait
const INNER = 0.6; // dashed quadrant, as in CompassArc
const SMOOTHING = 0.08;
const DRIFT_MID = 45;
const DRIFT_AMP = 28;
const DRIFT_PERIOD_MS = 12000;

// Enters through DrawController's compass sweep, re-aimed at the crossing and
// opening from straight down toward the left, after the ring closes (500ms).
const DRAW_STYLE = {
  "--draw-origin": `${ORIGIN_X * 100}% ${ORIGIN_Y * 100}%`,
  "--draw-from": "180deg",
  "--draw-delay": "750ms",
} as CSSProperties;

/**
 * Live compass in the hero ribbon. On the full-desktop tier the leg follows the
 * pointer over the hero and the arc grows to meet it, labelled with the true
 * angle; with the pointer away it drifts slowly around 45°. The loop runs only
 * while the hero is on screen. Every other tier gets a still leg at 42°.
 * Updates go straight to SVG attributes, never React state.
 */
export default function HeroCompass({ containerId }: { containerId: string }) {
  const { tier } = useCapability();
  const svgRef = useRef<SVGSVGElement>(null);
  const innerRef = useRef<SVGPathElement>(null);
  const arcRef = useRef<SVGPathElement>(null);
  const legRef = useRef<SVGPathElement>(null);
  const tickRef = useRef<SVGPathElement>(null);
  const labelRef = useRef<SVGTextElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const ribbon = svg?.parentElement;
    const hero = document.getElementById(containerId);
    const [inner, arc, leg, tick, label] = [innerRef.current, arcRef.current, legRef.current, tickRef.current, labelRef.current];
    if (!svg || !ribbon || !hero || !inner || !arc || !leg || !tick || !label) return;

    let w = 0, h = 0, cx = 0, cy = 0, r = 0;
    let angle = COMPASS_REST_DEG;
    let target = angle;
    let pointerIn = false;
    let visible = false;
    let raf = 0;
    let driftStart = performance.now();

    const draw = (deg: number) => {
      const e = legEnd(cx, cy, r, deg);
      arc.setAttribute("d", `M ${cx} ${cy + r} A ${r} ${r} 0 0 1 ${e.x} ${e.y}`);
      leg.setAttribute("d", `M ${cx} ${cy} L ${e.x} ${e.y}`);
      tick.setAttribute("d", `M ${e.x - 5} ${e.y} H ${e.x + 5} M ${e.x} ${e.y - 5} V ${e.y + 5}`);
      label.setAttribute("x", String(Math.min(w - 8, Math.max(40, e.x - 10))));
      label.setAttribute("y", String(Math.min(h - 10, Math.max(16, e.y - 10))));
      label.textContent = `${Math.round(deg)}°`;
    };

    const layout = () => {
      w = ribbon.clientWidth;
      h = ribbon.clientHeight;
      cx = w * ORIGIN_X;
      cy = h * ORIGIN_Y;
      r = w * RADIUS;
      svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
      const ri = r * INNER;
      inner.setAttribute("d", `M ${cx} ${cy + ri} A ${ri} ${ri} 0 0 1 ${cx - ri} ${cy}`);
      draw(angle);
    };

    const resize = new ResizeObserver(layout);
    resize.observe(ribbon);
    layout();

    if (tier !== "full-desktop") return () => resize.disconnect();

    const frame = (now: number) => {
      raf = 0;
      if (!visible) return;
      if (!pointerIn) target = DRIFT_MID + DRIFT_AMP * Math.sin(((now - driftStart) / DRIFT_PERIOD_MS) * Math.PI * 2);
      angle += (target - angle) * SMOOTHING;
      draw(angle);
      raf = requestAnimationFrame(frame);
    };
    const kick = () => {
      if (visible && !raf) raf = requestAnimationFrame(frame);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const box = ribbon.getBoundingClientRect();
      target = pointerAngle(cx, cy, event.clientX - box.left, event.clientY - box.top);
      pointerIn = true;
      kick();
    };
    const onLeave = () => {
      pointerIn = false;
      // Resume the drift from the current angle instead of jumping to its phase.
      const phase = Math.asin(Math.min(1, Math.max(-1, (angle - DRIFT_MID) / DRIFT_AMP)));
      driftStart = performance.now() - (DRIFT_PERIOD_MS * phase) / (Math.PI * 2);
      kick();
    };
    const onScreen = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
      kick();
    });

    hero.addEventListener("pointermove", onMove);
    hero.addEventListener("pointerleave", onLeave);
    onScreen.observe(hero);

    return () => {
      cancelAnimationFrame(raf);
      resize.disconnect();
      onScreen.disconnect();
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
    };
  }, [containerId, tier]);

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      data-draw="compass"
      style={DRAW_STYLE}
      className="pointer-events-none absolute inset-0 hidden size-full text-white md:block"
    >
      <path ref={innerRef} fill="none" stroke="currentColor" strokeOpacity={0.25} strokeDasharray="2 4" vectorEffect="non-scaling-stroke" />
      <path ref={arcRef} fill="none" stroke="currentColor" strokeOpacity={0.35} vectorEffect="non-scaling-stroke" />
      <path ref={legRef} fill="none" stroke="currentColor" strokeOpacity={0.4} vectorEffect="non-scaling-stroke" />
      <path ref={tickRef} fill="none" stroke="currentColor" strokeOpacity={0.5} vectorEffect="non-scaling-stroke" />
      <text ref={labelRef} textAnchor="end" className="fill-white/85 font-[family-name:var(--font-mono)] text-[11px] tracking-[0.08em]" />
    </svg>
  );
}
