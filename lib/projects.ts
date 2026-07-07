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

import clariftHero from "@/app/assets/projects/clarift/hero.webp";
import clarift1 from "@/app/assets/projects/clarift/1.webp";
import clarift2 from "@/app/assets/projects/clarift/2.webp";
import clarift3 from "@/app/assets/projects/clarift/3.webp";
import clarift4 from "@/app/assets/projects/clarift/4.webp";
import clarift5 from "@/app/assets/projects/clarift/5.webp";

import leDouxHero from "@/app/assets/projects/leDoux/hero.webp";
import leDoux1 from "@/app/assets/projects/leDoux/1.webp";
import leDoux2 from "@/app/assets/projects/leDoux/2.webp";
import leDoux3 from "@/app/assets/projects/leDoux/3.webp";
import leDoux4 from "@/app/assets/projects/leDoux/4.webp";
import leDoux5 from "@/app/assets/projects/leDoux/5.webp";
import leDoux6 from "@/app/assets/projects/leDoux/6.webp";
import leDoux7 from "@/app/assets/projects/leDoux/7.webp";
import leDoux8 from "@/app/assets/projects/leDoux/8.webp";
import leDoux9 from "@/app/assets/projects/leDoux/9.webp";
import leDoux10 from "@/app/assets/projects/leDoux/10.webp";

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

const clariftImages : StaticImageData[] = [
  clariftHero,
  clarift1,
  clarift2,
  clarift3,
  clarift4,
  clarift5,
]

const leDouxImages : StaticImageData[] = [
  leDouxHero,
  leDoux1,
  leDoux2,
  leDoux3,
  leDoux4,
  leDoux5,
  leDoux6,
  leDoux7,
  leDoux8,
  leDoux9,
  leDoux10,
]


export type Project = {
    slug: string;
    title: string;
    subtitle: string;
    heroImage: StaticImageData;
    ogImageSrc: string;
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
    slug: "le-doux",
    title: "Le Doux",
    subtitle:
      "Artisanal cookie ordering platform with a public order form and comprehensive admin dashboard for managing orders, products, payments, and analytics",
    heroImage: leDouxHero,
    ogImageSrc: "app/assets/projects/leDoux/hero.webp",
    year: "2026",
    problem:
      "A cookie seller relied on Instagram for discovery and Google Forms for order intake. Manual payment screenshot review, no order tracking, no CRM data, and no analytics made operations slow and error-prone. There was no structured product catalog, no automated confirmations, and no way to manage orders at scale.",
    technicalDecisions: [
      "Next.js full-stack App Router: Server Components, Server Actions, Route Handlers, and Middleware in a single deployment — no separate backend needed for this scope.",
      "Supabase for database, auth, and storage: PostgreSQL with RLS handles multi-tenant data isolation, Supabase Auth manages admin sessions, and Storage handles payment proofs and menu images without custom upload logic.",
      "Order snapshot strategy with JSONB: all customer, payment, and form response data is denormalized into snapshots at creation time. Historical orders render from snapshots only, ensuring accuracy as products, prices, or settings change.",
      "Server-side price recalculation: the client submits line items but the server re-fetches product prices from the database and recalculates all totals. Client-submitted totals are never trusted, preventing price tampering.",
      "Tesseract.js for client-side OCR: payment screenshots are processed in the browser to auto-extract GCash reference numbers, reducing manual entry errors without a server-side OCR pipeline.",
      "Dynamic form builder with draft/publish workflow: admins configure the public order form through a visual block editor stored as JSONB, with publish validation ensuring no orphaned categories or empty product lists.",
    ],
    overview:
      "Le Doux is a full-stack cookie ordering platform built for an artisanal cookie business in Davao. It replaces a Google Forms-based workflow with a branded, multi-step order wizard and a comprehensive admin dashboard. The system handles structured product ordering across multiple template types (cookies, boxes, tubs, bento cakes), GCash payment verification with client-side OCR, and a full admin suite covering orders, menu management, form building, customer CRM, and analytics.",
    features: [
      "Multi-step order wizard with step navigation and per-step validation",
      "Dynamic form rendering with admin-configurable blocks (text, images, product categories, customer info, fulfillment, payment, review)",
      "Product catalog with category grouping, sold-out indicators, and image support",
      "Flexible product types — Cookie (simple qty), Box (exact-quantity flavor distribution), Tub (3 flavors + 1 sauce), Bento Cake (dedication + add-ons)",
      "Fulfillment options — self-pickup with slot selection or Maxim delivery with address input",
      "GCash payment with QR display, screenshot upload, and client-side OCR for auto-extracting reference numbers",
      "Order confirmation with summary, social links, and scannable QR code for quick admin lookup",
      "Menu Guide bottom sheet with product information and guides",
      "Admin dashboard with at-a-glance stats (new orders, pending payments, today's orders, estimated revenue)",
      "Orders management — paginated list with status/search filters, CSV export, item breakdown, activity log, and internal notes",
      "Payment verification with screenshot lightbox review and reject-with-reason flow",
      "Manual confirmation with receipt generation — downloadable PNG receipts and copy-text summaries for Instagram/Facebook DMs",
      "Menu management — full CRUD for categories, products, option groups, and option values with template-based pre-creation, reordering, and sold-out toggles",
      "Form builder — drag/reorder form blocks, toggle visibility, exclude products, preview draft, publish with validation",
      "Content management for welcome messages, reminders, and GCash instructions",
      "Settings — pickup slot CRUD with reorder and capacity, payment method toggles with account info and QR upload",
      "Customer CRM — auto-created customer records, searchable list with order stats, customer detail with notes and order history",
      "Analytics — period-filtered charts for revenue over time, status/payment/fulfillment breakdowns, new vs repeat customers, top products and flavors",
      "Staff management with add staff, change password, and forgot password flow",
      "Automated cleanup — weekly pg_cron job deletes orphaned storage files, purges stale logs",
    ],
    role: "Sole Full Stack Developer",
    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind CSS 4",
      "Supabase",
      "Zod",
      "Lucide React",
      "Recharts",
      "Tesseract.js",
      "Framer Motion",
      "qrcode.react",
      "html-to-image",
    ],
    integrations: ["Supabase", "Netlify"],
    gallery: leDouxImages,
    live: "https://le-doux.netlify.app/order",
    client: "Le Doux",
    clientConsent: true,
  },
  {
    slug: "clarift",
    title: "Clarift",
    subtitle:
      "AI-powered study engine for Filipino students — transforms uploaded materials into summaries, quizzes, and targeted practice",
    heroImage: clariftHero,
    ogImageSrc: "app/assets/projects/clarift/hero.webp",
    year: "2026",
    problem:
      "Filipino students and review center learners waste hours reformatting raw study material into usable review content. Existing tools either ignore uploaded notes or generate content from general knowledge rather than the student's own materials.",
    technicalDecisions: [
      "Split architecture (Next.js frontend + FastAPI backend): AI pipelines need persistent processes with proper task isolation, serverless functions hit timeout limits for LangChain chains.",
      "ARQ worker with Redis queue: async job processing for document ingestion and AI generation keeps the API responsive and allows SSE progress tracking.",
      "pgvector for embeddings: leverages the existing Neon PostgreSQL database rather than adding a separate vector store, reducing infrastructure complexity.",
      "Clerk for auth with JWT verification in FastAPI: OAuth handled by a dedicated service, backend verifies tokens directly for tenant isolation.",
      "Cloudflare R2 for file storage: S3-compatible, cost-effective for PDF uploads without vendor lock-in.",
    ],
    overview:
      "Clarift is an AI-powered study engine built specifically for Filipino students and review center learners. It transforms uploaded study material into structured summaries, quizzes, and targeted practice through an active learning loop designed for high-stakes exams. The system uses RAG to ground all AI outputs in the student's own notes, never generating from general knowledge.",
    features: [
      "Document ingestion — upload PDFs as study material",
      "Structured summaries — multi-step AI chain with MermaidJS diagrams",
      "Quiz generation — auto-generated from uploaded material only",
      "Weak area diagnosis — identifies knowledge gaps from quiz performance",
      "Targeted practice — personalized drills focused on specific weak topics",
      "Grounded RAG chat — answers exclusively from uploaded notes",
      "Quota system — daily usage limits with free and Pro tiers",
    ],
    role: "Sole Full Stack Developer",
    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind CSS 4",
      "shadcn/ui",
      "Radix UI",
      "Framer Motion",
      "TanStack React Query",
      "Zustand",
      "Tiptap",
      "Recharts",
      "FastAPI",
      "Python 3.12",
      "LangChain",
      "SQLAlchemy async",
      "Alembic",
      "Neon PostgreSQL",
      "pgvector",
    ],
    integrations: [
      "Clerk",
      "Google Gemini API",
      "Cloudflare R2",
      "Upstash Redis",
      "PayMongo",
      "Sentry",
      "Vercel",
      "Railway",
    ],
    gallery: clariftImages,
    github: "https://github.com/Hanseooo/clarift",
    live: "https://www.clarift.me/",
  },
  {
    slug: "simply-note",
    title: "SimplyNote",
    subtitle:
      "An AI-Powered Learning Productivity Web Application with Note Summarization and Quiz Generation capabilities",
    heroImage: simplyNoteHero,
    ogImageSrc: "app/assets/projects/simplyNote/hero.webp",
    year: "2025",
    problem:
      "Students studying with raw notes had no fast way to turn them into structured study material. Existing tools either required manual reformatting or didn't work with your own content.",
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
    role: "Sole Full Stack Developer",
    stack: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Shadcn/ui",
      "Zustand",
      "Tanstack Router",
      "Tanstack Query",
      "Django REST Framework",
      "PostgreSQL",
      "Brevo",
    ],
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
    ogImageSrc: "app/assets/projects/ThePodium/hero.webp",
    year: "2024",
    problem:
      "HCDC's VPAA managed seminar attendance and certificate distribution manually, spreadsheets, printed sign-in sheets, and emailed certificates sent one by one.",
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
    role: "Sole Full Stack Developer",
    stack: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Shadcn/ui",
      "Zustand",
      "Django REST Framework",
      "PostgreSQL",
      "Brevo",
      "Cloudinary",
    ],
    gallery: thePodiumImages,
    github: "https://github.com/Hanseooo/attendance-evaluation-certification",
    live: "https://hcdc-podium.vercel.app",
  },
  {
    slug: "hcdc-lfms",
    title: "Lost and Found Management System",
    subtitle:
      "A centralized Lost and Found Management System with reporting, claims, notifications, and admin moderation",
    heroImage: hcdcLFMSHero,
    ogImageSrc: "app/assets/projects/hcdcLFMS/hero.webp",
    year: "2024",
    problem:
      "Lost and found items at HCDC were reported informally, word of mouth, group chats, bulletin boards. No central record meant items went unclaimed and disputes had no audit trail.",
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
    role: "Sole Full Stack Developer",
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
  },
];
