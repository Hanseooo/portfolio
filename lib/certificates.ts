import introToModernAICert from "@/app/assets/certificates/intro-to-modern-ai.png"
import nationalProgrammingChallenge2024 from "@/app/assets/certificates/national-programming-challenge-2024.png";
import pythonEssentials1Cert from "@/app/assets/certificates/pythonEssentials1.png";
import { StaticImageData } from "next/image";



interface Certificate {
  title: string;
  slug: string
  issuer: string;
  image: StaticImageData;
  date: string;
  credentialUrl: string | null;
}

export const certificates: Certificate[] = [
  {
    title: "Introduction to Modern AI Completion",
    slug: "introduction-to-modern-ai",
    issuer: "Cisco Networking Academy",
    image: introToModernAICert,
    date: "December 8, 2025",
    credentialUrl:
      "https://www.credly.com/badges/505dca5f-4aa7-48c6-9b06-c37495b9b9d0/public_url",
  },
  {
    title: "National Programming Challenge 2024 Participation",
    slug: "national-programming-challenge-2024",
    issuer: "Codechum",
    image: nationalProgrammingChallenge2024,
    date: "December 5, 2024",
    credentialUrl: "https://hcdc.codechum.com/certificates/4235",
  },
  {
    title: "Python Essentials 1 Completion",
    slug: "python-essentials-1",
    issuer: "Cisco Networking Academy",
    image: pythonEssentials1Cert,
    date: "December 5, 2025",
    credentialUrl:
      "https://www.credly.com/badges/bdec1c5f-e5af-423d-b0e1-e5f934f97054/public_url",
  },
];
