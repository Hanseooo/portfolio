// app/certificates/[slug]/loading.tsx

/**
 * Certificate detail loading — S4 §13.2.
 *
 * Approximates: masthead, artifact placeholder.
 * Simpler than project loading (compact documentary route).
 */
export default function CertificateLoading() {
  return (
    <article className="mx-auto max-w-[1400px] px-[var(--cs-gutter-portfolio)]">
      {/* Masthead skeleton */}
      <div className="pb-12 pt-8 md:pb-16 md:pt-12">
        <div className="h-0.5 w-16 bg-[color:var(--cs-structural-line)] md:w-24" />
        <div className="mt-6 h-4 w-32 bg-[color:var(--cs-raised-neutral)]" />
        <div className="mt-4 h-3 w-20 bg-[color:var(--cs-raised-neutral)]" />
        <div className="mt-4 h-10 w-3/4 max-w-md bg-[color:var(--cs-raised-neutral)] md:h-14" />
        <div className="mt-3 flex gap-4">
          <div className="h-4 w-20 bg-[color:var(--cs-raised-neutral)]" />
          <div className="h-4 w-24 bg-[color:var(--cs-raised-neutral)]" />
        </div>
      </div>

      {/* Artifact placeholder */}
      <div className="aspect-[4/3] w-full max-w-3xl border border-[color:var(--cs-structural-line)] bg-[color:var(--cs-reading-surface)] p-6">
        <div className="h-full w-full bg-[color:var(--cs-raised-neutral)]" />
      </div>

      {/* Description skeleton */}
      <div className="mt-8 space-y-3">
        <div className="h-3 w-20 bg-[color:var(--cs-raised-neutral)]" />
        <div className="h-4 w-full max-w-lg bg-[color:var(--cs-raised-neutral)]" />
        <div className="h-4 w-5/6 max-w-lg bg-[color:var(--cs-raised-neutral)]" />
      </div>
    </article>
  );
}
