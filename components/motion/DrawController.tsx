"use client";

import { useEffect, useRef, useState } from "react";
import { useCapability } from "@/components/providers/CapabilityProvider";
import { useRouteHandoff } from "@/components/motion/RouteHandoffController";
import { ARRIVAL_DONE_EVENT } from "@/components/motion/BrandedArrival";

const MARK_SELECTOR = "[data-draw]";
/** Same edge the route registers reveal on (motion-recipes REGISTER_EDGE_MARGIN). */
const ROOT_MARGIN = "0px 0px -15% 0px";

/**
 * Drawn marks — constructs each geometry mark once as it scrolls into view.
 *
 * Owns <html data-draw-armed> and each mark's data-drawn state; globals.css
 * owns what each state looks like. Marks wait while the branded arrival or a
 * route handoff covers the page, so nothing draws unseen. When no cover is up
 * at arming time, marks already on the page are finished instantly instead of
 * blinking out and redrawing.
 */
export default function DrawController() {
  const { initialized, structuredReveal } = useCapability();
  const { phase } = useRouteHandoff();
  const armedRef = useRef(false);
  /** armed: styles live, waiting on the arrival cover. arrived: free to draw. */
  const [stage, setStage] = useState<"unarmed" | "armed" | "arrived">("unarmed");

  // Arm once, on the first eligible capability resolution.
  useEffect(() => {
    if (!initialized || !structuredReveal || armedRef.current) return;
    armedRef.current = true;
    const root = document.documentElement;
    const covered = root.dataset.arrival === "covering";
    if (!covered) {
      document.querySelectorAll<HTMLElement>(MARK_SELECTOR).forEach((mark) => {
        mark.dataset.drawn = "done";
      });
    }
    root.dataset.drawArmed = "";
    if (covered) {
      // Not removed on cleanup: arming happens once, so a tier change while
      // the cover is up must not drop the only signal that opens the gate.
      window.addEventListener(ARRIVAL_DONE_EVENT, () => setStage("arrived"), { once: true });
    }
    setStage(covered ? "armed" : "arrived");
  }, [initialized, structuredReveal]);

  // Retire a mark's animation styles (and its mask) once it finishes.
  const armed = stage !== "unarmed";
  useEffect(() => {
    if (!armed) return;
    const finish = (event: AnimationEvent) => {
      if (!event.animationName.startsWith("draw-")) return;
      const mark = (event.target as Element).closest<HTMLElement>('[data-drawn="run"]');
      if (mark) mark.dataset.drawn = "done";
    };
    document.addEventListener("animationend", finish);
    document.addEventListener("animationcancel", finish);
    return () => {
      document.removeEventListener("animationend", finish);
      document.removeEventListener("animationcancel", finish);
    };
  }, [armed]);

  const open = stage === "arrived" && (phase === "idle" || phase === "revealing");

  // Observe undrawn marks, including ones a later render or route adds.
  useEffect(() => {
    if (!open) return;
    const intersection = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.drawn = "run";
          intersection.unobserve(entry.target);
        }
      },
      { rootMargin: ROOT_MARGIN }
    );
    const watch = (scope: ParentNode) => {
      scope.querySelectorAll<HTMLElement>(`${MARK_SELECTOR}:not([data-drawn])`).forEach((mark) => {
        intersection.observe(mark);
      });
    };
    watch(document);
    const mutations = new MutationObserver((records) => {
      for (const record of records) {
        record.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement || node instanceof SVGElement)) return;
          if (node.matches(`${MARK_SELECTOR}:not([data-drawn])`)) intersection.observe(node);
          watch(node);
        });
      }
    });
    mutations.observe(document.body, { childList: true, subtree: true });
    return () => {
      mutations.disconnect();
      intersection.disconnect();
    };
  }, [open]);

  return null;
}
