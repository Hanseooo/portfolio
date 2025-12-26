"use client";

import { certificates } from "@/lib/certificates";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { motion } from "framer-motion";


export default function Certificates() {
  return (
    <section id="certificates" className="mx-auto max-w-5xl px-6 py-32">
      <motion.h2
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        viewport={{ once: true, amount: 1 }}
        className="mb-20 text-primary text-5xl font-bold"
      >
        Certificates
      </motion.h2>

      <div className="grid gap-8 sm:grid-cols-2">
        {certificates.map((cert, i) => (
          <Dialog key={i}>
            <DialogTrigger asChild>
              <button className="group border border-foreground/20 p-6 text-left transition hover:border-primary">
                <h3 className="mb-2 text-lg font-semibold group-hover:text-primary">
                  {cert.title}
                </h3>
                <p className="text-sm opacity-70">
                  {cert.issuer} · {cert.year}
                </p>
              </button>
            </DialogTrigger>

            <DialogContent className="max-w-xl">
              <h3 className="mb-4 text-xl font-semibold">{cert.title}</h3>
              <p className="opacity-80">
                Issued by {cert.issuer} in {cert.year}.
              </p>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </section>
  );
}
