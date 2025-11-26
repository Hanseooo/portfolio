import CompaniesVisitedSection from "../sections/CompaniesVisitedSection";

export default function EducationalTourPage() {
  const tarsierCertificate = {
    title: "T.A.R.S.I.E.R 117 Completion Certificate",
    issuer: "T.A.R.S.I.E.R 117",
    date: "November 15, 2025",
  };

  return (
    <main className="pt-28 pb-20 px-4">
      {/* Page Header */}
      <header className="max-w-5xl mx-auto text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Cebu – Bohol Educational Tour <span className="text-primary">2025</span>
        </h2>
        <p className="mt-3 text-muted-foreground max-w-xl mx-auto text-lg">
          A collection of companies visited and experiences gained during the
          Cebu–Bohol Educational Tour.
        </p>
      </header>

      <CompaniesVisitedSection />

      <h4 className="text-3xl font-bold mt-20 mb-8 text-center">
        Certificate <span className="text-primary">Received</span> 
      </h4>
      <section className="max-w-xl mx-auto">
        <div className="rounded-xl border bg-card shadow-md p-6 space-y-4 text-center">
          <div className="w-full aspect-4/3 rounded-lg bg-muted/20 flex items-center justify-center text-muted-foreground">
            No Image for now haha
          </div>
          <h3 className="text-2xl font-semibold">{tarsierCertificate.title}</h3>
          <p className="text-sm text-muted-foreground">
            Issuer: {tarsierCertificate.issuer}
          </p>
          <p className="text-sm text-muted-foreground">
            Date: {tarsierCertificate.date}
          </p>
        </div>
      </section>
        <h4 className="text-3xl font-bold mt-20 mb-8 text-center">
        Educational Tour <span className="text-primary">Gallery</span> 
      </h4>
    </main>
  );
}
