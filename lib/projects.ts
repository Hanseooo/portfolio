// lib/projects.ts
import simplyNoteHero from "@/app/assets/projects/simplyNote/hero.webp"
import simplyNote1 from "@/app/assets/projects/simplyNote/1.webp";
import simplyNote2 from "@/app/assets/projects/simplyNote/2.webp";
import simplyNote3 from "@/app/assets/projects/simplyNote/3.webp";
import simplyNote4 from "@/app/assets/projects/simplyNote/4.webp";
import simplyNote5 from "@/app/assets/projects/simplyNote/5.webp";
import simplyNote6 from "@/app/assets/projects/simplyNote/6.webp";
import simplyNote7 from "@/app/assets/projects/simplyNote/7.webp";
import simplyNote8 from "@/app/assets/projects/simplyNote/8.webp";
import simplyNote9 from "@/app/assets/projects/simplyNote/9.webp";

import ThePodiumHero  from "@/app/assets/projects/ThePodium/hero.webp";
import ThePodium1 from "@/app/assets/projects/ThePodium/1.webp";
import ThePodium2 from "@/app/assets/projects/ThePodium/2.webp";
import ThePodium3 from "@/app/assets/projects/ThePodium/3.webp";
import ThePodium4 from "@/app/assets/projects/ThePodium/4.webp";
import ThePodium5 from "@/app/assets/projects/ThePodium/5.webp";
import ThePodium6 from "@/app/assets/projects/ThePodium/6.webp";
import ThePodium7 from "@/app/assets/projects/ThePodium/7.webp";
import ThePodium8 from "@/app/assets/projects/ThePodium/8.webp";
import ThePodium9 from "@/app/assets/projects/ThePodium/9.webp";

import hcdcLFMSHero from "@/app/assets/projects/hcdcLFMS/hero.webp";
import hcdcLFMS1 from "@/app/assets/projects/hcdcLFMS/1.webp";
import hcdcLFMS2 from "@/app/assets/projects/hcdcLFMS/2.webp";
import hcdcLFMS3 from "@/app/assets/projects/hcdcLFMS/3.webp";
import hcdcLFMS4 from "@/app/assets/projects/hcdcLFMS/4.webp";
import hcdcLFMS5 from "@/app/assets/projects/hcdcLFMS/5.webp";
import hcdcLFMS6 from "@/app/assets/projects/hcdcLFMS/6.webp";

import { StaticImageData } from "next/image";


const simplyNoteImages : StaticImageData[] = [
  simplyNote1,
  simplyNote2,
  simplyNote3,
  simplyNote4,
  simplyNote5,
  simplyNote6,
  simplyNote7,
  simplyNote8,
  simplyNote9,
]

const thePodiumImages : StaticImageData[] = [
  ThePodium1,
  ThePodium2,
  ThePodium3,
  ThePodium4,
  ThePodium5,
  ThePodium6,
  ThePodium7,
  ThePodium8,
  ThePodium9,
]

const hcdcLFMSImages  : StaticImageData[] = [
  hcdcLFMS1,
  hcdcLFMS2,
  hcdcLFMS3,
  hcdcLFMS4,
  hcdcLFMS5,
  hcdcLFMS6,
]


export type Project = {
    slug: string;
    title: string;
    subtitle: string;
    heroImage: StaticImageData;
    year: string;
    problem: string;
    technicalDecisions: string[];
    overview: string;
    features: string[];
    role: string;
    stack: string[];
    integrations?: string[];
    gallery: StaticImageData[];
    github?: string;
    live?: string;
    client?: string;
    clientConsent?: boolean;
}

export const projects: Project[] = [
  {
    slug: "simply-note",
    title: "SimplyNote",
    subtitle: "An AI-Powered Learning Productivity Web Application with Note Summarization and Quiz Generation capabilities",
    heroImage: simplyNoteHero,
    year: "2025",
    problem: "Students studying with raw notes had no fast way to turn them into structured study material. Existing tools either required manual reformatting or didn't work with your own content.",
    technicalDecisions: [
      "Rolling-window AI quota system: tracks usage per user over a sliding 24h window rather than a hard daily reset, fairer distribution and harder to game than a midnight cutoff.",
      "Django REST over Next.js API routes: the quota logic, PDF parsing, and AI orchestration needed a persistent process with proper task isolation, serverless functions would hit timeout limits.",
      "Zustand over Redux: the client state surface (auth, quota display, note draft) is small enough that a store factory pattern would have been over-engineering for 3 slices.",
    ],
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
    integrations: [],
    gallery: simplyNoteImages,
    github: "https://github.com/Hanseooo/simply-note",
    live: "https://simplynote-ai.vercel.app",
  },
  {
    slug: "the-podium",
    title: "The Podium",
    subtitle: "A Seminar Tracking Platform with automated Certifications and Attendance System",
    heroImage: ThePodiumHero,
    year: "2024",
    problem: "HCDC's VPAA managed seminar attendance and certificate distribution manually, spreadsheets, printed sign-in sheets, and emailed certificates sent one by one.",
    technicalDecisions: [
      "QR codes generated server-side and validated on scan: avoids the race condition where a client-generated code could be shared or reused before the server invalidates it.",
      "Certificate rendering via canvas/PNG rather than PDF: gives admins live preview of font and position changes, and Cloudinary can serve the PNG directly without a PDF renderer on the client.",
      "Brevo for transactional email: the free tier covers the organization's volume and the template editor reduces the need to maintain HTML email strings in code.",
    ],
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
    stack: ["React", "TypeScript", "Tailwind CSS", "Shadcn/ui", "Zustand", "Django REST Framework", "PostgreSQL", "Brevo", "Cloudinary"],
    gallery: thePodiumImages,
    github: "https://github.com/Hanseooo/attendance-evaluation-certification",
    live: "https://hcdc-podium.vercel.app",
    client: "HCDC – VPAA",
    clientConsent: true,
  },
  {
    slug: "hcdc-lfms",
    title: "Lost and Found Management System",
    subtitle: "A centralized Lost and Found Management System with reporting, claims, notifications, and admin moderation",
    heroImage: hcdcLFMSHero,
    year: "2023",
    problem: "Lost and found items at HCDC were reported informally, word of mouth, group chats, bulletin boards. No central record meant items went unclaimed and disputes had no audit trail.",
    technicalDecisions: [
      "Role-based access at the API layer, not just the UI: admin-only endpoints validate the role on every request so a user who inspects the frontend cannot call moderation routes directly.",
      "Cloudinary for image uploads: offloads resizing and storage from the Django server, keeping the API layer stateless and the server footprint small.",
      "Real-time notifications via polling rather than WebSockets: the notification surface (claim updates, report status) does not need sub-second latency, and polling avoids maintaining a persistent connection on a shared hosting environment.",
    ],
    overview:
      "HCDC Lost and Found Management System is a full-stack web application built as an academic project to streamline lost and found reporting within an organization. The platform allows users to report lost or found items, upload images, interact through claims and comments, and receive real-time notifications. An admin dashboard enables moderation, report validation, and status management to ensure accurate and secure item recovery.",
    features: [
      "User authentication and profile management",
      "Create and manage lost and found item reports",
      "Image uploads using Cloudinary",
      "Item claiming system with activity and resolution logs",
      "Real-time notifications for claims and report updates",
      "Commenting system for report discussions",
      "Admin dashboard for report review, approval, and moderation",
      "Role-based access control (user and admin roles)",
      "Responsive UI with light, dark, and system theme support",
    ],
    role: "Solo Developer",
    stack: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Shadcn/ui",
      "Django REST Framework",
      "PostgreSQL",
      "Cloudinary",
    ],
    gallery: hcdcLFMSImages,
    github: "https://github.com/Hanseooo/hcdc-lfms",
    client: "HCDC",
    clientConsent: true,
  },
];
