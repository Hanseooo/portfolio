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
      .from(
        ".menu-link",
        {
          y: 50, // Start 50px lower
          opacity: 1, // Start transparent
          duration: 0.5,
          stagger: 0.1, // Delay between each link
          ease: "power2.out",
        },
        "-=0.5" // Start slightly before the menu finish sliding
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
      id={id}
      ref={menuRef}
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
      className={`fixed inset-0 z-50 flex h-screen w-screen flex-col items-center justify-center bg-background/85 text-foreground opacity-0 backdrop-blur-xl ${open ? "pointer-events-auto" : "pointer-events-none"}`}
    >
      <ul className="mb-24 flex h-[90vh] flex-col justify-around space-y-4 py-24 text-center sm:py-0">
        {links.map((link, index) => (
          <li key={link.id}>
            <button
              ref={index === 0 ? firstLinkRef : undefined}
              type="button"
              onClick={() => handleClick(link.id)}
              className="menu-link py-2 text-[clamp(2.5rem,6vw,4rem)] uppercase tracking-wide text-center transition hover:text-primary"
            >
              {link.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
