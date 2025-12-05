import { cn } from "@/lib/utils";
import CompaniesVisitedSection from "../sections/CompaniesVisitedSection";
import { GridPattern } from "../ui/shadcn-io/grid-pattern";
import TourGallerySection from "../sections/TourGallerySection";
import tourCert from "@/assets/images/Certificates/educ-tour-cert.png";

type Certificate = {
  title: string;
  issuer: string;
  date: string;
  imageUrl: string;
};

const TOUR_CERTIFICATES : Certificate[] = [
  {
    title: "Educational Tour Completion",
    issuer: "World of Adventures Travels and Tours",
    date: "November 15, 2025",
    imageUrl: tourCert
  },
  {
    title: "T.A.R.S.I.E.R 117 Completion Certificate",
    issuer: "T.A.R.S.I.E.R 117",
    date: "November 15, 2025",
    imageUrl: ""
  },
]

function CertificateCard({ cert }: { cert: Certificate }) {
  return (
          <div className="rounded-xl border bg-card shadow-md p-6 space-y-4 text-center mb-4">
            <img src= {cert.imageUrl} className="w-full aspect-4/3 rounded-lg bg-muted/20 flex items-center justify-center text-muted-foreground select-none" />
            <h3 className="text-2xl font-semibold">{cert.title}</h3>
            <p className="text-sm text-muted-foreground">
              Issuer: {cert.issuer}
            </p>
            <p className="text-sm text-muted-foreground">
              Date: {cert.date}
            </p>
          </div>
  )
}

export default function EducationalTourPage() {

  return (
    <>
        <main className="pt-28 pb-20 px-4 relative overflow-hidden">
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
              <GridPattern
          width={50}
          height={50}
          x={-1}
          y={-1}
          squares={[
            [4, 4],
            [5, 1],
            [8, 2],
            [5, 3],
            [5, 5],
            
          ]}
          className={cn(
            "mask-[radial-gradient(farthest-side_at_center,white,transparent)]",
            "inset-x-0 inset-y-[-85%] h-[200%] skew-y-12 z-[-1]"
          )}
        />
          <CompaniesVisitedSection />

        <h4 className="text-3xl font-bold mt-20 mb-8 text-center">
          Certificates <span className="text-primary">Received</span> 
        </h4>
        <section className="max-w-xl mx-auto" id="tour-certificate">
          {
            TOUR_CERTIFICATES.map((cert, index) => (
              <CertificateCard 
                key={index}
                cert={cert}
              />
            ))
          }
        </section>
          {/* <h4 className="text-3xl font-bold mt-20 mb-8 text-center">
          Educational Tour <span className="text-primary">Gallery</span> 
        </h4> */}
      </main>
      <TourGallerySection />
    </>
  );
}
