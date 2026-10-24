// components/geometry/index.tsx

/**
 * Constructed line marks — refresh docket, geometry row.
 *
 * Real constructions (brackets, arcs, registration circles) that frame content.
 * Strokes use currentColor, so callers set the color with a text-* class.
 * All marks are decorative: aria-hidden, pointer-events-none, no invented labels.
 * `data-draw` lets DrawController construct each mark once as it scrolls into
 * view (see "Drawn marks" in globals.css); without JS they render finished.
 */

import type { CSSProperties } from "react";

const STROKE = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1,
  vectorEffect: "non-scaling-stroke",
} as const;

/** `inward` points from each corner toward the box center (x, y signs). */
const CORNERS = [
  { top: 0, left: 0, rotate: 0, inward: [1, 1] },
  { top: 0, right: 0, rotate: 90, inward: [-1, 1] },
  { bottom: 0, right: 0, rotate: 180, inward: [-1, -1] },
  { bottom: 0, left: 0, rotate: 270, inward: [1, -1] },
] as const;

/**
 * Corner brackets just outside the four corners of the nearest positioned parent.
 * The parent must not clip overflow.
 */
export function CropMarks({
  size = 14,
  offset = 6,
  className = "",
}: {
  size?: number;
  offset?: number;
  className?: string;
}) {
  return (
    <span aria-hidden="true" data-draw="settle" className={`pointer-events-none absolute inset-0 ${className}`}>
      {CORNERS.map(({ rotate, inward: [x, y], ...edges }) => (
        <svg
          key={rotate}
          width={size}
          height={size}
          viewBox="0 0 14 14"
          className="absolute"
          style={
            {
              ...Object.fromEntries(Object.keys(edges).map((edge) => [edge, -offset])),
              transform: `rotate(${rotate}deg)`,
              "--crop-x": x,
              "--crop-y": y,
            } as CSSProperties
          }
        >
          <path d="M0.5 14 V0.5 H14" {...STROKE} />
        </svg>
      ))}
    </span>
  );
}

/** Surveyor's registration circle: ring, crosshair, center point. */
export function RegistrationMark({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" data-draw="ring" viewBox="0 0 100 100" className={`pointer-events-none ${className}`}>
      <circle cx="50" cy="50" r="30" {...STROKE} />
      <circle cx="50" cy="50" r="4" {...STROKE} />
      <path d="M50 0 V100 M0 50 H100" {...STROKE} />
    </svg>
  );
}

/**
 * Compass construction swung from the bottom-left corner of its box:
 * a full arc, a dashed inner arc, and one radius line.
 */
export function CompassArc({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" data-draw="compass" viewBox="0 0 100 100" className={`pointer-events-none overflow-visible ${className}`}>
      <path d="M0 4 A96 96 0 0 1 96 100" {...STROKE} />
      <path d="M0 40 A60 60 0 0 1 60 100" {...STROKE} strokeDasharray="2 4" />
      <path d="M0 100 L68 32" {...STROKE} />
      <path d="M-4 100 H4 M0 96 V104" {...STROKE} />
    </svg>
  );
}

/** Record index set as a display numeral with a short leader line. */
export function IndexMark({ position, className = "" }: { position: number; className?: string }) {
  return (
    <span className={`flex items-center gap-4 ${className}`}>
      <span className="font-[family-name:var(--font-display)] text-4xl font-black leading-none text-[color:var(--cs-signal-text)]">
        {String(position).padStart(2, "0")}
      </span>
      <span aria-hidden="true" className="h-px w-12 bg-[color:var(--cs-structural-line-strong)]" />
    </span>
  );
}
