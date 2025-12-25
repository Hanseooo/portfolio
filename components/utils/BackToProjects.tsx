"use client";

import { useRouter } from "next/navigation";
import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { ArrowLeft } from "lucide-react";

export default function BackToProjects() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Reveal animation as user scrolls to the bottom
      gsap.from(buttonRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 90%",
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleBack = () => {
    // Logic similar to your menu: Go home and tell it to scroll to projects
    sessionStorage.setItem("scrollTarget", "projects");
    router.push("/");
  };

  return (
    <div
      ref={containerRef}
      className="flex justify-center py-32 border-t border-foreground/10"
    >
      <button
        ref={buttonRef}
        onClick={handleBack}
        className="group flex flex-col items-center gap-4 transition-colors hover:text-primary"
      >
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-foreground/20 transition-transform duration-500 group-hover:scale-110 group-hover:border-primary">
          <ArrowLeft className="h-8 w-8 transition-transform group-hover:-translate-x-2" />
        </div>
        <span className="text-xl font-bold uppercase tracking-widest">
          Back to Projects
        </span>
      </button>
    </div>
  );
}
