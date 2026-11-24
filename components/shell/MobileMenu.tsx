"use client";

import { useEffect, useLayoutEffect, useRef, useCallback, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, X } from "lucide-react";
import {
  MOBILE_NAV_SEQUENCE,
  HOMEPAGE_CHAPTER_SEQUENCE,
  DESTINATIONS,
  getDestinationHref,
  isRouteChange,
  type DestinationId,
} from "@/lib/destinations";
import {
  buildAnchorRequest,
  performNativeAnchorNavigation,
} from "@/lib/anchor-navigation";
import { useCapability } from "@/components/providers/CapabilityProvider";
import { useRouteHandoff } from "@/components/motion/RouteHandoffController";
import { RESUME_LABEL, RESUME_URL } from "@/components/utils/externalLinks";

interface MobileMenuProps {
  open: boolean;
  close: () => void;
  id: string;
  currentPathname: string;
}

const CUT_EASE = [0.65, 0, 0.35, 1] as const;

/** The sheet is cut open from the menu button and cut closed back into it (.menu-cut). */
const SHEET: Variants = {
  closed: { "--cut": "0%" },
  open: {
    "--cut": "100%",
    // Rows start while the cut is still opening so the whole menu is in by ~0.85s.
    transition: { duration: 0.36, ease: CUT_EASE, delayChildren: 0.15, staggerChildren: 0.05 },
  },
  // A route change holds the menu until the handoff cover has closed over it (300ms), then drops it.
  exit: (toRoute: boolean) =>
    toRoute
      ? { "--cut": "0%", transition: { duration: 0, delay: 0.32 } }
      : { "--cut": "0%", transition: { duration: 0.22, ease: CUT_EASE } },
};

const ROW: Variants = {
  closed: { opacity: 0, y: 16 },
  open: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
};

/** Sections enter with the last route row, so the menu never staggers more than 8 rows. */
const SECTIONS_ENTER = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, delay: 0.15 + 7 * 0.05, ease: [0.16, 1, 0.3, 1] } },
} as const;

const LEADER: Variants = {
  closed: { scaleX: 0 },
  open: { scaleX: 1, transition: { duration: 0.45, delay: 0.15, ease: [0.16, 1, 0.3, 1] } },
};

/**
 * Full-screen mobile menu — S5 §8, S6 §6.1.
 *
 * Behavior:
 * - Cut open from the menu button, rows staggered in, current route's leader drawn;
 *   cut closed on dismiss (immediate in reduced-motion)
 * - Focus trapped while open
 * - Escape closes and restores focus
 * - Activating current route closes without handoff
 * - Same-route anchor closes and performs native anchor nav
 * - Different-route navigates via router
 * - Homepage chapter anchors shown when on homepage
 */
export default function MobileMenu({ open, close, id, currentPathname }: MobileMenuProps) {
  const firstFocusRef = useRef<HTMLAnchorElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const { tier } = useCapability();
  const { navigate: handoffNavigate } = useRouteHandoff();
  const reducedMotion = tier === "reduced-motion";
  // True once a route link closed the menu; read by the exit variant. Cleared on reopen.
  const [toRoute, setToRoute] = useState(false);
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setToRoute(false);
  }

  // Cut from the center of the button that opened the menu, set before the first frame.
  useLayoutEffect(() => {
    if (!open) return;
    const rect = document.querySelector(`[aria-controls="${id}"]`)?.getBoundingClientRect();
    if (rect) dialogRef.current?.style.setProperty("--menu-origin", `${rect.left + rect.width / 2}px ${rect.top + rect.height / 2}px`);
  }, [open, id]);

  // Focus first link when opened; restore the invoker on close
  useEffect(() => {
    if (!open) return;
    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    // Small delay to allow Framer to mount
    const raf = requestAnimationFrame(() => {
      firstFocusRef.current?.focus();
    });
    return () => {
      cancelAnimationFrame(raf);
      restoreFocusRef.current?.focus();
    };
  }, [open]);

  // Escape closes; Tab stays inside the dialog
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key !== "Tab") return;

      const dialog = dialogRef.current;
      if (!dialog) return;
      // ponytail: every focusable in this dialog is a link or a button —
      // no need for the full tabbable-selector list.
      const focusables = dialog.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled])"
      );
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (e.shiftKey) {
        if (active === first || !dialog.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else if (active === last || !dialog.contains(active)) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, close]);

  // Prevent body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [open]);

  const handleNavigation = useCallback(
    (destId: DestinationId, from: Element) => {
      const dest = DESTINATIONS[destId];
      const href = getDestinationHref(dest);

      // Same-route anchor
      if (dest.fragment && !isRouteChange(dest, currentPathname)) {
        const request = buildAnchorRequest(dest, currentPathname);
        close();
        if (request && performNativeAnchorNavigation(request)) restoreFocusRef.current = null;
        return;
      }

      // Current route without fragment — just close
      if (!isRouteChange(dest, currentPathname) && !dest.fragment) {
        close();
        return;
      }

      // Different route — use handoff for eligible navigation
      setToRoute(true);
      close();
      handoffNavigate(href, from);
    },
    [currentPathname, close, handoffNavigate]
  );

  const showChapters = currentPathname === "/";

  return (
    <AnimatePresence custom={toRoute}>
      {open && (
        <motion.div
          ref={dialogRef}
          id={id}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          variants={reducedMotion ? undefined : SHEET}
          custom={toRoute}
          initial={reducedMotion ? false : "closed"}
          animate="open"
          exit={reducedMotion ? undefined : "exit"}
          className={`fixed inset-0 z-50 bg-[color:var(--cs-foundation)] ${reducedMotion ? "" : "menu-cut"}`}
        >
          {!reducedMotion && <div aria-hidden="true" className="menu-edge pointer-events-none absolute inset-0 z-10" />}
          <div className="flex h-full flex-col overflow-y-auto">
          {/* Same height and gutter as the site header, so Close lands exactly on the menu button. */}
          <div className="flex h-16 shrink-0 items-center justify-between px-[var(--cs-gutter-portfolio)] border-b border-[color:var(--cs-structural-line)]">
            <span className="font-[family-name:var(--font-mono)] text-xs font-bold uppercase tracking-widest text-[color:var(--cs-text-primary)]">
              Menu
            </span>
            <button
              type="button"
              onClick={close}
              className="flex h-11 w-11 items-center justify-center text-[color:var(--cs-text-primary)] transition-colors hover:text-[color:var(--cs-signal)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--cs-focus-ring)]"
              aria-label="Close menu"
            >
              <X size={24} aria-hidden="true" />
            </button>
          </div>

          {/* Route links */}
          <nav aria-label="Menu navigation" className="flex-1 px-[var(--cs-gutter-portfolio)] py-6">
            <ul className="flex flex-col gap-2" role="list">
              {MOBILE_NAV_SEQUENCE.map((destId, index) => {
                const dest = DESTINATIONS[destId];
                const href = getDestinationHref(dest);
                const isCurrent =
                  dest.pathname === currentPathname && !dest.fragment;

                return (
                  <motion.li key={destId} variants={reducedMotion ? undefined : ROW}>
                    <Link
                      ref={index === 0 ? firstFocusRef : undefined}
                      href={href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavigation(destId, e.currentTarget);
                      }}
                      className={`flex h-12 items-center font-[family-name:var(--font-display)] text-2xl uppercase tracking-wider transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--cs-focus-ring)] ${
                        isCurrent
                          ? "text-[color:var(--cs-signal)]"
                          : "text-[color:var(--cs-text-primary)] hover:text-[color:var(--cs-signal)]"
                      }`}
                      aria-current={isCurrent ? "page" : undefined}
                    >
                      {isCurrent && (
                        <motion.span
                          aria-hidden="true"
                          variants={reducedMotion ? undefined : LEADER}
                          className="mr-4 h-px w-8 origin-left bg-[color:var(--cs-signal)]"
                        />
                      )}
                      {dest.label}
                    </Link>
                  </motion.li>
                );
              })}
              <motion.li variants={reducedMotion ? undefined : ROW}>
                <a
                  href={RESUME_URL}
                  target="_blank"
                  rel="noopener"
                  aria-label={RESUME_LABEL}
                  onClick={close}
                  className="flex h-12 items-center gap-2 font-[family-name:var(--font-display)] text-2xl uppercase tracking-wider text-[color:var(--cs-text-primary)] transition-colors hover:text-[color:var(--cs-signal)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--cs-focus-ring)]"
                >
                  Resume
                  <ArrowUpRight size={20} aria-hidden="true" />
                </a>
              </motion.li>
            </ul>

            {/* Homepage chapter anchors (only when on homepage) */}
            {showChapters && (
              <motion.div {...(reducedMotion ? {} : SECTIONS_ENTER)} className="mt-8 border-t border-[color:var(--cs-structural-line)] pt-6">
                <p className="mb-3 font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[color:var(--cs-text-secondary)]">
                  Sections
                </p>
                <ul className="grid grid-cols-2 gap-x-4" role="list">
                  {HOMEPAGE_CHAPTER_SEQUENCE.map((destId) => {
                    const dest = DESTINATIONS[destId];
                    return (
                      <li key={destId}>
                        <button
                          type="button"
                          onClick={(e) => handleNavigation(destId, e.currentTarget)}
                          className="flex h-11 w-full items-center text-left font-[family-name:var(--font-mono)] text-sm text-[color:var(--cs-text-secondary)] transition-colors hover:text-[color:var(--cs-signal)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--cs-focus-ring)]"
                          aria-label={dest.accessibleName}
                        >
                          {dest.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </motion.div>
            )}
          </nav>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
