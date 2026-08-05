"use client";

import { GridPattern } from "../ui/shadcn-io/grid-pattern";
import AboutMobile from "./about/AboutMobile";
import AboutStacked from "./about/AboutStacked";
import { useClientReady } from "@/components/utils/useClientReady";
import { getRuntimeEnv } from "../utils/browserInfo";


export default function About() {
  const isClient = useClientReady();

  const runtimeEnv = isClient
    ? getRuntimeEnv()
    : { isMobile: false, isWebView: false };
  const isMobile = runtimeEnv.isMobile;

  return (
    <section
      id="about"
      className="relative w-full overflow-hidden bg-background min-h-screen"
    >
      <GridPattern
        width={80}
        height={80}
        squares={[
          [4, 9],
          [5, 1],
          [24, 12],
          [10, 3],
          [3, 4],
        ]}
        className="absolute inset-0 -z-10 h-full w-full text-gray-400/30 dark:text-gray-700/30"
      />

      {isMobile ? <AboutMobile /> : <AboutStacked />}
    </section>
  );
}
