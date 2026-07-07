"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { certificates } from "@/lib/certificates";
import { useClientReady } from "@/components/utils/useClientReady";
import { usePrefersReducedMotion } from "@/components/utils/usePrefersReducedMotion";

type Cert = (typeof certificates)[number];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const mobileCardVariants = {
  hidden: { opacity: 0, x: -5},
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function FeaturedCertificatesSection({ id }: { id: string }) {
  const isClient = useClientReady();
  const reducedMotion = usePrefersReducedMotion();

  if (!isClient) {
    return (
      <section id={id} className="relative px-6 py-32">
        <div className="mx-auto w-full max-w-[1400px]">
          <SectionHeader />
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {certificates.slice(0, 3).map((cert, idx) => (
              <DesktopCard key={cert.slug} cert={cert} idx={idx} reducedMotion={false} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id={id} className="relative px-6 py-32">
      <div className="mx-auto w-full max-w-[1400px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
        >
          <SectionHeader />
        </motion.div>

        {/* Desktop grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="hidden lg:grid grid-cols-3 gap-8"
        >
          {certificates.slice(0, 3).map((cert, idx) => (
            <motion.div key={cert.slug} variants={cardVariants}>
              <DesktopCard cert={cert} idx={idx} reducedMotion={reducedMotion} />
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile snap scroll */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="lg:hidden flex gap-6 overflow-x-auto snap-x snap-mandatory -mx-6 px-6"
          style={{ scrollbarWidth: "none" }}
        >
          {certificates.slice(0, 3).map((cert) => (
            <motion.div
              key={cert.slug}
              variants={mobileCardVariants}
              className="flex-shrink-0 w-[85vw] snap-start"
            >
              <MobileCard cert={cert} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function SectionHeader() {
  return (
    <div className="mb-20 flex items-end justify-between border-b border-border pb-8">
      <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-black leading-none tracking-tighter text-foreground">
        Credentials
      </h2>
      <Link
        href="/certificates"
        className="group flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
      >
        <span>View All</span>
        <ArrowUpRight
          size={16}
          className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
        />
      </Link>
    </div>
  );
}

function DesktopCard({
  cert,
  idx,
  reducedMotion,
}: {
  cert: Cert;
  idx: number;
  reducedMotion: boolean;
}) {
  const [scanning, setScanning] = useState(false);

  return (
    <Link
      href={`/certificates/${cert.slug}`}
      className="block"
      style={{ perspective: "1200px" }}
    >
      <motion.div
        className="relative overflow-hidden border border-border bg-card transition-shadow duration-300 hover:shadow-[0_8px_30px_-4px_hsl(var(--primary)/0.25)]"
        whileHover={
          reducedMotion
            ? undefined
            : { rotateX: -4, rotateY: 8, scale: 1.03 }
        }
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        onHoverStart={() => !reducedMotion && setScanning(true)}
        onHoverEnd={() => setScanning(false)}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* VERIFIED ✓ badge */}
        <AnimatePresence>
          {scanning && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute top-3 right-3 z-20 border border-primary/60 bg-black/60 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-primary backdrop-blur-sm"
            >
              VERIFIED ✓
            </motion.span>
          )}
        </AnimatePresence>

        {/* Scan-line — full-height container clips the sweep */}
        <AnimatePresence>
          {scanning && (
            <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: "-100%" }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.55, ease: "linear" }}
                className="h-full w-full"
                style={{
                  background:
                    "linear-gradient(to bottom, transparent 0%, transparent calc(50% - 1px), hsl(var(--primary) / 0.5) calc(50% - 1px), hsl(var(--primary) / 0.5) calc(50% + 1px), transparent calc(50% + 1px), transparent 100%)",
                }}
              />
            </div>
          )}
        </AnimatePresence>

        {/* Certificate image */}
        <div className="relative aspect-4/3 overflow-hidden border-b border-border bg-background">
          <Image
            src={cert.image}
            alt={cert.title}
            fill
            className="object-contain p-6"
            sizes="(max-width: 1023px) 100vw, 33vw"
          />
        </div>

        {/* Info block */}
        <div className="border-l-2 border-primary px-5 py-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {cert.issuer}
          </p>
          <h3 className="mt-1 font-bold leading-tight text-foreground">
            {cert.title}
          </h3>
          <p className="mt-1 font-mono text-xs text-muted-foreground/70">
            {cert.date}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}

function MobileCard({ cert }: { cert: Cert }) {
  return (
    <Link href={`/certificates/${cert.slug}`} className="group block">
      <div className="relative aspect-4/3 w-full overflow-hidden border border-border bg-background">
        <Image
          src={cert.image}
          alt={cert.title}
          fill
          className="object-contain p-6"
          sizes="85vw"
        />
      </div>
      <div className="mt-4 border-l-2 border-primary pl-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {cert.issuer}
        </p>
        <h3 className="mt-1 font-bold leading-tight text-foreground transition-colors group-hover:text-primary">
          {cert.title}
        </h3>
        <span className="mt-2 inline-flex items-center gap-1 font-mono text-xs text-primary">
          View <ArrowUpRight size={12} />
        </span>
      </div>
    </Link>
  );
}
