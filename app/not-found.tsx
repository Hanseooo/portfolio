// app/not-found.tsx
import Link from "next/link";

/**
 * Global 404 — S4 §13.4.
 *
 * Restrained signal statement with clear destinations.
 * Part of portfolio shell (global nav + footer visible via layout).
 * No decorative entrance animation delaying recovery controls.
 * Unknown slugs (e.g., /projects/nonexistent) hit this via notFound().
 */
export default function NotFound() {
  return (
    <article
      data-utility-priority="immediate"
      className="mx-auto max-w-[1400px] px-[var(--cs-gutter-portfolio)] py-16 md:py-24"
    >
      {/* Signal rule */}
      <div className="h-0.5 w-16 bg-[color:var(--cs-signal)] md:w-24" aria-hidden="true" />

      <div className="mt-8 max-w-xl">
        {/* 404 signal */}
        <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[color:var(--cs-text-secondary)]">
          404
        </p>

        <h1 className="mt-4 font-[family-name:var(--font-display)] text-[clamp(2.5rem,6vw,4.5rem)] font-normal uppercase leading-[0.95] tracking-tight text-[color:var(--cs-text-primary)]">
          Page Not Found
        </h1>

        <p className="mt-4 text-base leading-relaxed text-[color:var(--cs-text-secondary)]">
          This page does not exist. Here are some places to go instead.
        </p>

        {/* Recovery destinations */}
        <nav aria-label="Recovery navigation" className="mt-10">
          <ul className="flex flex-col gap-2" role="list">
            {[
              { href: "/", label: "Home" },
              { href: "/projects", label: "Projects" },
              { href: "/experience", label: "Experience" },
              { href: "/certificates", label: "Certificates" },
            ].map((dest) => (
              <li key={dest.href}>
                <Link
                  href={dest.href}
                  className="inline-flex h-11 items-center gap-2 font-[family-name:var(--font-mono)] text-sm uppercase tracking-widest text-[color:var(--cs-text-secondary)] transition-colors hover:text-[color:var(--cs-signal)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--cs-focus-ring)]"
                >
                  {dest.label} →
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </article>
  );
}
