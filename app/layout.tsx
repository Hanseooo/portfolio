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
  PERSON_LD_ID,
  SITE_URL,
  X_URL,
} from "@/components/utils/externalLinks";
import { SITE_DESCRIPTION, SITE_HEADLINE } from "@/lib/content/homepage-projections";
import { buildItems } from "@/lib/skills";
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
    default: `Hans Amoguis (Hanseo) | ${SITE_HEADLINE}`,
    template: "%s | Hans Amoguis",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Hans Amoguis",
    "Hanseo",
    "AI engineer",
    "full-stack developer",
    "applied AI",
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
    title: `Hans Amoguis | ${SITE_HEADLINE}`,
    description: SITE_DESCRIPTION,
    siteName: "Hans Amoguis Portfolio",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@hansamoguis",
    creator: "@hansamoguis",
    title: `Hans Amoguis | ${SITE_HEADLINE}`,
    description: SITE_DESCRIPTION,
  },
};

const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": PERSON_LD_ID,
  name: "Hans Amoguis",
  alternateName: "Hanseo",
  jobTitle: SITE_HEADLINE,
  description: SITE_DESCRIPTION,
  url: siteUrl,
  image: new URL(hansPortrait.src, siteUrl).toString(),
  email: EMAIL_ADDRESS,
  address: {
    "@type": "PostalAddress",
    addressCountry: "PH",
  },
  knowsAbout: buildItems,
  alumniOf: { "@type": "CollegeOrUniversity", name: "Holy Cross of Davao College" },
  affiliation: { "@type": "Organization", name: "DurianPy" },
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
