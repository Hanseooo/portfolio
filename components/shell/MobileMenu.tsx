"use client";

import { useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { X } from "lucide-react";
import {
  GLOBAL_NAV_SEQUENCE,
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

interface MobileMenuProps {
  open: boolean;
  close: () => void;
  id: string;
  currentPathname: string;
}

/**
 * Full-screen mobile menu — S5 §8, S6 §6.1.
 *
 * Behavior:
 * - Framer presence for enter/exit (immediate in reduced-motion)
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
    (destId: DestinationId) => {
      const dest = DESTINATIONS[destId];
      const href = getDestinationHref(dest);

      // Same-route anchor
      if (dest.fragment && !isRouteChange(dest, currentPathname)) {
        const request = buildAnchorRequest(dest, currentPathname);
        if (request) performNativeAnchorNavigation(request);
        close();
        return;
      }

      // Current route without fragment — just close
      if (!isRouteChange(dest, currentPathname) && !dest.fragment) {
        close();
        return;
      }

      // Different route — use handoff for eligible navigation
      close();
      handoffNavigate(href);
    },
    [currentPathname, close, handoffNavigate]
  );

  const showChapters = currentPathname === "/";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={dialogRef}
          id={id}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reducedMotion ? undefined : { opacity: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.2 }}
          className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-[color:var(--cs-foundation)] pt-4"
        >
          {/* Overlay Top Bar with explicit X Close Button */}
          <div className="flex items-center justify-between px-[var(--cs-gutter-portfolio)] py-3 border-b border-[color:var(--cs-structural-line)]">
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
          <nav aria-label="Menu navigation" className="flex-1 px-[var(--cs-gutter-portfolio)] py-8">
            <ul className="flex flex-col gap-2" role="list">
              {GLOBAL_NAV_SEQUENCE.map((destId, index) => {
                const dest = DESTINATIONS[destId];
                const href = getDestinationHref(dest);
                const isCurrent =
                  dest.pathname === currentPathname && !dest.fragment;

                return (
                  <li key={destId}>
                    <Link
                      ref={index === 0 ? firstFocusRef : undefined}
                      href={href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavigation(destId);
                      }}
                      className={`flex h-14 items-center font-[family-name:var(--font-display)] text-2xl uppercase tracking-wider transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--cs-focus-ring)] ${
                        isCurrent
                          ? "text-[color:var(--cs-signal)]"
                          : "text-[color:var(--cs-text-primary)] hover:text-[color:var(--cs-signal)]"
                      }`}
                      aria-current={isCurrent ? "page" : undefined}
                    >
                      {dest.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Homepage chapter anchors (only when on homepage) */}
            {showChapters && (
              <div className="mt-8 border-t border-[color:var(--cs-structural-line)] pt-6">
                <p className="mb-3 font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[color:var(--cs-text-secondary)]">
                  Sections
                </p>
                <ul className="flex flex-col gap-1" role="list">
                  {HOMEPAGE_CHAPTER_SEQUENCE.map((destId) => {
                    const dest = DESTINATIONS[destId];
                    return (
                      <li key={destId}>
                        <button
                          type="button"
                          onClick={() => handleNavigation(destId)}
                          className="flex h-11 items-center gap-3 font-[family-name:var(--font-mono)] text-sm text-[color:var(--cs-text-secondary)] transition-colors hover:text-[color:var(--cs-signal)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--cs-focus-ring)]"
                          aria-label={dest.accessibleName}
                        >
                          {dest.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
