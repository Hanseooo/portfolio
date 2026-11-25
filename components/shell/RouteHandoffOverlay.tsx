"use client";

import type { CSSProperties } from "react";
import { useRouteHandoff } from "@/components/motion/RouteHandoffController";

/**
 * Route-handoff cover, drawn as a compass cut (globals.css `.handoff-cover`). The ivory sheet is
 * cut closed from the control that asked for the route, then cut open on the new page from the
 * top-right, where the masthead's compass sits. A 1px signal edge rides both cuts. Reduced-motion
 * and webview tiers never raise it (RouteHandoffController).
 */
export default function RouteHandoffOverlay() {
  const { phase, isActive, origin } = useRouteHandoff();
  if (!isActive) return null;

  return (
    <div
      data-phase={phase === "revealing" ? "open" : "close"}
      style={{ "--handoff-origin": origin } as CSSProperties}
      className="handoff-cover pointer-events-none fixed inset-0 z-[9000] bg-[color:var(--cs-foundation)]"
      aria-hidden="true"
    >
      <div className="handoff-edge absolute inset-0" />
    </div>
  );
}
