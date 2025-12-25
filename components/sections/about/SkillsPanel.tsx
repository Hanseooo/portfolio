"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function SkillsPanel() {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".skill-group", {
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
          Skills
        </span>
        <h2 className="text-primary text-4xl md:text-5xl font-bold leading-tight">
          Building
          <br />
          With Intent
        </h2>
      </div>

      {/* RIGHT — Skills List */}
      <div className="w-full md:w-1/2 space-y-8">
        <SkillGroup
          title="Frontend"
          items={[
            "React / Next.js",
            "TypeScript",
            "Tailwind CSS",
            "Framer Motion",
            "GSAP",
          ]}
        />
        <SkillGroup
          title="Backend"
          items={[
            "Django REST Framework",
            "PostgreSQL",
            "Authentication",
            "REST APIs",
          ]}
        />
        <SkillGroup
          title="Practices"
          items={[
            "Component Architecture",
            "CI/CD",
            "Performance Optimization",
            "UX-driven Engineering",
          ]}
        />
      </div>
    </div>
  );
}

function SkillGroup({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="skill-group">
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide opacity-70">
        {title}
      </h3>
      <ul className="space-y-1 text-lg opacity-85">
        {items.map((item) => (
          <li key={item}>— {item}</li>
        ))}
      </ul>
    </div>
  );
}
