// lib/content/types.ts

import type { StaticImageData } from "next/image";

/** Source-identity tracing — every projected value carries provenance. */
export interface SourceIdentity {
  /** Authoritative source file path */
  source: string;
  /** Record key or slug for traceability */
  recordId: string;
}

/** A qualified proof figure for the homepage. */
export interface ProofFigure {
  /** The numeric value, e.g. "75%" or "~80%" */
  value: string;
  /** What it measures */
  label: string;
  /** Attribution to the source of the claim */
  attribution: string;
  /** Source tracing */
  source: SourceIdentity;
}

/** A concise project record for homepage use. */
export interface ProjectCardProjection {
  slug: string;
  title: string;
  year: string;
  role: string;
  /** S1-approved concise editorial summary */
  editorialSummary: string;
  /** Hero screenshot only — gallery NOT projected here */
  heroImage: StaticImageData;
  /** Route to full case study */
  detailRoute: string;
  /** Source provenance */
  source: SourceIdentity;
  /** Optional: up to 3 concise technical evidence statements (flagships only) */
  technicalEvidence?: string[];
  /** Live URL if available — omitted if absent */
  liveUrl?: string;
  /** GitHub URL if available */
  githubUrl?: string;
}

/** A concise experience record for homepage use. */
export interface ExperienceCardProjection {
  role: string;
  company: string;
  /** Period string — empty string if unknown (never invented) */
  period: string;
  /** S1-approved concise editorial summary */
  editorialSummary: string;
  /** Strongest proof from this experience */
  proof?: ProofFigure;
  source: SourceIdentity;
}

/** Credential projection for homepage — only Eskwelabs emphasized. */
export interface CredentialProjection {
  title: string;
  slug: string;
  issuer: string;
  date: string;
  /** S1-approved editorial summary */
  editorialSummary: string;
  image: StaticImageData;
  /** Null if no external verification URL exists */
  credentialUrl: string | null;
  source: SourceIdentity;
}

/** Contact channel — omitted if unconfigured. */
export interface ContactChannel {
  type: "email" | "linkedin" | "github";
  label: string;
  href: string;
}
