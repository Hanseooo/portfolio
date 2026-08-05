import "./globals.css";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { fontVariableClasses } from "./fonts";
import PortfolioProviders from "@/components/providers/PortfolioProviders";
import { PortfolioFrame } from "@/components/shell";
import JsonLd from "@/components/seo/JsonLd";
import {
  EMAIL_ADDRESS,
  GITHUB_URL,
  INSTAGRAM_URL,
  LINKEDIN_URL,
  SITE_URL,
  X_URL,
} from "@/components/utils/externalLinks";
import hansPortrait from "@/app/assets/myImages/hans.webp";

const siteUrl = SITE_URL;

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F3F0E9" },
    { media: "(prefers-color-scheme: dark)", color: "#080909" },
  ],
};

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
  alternates: { canonical: "/" },
  authors: [{ name: "Hans Amoguis", url: siteUrl }],
  creator: "Hans Amoguis",
  publisher: "Hans Amoguis",
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
    site: "@hansamoguis",
    creator: "@hansamoguis",
    title: "Hans Amoguis | Full-Stack Engineer focused on AI Product Engineering",
    description:
      "Portfolio of Hans Amoguis, building production-minded full-stack and AI-enabled products with Next.js, LangChain, and FastAPI.",
  },
};

const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Hans Amoguis",
  alternateName: "Hanseo",
  jobTitle: "Full-Stack Engineer",
  description:
    "Portfolio of Hans Amoguis, a full-stack engineer focused on AI product engineering with Next.js, TypeScript, LangChain, and FastAPI.",
  url: siteUrl,
  image: new URL(hansPortrait.src, siteUrl).toString(),
  email: EMAIL_ADDRESS,
  address: {
    "@type": "PostalAddress",
    addressCountry: "PH",
  },
  knowsAbout: [
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "FastAPI",
    "Python",
    "LangChain",
    "PostgreSQL",
    "Supabase",
    "retrieval-augmented generation",
  ],
  sameAs: [GITHUB_URL, LINKEDIN_URL, X_URL, INSTAGRAM_URL],
};

const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Hans Amoguis Portfolio",
  url: siteUrl,
  author: personLd,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fontVariableClasses} font-sans`}
      suppressHydrationWarning
    >
      <body className="bg-[color:var(--cs-foundation)] text-[color:var(--cs-text-primary)] antialiased min-h-screen">
        <JsonLd data={personLd} />
        <JsonLd data={websiteLd} />
        <PortfolioProviders>
          <PortfolioFrame>
            {children}
          </PortfolioFrame>
        </PortfolioProviders>
      </body>
    </html>
  );
}
