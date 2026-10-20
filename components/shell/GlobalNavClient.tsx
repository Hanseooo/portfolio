"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { ThemeControl } from "./ThemeControl";
import MobileMenu from "./MobileMenu";
import {
  DESTINATIONS,
  getDestinationHref,
  type DestinationId,
} from "@/lib/destinations";
import { useRouteHandoff } from "@/components/motion/RouteHandoffController";
import { RESUME_LABEL, RESUME_URL } from "@/components/utils/externalLinks";

const MENU_ID = "portfolio-mobile-menu";

/** Desktop-visible nav destinations (excludes Contact — it's in footer/menu) */
const DESKTOP_NAV_IDS: DestinationId[] = ["home", "projects", "experience", "certificates", "resources"];

export default function GlobalNavClient() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const { navigate: handoffNavigate } = useRouteHandoff();

  useEffect(() => {
    const header = navRef.current?.closest("header");
    const update = () => header?.setAttribute("data-scrolled", String(window.scrollY > 0));
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  const isCurrentRoute = (destId: DestinationId): boolean => {
    const dest = DESTINATIONS[destId];
    if (dest.pathname === "/" && !dest.fragment) return pathname === "/";
    return pathname.startsWith(dest.pathname) && dest.pathname !== "/";
  };

  return (
    <>
      <nav
        ref={navRef}
        aria-label="Site navigation"
        className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-[var(--cs-gutter-portfolio)] md:h-20"
      >
        {/* Wordmark / Home */}
        <Link
          href="/"
          onClick={(e) => {
            const nativeNavigation =
              e.button !== 0 ||
              e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;
            if (nativeNavigation) return;
            if (pathname === "/") return; // already home — no handoff
            e.preventDefault();
            handoffNavigate("/");
          }}
          className="flex h-11 items-center font-[family-name:var(--font-display)] text-base uppercase tracking-[0.15em] text-[color:var(--cs-text-primary)] transition-colors hover:text-[color:var(--cs-signal)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--cs-focus-ring)]"
          aria-label="Hans Amoguis — Home"
          aria-current={pathname === "/" ? "page" : undefined}
        >
          Hanseo
        </Link>

        {/* Desktop route links — hidden below md */}
        <ul className="hidden md:flex md:items-center md:gap-1" role="list">
          {DESKTOP_NAV_IDS.map((id) => {
            const dest = DESTINATIONS[id];
            const current = isCurrentRoute(id);
            return (
              <li key={id}>
                <Link
                  href={getDestinationHref(dest)}
                  onClick={(e) => {
                    const anchor = e.currentTarget;
                    const nativeNavigation =
                      e.button !== 0 ||
                      e.metaKey || e.ctrlKey || e.shiftKey || e.altKey ||
                      anchor.target === "_blank" ||
                      anchor.hasAttribute("download");
                    if (nativeNavigation) return;
                    e.preventDefault();
                    handoffNavigate(getDestinationHref(dest));
                  }}
                  className={`flex h-11 items-center px-4 font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--cs-focus-ring)] ${
                    current
                      ? "text-[color:var(--cs-signal)]"
                      : "text-[color:var(--cs-text-secondary)] hover:text-[color:var(--cs-text-primary)]"
                  }`}
                  aria-current={current ? "page" : undefined}
                >
                  {dest.label}
                </Link>
              </li>
            );
          })}
          <li>
            <a
              href={RESUME_URL}
              target="_blank"
              rel="noopener"
              aria-label={RESUME_LABEL}
              className="flex h-11 items-center gap-1 px-4 font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[color:var(--cs-text-secondary)] transition-colors hover:text-[color:var(--cs-text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--cs-focus-ring)]"
            >
              Resume
              <ArrowUpRight size={12} aria-hidden="true" />
            </a>
          </li>
        </ul>

        {/* Right controls */}
        <div className="flex items-center gap-1">
          <ThemeControl />

          {/* Menu toggle */}
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex h-11 w-11 items-center justify-center text-[color:var(--cs-text-primary)] md:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--cs-focus-ring)]"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls={MENU_ID}
          >
            {menuOpen ? (
              <X size={24} aria-hidden="true" />
            ) : (
              <Menu size={24} aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu
        open={menuOpen}
        close={closeMenu}
        id={MENU_ID}
        currentPathname={pathname}
      />
    </>
  );
}
