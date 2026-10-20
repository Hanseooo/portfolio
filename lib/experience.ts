import type { StaticImageData } from "next/image";
import slideGenerate from "@/app/assets/experience/eskwelabs/slide-deck-01-generate.webp";
import slideHistory from "@/app/assets/experience/eskwelabs/slide-deck-02-history.webp";
import slidePreview from "@/app/assets/experience/eskwelabs/slide-deck-03-deck-preview.webp";
import slideOutput from "@/app/assets/experience/eskwelabs/slide-deck-04-slides-output.webp";

export type ExperienceRecord = {
  id: "eskwelabs" | "durianpy" | "freelance";
  role: string;
  company: string;
  period: string;
  points: string[];
  links?: { label: string; href: string }[];
  gallery?: { image: StaticImageData; alt: string; caption: string }[];
};

export const experience: ExperienceRecord[] = [
  {
    id: "eskwelabs",
    role: "AI Solutions Development Intern",
    company: "Eskwelabs",
    period: "Feb 2026 — May 2026",
    points: [
      "Architected and scaffolded a full-stack recruitment automation prototype; implemented LangChain workflows for job descriptions and LinkedIn/Facebook posts to standardize recurring content drafts.",
      "Built the React frontend with shadcn/ui and organized development through structured GitHub issues, assigning implementation tasks to fellow interns to coordinate parallel work.",
      "Developed a template-driven Google Slides generator with slide ordering, placeholder replacement, speaker-specific notes, and incomplete-content checks to produce drafts ready for human review.",
      "Took over the Slide Deck Generator from v1 and built v1.1 with a fellow intern, adding generation history, speaker notes with retry, single-slide regeneration, and Slides API backoff; it runs for instructors at eskwelabs-instructor-slides.vercel.app.",
    ],
    links: [
      
    ],
    gallery: [
      { image: slideGenerate, alt: "Slide Deck Generator upload and generation form", caption: "Upload a PRD and generate a lecture deck." },
      { image: slideHistory, alt: "Generation history showing status, slide counts, and cost", caption: "Supabase-backed generation history added in v1.1." },
      { image: slidePreview, alt: "Generated lecture deck preview, slide 1 of 31", caption: "Review the generated deck before opening Google Slides." },
      { image: slideOutput, alt: "Generated Google Slide with an image placeholder and speaker notes", caption: "Generated slide output with a placeholder for human review and speaker notes." },
    ],
  },
  {
    id: "durianpy",
    role: "Volunteer Software Developer",
    company: "DurianPy",
    period: "Aug 2026 — Present",
    points: [
      "Built and tested a FastAPI admin endpoint for presigned badge-artwork uploads with authentication, request validation, and sanitized errors; changes were merged.",
      "Implemented the responsive homepage hero and travel-guide page for PyCon Davao 2026 from Figma designs; both contributions were merged into the conference website.",
      "Updated the TechTix registration step for the 2026 event while preserving existing field mappings, validation, and next-step behavior; changes were merged.",
    ],
    links: [
      { label: "PyCon Davao 2026 hero · PR #11", href: "https://github.com/DurianPy-Davao-Python-User-Group/pycon-davao-2026-website/pull/11" },
      { label: "PyCon Davao 2026 travel guide · PR #41", href: "https://github.com/DurianPy-Davao-Python-User-Group/pycon-davao-2026-website/pull/41" },
      { label: "PyCon Davao 2026 venue fix · PR #46", href: "https://github.com/DurianPy-Davao-Python-User-Group/pycon-davao-2026-website/pull/46" },
      { label: "TechTix registration · PR #112", href: "https://github.com/DurianPy-Davao-Python-User-Group/TechTix/pull/112" },
      { label: "Badge-artwork upload · PR #10", href: "https://github.com/DurianPy-Davao-Python-User-Group/durianpy-badge-service-backend/pull/10" },
    ],
  },
  {
    id: "freelance",
    role: "Full-Stack Web Developer",
    company: "Freelance",
    period: "",
    points: [
      "Designed, developed, and deployed a Next.js/Supabase ordering platform replacing Google Forms; the client reported 75% faster order processing.",
      "Built a multi-step checkout, GCash proof review with browser-based OCR, and admin tools for orders, products, customers, and reporting to centralize daily operations.",
      "Implemented server-side total recalculation, PostgreSQL row-level security, and order snapshots to protect prices, access, and historical records.",
    ],
  },
];
