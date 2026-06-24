"use client";

import Image from "next/image";
import Link from "next/link";
import { certificates, type Certificate } from "@/lib/certificates";

function NavCard({
  cert,
  direction,
}: {
  cert: Certificate;
  direction: "prev" | "next";
}) {
  return (
    <Link
      href={`/certificates/${cert.slug}`}
      className="group relative block aspect-[5/2] overflow-hidden bg-zinc-950"
    >
      <Image
        src={cert.image}
        alt={cert.title}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-contain p-6 opacity-40 transition-opacity duration-500 group-hover:opacity-60"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-8">
        <p className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
          {direction === "prev" && (
            <span className="transition-transform duration-300 group-hover:-translate-x-1">
              ←
            </span>
          )}
          <span>{direction === "prev" ? "Previous" : "Next"}</span>
          {direction === "next" && (
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          )}
        </p>
        <h3 className="text-xl font-black text-white">{cert.title}</h3>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
          {cert.issuer}
        </p>
      </div>
    </Link>
  );
}

export default function CertificateNextPrev({ cert }: { cert: Certificate }) {
  if (certificates.length < 2) return null;

  const idx = certificates.findIndex((c) => c.slug === cert.slug);
  const prev = certificates[(idx - 1 + certificates.length) % certificates.length];
  const next = certificates[(idx + 1) % certificates.length];

  return (
    <section className="mx-auto max-w-[1400px] px-6 py-16">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="order-1 md:order-2">
          <NavCard cert={next} direction="next" />
        </div>
        <div className="order-2 md:order-1">
          <NavCard cert={prev} direction="prev" />
        </div>
      </div>
    </section>
  );
}
