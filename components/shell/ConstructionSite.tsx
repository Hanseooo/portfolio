"use client";

import { useEffect, useRef } from "react";
import { useCapability } from "@/components/providers/CapabilityProvider";
import { CYCLE_S, STILL_T, clamp, craneState, trolleyX, type CraneStops } from "@/lib/construction-site";
import type { MotionTier } from "@/lib/motion-budget";

const SVGNS = "http://www.w3.org/2000/svg";
const ANIMATED_TIERS = new Set<MotionTier>(["full-desktop", "mobile-touch", "short-height"]);

function el<K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string | number>, parent: Element) {
  const node = document.createElementNS(SVGNS, tag);
  for (const k in attrs) node.setAttribute(k, String(attrs[k]));
  parent.appendChild(node);
  return node;
}

/**
 * Footer construction site: one hatched floor per project, and a tower crane
 * hoisting the next floor as a dashed outline. The load swings from the
 * trolley and traces a dashed compass arc while it does. A few crosses
 * twinkle in the sky; in dark mode some windows are lit. Runs only while the
 * footer is on screen and on animated tiers; otherwise one still frame.
 * Built imperatively from the measured width, so React renders only the <svg>.
 */
export default function ConstructionSite({ floors }: { floors: number }) {
  const { tier } = useCapability();
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const animated = ANIMATED_TIERS.has(tier);

    type Parts = {
      windows: SVGRectElement[];
      roofLoad: SVGRectElement;
      yardLoad: SVGRectElement;
      swingArc: SVGPathElement;
      trolley: SVGGElement;
      pend: SVGGElement;
      rope: SVGPathElement;
      hook: SVGPathElement;
      load: SVGGElement;
      sling: SVGPathElement;
      loadRect: SVGRectElement;
    };
    let parts: Parts | null = null;
    let stops: CraneStops = { xYard: 0, xRoof: 0, hookYard: 0, hookHigh: 0, hookRoof: 0 };
    let jibY = 0, fh = 0, bw = 0, swingL = 120;
    let visible = false, raf = 0, last = 0, clock = 0, litClock = 0;
    let theta = 0, omega = 0;

    const build = () => {
      const W = svg.clientWidth;
      const H = svg.clientHeight;
      if (!W || !H) return;
      const phone = H < 240;
      const G = H - 34;
      fh = phone ? 13 : 18;
      bw = phone ? 96 : 170;
      // Wide frames: the crane reaches across the whole sheet. Building and mast
      // sit at the right, the yard at the far left.
      const wide = !phone && W >= 1100;
      const x0 = phone ? 14 : wide ? Math.max(32, W * 0.04) : Math.max(32, W * 0.1);
      const gap = phone ? 28 : 52;
      const mastX = wide ? W - 28 - 96 : x0 + bw + gap + bw + (phone ? 34 : 60);
      const bx = wide ? mastX - 60 - bw : x0 + bw + gap;
      const yardX = x0;
      const roofY = G - floors * fh;
      jibY = phone ? 44 : 42;
      const jibL = yardX - (phone ? 6 : 14);
      const cEnd = mastX + (phone ? 58 : 96);
      stops = { xYard: yardX + bw / 2, xRoof: bx + bw / 2, hookYard: G - fh - 14, hookRoof: roofY - fh - 14, hookHigh: jibY + 22 };
      // A longer carry would throw the load past its clamp; scale the swing so it
      // stays a sway (about 11 degrees across a full-width carry, 8 on tablets).
      swingL = 120 * Math.max(1, (stops.xRoof - stops.xYard) / 300);
      svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
      svg.textContent = "";

      const hatchId = "site-hatch";
      const pat = el("pattern", { id: hatchId, width: 7, height: 7, patternUnits: "userSpaceOnUse", patternTransform: "rotate(45)" }, el("defs", {}, svg));
      el("line", { class: "hatch-ln", x1: 0, y1: 0, x2: 0, y2: 7 }, pat);
      const hatch = `url(#${hatchId})`;

      // Sky crosses at fixed grid points, clear of the crane.
      const crosses = el("g", {}, svg);
      let seed = 7 + Math.round(W);
      const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
      // Clear of the crane: the jib and the band the load travels through, and
      // the columns where it is lifted and lowered (yard, building, mast).
      const loadBand = stops.hookHigh + 14 + fh + 14;
      const inColumn = (x: number) =>
        (x > yardX - 16 && x < yardX + bw + 16) || (x > bx - 28 && x < cEnd + 40);
      const cells: [number, number][] = [];
      for (let x = 24; x < W - 16; x += 48) {
        for (let y = 16; y < G - 40; y += 40) {
          const inSpan = x > jibL - 24 && x < cEnd + 40;
          if (!(inSpan && (y > jibY - 36 && (y < loadBand || inColumn(x))))) cells.push([x, y]);
        }
      }
      const count = Math.min(cells.length, phone ? 4 : 10);
      for (let i = 0; i < count; i++) {
        const [cx, cy] = cells.splice(Math.floor(rand() * cells.length), 1)[0];
        // Nudge off the grid so a single open row does not read as a dotted line.
        const x = cx + (rand() - 0.5) * 16;
        const y = Math.max(8, cy + (rand() - 0.5) * 28);
        const c = el("path", { class: "x", d: `M ${x - 3.5} ${y} H ${x + 3.5} M ${x} ${y - 3.5} V ${y + 3.5}` }, crosses);
        c.style.setProperty("--delay", `${(-rand() * 6).toFixed(2)}s`);
        c.style.setProperty("--dur", `${(4 + rand() * 4).toFixed(2)}s`);
      }

      // Ground and section-cut earth under the site.
      el("path", { class: "ln", d: `M 0 ${G} H ${W}` }, svg);
      el("rect", { x: jibL - 10, y: G, width: cEnd - jibL + 30, height: 9, fill: hatch }, svg);
      el("path", { class: "ln soft", d: `M ${jibL - 10} ${G + 9} H ${cEnd + 20}` }, svg);

      // Building: one hatched floor per project.
      const windows: SVGRectElement[] = [];
      const wn = 5, ww = Math.round(bw * 0.075), wh = Math.round(fh * 0.42);
      const wgap = (bw - wn * ww) / (wn + 1);
      for (let f = 0; f < floors; f++) {
        const y = G - (f + 1) * fh;
        el("rect", { x: bx, y, width: bw, height: fh, fill: hatch, class: "wall" }, svg);
        for (let k = 0; k < wn; k++) {
          windows.push(el("rect", { class: "win", x: bx + wgap + k * (ww + wgap), y: y + (fh - wh) / 2, width: ww, height: wh }, svg));
        }
      }
      // Dimension line up the building's left side, with the real count beneath.
      const dx = bx - (phone ? 10 : 16);
      let dd = `M ${dx} ${G} V ${roofY}`;
      for (let f = 0; f <= floors; f++) dd += ` M ${dx - 3} ${G - f * fh} H ${dx + 3}`;
      el("path", { class: "ln", d: dd }, svg);
      el("text", { class: "label", x: bx + bw / 2, y: G + 24, "text-anchor": "middle" }, svg).textContent =
        `${String(floors).padStart(2, "0")} PROJECTS`;

      // Tower crane: lattice mast, cat-head, jib, counter-jib.
      let m = `M ${mastX - 5} ${G} V ${jibY} M ${mastX + 5} ${G} V ${jibY} M ${mastX - 5} ${G}`;
      for (let y = G, s = 1; y > jibY + 6; y -= 12, s = -s) m += ` L ${mastX + 5 * s} ${y - 12}`;
      el("path", { class: "ln", d: m }, svg);
      const apexY = jibY - 22;
      el("path", { class: "ln", d: `M ${mastX - 5} ${jibY} L ${mastX} ${apexY} L ${mastX + 5} ${jibY}` }, svg);
      el("path", { class: "ln soft", d: `M ${mastX} ${apexY} L ${jibL + 8} ${jibY} M ${mastX} ${apexY} L ${cEnd} ${jibY}` }, svg);
      let j = `M ${jibL} ${jibY} H ${cEnd} M ${jibL} ${jibY + 6} H ${cEnd} M ${jibL} ${jibY} V ${jibY + 6} M ${cEnd} ${jibY} V ${jibY + 6} M ${jibL} ${jibY + 6}`;
      for (let x = jibL, s = 0; x < cEnd - 8; x += 8, s ^= 1) j += ` L ${x + 8} ${jibY + (s ? 6 : 0)}`;
      el("path", { class: "ln", d: j }, svg);
      el("rect", { class: "wall", x: cEnd - 24, y: jibY + 6, width: 20, height: 18, fill: hatch }, svg);
      el("rect", { class: "ln solid", x: mastX + 6, y: jibY + 6, width: 12, height: 10 }, svg);

      // Moving parts.
      const roofLoad = el("rect", { class: "ln dash", x: bx, y: roofY - fh, width: bw, height: fh }, svg);
      const yardLoad = el("rect", { class: "ln dash", x: yardX, y: G - fh, width: bw, height: fh }, svg);
      const swingArc = el("path", { class: "ln dash", opacity: 0 }, svg);
      const trolley = el("g", {}, svg);
      el("rect", { class: "ln solid", x: -6, y: jibY + 6, width: 12, height: 4 }, trolley);
      el("path", { class: "ln soft", d: `M -4 ${jibY + 13} H 4 M 0 ${jibY + 9} V ${jibY + 17}` }, trolley);
      const pend = el("g", {}, svg);
      const rope = el("path", { class: "ln" }, pend);
      const hook = el("path", { class: "ln" }, pend);
      const load = el("g", {}, pend);
      const sling = el("path", { class: "ln soft" }, load);
      const loadRect = el("rect", { class: "ln dash", width: bw, height: fh }, load);

      parts = { windows, roofLoad, yardLoad, swingArc, trolley, pend, rope, hook, load, sling, loadRect };
      (phone ? [3, 11, 22] : [2, 9, 13, 21, 27]).forEach((i) => windows[i]?.classList.add("lit"));
      render(animated ? clock : STILL_T, !animated);
    };

    const physics = (t: number, dt: number) => {
      // Pendulum hanging from the trolley, driven by the trolley's acceleration.
      const w0 = (2 * Math.PI) / 1.7, damp = 1.1, lEff = swingL;
      const steps = Math.max(1, Math.ceil(dt / (1 / 240)));
      const h = dt / steps;
      for (let i = 0; i < steps; i++) {
        const tt = t - dt + (i + 1) * h, e = 1 / 120;
        const ax = (trolleyX(tt + e, stops) - 2 * trolleyX(tt, stops) + trolleyX(tt - e, stops)) / (e * e);
        omega += (-w0 * w0 * theta - ax / lEff - damp * omega) * h;
        theta += omega * h;
      }
      theta = clamp(theta, -0.3, 0.3);
    };

    const render = (t: number, still: boolean) => {
      if (!parts) return;
      const p = parts, s = craneState(t, stops);
      const th = still ? 0 : theta * s.calm;
      const pivotY = jibY + 10;
      p.trolley.setAttribute("transform", `translate(${s.x} 0)`);
      p.pend.setAttribute("transform", `rotate(${(th * 180) / Math.PI} ${s.x} ${pivotY})`);
      p.rope.setAttribute("d", `M ${s.x} ${pivotY} V ${s.hookY}`);
      p.hook.setAttribute("d", `M ${s.x - 3} ${s.hookY} H ${s.x + 3} V ${s.hookY + 4} H ${s.x - 3} Z`);
      p.load.style.display = s.attached ? "" : "none";
      const top = s.hookY + 14;
      p.sling.setAttribute("d", `M ${s.x} ${s.hookY + 4} L ${s.x - bw / 2} ${top} M ${s.x} ${s.hookY + 4} L ${s.x + bw / 2} ${top}`);
      p.loadRect.setAttribute("x", String(s.x - bw / 2));
      p.loadRect.setAttribute("y", String(top));
      p.roofLoad.setAttribute("opacity", String(s.roofOpacity));
      p.yardLoad.setAttribute("opacity", String(s.yardOpacity));
      // The compass trace: a dashed arc around the trolley while the load swings.
      const rr = s.attached ? top + fh - pivotY : s.hookY + 4 - pivotY;
      const a0 = Math.PI / 2 - 0.28, a1 = Math.PI / 2 + 0.28;
      p.swingArc.setAttribute("d", `M ${s.x + rr * Math.cos(a0)} ${pivotY + rr * Math.sin(a0)} A ${rr} ${rr} 0 0 1 ${s.x + rr * Math.cos(a1)} ${pivotY + rr * Math.sin(a1)}`);
      p.swingArc.setAttribute("opacity", String(still ? 0 : clamp(Math.abs(th) / 0.06, 0, 1) * 0.9));
    };

    const frame = (now: number) => {
      raf = 0;
      if (!visible || !parts) return;
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 0);
      last = now;
      clock = (clock + dt) % CYCLE_S;
      if (clock < dt) theta = omega = 0;
      physics(clock, dt);
      render(clock, false);
      litClock += dt;
      if (litClock > 3.2) {
        litClock = 0;
        parts.windows[Math.floor(Math.random() * parts.windows.length)]?.classList.toggle("lit");
      }
      raf = requestAnimationFrame(frame);
    };

    let lastW = 0;
    const resize = new ResizeObserver(() => {
      if (Math.abs(svg.clientWidth - lastW) > 1) {
        lastW = svg.clientWidth;
        build();
      }
    });
    resize.observe(svg);

    if (!animated) {
      svg.classList.add("still");
      return () => resize.disconnect();
    }
    svg.classList.remove("still");

    const onScreen = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      svg.classList.toggle("paused", !visible);
      if (visible && !raf) {
        last = 0;
        raf = requestAnimationFrame(frame);
      }
    });
    onScreen.observe(svg);

    return () => {
      cancelAnimationFrame(raf);
      resize.disconnect();
      onScreen.disconnect();
    };
  }, [floors, tier]);

  return <svg ref={svgRef} aria-hidden="true" className="site-scene" />;
}
