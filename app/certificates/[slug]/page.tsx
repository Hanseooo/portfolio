"use client"

import { notFound } from "next/navigation";
import { certificates } from "@/lib/certificates";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { use } from "react";
import BackButton from "@/components/utils/BackButton";
import PageTransition from "@/components/layout/PageTransition";
import { useResetScrollTop } from "@/components/utils/useResetScrollTop";
import { motion } from "framer-motion";
import { motionTokens } from "@/lib/motion";
import { Button } from "@/components/ui/button";
import { MagneticButton } from "@/components/ui/MagneticButton";

export default function CertificatePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const cert = certificates.find((c) => c.slug === resolvedParams.slug);
  useResetScrollTop();

  if (!cert) notFound();

  return (
    <PageTransition>
      <section className="relative overflow-hidden border-b border-foreground/15">
        <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/56 to-black/18" />
        <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/24 to-transparent" />

        <div className="pointer-events-none absolute right-[-6rem] top-10 hidden opacity-20 blur-[1px] md:block">
          <Image
            src={cert.image}
            alt=""
            aria-hidden="true"
            width={560}
            height={420}
            className="h-auto w-[26rem] object-contain"
          />
        </div>

        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: motionTokens.duration.feature,
            ease: motionTokens.framerEase.enter,
          }}
          className="relative mx-auto w-full max-w-7xl px-6 py-24"
        >
          <div className="max-w-4xl py-8">
            <p className="font-bold text-[10px] uppercase tracking-[0.2em] text-primary">
              Certificate
            </p>
            <h1 className="mt-3 text-pretty text-[clamp(2.15rem,5vw,4.25rem)] font-black leading-[0.94] text-white">
              {cert.title}
            </h1>

            <p className="mt-5 border-l-2 border-primary/70 pl-4 text-base text-white/84 sm:text-lg">
              {cert.issuer} · {cert.date}
            </p>

            {cert.credentialUrl && (
              <div className="mt-8 flex">
                <MagneticButton>
                  <Button asChild className="font-semibold">
                    <Link href={cert.credentialUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Credential
                    </Link>
                  </Button>
                </MagneticButton>
              </div>
            )}
          </div>
        </motion.div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-6 py-20">
        <div className="relative aspect-[4/3] w-full overflow-hidden border border-border">
          <Image
            src={cert.image}
            alt={cert.title}
            fill
            sizes="(min-width: 1280px) 72rem, (min-width: 768px) 90vw, 100vw"
            className="object-contain p-3 sm:p-6"
          />
        </div>
      </section>

      <BackButton sectionId="certificates" text="Back to Certificates" />
    </PageTransition>
  );
}
