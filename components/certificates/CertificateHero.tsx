"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { motionTokens } from "@/lib/motion";
import type { Certificate } from "@/lib/certificates";

export default function CertificateHero({ cert }: { cert: Certificate }) {
  return (
    <section className="relative min-h-[70vh] w-full overflow-hidden border-b border-foreground/15">
      <Image
        src={cert.image}
        alt=""
        aria-hidden="true"
        fill
        priority
        sizes="100vw"
        className="object-cover scale-105 blur-sm"
      />

      <div className="absolute inset-0 bg-linear-to-t from-black/88 via-black/60 to-black/28" />
      <div className="absolute inset-0 bg-linear-to-r from-black/74 via-black/28 to-transparent" />
      <div className="absolute inset-0 bg-radial-[circle_at_16%_78%] from-black/60 via-transparent to-transparent" />

      <motion.div
        initial={{ y: 28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: motionTokens.duration.feature,
          ease: motionTokens.framerEase.enter,
        }}
        className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-[1400px] px-6 pb-12"
      >
        <div className="max-w-4xl sm:py-8">
          <div className="mb-6 flex flex-wrap items-center gap-3 font-bold text-[10px] uppercase tracking-[0.2em] text-white">
            <span className="text-primary">Certificate</span>
            <span className="h-px w-10 bg-primary/70" aria-hidden="true" />
            <span>{cert.issuer}</span>
            <span className="h-px w-10 bg-primary/70" aria-hidden="true" />
            <span>{cert.date}</span>
          </div>

          <h1 className="text-pretty text-[clamp(2.15rem,5vw,4.25rem)] font-black leading-[0.94] text-white">
            {cert.title}
          </h1>

          {cert.description && (
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-white/80 sm:text-lg">
              {cert.description}
            </p>
          )}

          {cert.credentialUrl && (
            <div className="mt-8 flex">
              <Button asChild className="font-semibold">
                <Link
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Credential
                </Link>
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
