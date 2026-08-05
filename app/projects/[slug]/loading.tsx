// app/projects/[slug]/loading.tsx

/**
 * Project detail loading — S4 §13.2.
 *
 * Approximates: masthead, primary image, reading-band placeholders.
 * No fabricated labels, titles, or metadata.
 * Corners: square or minimal (S2).
 * Motion: Plan 5 decides animation; static gray blocks here.
 */
export default function ProjectLoading() {
  return (
    <article className="mx-auto max-w-[1400px] px-[var(--cs-gutter-portfolio)]">
      {/* Masthead skeleton */}
      <div className="pb-12 pt-8 md:pb-16 md:pt-12">
        <div className="h-0.5 w-16 bg-[color:var(--cs-structural-line)] md:w-24" />
        <div className="mt-6 h-4 w-32 bg-[color:var(--cs-raised-neutral)]" />
        <div className="mt-4 h-3 w-20 bg-[color:var(--cs-raised-neutral)]" />
        <div className="mt-4 h-12 w-3/4 max-w-lg bg-[color:var(--cs-raised-neutral)] md:h-16" />
        <div className="mt-4 h-5 w-full max-w-md bg-[color:var(--cs-raised-neutral)]" />
        <div className="mt-3 flex gap-3">
          <div className="h-4 w-16 bg-[color:var(--cs-raised-neutral)]" />
          <div className="h-4 w-24 bg-[color:var(--cs-raised-neutral)]" />
        </div>
      </div>

      {/* Local nav skeleton */}
      <div className="mb-8 flex gap-6 border-b border-[color:var(--cs-structural-line)] pb-4 md:mb-12">
        <div className="h-4 w-12 bg-[color:var(--cs-raised-neutral)]" />
        <div className="h-4 w-16 bg-[color:var(--cs-raised-neutral)]" />
        <div className="h-4 w-14 bg-[color:var(--cs-raised-neutral)]" />
        <div className="h-4 w-20 bg-[color:var(--cs-raised-neutral)]" />
      </div>

      {/* Primary image skeleton */}
      <div className="aspect-[16/10] w-full border border-[color:var(--cs-structural-line)] bg-[color:var(--cs-raised-neutral)]" />

      {/* Reading band skeleton */}
      <div className="mt-12 space-y-4 border-t border-[color:var(--cs-structural-line)] pt-12">
        <div className="h-8 w-24 bg-[color:var(--cs-raised-neutral)]" />
        <div className="h-4 w-full max-w-2xl bg-[color:var(--cs-raised-neutral)]" />
        <div className="h-4 w-5/6 max-w-2xl bg-[color:var(--cs-raised-neutral)]" />
        <div className="h-4 w-4/6 max-w-2xl bg-[color:var(--cs-raised-neutral)]" />
      </div>
    </article>
  );
}
