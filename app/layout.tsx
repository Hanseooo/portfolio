"use client";

import { LenisProvider } from "@/components/providers/LenisProvider";
import "./globals.css";
// import { MotionProvider } from "@/components/providers/MotionProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ReactNode } from "react";

import { Inter, Poppins } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import TransitionProvider from "@/components/transitions/TransitionProvider";

const poppins = Poppins({ weight: "400" });

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className={poppins.className} suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased">
        <LenisProvider>
          <TransitionProvider>
            {/* <MotionProvider> */}
            <ThemeProvider>
              <Navbar />
              {children}
              <Footer />
            </ThemeProvider>
            {/* </MotionProvider> */}
          </TransitionProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
