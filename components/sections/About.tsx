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
import { useClientReady } from "@/components/utils/useClientReady";
import { usePrefersReducedMotion } from "@/components/utils/usePrefersReducedMotion";
import AboutMobile from "./about/AboutMobile";
import AboutStacked from "./about/AboutStacked";


function DragHint() {
  return (
    <div className="pointer-events-none fixed right-6 top-24 z-40 flex items-center gap-2 rounded-md border border-foreground/20 bg-background/85 px-3 py-2 text-xs backdrop-blur">
      <span className="opacity-80">Press</span>
      <Kbd>D</Kbd>
      <span className="opacity-80">to drag panels</span>
    </div>
  );
}



export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const isClient = useClientReady();
  const [viewportReady, setViewportReady] = useState(false);
  const [viewportAllowsHorizontal, setViewportAllowsHorizontal] = useState(false);

  const runtimeEnv = isClient
    ? getRuntimeEnv()
    : { isMobile: false, isWebView: false };
  const isMobile = runtimeEnv.isMobile;
  const isWebView = runtimeEnv.isWebView;
  const isReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!isClient) return;

    let resizeFrame = 0;

    const evaluateViewport = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      const canEnterHorizontal =
        (width >= 1500 && height >= 660) ||
        (width >= 1360 && height >= 700) ||
        (width >= 1285 && height >= 760) ||
        (width >= 1240 && height >= 820);

      const shouldStayHorizontal =
        (width >= 1460 && height >= 640) ||
        (width >= 1320 && height >= 680) ||
        (width >= 1260 && height >= 740) ||
        (width >= 1200 && height >= 800);

      const nextHorizontal = viewportAllowsHorizontal
        ? shouldStayHorizontal
        : canEnterHorizontal;

      setViewportAllowsHorizontal(nextHorizontal);
      setViewportReady(true);
    };

    evaluateViewport();

    const onResize = () => {
      if (resizeFrame) cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(evaluateViewport);
    };

    window.addEventListener("resize", onResize);

    return () => {
      if (resizeFrame) cancelAnimationFrame(resizeFrame);
      window.removeEventListener("resize", onResize);
    };
  }, [isClient, viewportAllowsHorizontal]);

  const useHorizontalLayout =
    viewportReady &&
    viewportAllowsHorizontal &&
    !isWebView &&
    !isMobile &&
    !isReducedMotion;

  const [dragEnabled, setDragEnabled] = useState(false);
  const isDesktop = !isMobile && useHorizontalLayout;

  const dragBind = useHorizontalDrag(isDesktop && dragEnabled);

  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (!isDesktop) return;
    if (sessionStorage.getItem("drag-hint-shown")) return;

    const showTimeout = setTimeout(() => setShowHint(true), 0);
    sessionStorage.setItem("drag-hint-shown", "1");

    const t = setTimeout(() => setShowHint(false), 8000);
    return () => {
      clearTimeout(showTimeout);
      clearTimeout(t);
    };
  }, [isDesktop]);


  useEffect(() => {
    if (!isClient || !useHorizontalLayout) return;

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>(".about-panel");
      const getIsShortHeight = () => window.innerHeight < 860;
      const horizontalDistance = () => {
        const base = window.innerWidth * (panels.length - 1);
        return getIsShortHeight() ? base * 1.28 : base * 1.08;
      };

      if (trackRef.current) {
        gsap.fromTo(
          trackRef.current,
          { y: 18, opacity: 0.94 },
          {
            y: 0,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 86%",
              end: "top 58%",
              scrub: true,
            },
          }
        );
      }

      gsap.to(panels, {
        xPercent: -100 * (panels.length - 1),
        ease: "none",
        scrollTrigger: {
          id: "about-horizontal",
          trigger: sectionRef.current,
          pin: true,
          scrub: getIsShortHeight() ? 1.55 : 1.18,
          invalidateOnRefresh: true,
          anticipatePin: isDesktop ? 1.2 : 0,
          snap: getIsShortHeight()
            ? undefined
            : {
                snapTo: 1 / (panels.length - 1),
                duration: { min: 0.18, max: 0.42 },
                delay: 0.05,
                ease: "power2.inOut",
                directional: true,
              },
          end: () => `+=${horizontalDistance()}`,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [isClient, useHorizontalLayout, isDesktop]);


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
      className={`relative w-full overflow-hidden bg-background ${useHorizontalLayout ? "h-screen" : "min-h-screen"}`}
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

      {useHorizontalLayout ? (
        <>
          {!isMobile && <AboutProgress sectionRef={sectionRef} />}

          <div
            ref={trackRef}
            {...dragBind}
            className={`flex h-screen w-max will-change-transform ${
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
        </>
      ) : (
        isMobile ? <AboutMobile /> : <AboutStacked />
      )}
    </section>
  );
}
