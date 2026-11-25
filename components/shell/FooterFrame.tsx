import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  DESTINATIONS,
  getDestinationHref,
} from "@/lib/destinations";
import { projects } from "@/lib/projects";
import { GITHUB_URL, LINKEDIN_URL } from "@/components/utils/externalLinks";
import ConstructionSite from "./ConstructionSite";

/**
 * Shared portfolio footer — S6 §6.1 universal footer.
 *
 * Responsibilities:
 * - Copyright
 * - Universal route links (Projects, Experience, Certificates, Contact)
 * - Profile links (GitHub, LinkedIn), so every page reaches them
 *
 * Content-sized — not a full-viewport chapter.
 * Uses semantic tokens only.
 */
export default function FooterFrame() {
  const footerRoutes = [
    DESTINATIONS.projects,
    DESTINATIONS.experience,
    DESTINATIONS.certificates,
    DESTINATIONS.contact,
  ];
  const profiles = [
    { label: "GitHub", href: GITHUB_URL },
    { label: "LinkedIn", href: LINKEDIN_URL },
  ];
  const linkClass =
    "inline-flex min-h-11 items-center font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[color:var(--cs-text-secondary)] transition-colors hover:text-[color:var(--cs-text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--cs-focus-ring)]";

  return (
    <footer
      className="border-t border-[color:var(--cs-structural-line)] bg-[color:var(--cs-foundation)] px-[var(--cs-gutter-portfolio)]"
      role="contentinfo"
    >
      <div className="mx-auto max-w-[1400px] pb-12 pt-8 md:pb-16">
        <ConstructionSite floors={projects.length} />
        <div className="mt-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap gap-x-6" role="list">
              {footerRoutes.map((dest) => (
                <li key={dest.id}>
                  <Link href={getDestinationHref(dest)} className={linkClass}>
                    {dest.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <ul className="flex flex-wrap gap-x-6" role="list" aria-label="Profiles">
              {profiles.map(({ label, href }) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer" className={`group gap-1 ${linkClass}`}>
                    {label}
                    <ArrowUpRight size={12} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </li>
              ))}
            </ul>
            <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[color:var(--cs-text-secondary)]">
              © {new Date().getFullYear()} Hans Amoguis
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
