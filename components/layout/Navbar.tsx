"use client";

import Link from "next/link";
import { BBH_Bartle } from "next/font/google";
import { useRef, useState } from "react";
import MenuToggle from "./MenuToggle";
import FullscreenMenu from "./FullScreenMenu";
import { ThemeToggle } from "./ThemeToggle";

const bbhBartle = BBH_Bartle({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

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
      <header className="fixed top-0 z-[60] w-full px-6 py-6">
        <nav className={"flex items-center justify-between text-primary"}>
          <Link
            href="/"
            className={`text-sm font-bold tracking-wide hover:text-foreground ${bbhBartle.className}`}
          >
            Hanseo
          </Link>
          <ThemeToggle />
          <MenuToggle
            open={open}
            toggle={() => setOpen(!open)}
            buttonRef={menuToggleRef}
            controlsId={MENU_ID}
          />
        </nav>
      </header>

      <FullscreenMenu open={open} close={closeMenu} id={MENU_ID} />
    </>
  );
}
