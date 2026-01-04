"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { GridPattern } from "../ui/shadcn-io/grid-pattern";
import AboutMePanel from "./about/AboutMePanel";
import SkillsPanel from "./about/SkillsPanel";
import PhilosophyPanel from "./about/PhilosophyPanel";
import AboutProgress from "./about/AboutProgress";
import ToolsPanel from "./about/ToolsPanel";
import { getRuntimeEnv } from "../utils/browserInfo";
import { useHorizontalDrag } from "../utils/useHorizontalDrag";
import { Kbd } from "../ui/kbd";


function DragHint() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-md bg-background/80 px-3 py-2 text-xs backdrop-blur">
      <span className="opacity-80">Press</span>
      <Kbd>D</Kbd>
      <span className="opacity-80">to drag</span>
    </div>
  );
}



export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [runtimeEnv, setRuntimeEnv] = useState({
    isMobile: false,
    isWebView: false,
  })
  
  const [dragEnabled, setDragEnabled] = useState(false);
  const isDesktop = !runtimeEnv.isMobile && !runtimeEnv.isWebView;

  const dragBind = useHorizontalDrag(
    runtimeEnv.isMobile || (isDesktop && dragEnabled)
  );

  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (!isDesktop) return;
    if (sessionStorage.getItem("drag-hint-show")) return;

    setShowHint(true);
    sessionStorage.setItem("drag-hint-shown", "1");

    const t = setTimeout(() => setShowHint(false), 8000);
    return () => clearTimeout(t);
  }, [isDesktop]);



  useEffect(() => {
    setRuntimeEnv(getRuntimeEnv())
  }, []);


  useEffect(() => {

    if (runtimeEnv.isWebView) return;

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>(".about-panel");

      gsap.to(panels, {
        xPercent: -100 * (panels.length - 1),
        ease: "none",
        scrollTrigger: {
          id: "about-horizontal",
          trigger: sectionRef.current,
          pin: true,
          pinType: isDesktop ? "transform" : "fixed",  
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1.5,
          snap: {
            snapTo: 1 / (panels.length - 1),
            duration: 0.4,
            ease: "power2.inOut",
          },
          end: () => {
            const vw = window.innerWidth;
            return `+=${vw * (panels.length - 1)}`;
          },
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [runtimeEnv.isWebView]);


  useEffect(() => {
    if (!isDesktop) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "d") {
        setDragEnabled((v) => !v);
        setShowHint(false);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isDesktop]);



  return (
    <section
      id="about"
      ref={sectionRef}
      className={`relative w-full bg-background ${runtimeEnv.isWebView ? "min-h-screen" : "h-screen"}`}
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
        className={`${
          runtimeEnv.isWebView ? "relative" : "absolute inset-0"
        } -z-10 w-full h-full text-gray-400/30 dark:text-gray-700/30`}
      />

      {!runtimeEnv.isMobile && !runtimeEnv.isWebView && (
        <AboutProgress sectionRef={sectionRef} />
      )}

      <div
        ref={trackRef}
        {...dragBind}
        className={`flex ${
          runtimeEnv.isWebView
            ? "flex-col min-h-screen"
            : "h-screen w-max will-change-transform"
        } ${
          isDesktop && dragEnabled
            ? "cursor-grab active:cursor-grabbing select-none"
            : "cursor-default"
        }`}
      >
        <AboutMePanel />
        <SkillsPanel />
        <ToolsPanel />
        <PhilosophyPanel />
      </div>
      {isDesktop && showHint && <DragHint />}

    </section>
  );
}
