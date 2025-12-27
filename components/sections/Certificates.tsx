"use client";

import { useState } from "react";
import { certificates } from "@/lib/certificates";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function Certificates() {
  const [active, setActive] = useState(certificates[0]);

  return (
    <section id="certificates" className="mx-auto max-w-6xl px-6 py-32">
      <motion.h2
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        viewport={{ once: true }}
        className="mb-16 text-5xl font-bold text-primary"
      >
        Certificates
      </motion.h2>

      <div className="grid gap-10 md:grid-cols-[360px_1fr]">
        {/* LEFT COLUMN — LIST */}
        <motion.div 
        initial={{y: 40, opacity: 0}}
        whileInView={{y: 0, opacity: 1}}
        viewport={{once: true, amount: 0.25}}
        transition={{duration: 0.3, ease: "easeOut"}}
        className="space-y-4">
          {certificates.map((cert) => (
            <Link
              key={cert.slug}
              href={`/certificates/${cert.slug}`}
              onMouseEnter={() => setActive(cert)}
              className="
                group block
                border border-foreground/20
                px-5 py-4
                transition
                hover:border-primary
                focus-visible:border-primary
              "
            >
              <h3 className="font-semibold group-hover:text-primary">
                {cert.title}
              </h3>
              <p className="mt-1 text-sm opacity-70">
                {cert.issuer} · {cert.date}
              </p>
            </Link>
          ))}
        </motion.div>

        {/* RIGHT COLUMN — PREVIEW (hidden on mobile) */}
        <div className="relative hidden md:block">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.slug}
              initial={{ opacity: 0.5, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="
                relative
                aspect-4/3
                w-full
                overflow-hidden
                rounded-lg
                border border-foreground/20
                bg-muted
              "
            >
              <Image
                src={active.image}
                alt={active.title}
                fill
                className="object-contain p-6"
                sizes="600px"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
