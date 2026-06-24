import introToModernAICert from "@/app/assets/certificates/intro-to-modern-ai.webp"
import nationalProgrammingChallenge2024 from "@/app/assets/certificates/national-programming-challenge-2024.webp";
import pythonEssentials1Cert from "@/app/assets/certificates/pythonEssentials1.webp";
import eskwelabsAITrackCert from "@/app/assets/certificates/eskwelabs-cert.jpg";
import { StaticImageData } from "next/image";



export interface Certificate {
  title: string;
  slug: string;
  issuer: string;
  image: StaticImageData;
  date: string;
  credentialUrl: string | null;
  description?: string;
}

export const certificates: Certificate[] = [
  {
    title: "Eskwelabs AI Solution Development Track",
    slug: "eskwelabs-ai-solution-development-track",
    issuer: "Eskwelabs",
    image: eskwelabsAITrackCert,
    date: "May 9, 2026",
    credentialUrl: null,
    description:
      "Built AI-powered internal tools and workflows for Eskwelabs' recruitment and operations processes, including an AI-assisted Job Description generator, Social Media Post generator, and Recruitment Automation System. Completed as part of Eskwelabs' AI Solution Development Track.",
  },
  {
    title: "Introduction to Modern AI",
    slug: "introduction-to-modern-ai",
    issuer: "Cisco Networking Academy",
    image: introToModernAICert,
    date: "December 8, 2025",
    credentialUrl:
      "https://www.credly.com/badges/505dca5f-4aa7-48c6-9b06-c37495b9b9d0/public_url",
    description:
      "Covers the foundations of modern AI: llms, generative AI, and their applications. Part of Cisco's Networking Academy AI track, verified through a Credly badge.",
  },
  {
    title: "National Programming Challenge 2024",
    slug: "national-programming-challenge-2024",
    issuer: "Codechum",
    image: nationalProgrammingChallenge2024,
    date: "December 5, 2024",
    credentialUrl: "https://hcdc.codechum.com/certificates/4235",
    description:
      "Participated in the National Programming Challenge 2024, a competitive programming contest organized by Codechum. The challenge tested problem-solving skills, algorithmic thinking, and coding proficiency.",
  },
  {
    title: "Python Essentials 1",
    slug: "python-essentials-1",
    issuer: "Cisco Networking Academy",
    image: pythonEssentials1Cert,
    date: "December 5, 2025",
    credentialUrl:
      "https://www.credly.com/badges/bdec1c5f-e5af-423d-b0e1-e5f934f97054/public_url",
    description:
      "Foundational Python certification covering syntax, data types, control flow, functions, and basic object-oriented programming. Part of Cisco's Networking Academy Python track, verified through a Credly badge.",
  },
];
