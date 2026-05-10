"use client";

import PageTransition from "@/components/layout/PageTransition";
import ChapterNav from "@/components/layout/ChapterNav";
import HeroSection from "@/components/sections/HeroSection";
import PhilosophySection from "@/components/sections/PhilosophySection";
import FeaturedProjectsSection from "@/components/sections/FeaturedProjectsSection";
import ExperienceSnapshotSection from "@/components/sections/ExperienceSnapshotSection";
import LiveActivity from "@/components/sections/LiveActivity";
import { useResetScrollTop } from "@/components/utils/useResetScrollTop";

export default function Home() {
  useResetScrollTop();

  return (
    <PageTransition>
      <div className="relative bg-background">
        <ChapterNav />
        <main>
          <HeroSection id="identity" />
          <PhilosophySection id="approach" />
          <FeaturedProjectsSection id="work" />
          <ExperienceSnapshotSection id="trajectory" />
          <LiveActivity />
        </main>
      </div>
    </PageTransition>
  );
}
