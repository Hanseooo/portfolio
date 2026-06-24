"use client";

import { useEffect } from "react";
import PageTransition from "@/components/layout/PageTransition";
import ChapterNav from "@/components/layout/ChapterNav";
import HeroSection from "@/components/sections/HeroSection";
import PhilosophySection from "@/components/sections/PhilosophySection";
import FeaturedProjectsSection from "@/components/sections/FeaturedProjectsSection";
import TechStackSection from "@/components/sections/TechStackSection";
import ExperienceSnapshotSection from "@/components/sections/ExperienceSnapshotSection";
import FeaturedCertificatesSection from "@/components/sections/FeaturedCertificatesSection";
import LiveActivity from "@/components/sections/LiveActivity";
import { useResetScrollTop } from "@/components/utils/useResetScrollTop";
import { ScrollTrigger } from "@/lib/gsap";

export default function Home() {
  useResetScrollTop();

  // After all section effects mount and pin spacers are inserted, recalculate positions
  useEffect(() => {
    const timer = setTimeout(() => ScrollTrigger.refresh(), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <PageTransition>
      <div className="relative bg-background">
        <ChapterNav />
        <main>
          <HeroSection id="identity" />
          <PhilosophySection id="approach" />
          <TechStackSection id="stack" />
          <FeaturedProjectsSection id="work" />
          <ExperienceSnapshotSection id="trajectory" />
          <FeaturedCertificatesSection id="credentials" />
          <LiveActivity />
        </main>
      </div>
    </PageTransition>
  );
}
