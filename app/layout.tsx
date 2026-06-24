import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Inter, JetBrains_Mono } from "next/font/google";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import AppProviders from "@/components/providers/AppProviders";
import CustomCursor from "@/components/ui/CustomCursor";
import Preloader from "@/components/ui/Preloader";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

const siteUrl = "https://hanseo.tech";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Hans Amoguis (Hanseo) | Full-Stack Engineer",
    template: "%s | Hans Amoguis",
  },
  description:
    "Portfolio of Hans Amoguis, a full-stack engineer focused on AI product engineering with Next.js, TypeScript, LangChain, and FastAPI.",
  keywords: [
    "Hans Amoguis",
    "Hanseo",
    "full-stack engineer",
    "AI product engineering",
    "Next.js portfolio",
    "LangChain developer",
    "FastAPI developer",
    "TypeScript",
    "web developer portfolio",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Hans Amoguis | Full-Stack Engineer focused on AI Product Engineering",
    description:
      "Portfolio of Hans Amoguis, building production-minded full-stack and AI-enabled products with clear architecture and strong UX.",
    siteName: "Hans Amoguis Portfolio",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hans Amoguis | Full-Stack Engineer focused on AI Product Engineering",
    description:
      "Portfolio of Hans Amoguis, building production-minded full-stack and AI-enabled products with Next.js, LangChain, and FastAPI.",
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} font-sans`} suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased min-h-screen cursor-none">
        <CustomCursor />
        <AppProviders>
          <Preloader />
          <Navbar />
          {children}
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
