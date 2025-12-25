"use client";

import { useState } from "react";
import MenuToggle from "./MenuToggle";
import FullscreenMenu from "./FullScreenMenu";
import { ThemeToggle } from "./ThemeToggle";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 z-60 w-full px-6 py-6">
        <nav className="flex items-center justify-between">
          <span className="text-sm font-bold tracking-wide">Hanseo</span>
          <ThemeToggle />
          <MenuToggle open={open} toggle={() => setOpen(!open)} />
        </nav>
      </header>

      <FullscreenMenu open={open} close={() => setOpen(false)} />
    </>
  );
}
