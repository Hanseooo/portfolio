import Link from "next/link";
import {
  DESTINATIONS,
  getDestinationHref,
} from "@/lib/destinations";

/**
 * Shared portfolio footer — S6 §6.1 universal footer.
 *
 * Responsibilities:
 * - Copyright
 * - Universal route links (Projects, Experience, Certificates)
 *
 * Content-sized — not a full-viewport chapter.
 * Uses semantic tokens only.
 */
export default function FooterFrame() {
  const footerRoutes = [
    DESTINATIONS.projects,
    DESTINATIONS.experience,
    DESTINATIONS.certificates,
  ];

  return (
    <footer
      className="border-t border-[color:var(--cs-structural-line)] bg-[color:var(--cs-foundation)] px-[var(--cs-gutter-portfolio)]"
      role="contentinfo"
    >
      <div className="mx-auto max-w-[1400px] py-12 md:py-16">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap gap-6" role="list">
              {footerRoutes.map((dest) => (
                <li key={dest.id}>
                  <Link
                    href={getDestinationHref(dest)}
                    className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[color:var(--cs-text-secondary)] transition-colors hover:text-[color:var(--cs-text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--cs-focus-ring)]"
                  >
                    {dest.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[color:var(--cs-text-secondary)]">
            © {new Date().getFullYear()} Hans Amoguis
          </p>
        </div>
      </div>
    </footer>
  );
}
