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
    role: string;
    stack: string[];
    gallery: StaticImageData[];
    github?: string;
    live?: string;
}

export const projects : Project[] = [
  {
    slug: "simply-note",
    title: "SimplyNote",
    subtitle: "React • PostgreSQL • Django Rest Framework",
    heroImage: simplyNoteHero,
    heroSubtitleColor: "text-white/80",
    heroTextPosition: "bottom-20",
    overview:
      "A Full-stack AI-Powered Learning Productivity Platform that summarizes notes with quiz and roadmap generation capabilities.",
    role: "Solo Developer",
    stack: ["React", "Django", "PostgreSQL"],
    gallery: [simplyNoteHero, simplyNote2, simplyNote3, simplyNote4],
    github: "https://github.com/yourname/motion-portfolio",
    live: "https://yourdomain.com",
  },
  {
    slug: "the-podium",
    title: "The Podium",
    subtitle: "React • PostgreSQL • Django Rest Framework",
    heroImage: ThePodiumHero,
    heroSubtitleColor: "text-white/80",
    heroTextPosition: "bottom-20",
    overview:
      "A Full-stack web application built for HCDC's VPAA for seminar management with attendance system and automated certificate generation upon attendance with a certificate template editor.",
    role: "Solo Developer",
    stack: ["React", "Framer Motion", "Tailwind", "shadcn"],
    gallery: [ThePodiumHero, ThePodium2, ThePodium3, ThePodium4],
    github: "https://github.com/yourname/motion-portfolio",
    live: "https://yourdomain.com",
  },
];
