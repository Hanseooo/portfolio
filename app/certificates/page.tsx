import PageTransition from "@/components/layout/PageTransition";
import { certificates } from "@/lib/certificates";
import Image from "next/image";
import Link from "next/link";
import BackButton from "@/components/utils/BackButton";

export default function CertificatesPage() {
  return (
    <PageTransition>
      <main className="min-h-screen pt-40 px-6 pb-24">
        <div className="mx-auto max-w-[1400px]">
          <h1 className="mb-12 text-4xl font-black uppercase tracking-tighter md:text-6xl text-foreground">
            <span className="text-primary">Certificates</span>
          </h1>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {certificates.map((cert) => (
              <Link key={cert.slug} href={`/certificates/${cert.slug}`} className="group block">
                <div className="relative aspect-[4/3] w-full overflow-hidden border border-border bg-card p-4">
                  <Image
                    src={cert.image}
                    alt={cert.title}
                    fill
                    className="object-contain p-4 transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-primary/0 transition-colors duration-500 group-hover:bg-primary/5" />
                </div>
                <div className="mt-4 flex flex-col gap-1">
                  <h3 className="text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                    {cert.title}
                  </h3>
                  <p className="font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80 mt-1">
                    {cert.issuer} {"//"} {cert.date}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <BackButton text="Back to Home" />
    </PageTransition>
  );
}
