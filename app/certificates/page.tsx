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
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {certificates.map((cert) => (
              <Link key={cert.slug} href={`/certificates/${cert.slug}`} className="group block">
                <div className="relative aspect-[4/3] w-full overflow-hidden border border-foreground/10 bg-muted transition-colors duration-300 group-hover:border-primary/50">
                  <div className="absolute top-0 left-0 right-0 z-10 h-0.5 origin-left scale-x-0 bg-primary transition-transform duration-300 ease-out group-hover:scale-x-100" />
                  <Image
                    src={cert.image}
                    alt={cert.title}
                    fill
                    className="object-contain p-6 transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="mt-3 flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold leading-snug text-foreground transition-colors duration-200 group-hover:text-primary">
                      {cert.title}
                    </h3>
                    <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-foreground/40">
                      {cert.issuer} · {cert.date}
                    </p>
                  </div>
                  <span className="mt-0.5 translate-x-0 text-foreground/25 transition-[color,transform] duration-200 group-hover:translate-x-1 group-hover:text-primary">→</span>
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
