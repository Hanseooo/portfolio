"use client";

import type { ReactNode } from "react";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import TransitionProvider from "@/components/transitions/TransitionProvider";

interface AppProvidersProps {
  children: ReactNode;
}

export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <LenisProvider>
      <TransitionProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </TransitionProvider>
    </LenisProvider>
  );
}
