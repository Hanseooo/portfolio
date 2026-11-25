"use client";

import { usePathname } from "next/navigation";

const STROKE = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1,
  vectorEffect: "non-scaling-stroke",
} as const;

// CompassArc's frame: origin at (0,100), radius 96, angle measured clockwise
// from straight up. The leg stops at REACH; the dashed remainder of the
// quadrant is the ground it never reached.
const R = 96;
const REACH_DEG = 58;
const rad = (REACH_DEG * Math.PI) / 180;
const TIP = { x: +(R * Math.sin(rad)).toFixed(2), y: +(100 - R * Math.cos(rad)).toFixed(2) };

/**
 * 404 survey: a compass swung from its origin that stops short, with the
 * address that was asked for written at the leg's tip.
 */
export default function NotFoundSurvey({ className = "" }: { className?: string }) {
  const pathname = usePathname();
  return (
    <div aria-hidden="true" className={`pointer-events-none relative aspect-square ${className}`}>
      <svg data-draw="compass" viewBox="0 0 100 100" className="absolute inset-0 size-full overflow-visible text-[color:var(--cs-structural-line-strong)]">
        <path d={`M0 4 A${R} ${R} 0 0 1 ${TIP.x} ${TIP.y}`} {...STROKE} />
        <path d={`M${TIP.x} ${TIP.y} A${R} ${R} 0 0 1 ${R} 100`} {...STROKE} strokeDasharray="2 4" />
        <path d={`M0 100 L${TIP.x} ${TIP.y}`} {...STROKE} />
        <path d="M-4 100 H4 M0 96 V104" {...STROKE} />
        <path
          d={`M${TIP.x - 3} ${TIP.y} H${TIP.x + 3} M${TIP.x} ${TIP.y - 3} V${TIP.y + 3}`}
          {...STROKE}
          className="text-[color:var(--cs-signal)]"
          stroke="currentColor"
        />
      </svg>
      <span
        className="absolute max-w-[75%] -translate-y-full truncate pb-2 pr-3 text-right font-[family-name:var(--font-mono)] text-[11px] tracking-wider text-[color:var(--cs-text-secondary)]"
        style={{ right: `${100 - TIP.x}%`, top: `${TIP.y}%` }}
      >
        {pathname}
      </span>
    </div>
  );
}
