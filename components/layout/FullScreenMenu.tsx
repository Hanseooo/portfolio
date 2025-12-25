"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { label: "Home", id: "home" },
  { label: "About", id: "about" },
  { label: "Projects", id: "projects" },
  { label: "Experience", id: "experience" },
  { label: "Certificates", id: "certificates" },
];

export default function FullscreenMenu({
  open,
  close,
}: {
  open: boolean;
  close: () => void;
}) {
  const menuRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!menuRef.current) return;

    tl.current = gsap.timeline({ paused: true });

    tl.current
      .set(menuRef.current, { autoAlpha: 1 })
      .fromTo(
        menuRef.current,
        { y: "-100%" },
        { y: "0%", duration: 0.8, ease: "power4.out" }
      )
      .from(
        ".menu-link",
        {
          y: 60,
          opacity: 1,
          stagger: 0.12,
          duration: 0.6,
          ease: "power3.out",
        },
        "-=0.4"
      );
  }, []);

  useEffect(() => {
    open ? tl.current?.play() : tl.current?.reverse();
  }, [open]);

  const handleClick = (id: string) => {
    close();

    // If we're already on home, just scroll
    if (pathname === "/") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    // Otherwise: remember target, go home
    sessionStorage.setItem("scrollTarget", id);
    router.push("/");
  };

  return (
    <div
      ref={menuRef}
      className="fixed inset-0 z-50 flex h-screen w-screen flex-col items-center justify-center bg-background text-foreground opacity-0"
    >
      <ul className="mb-24 flex h-[90vh] flex-col justify-around space-y-4 py-24 text-center sm:py-0">
        {links.map((link) => (
          <li key={link.id}>
            <button
              onClick={() => handleClick(link.id)}
              className="menu-link py-2 text-[clamp(2.5rem,6vw,4rem)] font-bold transition hover:text-primary"
            >
              {link.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
