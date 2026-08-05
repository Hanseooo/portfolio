// lib/content/collection-projections.ts

/**
 * Named projections for collection-index routes.
 *
 * Key decisions:
 * - Source-ordered records (no sorting/filtering for current 5 projects)
 * - Truthful omission: missing links/dates produce undefined, never empty controls
 * - client field only exposed when clientConsent is true
 */

import type { StaticImageData } from "next/image";
import { projects } from "@/lib/projects";
import { experience } from "@/lib/experience";
import { certificates } from "@/lib/certificates";
import type { SourceIdentity } from "./types";

// ─── Project Collection (/projects) ─────────────────────────────────

export interface ProjectCollectionRecord {
  slug: string;
  title: string;
  subtitle: string;
  year: string;
  role: string;
  heroImage: StaticImageData;
  /** Position in authoritative source order (1-based) */
  position: number;
  detailRoute: string;
  /** Client context — only if source has clientConsent */
  client?: string;
  source: SourceIdentity;
}

export interface ProjectCollectionProjection {
  totalCount: number;
  records: ProjectCollectionRecord[];
}

export function getProjectCollection(): ProjectCollectionProjection {
  return {
    totalCount: projects.length,
    records: projects.map((p, i) => ({
      slug: p.slug,
      title: p.title,
      subtitle: p.subtitle,
      year: p.year,
      role: p.role,
      heroImage: p.heroImage,
      position: i + 1,
      detailRoute: `/projects/${p.slug}`,
      client: p.clientConsent ? p.client : undefined,
      source: { source: "lib/projects.ts", recordId: p.slug },
    })),
  };
}

// ─── Certificate Collection (/certificates) ──────────────────────────

export interface CertificateCollectionRecord {
  slug: string;
  title: string;
  issuer: string;
  date: string;
  image: StaticImageData;
  position: number;
  detailRoute: string;
  /** Null when no verification URL exists — never show empty control */
  credentialUrl: string | null;
  description?: string;
  source: SourceIdentity;
}

export interface CertificateCollectionProjection {
  totalCount: number;
  records: CertificateCollectionRecord[];
}

export function getCertificateCollection(): CertificateCollectionProjection {
  return {
    totalCount: certificates.length,
    records: certificates.map((c, i) => ({
      slug: c.slug,
      title: c.title,
      issuer: c.issuer,
      date: c.date,
      image: c.image,
      position: i + 1,
      detailRoute: `/certificates/${c.slug}`,
      credentialUrl: c.credentialUrl,
      description: c.description,
      source: { source: "lib/certificates.ts", recordId: c.slug },
    })),
  };
}

// ─── Experience Ledger (/experience) ─────────────────────────────────

export interface ExperienceLedgerRecord {
  role: string;
  company: string;
  /** Empty string when period is unknown — never invent a date */
  period: string;
  /** Complete source bullets preserved */
  points: string[];
  position: number;
  source: SourceIdentity;
}

export interface ExperienceLedgerProjection {
  totalCount: number;
  records: ExperienceLedgerRecord[];
}

export function getExperienceLedger(): ExperienceLedgerProjection {
  return {
    totalCount: experience.length,
    records: experience.map((e, i) => ({
      role: e.role,
      company: e.company,
      period: e.period,
      points: e.points,
      position: i + 1,
      source: {
        source: "lib/experience.ts",
        recordId: e.company.toLowerCase().replace(/\s+/g, "-"),
      },
    })),
  };
}
