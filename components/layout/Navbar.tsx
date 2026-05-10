"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import MenuToggle from "./MenuToggle";
import FullscreenMenu from "./FullScreenMenu";
import { ThemeToggle } from "./ThemeToggle";

const MENU_ID = "site-fullscreen-menu";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const menuToggleRef = useRef<HTMLButtonElement>(null);

  const closeMenu = () => {
    setOpen(false);
    menuToggleRef.current?.focus();
  };

  return (
    <>
      <ThemeToggle />
      <header className="fixed top-0 z-[60] w-full px-6 py-4 bg-background/80 backdrop-blur-md border-b border-border/40 shadow-sm transition-colors duration-300">
        <nav className="mx-auto flex max-w-[1400px] items-center justify-between text-foreground">
          <Link
            href="/"
            className="text-sm font-bold uppercase tracking-[0.2em] text-foreground transition-colors hover:text-primary"
          >
            Hanseo
          </Link>
          <div className="flex items-center gap-6">
            <MenuToggle
              open={open}
              toggle={() => setOpen(!open)}
              buttonRef={menuToggleRef}
              controlsId={MENU_ID}
            />
          </div>
        </nav>
      </header>

      <FullscreenMenu open={open} close={closeMenu} id={MENU_ID} />
    </>
  );
}
