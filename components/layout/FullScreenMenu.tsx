"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Experience", href: "/experience" },
  { label: "Certificates", href: "/certificates" },
];

export default function FullscreenMenu({
  open,
  close,
  id,
}: {
  open: boolean;
  close: () => void;
  id: string;
}) {
  const menuRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLButtonElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!menuRef.current) return;

    // Initialize timeline
    tl.current = gsap.timeline({ paused: true });

    tl.current
      .set(menuRef.current, { autoAlpha: 1 }) // Ensures visibility before sliding
      .fromTo(
        menuRef.current,
        { y: "-100%" },
        { y: "0%", duration: 0.8, ease: "power4.inOut" } // Smoother ease for large panels
      )
      .fromTo(
        gsap.utils.toArray(".menu-link"),
        {
          y: 50,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.15,
          stagger: 0.1,
          ease: "power2.out",
        },
        "-=0.5"
      );

    // Cleanup to prevent memory leaks/glitches on hot reload
    return () => {
      if (tl.current) tl.current.kill();
    };
  }, []);

  useEffect(() => {
    if (open) {
      tl.current?.play();
      return;
    }

    tl.current?.reverse();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    firstLinkRef.current?.focus();

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
    };

    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [open, close]);

  const handleClick = (href: string) => {
    close();
    if (pathname !== href) {
      router.push(href);
    }
  };

  return (
    <div
      id={id}
      ref={menuRef}
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
      className={`fixed inset-0 z-50 flex h-screen w-screen flex-col items-center justify-center bg-background/85 text-foreground opacity-0 backdrop-blur-xl ${open ? "pointer-events-auto" : "pointer-events-none"}`}
    >
      <ul className="flex flex-col items-center justify-center space-y-8 sm:space-y-12">
        {links.map((link, index) => (
          <li key={link.href} className="overflow-hidden">
            <button
              ref={index === 0 ? firstLinkRef : undefined}
              type="button"
              onClick={() => handleClick(link.href)}
              className="menu-link block py-2 text-[clamp(3rem,8vw,5rem)] font-black uppercase leading-none tracking-tight text-foreground transition-all duration-300 hover:text-primary hover:scale-105"
            >
              {link.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
