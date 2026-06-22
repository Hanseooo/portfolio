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
    heroSubtitleColor: string;
    heroTextPosition: string;
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
    integrations: [],
    gallery: simplyNoteImages,
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
    gallery: thePodiumImages,
    github: "https://github.com/Hanseooo/attendance-evaluation-certification",
    live: "https://hcdc-podium.vercel.app",
    client: "HCDC – VPAA",
    clientConsent: true,
  },
  {
    slug: "hcdc-lfms",
    title: "Lost and Found Management System",
    subtitle:
      "A centralized Lost and Found Management System with reporting, claims, notifications, and admin moderation",
    heroImage: hcdcLFMSHero,
    heroSubtitleColor: "text-white/80",
    heroTextPosition: "bottom-20",
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
