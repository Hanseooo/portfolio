"use client"

import PageTransition from "@/components/layout/PageTransition";
import About from "@/components/sections/About";
import Certificates from "@/components/sections/Certificates";
import Experience from "@/components/sections/Experience";
import Hero from "@/components/sections/Hero";
import Projects from "@/components/sections/Projects";
import { GridPattern } from "@/components/ui/shadcn-io/grid-pattern";
import HomeScrollHandler from "@/components/utils/HomeScrollHandler";
import { useResetScrollTop } from "@/components/utils/useResetScrollTop";

export default function Home() {
  useResetScrollTop();

  return (
    <PageTransition>
    <div className="relative overflow-x-hidden">
      <HomeScrollHandler />
      <GridPattern
        width={80}
        height={80}
        squares={[
          [4, 4],
          [12, 1],
          [8, 2],
          [9, 9],
          [5, 5],
        ]}
        className="absolute inset-0 -z-10 w-full h-full text-gray-400/30 dark:text-gray-700/30"
      />
      <Hero />
      {/* <GestureScrollProvider> */}
        <About />
      {/* </GestureScrollProvider> */}
      <Projects />
      <Experience />
      <Certificates />
    </div>
    </PageTransition>
  );
}
