"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
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
      className="about-panel bg-background dark:border-r flex flex-col md:flex-row h-screen w-screen items-center justify-center px-6 md:px-12 gap-12"
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
            { label: "TypeScript", id: "typescript" },
            { label: "Next.js", id: "nextjs" },
            { label: "React", id: "react" },
            { label: "Tailwind CSS", id: "tailwind" },
            { label: "React Query", id: "reactquery" },
            { label: "Bootstrap", id: "bootstrap" },
            { label: "JavaScript", id: "javascript" },
            { label: "Shadcn Ui", id: "shadcnui" },
          ]}
        />

        <ToolGroup
          title="Backend"
          tools={[
            { label: "Python", id: "python" },
            { label: "Django", id: "django" },
            { label: "PostgreSQL", id: "postgres" },
            { label: "MySQL", id: "mysql" },
          ]}
        />

        <ToolGroup
          title="Services"
          tools={[
            { label: "Github", id: "github" },
            { label: "Git", id: "git" },
            { label: "AI Studio", id: "ai-studio" },
            { label: "Firebase", id: "firebase" },
            { label: "Supabase", id: "supabase" },
          ]}
        />
      </div>
    </div>
  );
}
