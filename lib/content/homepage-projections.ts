// lib/content/homepage-projections.ts

/**
 * Named content projections for the six homepage scenes.
 * These are DETERMINISTIC views of authoritative records.
 * They do NOT create new factual claims.
 */

import type { StaticImageData } from "next/image";
import hansPortrait from "@/app/assets/myImages/hans.webp";
import { projects } from "@/lib/projects";
import { experience } from "@/lib/experience";
import { certificates } from "@/lib/certificates";
import { EMAIL_ADDRESS, LINKEDIN_URL, GITHUB_URL } from "@/components/utils/externalLinks";
import type {
  ProofFigure,
  ProjectCardProjection,
  ExperienceCardProjection,
  CredentialProjection,
  ContactChannel,
} from "./types";

function requireProject(slug: string) {
  const project = projects.find((record) => record.slug === slug);
  if (!project) {
    throw new Error(`Homepage projection requires project slug: ${slug}`);
  }
  return project;
}

function requireCertificate(slug: string) {
  const certificate = certificates.find((record) => record.slug === slug);
  if (!certificate) {
    throw new Error(`Homepage projection requires certificate slug: ${slug}`);
  }
  return certificate;
}

// ─── Scene 01: Identity & Immediate Proof ───────────────────────────

export interface HomepageIdentityProjection {
  name: "Hans Amoguis";
  roleStatement: string;
  introduction: string;
  immediateProof: [ProofFigure, ProofFigure];
  portrait: StaticImageData;
}

export function getHomepageIdentity(): HomepageIdentityProjection {
  return {
    name: "Hans Amoguis",
    roleStatement: "Full-stack engineer focused on AI product engineering.",
    introduction:
      "I build maintainable full-stack and AI products with clear architecture, clean implementation, and practical user experience.",
    immediateProof: [
      {
        value: "Full-Stack Developer",
        label: "Architecture & Systems",
        attribution: "Core capability",
        source: { source: "lib/experience.ts", recordId: "freelance" },
      },
      {
        value: "Product Engineer",
        label: "AI & User Experience",
        attribution: "Product delivery",
        source: { source: "lib/experience.ts", recordId: "eskwelabs" },
      },
    ],
    portrait: hansPortrait,
  };
}

// ─── Scene 02: Flagship Work ────────────────────────────────────────

export interface HomepageFlagshipProjection {
  flagships: [ProjectCardProjection, ProjectCardProjection];
}

export function getHomepageFlagships(): HomepageFlagshipProjection {
  const leDoux = requireProject("le-doux");
  const clarift = requireProject("clarift");

  return {
    flagships: [
      {
        slug: leDoux.slug,
        title: leDoux.title,
        year: leDoux.year,
        role: leDoux.role,
        editorialSummary:
          "I built Le Doux for an artisanal cookie business in Davao, replacing its Google Forms workflow with a structured ordering platform and admin system. As the sole full-stack developer, I handled ordering, GCash verification, menu management, CRM, and analytics. The client reported processing orders 75% faster.",
        heroImage: leDoux.heroImage,
        detailRoute: `/projects/${leDoux.slug}`,
        source: { source: "lib/projects.ts", recordId: leDoux.slug },
        technicalEvidence: [
          "Next.js full-stack App Router with Server Actions",
          "Supabase PostgreSQL + RLS for multi-tenant isolation",
          "Client-side OCR for GCash reference extraction",
        ],
        liveUrl: leDoux.live,
      },
      {
        slug: clarift.slug,
        title: clarift.title,
        year: clarift.year,
        role: clarift.role,
        editorialSummary:
          "I built Clarift as an AI-powered study engine for Filipino students. It turns uploaded material into grounded summaries, quizzes, and targeted practice using a Next.js and FastAPI architecture with background jobs, Redis, and pgvector.",
        heroImage: clarift.heroImage,
        detailRoute: `/projects/${clarift.slug}`,
        source: { source: "lib/projects.ts", recordId: clarift.slug },
        technicalEvidence: [
          "Split Next.js + FastAPI architecture for AI pipelines",
          "ARQ worker with Redis for async document ingestion",
          "pgvector RAG grounding all outputs in student materials",
        ],
        liveUrl: clarift.live,
        githubUrl: clarift.github,
      },
    ],
  };
}

// ─── Scene 03: Experience & Corroboration ────────────────────────────

export interface HomepageExperienceProjection {
  records: [ExperienceCardProjection, ExperienceCardProjection];
  /** Eskwelabs credential attached as corroboration */
  attachedCredential: CredentialProjection;
}

export function getHomepageExperience(): HomepageExperienceProjection {
  const eskwelabs = experience[0];
  const freelance = experience[1];
  const eskwelabsCert = requireCertificate(
    "eskwelabs-ai-solution-development-track"
  );

  return {
    records: [
      {
        role: eskwelabs.role,
        company: eskwelabs.company,
        period: eskwelabs.period,
        editorialSummary:
          "At Eskwelabs, I architected and scaffolded a recruitment automation system with AI-assisted job-description and social-post generation. I owned the UI layer, coordinated implementation tasks through GitHub issues, and helped reduce manual recruitment work by about 80%.",
        proof: {
          value: "~80%",
          label: "reduced manual recruitment work",
          attribution: "Eskwelabs internship",
          source: { source: "lib/experience.ts", recordId: "eskwelabs" },
        },
        source: { source: "lib/experience.ts", recordId: "eskwelabs" },
      },
      {
        role: freelance.role,
        company: freelance.company,
        period: freelance.period,
        editorialSummary:
          "As the sole developer for Le Doux, I replaced a Google Forms ordering workflow with a production platform covering customer orders, GCash verification, menu management, CRM, and analytics.",
        proof: {
          value: "75%",
          label: "faster order processing",
          attribution: "Client-reported, Le Doux",
          source: { source: "lib/experience.ts", recordId: "freelance" },
        },
        source: { source: "lib/experience.ts", recordId: "freelance" },
      },
    ],
    attachedCredential: {
      title: eskwelabsCert.title,
      slug: eskwelabsCert.slug,
      issuer: eskwelabsCert.issuer,
      date: eskwelabsCert.date,
      editorialSummary:
        "Completed the Eskwelabs AI Solution Development Track while building AI-powered recruitment and operations workflows.",
      image: eskwelabsCert.image,
      credentialUrl: eskwelabsCert.credentialUrl,
      source: { source: "lib/certificates.ts", recordId: eskwelabsCert.slug },
    },
  };
}

// ─── Scene 04: More Selected Work ────────────────────────────────────

export interface HomepageMoreWorkProjection {
  supporting: [ProjectCardProjection, ProjectCardProjection, ProjectCardProjection];
  catalogueRoute: "/projects";
}

export function getHomepageMoreWork(): HomepageMoreWorkProjection {
  const simplyNote = requireProject("simply-note");
  const thePodium = requireProject("the-podium");
  const hcdcLfms = requireProject("hcdc-lfms");

  const mapSupporting = (
    p: ReturnType<typeof requireProject>,
    summary: string
  ): ProjectCardProjection => ({
    slug: p.slug,
    title: p.title,
    year: p.year,
    role: p.role,
    editorialSummary: summary,
    heroImage: p.heroImage,
    detailRoute: `/projects/${p.slug}`,
    source: { source: "lib/projects.ts", recordId: p.slug },
    liveUrl: p.live,
    githubUrl: p.github,
  });

  return {
    supporting: [
      mapSupporting(
        simplyNote,
        "An AI learning application that turns a learner's own notes and PDFs into summaries, roadmaps, and quizzes."
      ),
      mapSupporting(
        thePodium,
        "A seminar platform for HCDC's VPAA with QR attendance, certificate generation, email notifications, and evaluation analytics."
      ),
      mapSupporting(
        hcdcLfms,
        "A centralized lost-and-found system with reporting, claims, notifications, moderation, and role-based access."
      ),
    ],
    catalogueRoute: "/projects",
  };
}

// ─── Scene 05: Personal & Live Presence ──────────────────────────────

export interface HomepagePersonalProjection {
  portrait: StaticImageData;
  aboutPrimary: string;
  aboutSecondary: string;
  /** Personal identifier only — not a replacement for professional name */
  personalHandle: "Hanseo";
}

export function getHomepagePersonal(): HomepagePersonalProjection {
  return {
    portrait: hansPortrait,
    aboutPrimary:
      "I design architecture from product requirements before implementation so delivery stays clear and maintainable. I use specs and ADRs to keep decisions explicit and reduce rework.",
    aboutSecondary:
      "Outside, I enjoy going to coffee shops, playing billiards, attending tech events, volunteering for tech communities, and hanging out with friends.",
    personalHandle: "Hanseo",
  };
}

// ─── Scene 06: Contact ───────────────────────────────────────────────

export interface HomepageContactProjection {
  closeStatement: "Let's connect.";
  channels: ContactChannel[];
}

export function getHomepageContact(): HomepageContactProjection {
  return {
    closeStatement: "Let's connect.",
    channels: [
      { type: "email", label: "Email", href: `mailto:${EMAIL_ADDRESS}` },
      { type: "linkedin", label: "LinkedIn", href: LINKEDIN_URL },
      { type: "github", label: "GitHub", href: GITHUB_URL },
    ],
  };
}

// ─── Aggregate ───────────────────────────────────────────────────────

export function getHomepageProjections() {
  return {
    identity: getHomepageIdentity(),
    flagships: getHomepageFlagships(),
    experience: getHomepageExperience(),
    moreWork: getHomepageMoreWork(),
    personal: getHomepagePersonal(),
    contact: getHomepageContact(),
  };
}

export type HomepageProjections = ReturnType<typeof getHomepageProjections>;
