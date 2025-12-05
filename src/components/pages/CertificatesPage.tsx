"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { ExternalLink } from "lucide-react";
import { Particles } from "@/components/ui/shadcn-io/particles";
import nationalProgrammingChallenge2024 from "@/assets/images/Certificates/national-programming-challenge-2024.png"
import programmingComp2024 from "@/assets/images/Certificates/programming-comp-2024.jpg"
import googleIoExtendedCert from "@/assets/images/Certificates/google-io-extended-cert.png"
import devfest2025Cert from "@/assets/images/Certificates/devfest2025-cert.png"
import pythonEssentials1Cert from "@/assets/images/Certificates/python-essentials1.png"

gsap.registerPlugin(ScrollTrigger);

interface Certificate {
  title: string;
  issuer: string;
  imageUrl: string;
  date: string;
  credentialUrl: string | null;
}

const certificates: Certificate[] = [
    {
    title: "Python Essentials 1 Completion",
    issuer: "Cisco Networking Academy",
    imageUrl: pythonEssentials1Cert,
    date: "December 5, 2025",
    credentialUrl: "https://www.credly.com/badges/bdec1c5f-e5af-423d-b0e1-e5f934f97054/public_url",
  },
  {
    title: "National Programming Challenge 2024 Participation",
    issuer: "Codechum",
    imageUrl: nationalProgrammingChallenge2024,
    date: "December 5, 2024",
    credentialUrl: "https://hcdc.codechum.com/certificates/4235",
  },
  {
    title: "2024 CET TechnoFair Programming Competition - 1st runner-up",
    issuer: "HCDC College of Engineering and Technology",
    imageUrl: programmingComp2024,
    date: "March 20, 2024",
    credentialUrl: null,
  },
    {
    title: "Devfest Davao 2025 Participation",
    issuer: "Google Developer Group Davao",
    imageUrl: devfest2025Cert,
    date: "November 23, 2025",
    credentialUrl: null,
  },
  {
    title: "Google I/O Extended Davao Participation",
    issuer: "Google Developer Group Davao",
    imageUrl: googleIoExtendedCert,
    date: "July 20, 2025",
    credentialUrl: null,
  },
];

export default function CertificatesPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const cardsRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
    // Reset scroll immediately
    window.scrollTo(0, 0);

    // Wait a tick before GSAP initializes
    const id = setTimeout(() => {
        ScrollTrigger.refresh();
    }, 50);

    return () => clearTimeout(id);
    }, []);



  // particle optimization
  const particleQty = useMemo(() => {
    if (typeof window === "undefined") return 40;
    const w = window.innerWidth;
    if (w < 640) return 50;
    if (w < 1280) return 75;
    return 120;
  }, []);

  // subtle GSAP parallax
  useEffect(() => {
    const container = cardsRef.current;
    if (!container) return;

    const cards = container.querySelectorAll<HTMLElement>(".certificate-card");

    const ctx = gsap.context(() => {
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: 0, scale: 1, },
          {
            y: -200 - (i * 50), scale: 0.95,
            ease: "circ",
            scrollTrigger: {
              trigger: card,
              start: "center center",
              end: "bottom top",
              scrub: 0.85,
              invalidateOnRefresh: true,
              markers: false,
            },
          }
        );
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <main
      ref={sectionRef}
      className="relative min-h-screen w-full pt-12 bg-linear-to-r pb-20 from-background via-primary/10 to-background overflow-hidden"
    >
      {/* Particle Background */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <Particles
          className="w-full h-full"
          quantity={particleQty}
          staticity={50}
          ease={60}
          size={1}
          vy= {0.25}
          color="#ffffff"
        />
      </div>

      <div className="mx-auto max-w-4xl px-4 py-16">
        <header className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold">Certificates</h1>
          <p className="mt-2 text-muted-foreground">
            Acquired Certificates
          </p>
        </header>

        {/* Single Column Layout */}
        <div ref={cardsRef} className="flex flex-col gap-10 w-full">
          {certificates.map((cert, idx) => (
            <article
              key={cert.title + idx}
              className="certificate-card will-change-transform"
            >
              <Card className="overflow-hidden w-full max-w-3xl mx-auto bg-linear-to-tr from-background/15 via-primary/10 to-background-25 border-primary border-2 border-b-4 shadow-accent-foreground/20 shadow-xl">
                <CardHeader>
                  <div className="relative w-full aspect-4/3 bg-muted/5 rounded-md overflow-hidden">
                    <button
                      onClick={() => setOpenIndex(idx)}
                      className="absolute inset-0 w-full h-full focus:outline-none"
                      aria-label={`Open ${cert.title} image`}
                    >
                      <img
                        src={cert.imageUrl}
                        alt={cert.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.03] select-none"
                        loading="lazy"
                        draggable={false}
                      />
                    </button>
                  </div>
                </CardHeader>

                <CardContent className="px-4 py-4">
                  <h3 className="text-xl font-semibold">{cert.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {cert.issuer} • {cert.date}
                  </p>
                </CardContent>

                <CardFooter className="px-4 py-3 flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    Issued: {cert.date}
                  </div>

                  {cert.credentialUrl ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-1 rounded-md hover:bg-muted/10 text-sm"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span className="hidden sm:inline">Credential</span>
                        </a>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        View Credential (new tab)
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <div className="text-xs text-muted-foreground"></div>
                  )}
                </CardFooter>
              </Card>
            </article>
          ))}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex mb-48 justify-center">
                <a href="https://www.credly.com/users/hans-amoguis"  target = "_blank">
                  <h4 className="text-xl sm:text-4xl font-bold italic hover:underline wrap-break-word">Visit me on <span className="text-primary text-2xl sm:text-6xl">Credly!</span></h4>
                </a>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              View my badges (new tab)
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Fullscreen-style Dialog */}
    <Dialog open={openIndex !== null} onOpenChange={() => setOpenIndex(null)}>
    <DialogContent
        className="
        w-full 
        max-w-5xl 
        p-0 
        bg-background/50 
        backdrop-blur-md 
        rounded-xl 
        overflow-hidden
        "
    >
        {openIndex !== null && (
        <div className="w-full">

            {/* Header */}
            <DialogHeader
            className="
                px-6 pt-6
                text-center
                md:text-start
            "
            >
            <DialogTitle className="text-2xl font-semibold">
                {certificates[openIndex].title}
            </DialogTitle>
            </DialogHeader>

            {/* Landscape layout container */}
            <div
            className="
                w-full 
                flex 
                flex-col 
                md:flex-row 
                gap-6 
                px-4 
                md:px-6 
                py-4
            "
            >

            {/* Image Section */}
            <div
                className="
                flex-1
                flex 
                items-center 
                justify-center 
                "
            >
                <div
                className="
                    aspect-4/3 
                    w-full 
                    rounded-lg 
                    overflow-hidden 
                    bg-muted/10 
                    
                    /* Add space around image on mobile only */
                    p-3 
                    md:p-0
                "
                >
                <img
                    src={certificates[openIndex].imageUrl}
                    alt={certificates[openIndex].title}
                    className="w-full h-full object-contain select-none"
                />
                </div>
            </div>

            {/* Metadata Section */}
            <div
                className="
                flex-1
                flex 
                flex-col 
                justify-between 
                gap-4 
                text-center 
                md:text-start
                pb-4
                "
            >
                <div>
                <div className="font-medium text-lg">
                    {certificates[openIndex].issuer}
                </div>

                <div className="text-sm text-muted-foreground">
                    {certificates[openIndex].date}
                </div>

                {certificates[openIndex].credentialUrl && (
                    <div className="mt-4">
                    <Tooltip>
                        <TooltipTrigger asChild>
                        <Button
                            size="sm"
                            onClick={() =>
                            window.open(
                                certificates[openIndex].credentialUrl!,
                                "_blank",
                                "noopener,noreferrer"
                            )
                            }
                        >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Open Credential
                        </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                        Opens credential in a new tab
                        </TooltipContent>
                    </Tooltip>
                    </div>
                )}
                </div>

                {/* Footer */}
                <DialogFooter className="md:justify-start justify-center">
                <Button variant="ghost" onClick={() => setOpenIndex(null)}>
                    Close
                </Button>
                </DialogFooter>
            </div>
            </div>
        </div>
        )}
    </DialogContent>
    </Dialog>

    </main>
  );
}
