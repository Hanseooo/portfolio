import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Poppins } from "next/font/google";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import AppProviders from "@/components/providers/AppProviders";

const poppins = Poppins({ weight: "400" });

export const metadata: Metadata = {
  title: "Hanseo | Full-Stack Developer",
  description:
    "Portfolio showcasing UX-focused, performance-driven full-stack web engineering and interaction design.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className={poppins.className} suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased">
        <AppProviders>
          <Navbar />
          {children}
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
