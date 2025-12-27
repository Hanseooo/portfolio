// lib/projects.ts
import simplyNoteHero from "@/app/assets/projects/simplyNote/1.png"
import simplyNote2 from "@/app/assets/projects/simplyNote/2.png";
import simplyNote3 from "@/app/assets/projects/simplyNote/3.png";
import simplyNote4 from "@/app/assets/projects/simplyNote/4.png";

import ThePodiumHero  from "@/app/assets/projects/ThePodium/1.png";
import ThePodium2 from "@/app/assets/projects/ThePodium/2.png";
import ThePodium3 from "@/app/assets/projects/ThePodium/3.png";
import ThePodium4 from "@/app/assets/projects/ThePodium/4.png";
import { StaticImageData } from "next/image";


export type Project = {
    slug: string;
    title: string;
    subtitle: string;
    heroImage: StaticImageData;
    heroSubtitleColor: string;
    heroTextPosition: string;
    overview: string;
    features: string[];
    role: string;
    stack: string[];
    gallery: StaticImageData[];
    github?: string;
    live?: string;
}

export const projects: Project[] = [
  {
    slug: "simply-note",
    title: "SimplyNote",
    subtitle: "An AI-Powered Learning Productivity Web Application",
    heroImage: simplyNoteHero,
    heroSubtitleColor: "text-white/80",
    heroTextPosition: "bottom-20",
    overview:
      "SimplyNote is an AI-powered learning productivity platform that helps students and self-learners study smarter using their own content. It transforms raw notes into concise structured summaries, structured learning roadmaps, interactive quizzes with explanations. SimplyNote implements a rolling-window AI quota system to ensure fairness, performance, and transparency.",
    features: [
      "JWT-based authentication",
      "Summarize pasted notes or PDFs",
      "AI-powered summarization, roadmap & quiz generation",
      "Create quizzes only from your notes",
      "Quiz answer explanations",
      "Note formatting",
      "Share generated content via share codes",
      "Quiz explanations and mastery analytics",
      "Transparent AI quota system",
      "Feedback & bug reporting system",
    ],
    role: "Solo Developer",
    stack: ["React", "TypeScript", "Tailwind CSS", "Shadcn/ui", "Zustand", "Tanstack Router", "Tanstack Query", "Django REST Framework", "PostgreSQL", "Brevo"],
    gallery: [simplyNoteHero, simplyNote2, simplyNote3, simplyNote4],
    github: "https://github.com/Hanseooo/simply-note",
    live: "https://simplynote-ai.vercel.app",
  },
  {
    slug: "the-podium",
    title: "The Podium",
    subtitle:
      "A Seminar Tracking Platform with automated Certifications and Attendance System",
    heroImage: ThePodiumHero,
    heroSubtitleColor: "text-white/80",
    heroTextPosition: "bottom-20",
    overview:
      "A Full-stack web application built as a school project for HCDC's VPAA for seminar management. This system streamlines seminar management, QR-based attendance, certificate generation and editing, email notifications, and evaluation analytics.",
    features: [
      "Participant roles: attend seminars, view history, download certificates",
      "Admin roles: manage seminars, track attendance, view analytics",
      "QR attendance system: auto-generated codes, instant server validation, error handling",
      "Certificate generation: upload templates, adjust text, fonts, colors, rendered as PNG",
      "Supports customization: font family, size, color, text position, show/hide event name",
      "Email system via Brevo API: verification codes, password reset links, certificate notifications",
      "Seminar evaluation analytics: collect participant feedback, admin dashboards and charts for ratings, satisfaction, responses",
      "Seminar management: create, edit, delete seminars, upload images, view attendance, export data",
    ],

    role: "Solo Developer",
    stack: ["React", "TypeScript", "Tailwind CSS", "Shadcn/ui", "Zustand", 'Django REST Framework', "PostgreSQL", "Brevo", "Cloudinary"],
    gallery: [ThePodiumHero, ThePodium2, ThePodium3, ThePodium4],
    github: "https://github.com/Hanseooo/attendance-evaluation-certification",
  },
];
