"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { motion } from "framer-motion";


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
      className="about-panel flex flex-col bg-background dark:bg-transparent dark:border-r md:flex-row h-screen w-screen items-center justify-center px-6 md:px-12 gap-12"
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
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.4 }}
        className="w-full md:w-1/2 space-y-8"
      >
        <SkillGroup
          title="Web Development Fundamentals"
          items={[
            "Responsive web interface development",
            "RESTful API integration and client–server architecture",
            "AI Integration",
            "Design-to-code accuracy",
          ]}
        />
        <SkillGroup
          title="Engineering and Problem Solving"
          items={[
            "Writing clean, maintainable code",
            "Breaking down complex problems",
            "Logical thinking",
            "Code organization and structure",
          ]}
        />
        <SkillGroup
          title="Development Workflow"
          items={[
            "Feature branching and encapsulation",
            "Git/GitHub workflows and pull requests",
            "Component-based development",
            "Basic CI/CD and cloud deployment concepts",
          ]}
        />
      </motion.div>
    </div>
  );
}

function SkillGroup({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="skill-group">
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide opacity-70">
        {title}
      </h3>
      <ul className="space-y-1 text:md sm:text-lg opacity-85">
        {items.map((item) => (
          <li key={item} className="ml-4">- {item}</li>
        ))}
      </ul>
    </div>
  );
}
