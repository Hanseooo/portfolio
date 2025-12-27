"use client";

import { useRouter, usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  text?: string,
  sectionId?: string
}

export default function BackButton({text = "Back to Home", sectionId = "home"} : BackButtonProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = () => {
    // If already on home, just scroll
    if (pathname === "/") {
      document
        .getElementById(sectionId)
        ?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    // Otherwise: remember target and go home
    sessionStorage.setItem("scrollTarget", sectionId);
    router.push("/");
  };

  return (
    <div className="flex justify-center py-32 border-t border-foreground/10">
      <button
        onClick={handleClick}
        className="group flex flex-col items-center gap-4 transition-colors hover:text-primary"
      >
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-foreground/20 transition-transform duration-500 group-hover:scale-110 group-hover:border-primary">
          <ArrowLeft className="h-8 w-8 transition-transform group-hover:-translate-x-2" />
        </div>
        <span className="text-xl font-bold uppercase tracking-widest">
          {text}
        </span>
      </button>
    </div>
  );
}
