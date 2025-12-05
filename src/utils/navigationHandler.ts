import type { NavigateFunction } from "react-router-dom";

interface Navigation {
  page: string | null;
  section: string | null;
}

/**
 * Navigate user based on assistant's navigation JSON.
 * Supports:
 * - Page only
 * - Section inside page
 * - Home page section scrolling
 */
export function handleNavigation(nav: Navigation, navigate: NavigateFunction) {
  if (!nav || (!nav.page && !nav.section)) return;

  // Section only (on homepage)
  if (nav.page === "/" && nav.section) {
    navigate("/", { replace: false });
    setTimeout(() => {
      const el = document.querySelector(nav.section!);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
    return;
  }

  // Page + section
  if (nav.page && nav.section) {
    navigate(nav.page, { replace: false });
    setTimeout(() => {
      const el = document.querySelector(nav.section!);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 1500);
    return;
  }

  // Page only
  if (nav.page) {
    navigate(nav.page, { replace: false });
  }

}
