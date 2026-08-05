// lib/content/detail-projections.ts

/**
 * Named projections for detail routes.
 *
 * Key decisions:
 * - Gallery deduplication: hero is EXCLUDED from gallery array
 * - Non-wrapping adjacency: prev/next use source order
 * - Truthful omission: missing github/live/client → undefined
 */

import type { StaticImageData } from "next/image";
import { projects } from "@/lib/projects";
import { certificates } from "@/lib/certificates";
import type { SourceIdentity } from "./types";

// ─── Project Detail ─────────────────────────────────────────────────

export interface ProjectDetailProjection {
  slug: string;
  title: string;
  subtitle: string;
  year: string;
  role: string;
  heroImage: StaticImageData;
  ogImageSrc: string;
  problem: string;
  overview: string;
  technicalDecisions: string[];
  features: string[];
  stack: string[];
  integrations: string[];
  /** Gallery with hero EXCLUDED — deduplication */
  gallery: StaticImageData[];
  githubUrl?: string;
  liveUrl?: string;
  client?: string;
  /** Position in collection (1-based) */
  position: number;
  totalInCollection: number;
  /** Source-ordered previous project slug, or null if first */
  prevSlug: string | null;
  /** Source-ordered next project slug, or null if last */
  nextSlug: string | null;
  parentRoute: "/projects";
  source: SourceIdentity;
}

export function getProjectDetail(slug: string): ProjectDetailProjection | null {
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) return null;

  const p = projects[index];
  return {
    slug: p.slug,
    title: p.title,
    subtitle: p.subtitle,
    year: p.year,
    role: p.role,
    heroImage: p.heroImage,
    ogImageSrc: p.ogImageSrc,
    problem: p.problem,
    overview: p.overview,
    technicalDecisions: p.technicalDecisions,
    features: p.features,
    stack: p.stack,
    integrations: p.integrations ?? [],
    gallery: p.gallery.filter((img) => img !== p.heroImage),
    githubUrl: p.github,
    liveUrl: p.live,
    client: p.clientConsent ? p.client : undefined,
    position: index + 1,
    totalInCollection: projects.length,
    prevSlug: index > 0 ? projects[index - 1].slug : null,
    nextSlug: index < projects.length - 1 ? projects[index + 1].slug : null,
    parentRoute: "/projects",
    source: { source: "lib/projects.ts", recordId: p.slug },
  };
}

// ─── Certificate Detail ──────────────────────────────────────────────

export interface CertificateDetailProjection {
  slug: string;
  title: string;
  issuer: string;
  date: string;
  description?: string;
  image: StaticImageData;
  ogImageSrc: string;
  /** Null means no verification available — never show dead control */
  credentialUrl: string | null;
  position: number;
  totalInCollection: number;
  prevSlug: string | null;
  nextSlug: string | null;
  parentRoute: "/certificates";
  source: SourceIdentity;
}

export function getCertificateDetail(slug: string): CertificateDetailProjection | null {
  const index = certificates.findIndex((c) => c.slug === slug);
  if (index === -1) return null;

  const c = certificates[index];
  return {
    slug: c.slug,
    title: c.title,
    issuer: c.issuer,
    date: c.date,
    description: c.description,
    image: c.image,
    ogImageSrc: c.ogImageSrc,
    credentialUrl: c.credentialUrl,
    position: index + 1,
    totalInCollection: certificates.length,
    prevSlug: index > 0 ? certificates[index - 1].slug : null,
    nextSlug: index < certificates.length - 1 ? certificates[index + 1].slug : null,
    parentRoute: "/certificates",
    source: { source: "lib/certificates.ts", recordId: c.slug },
  };
}
