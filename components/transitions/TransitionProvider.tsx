"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import PageOverlay from "./PageOverlay";

export default function TransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [active, setActive] = useState(true);

  // Initial load
  useEffect(() => {
    const timeout = setTimeout(() => {
      setActive(false);
    }, 1200);

    return () => clearTimeout(timeout);
  }, []);

  // Route change
  useEffect(() => {
    setActive(true);

    const timeout = setTimeout(() => {
      setActive(false);
    }, 900);

    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <>
      <PageOverlay active={active} />
      {children}
    </>
  );
}
