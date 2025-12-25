"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import {
  Code2,
  Layers,
  Database,
  Server,
  Cloud,
  GitBranch,
} from "lucide-react";
import { ToolGroup } from "./Tools/ToolGroup";

export default function ToolsPanel() {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".tool-group", {
        y: 40,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: panelRef.current,
          start: "top 80%",
        },
      });
    }, panelRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={panelRef}
      className="about-panel bg-background flex flex-col md:flex-row h-screen w-screen items-center justify-center px-6 md:px-12 gap-12"
    >
      {/* LEFT — TITLE */}
      <div className="flex flex-col justify-center text-center md:text-left w-full md:w-1/2">
        <span className="mb-4 text-xs uppercase tracking-[0.3em] opacity-60">
          Tools
        </span>
        <h2 className="text-primary text-4xl md:text-5xl font-bold leading-tight">
          The Stack
          <br />I Trust
        </h2>
      </div>

      {/* RIGHT — Tool Groups */}
      <div className="w-full md:w-1/2 space-y-10">
        <ToolGroup
          title="Frontend"
          tools={[
            { label: "Next.js", icon: Code2 },
            { label: "React", icon: Layers },
            { label: "Tailwind CSS", icon: Layers },
            { label: "Framer Motion", icon: Layers },
            { label: "GSAP", icon: Layers },
          ]}
        />

        <ToolGroup
          title="Backend"
          tools={[
            { label: "Django REST", icon: Server },
            { label: "PostgreSQL", icon: Database },
            { label: "Auth Systems", icon: Server },
          ]}
        />

        <ToolGroup
          title="Services"
          tools={[
            { label: "Vercel", icon: Cloud },
            { label: "GitHub", icon: GitBranch },
            { label: "CI / CD", icon: Cloud },
          ]}
        />
      </div>
    </div>
  );
}
