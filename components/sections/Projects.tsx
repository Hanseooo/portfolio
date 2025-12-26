"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { projects } from "@/lib/projects";
import ProjectCard from "../cards/ProjectCard";

export default function Projects() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".project-card", {
        y: 80,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
        stagger: 0.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-background px-6 py-32"
    >
      <h2 className="mb-20 text-center sm:text-start text-primary font-bold text-[clamp(2.5rem,8vw,6rem)] leading-none">
        Featured Projects
      </h2>
            <div id="projects" className="h-0.5 bg-background" />
      

      <div className="mx-auto max-w-6xl grid gap-32">
        {projects.map((project) => (
          <ProjectCard key={project.slug} {...project} />
        ))}
      </div>
    </section>
  );
}
