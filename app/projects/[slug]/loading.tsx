export default function ProjectLoading() {
  return (
    <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-6 py-24">
      <div className="h-10 w-56 animate-pulse rounded bg-muted" />
      <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
      <div className="mt-4 h-[45vh] w-full animate-pulse rounded bg-muted" />
      <div className="h-4 w-full animate-pulse rounded bg-muted" />
      <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
    </section>
  );
}
