"use client";

import { useState } from "react";
import MenuToggle from "./MenuToggle";
import FullscreenMenu from "./FullScreenMenu";
import { ThemeToggle } from "./ThemeToggle";
import { BBH_Bartle } from "next/font/google";

  const bbhBartle = BBH_Bartle({
      subsets: ["latin"],
      weight: "400",
      display: "swap",
    });

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 z-60 w-full px-6 py-6">
        <nav className={"flex items-center justify-between"}>
          <a href="/" className={`text-sm font-bold tracking-wide hover:text-primary ${bbhBartle.className}`}>Hanseo</a>
          <ThemeToggle />
          <MenuToggle open={open} toggle={() => setOpen(!open)} />
        </nav>
      </header>

      <FullscreenMenu open={open} close={() => setOpen(false)} />
    </>
  );
}
