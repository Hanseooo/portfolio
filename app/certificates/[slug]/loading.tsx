export default function CertificateLoading() {
  return (
    <section className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-6 py-24">
      <div className="h-10 w-72 animate-pulse rounded bg-muted" />
      <div className="h-5 w-64 animate-pulse rounded bg-muted" />
      <div className="mt-4 h-[50vh] w-full animate-pulse rounded bg-muted" />
      <div className="mx-auto h-11 w-44 animate-pulse rounded bg-muted" />
    </section>
  );
}
