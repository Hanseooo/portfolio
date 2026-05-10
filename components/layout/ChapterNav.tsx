"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Chapter {
  id: string;
  title: string;
  number: string;
}

const chapters: Chapter[] = [
  { id: "identity", title: "Identity", number: "01" },
  { id: "approach", title: "Approach", number: "02" },
  { id: "work", title: "Selected Work", number: "03" },
  { id: "trajectory", title: "Trajectory", number: "04" },
];

export default function ChapterNav() {
  const [activeId, setActiveId] = useState<string>("identity");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      
      for (let i = chapters.length - 1; i >= 0; i--) {
        const chapter = chapters[i];
        const element = document.getElementById(chapter.id);
        
        if (element) {
          const { top } = element.getBoundingClientRect();
          const elementTop = top + window.scrollY;
          
          if (scrollPosition >= elementTop) {
            setActiveId(chapter.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Init

    return () => window.removeEventListener("scroll", handleScroll);
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
