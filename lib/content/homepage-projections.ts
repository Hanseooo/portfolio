// lib/content/homepage-projections.ts

/**
 * Named content projections for the six homepage scenes.
 * These are DETERMINISTIC views of authoritative records.
 * They do NOT create new factual claims.
 */

import type { StaticImageData } from "next/image";
import hansPortrait from "@/app/assets/myImages/hans.webp";
import { projects } from "@/lib/projects";
import { experience, type ExperienceRecord } from "@/lib/experience";
import { certificates } from "@/lib/certificates";
import { EMAIL_ADDRESS, LINKEDIN_URL, GITHUB_URL } from "@/components/utils/externalLinks";
import type {
  ProofFigure,
  ProjectCardProjection,
  ExperienceCardProjection,
  CredentialProjection,
  ContactChannel,
} from "./types";

const FLAGSHIP_SLUGS = ["story-buddy", "clarift", "le-doux"] as const;
const MORE_WORK_SLUGS = ["simply-note", "the-podium", "hcdc-lfms"] as const;

const leDouxProof: ProofFigure = {
  value: "75%",
  label: "faster order processing",
  attribution: "Client-reported, Le Doux",
  source: { source: "lib/experience.ts", recordId: "freelance" },
};

const projectEditorial: Record<string, { summary: string; technicalEvidence?: string[] }> = {
  "story-buddy": {
    summary: "As the solo developer working with three researchers, I built StoryBuddy, a capstone that turns Grade 5–6 learners' stories into picture books. Its 11-node LangGraph pipeline connects story analysis, reference generation, consistency checks, and targeted scene regeneration using open-weight models.",
    technicalEvidence: [
      "11-node deterministic LangGraph pipeline",
      "VLM-based consistency checks and targeted scene regeneration",
      "Character-identity annotation with precision, recall, and F1 reporting",
    ],
  },
  "clarift": {
    summary: "I built Clarift as an AI-powered study engine for Filipino students. It turns uploaded material into grounded summaries, quizzes, and targeted practice using a Next.js and FastAPI architecture with background jobs, Redis, and pgvector.",
    technicalEvidence: [
      "Split Next.js + FastAPI architecture for AI pipelines",
      "ARQ worker with Redis for async document ingestion",
      "pgvector RAG grounding all outputs in student materials",
    ],
  },
  "le-doux": {
    summary: "I built Le Doux for an artisanal cookie business in Davao, replacing its Google Forms workflow with a structured ordering platform and admin system. As the sole full-stack developer, I handled ordering, GCash verification, menu management, CRM, and analytics. The client reported processing orders 75% faster.",
    technicalEvidence: [
      "Next.js full-stack App Router with Server Actions",
      "Server-side total recalculation, row-level security, and order snapshots",
      "Client-side OCR for GCash reference extraction",
    ],
  },
  "simply-note": { summary: "An AI learning application that turns a learner's own notes and PDFs into summaries, roadmaps, and quizzes." },
  "the-podium": { summary: "A seminar platform for HCDC's VPAA with QR attendance, certificate generation, email notifications, and evaluation analytics." },
  "hcdc-lfms": { summary: "A centralized lost-and-found system with reporting, claims, notifications, moderation, and role-based access." },
};

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

function requireExperience(id: ExperienceRecord["id"]) {
  const record = experience.find((record) => record.id === id);
  if (!record) {
    throw new Error(`Homepage projection requires experience id: ${id}`);
  }
  return record;
}

function projectCard(slug: string): ProjectCardProjection {
  const project = requireProject(slug);
  const editorial = projectEditorial[slug];
  if (!editorial) {
    throw new Error(`Homepage projection requires editorial summary: ${slug}`);
  }
  return {
    slug: project.slug,
    title: project.title,
    year: project.year,
    role: project.role,
    editorialSummary: editorial.summary,
    heroImage: project.heroImage,
    detailRoute: `/projects/${project.slug}`,
    source: { source: "lib/projects.ts", recordId: project.slug },
    technicalEvidence: editorial.technicalEvidence,
    liveUrl: project.live,
    githubUrl: project.github,
  };
}

// ─── Scene 01: Identity & Immediate Proof ───────────────────────────

export interface HomepageIdentityProjection {
  name: "Hans Amoguis";
  roleStatement: string;
  introduction: string;
  immediateProof: ProofFigure[];
  portrait: StaticImageData;
}

export function getHomepageIdentity(): HomepageIdentityProjection {
  return {
    name: "Hans Amoguis",
    roleStatement: "Full-stack engineer focused on AI product engineering.",
    introduction:
      "I build maintainable full-stack and AI products with clear architecture, clean implementation, and practical user experience.",
    immediateProof: [
      leDouxProof,
      {
        value: "5",
        label: "merged PRs across PyCon Davao 2026, TechTix, and the DurianPy badge service",
        attribution: "DurianPy contributions",
        source: { source: "lib/experience.ts", recordId: "durianpy" },
      },
      {
        value: "11",
        label: "node LangGraph pipeline behind StoryBuddy",
        attribution: "StoryBuddy",
        source: { source: "lib/projects.ts", recordId: "story-buddy" },
      },
    ],
    portrait: hansPortrait,
  };
}

// ─── Scene 02: Flagship Work ────────────────────────────────────────

export interface HomepageFlagshipProjection {
  flagships: ProjectCardProjection[];
}

export function getHomepageFlagships(): HomepageFlagshipProjection {
  return { flagships: FLAGSHIP_SLUGS.map(projectCard) };
}

export interface HomepageExperienceProjection {
  records: ExperienceCardProjection[];
  /** Eskwelabs credential attached as corroboration */
  attachedCredential: CredentialProjection;
}

export function getHomepageExperience(): HomepageExperienceProjection {
  const eskwelabs = requireExperience("eskwelabs");
  const durianpy = requireExperience("durianpy");
  const freelance = requireExperience("freelance");
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
          "At Eskwelabs, I built a recruitment automation prototype, its React frontend, and LangChain workflows for job descriptions and social posts. I coordinated fellow interns through GitHub issues, then took over the Slide Deck Generator from v1 and built v1.1 with a fellow intern; it runs for instructors.",
        source: { source: "lib/experience.ts", recordId: "eskwelabs" },
      },
      {
        role: durianpy.role,
        company: durianpy.company,
        period: durianpy.period,
        editorialSummary:
          "On DurianPy's engineering committee, I contributed the PyCon Davao 2026 hero and travel guide, updated TechTix registration, and built a FastAPI endpoint for badge-artwork uploads. These contributions were merged.",
        evidenceLink: { label: "5 merged PRs", href: "/experience#durianpy" },
        source: { source: "lib/experience.ts", recordId: "durianpy" },
      },
      {
        role: freelance.role,
        company: freelance.company,
        period: freelance.period,
        editorialSummary:
          "As the sole developer for Le Doux, I replaced a Google Forms ordering workflow with a production platform covering customer orders, GCash verification, menu management, CRM, and analytics.",
        proof: leDouxProof,
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
  supporting: ProjectCardProjection[];
  firstPosition: number;
  catalogueRoute: "/projects";
}

export function getHomepageMoreWork(): HomepageMoreWorkProjection {
  return {
    supporting: MORE_WORK_SLUGS.map(projectCard),
    firstPosition: FLAGSHIP_SLUGS.length + 1,
    catalogueRoute: "/projects",
  };
}

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
