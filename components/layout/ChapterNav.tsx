"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ScrollTrigger } from "@/lib/gsap";

interface Chapter {
  id: string;
  title: string;
  number: string;
}

const chapters: Chapter[] = [
  { id: "identity", title: "Identity", number: "01" },
  { id: "approach", title: "Approach", number: "02" },
  { id: "stack", title: "Stack", number: "03" },
  { id: "work", title: "Selected Work", number: "04" },
  { id: "trajectory", title: "Trajectory", number: "05" },
  { id: "credentials", title: "Credentials", number: "06" },
];

export default function ChapterNav() {
  const [activeId, setActiveId] = useState<string>("identity");

  useEffect(() => {
    let triggers: (ReturnType<typeof ScrollTrigger.create> | null)[] = [];

    const buildTriggers = () => {
      triggers.forEach((t) => t?.kill());
      triggers = chapters.map((chapter) => {
        const el = document.getElementById(chapter.id);
        if (!el) return null;
        return ScrollTrigger.create({
          trigger: el,
          start: "top 50%",
          end: "bottom 50%",
          onEnter: () => setActiveId(chapter.id),
          onEnterBack: () => setActiveId(chapter.id),
        });
      });
    };

    buildTriggers();
    // Rebuild after refresh so positions account for pin spacers (FeaturedProjects, Philosophy)
    ScrollTrigger.addEventListener("refresh", buildTriggers);

    return () => {
      ScrollTrigger.removeEventListener("refresh", buildTriggers);
      triggers.forEach((t) => t?.kill());
    };
  }, []);

  return (
    <div className="fixed left-6 top-1/2 z-50 hidden -translate-y-1/2 flex-col gap-8 xl:flex">
      {chapters.map((chapter) => (
        <button
          key={chapter.id}
          onClick={() => {
            document.getElementById(chapter.id)?.scrollIntoView({ behavior: "smooth" });
          }}
          className="relative flex items-center gap-4 group cursor-pointer"
        >
          {/* Active Line Indicator */}
          <motion.div
            initial={false}
            animate={{
              width: activeId === chapter.id ? 24 : 0,
              opacity: activeId === chapter.id ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="absolute -left-10 h-[1px] bg-primary group-hover:opacity-50"
          />

          <span
            className={`font-mono text-xs transition-all duration-300 ${
              activeId === chapter.id
                ? "text-primary opacity-100"
                : "text-muted-foreground opacity-50 group-hover:text-primary group-hover:opacity-75"
            }`}
          >
            {chapter.number}
          </span>
          <span
            className={`text-xs uppercase tracking-widest transition-all duration-300 ${
              activeId === chapter.id
                ? "text-foreground opacity-100 font-bold"
                : "text-muted-foreground opacity-0 -translate-x-4 group-hover:opacity-50 group-hover:translate-x-0"
            }`}
          >
            {chapter.title}
          </span>
        </button>
      ))}
    </div>
  );
}
