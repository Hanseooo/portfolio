// app/certificates/[slug]/error.tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function CertificateError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <article
      data-utility-priority="immediate"
      className="mx-auto max-w-[1400px] px-[var(--cs-gutter-portfolio)] py-16 md:py-24"
    >
      {/* Signal rule */}
      <div className="h-0.5 w-16 bg-[color:var(--cs-error)] md:w-24" aria-hidden="true" />

      <div className="mt-8 max-w-xl">
        <h1 className="font-[family-name:var(--font-display)] text-3xl uppercase tracking-tight text-[color:var(--cs-text-primary)] md:text-4xl">
          Could Not Load Certificate
        </h1>
        <p className="mt-4 text-base leading-relaxed text-[color:var(--cs-text-secondary)]">
          Something went wrong while rendering this certificate page. You can try again or browse all certificates.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-11 items-center border border-[color:var(--cs-structural-line-strong)] px-5 font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[color:var(--cs-text-primary)] transition-colors hover:border-[color:var(--cs-signal)] hover:text-[color:var(--cs-signal)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--cs-focus-ring)]"
          >
            Try Again
          </button>
          <Link
            href="/certificates"
            className="inline-flex h-11 items-center px-5 font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[color:var(--cs-text-secondary)] transition-colors hover:text-[color:var(--cs-signal)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--cs-focus-ring)]"
          >
            All Certificates →
          </Link>
        </div>
      </div>
    </article>
  );
}
