// components/routes/CertificateRegisterRecord.tsx
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import StructuredReveal from "@/components/motion/StructuredReveal";
import type { CertificateCollectionRecord } from "@/lib/content/collection-projections";

interface CertificateRegisterRecordProps {
  record: CertificateCollectionRecord;
}

/**
 * Certificate register record — S4 §7.
 *
 * Continuous ruled register (not isolated card grid).
 * Restrained artifact preview beside information.
 * Long titles wrap at readable size.
 * Missing credentialUrl creates no empty control.
 * Eskwelabs record remains valid without credential action.
 */
export default function CertificateRegisterRecord({
  record,
}: CertificateRegisterRecordProps) {
  return (
    <StructuredReveal recipe="register-record">
    <div
      className="ruled-band"
      data-motion-target="register-record"
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-8">
        {/* Artifact preview — 3 columns on desktop */}
        <div className="md:col-span-3">
          <Link
            href={record.detailRoute}
            className="group block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--cs-focus-ring)]"
            aria-label={`View ${record.title} certificate detail`}
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden border border-[color:var(--cs-structural-line)] bg-[color:var(--cs-reading-surface)]">
              <Image
                src={record.image}
                alt={`${record.title} — certificate artifact`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 25vw, 300px"
                className="object-contain p-3 transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </div>
          </Link>
        </div>

        {/* Information — 9 columns on desktop */}
        <div className="flex flex-col justify-center gap-2 md:col-span-9">
          {/* Record index */}
          <span className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[color:var(--cs-text-secondary)]">
            {String(record.position).padStart(2, "0")}
          </span>

          {/* Title — wraps at readable size, never clips */}
          <h2 className="text-xl font-semibold leading-snug text-[color:var(--cs-text-primary)] md:text-2xl">
            <Link
              href={record.detailRoute}
              className="transition-colors hover:text-[color:var(--cs-signal)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--cs-focus-ring)]"
            >
              {record.title}
            </Link>
          </h2>

          {/* Issuer + Date */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[color:var(--cs-text-secondary)]">
            <span>{record.issuer}</span>
            <span aria-hidden="true" className="h-px w-4 bg-[color:var(--cs-structural-line-strong)]" />
            <span>{record.date}</span>
          </div>

          {/* Description when available */}
          {record.description && (
            <p className="mt-2 readable-measure text-sm leading-relaxed text-[color:var(--cs-text-secondary)]">
              {record.description}
            </p>
          )}

          {/* Actions row — truthful omission */}
          <div className="mt-3 flex flex-wrap items-center gap-4">
            <Link
              href={record.detailRoute}
              className="inline-flex h-11 items-center font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[color:var(--cs-signal)] transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--cs-focus-ring)]"
            >
              View Detail →
            </Link>

            {/* External credential — only when credentialUrl exists */}
            {record.credentialUrl && (
              <a
                href={record.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-1 font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[color:var(--cs-text-secondary)] transition-colors hover:text-[color:var(--cs-signal)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--cs-focus-ring)]"
              >
                Verify Credential <ArrowUpRight size={12} aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
    </StructuredReveal>
  );
}
