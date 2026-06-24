"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { motionTokens } from "@/lib/motion";
import type { Certificate } from "@/lib/certificates";

export default function CertificateDisplay({ cert }: { cert: Certificate }) {
  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-20">
      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{
          duration: motionTokens.duration.base,
          ease: motionTokens.framerEase.enter,
        }}
        viewport={{ once: true }}
        className="mb-8 font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80"
      >
        Certificate
      </motion.h2>

      <motion.div
        initial={{ y: 24, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{
          duration: motionTokens.duration.base,
          ease: motionTokens.framerEase.enter,
          delay: motionTokens.stagger.text,
        }}
        viewport={{ once: true }}
        className="relative aspect-[4/3] w-full overflow-hidden border border-border bg-foreground/3"
      >
        <Image
          src={cert.image}
          alt={cert.title}
          fill
          sizes="(min-width: 1280px) 72rem, (min-width: 768px) 90vw, 100vw"
          className="object-contain p-4 sm:p-8"
        />
      </motion.div>
    </section>
  );
}
