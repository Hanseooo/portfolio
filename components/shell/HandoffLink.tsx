"use client";

import { useCallback, type ReactNode } from "react";
import Link from "next/link";
import { useRouteHandoff } from "@/components/motion/RouteHandoffController";

interface HandoffLinkProps {
  href: string;
  className?: string;
  "aria-label"?: string;
  children: ReactNode;
}

/**
 * Drop-in Link replacement that pipes internal navigations through
 * RouteHandoffController, so the route-handoff overlay fires for any
 * internal link — not just the global nav.
 *
 * External hrefs (different origin) fall through to native behavior.
 * Middle-click, Ctrl/Cmd+click, and download attributes fall through too.
 */
export default function HandoffLink({
  href,
  className,
  "aria-label": ariaLabel,
  children,
}: HandoffLinkProps) {
  const { navigate: handoffNavigate } = useRouteHandoff();

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      const anchor = e.currentTarget;
      const nativeNavigation =
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey ||
        anchor.target === "_blank" ||
        anchor.hasAttribute("download");

      if (nativeNavigation) return;

      e.preventDefault();
      handoffNavigate(href);
    },
    [href, handoffNavigate]
  );

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </Link>
  );
}
