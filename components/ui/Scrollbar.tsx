"use client";

import { useEffect, useRef, type RefObject } from "react";
import gsap from "gsap";

interface ScrollbarProps {
  containerRef?: RefObject<HTMLDivElement | null>;
}

const MIN_THUMB_PX = 24;

function isTouchDevice() {
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia("(pointer: coarse)").matches
  );
}

export default function Scrollbar({ containerRef }: ScrollbarProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const thumb = thumbRef.current;
    if (!track || !thumb) return;

    if (isTouchDevice()) {
      track.style.display = "none";
      return;
    }

    const container = containerRef ? containerRef.current : null;
    if (containerRef && !container) {
      track.style.display = "none";
      return;
    }

    const hideTarget: HTMLElement = container ?? document.documentElement;
    hideTarget.classList.add("no-native-scrollbar");

    const setThumbY = gsap.quickSetter(thumb, "y", "px");

    let maxScroll = 0;
    let trackLen = 0;
    let thumbLen = 0;

    const getScroll = (): number => {
      if (container) return container.scrollTop;
      return window.__lenis?.scroll ?? window.scrollY;
    };

    const setScroll = (value: number) => {
      const clamped = Math.max(0, Math.min(maxScroll, value));
      if (container) {
        container.scrollTop = clamped;
      } else if (window.__lenis) {
        window.__lenis.scrollTo(clamped, { immediate: true });
      } else {
        window.scrollTo(0, clamped);
      }
    };

    const render = () => {
      const scroll = getScroll();
      const ratio = maxScroll > 0 ? scroll / maxScroll : 0;
      setThumbY(ratio * (trackLen - thumbLen));
    };

    const measure = () => {
      trackLen = track.clientHeight;
      const viewportLen = container ? container.clientHeight : window.innerHeight;
      const contentLen = container ? container.scrollHeight : document.documentElement.scrollHeight;
      maxScroll = Math.max(0, contentLen - viewportLen);
      thumbLen =
        maxScroll > 0
          ? Math.max(MIN_THUMB_PX, (viewportLen / contentLen) * trackLen)
          : trackLen;
      thumb.style.height = `${thumbLen}px`;
      track.style.opacity = maxScroll > 0 ? "1" : "0";
      track.style.pointerEvents = maxScroll > 0 ? "auto" : "none";
      render();
    };

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(container ?? document.documentElement);
    resizeObserver.observe(track);

    let stopScrollSource: () => void;

    if (container) {
      const onScroll = () => measure();
      container.addEventListener("scroll", onScroll);
      measure();
      stopScrollSource = () => container.removeEventListener("scroll", onScroll);
    } else {
      let rafId = 0;
      let unsubscribe: (() => void) | undefined;

      const attach = () => {
        const lenis = window.__lenis;
        if (!lenis) {
          rafId = requestAnimationFrame(attach);
          return;
        }
        unsubscribe = lenis.on("scroll", () => measure());
        measure();
      };
      attach();

      stopScrollSource = () => {
        cancelAnimationFrame(rafId);
        unsubscribe?.();
      };
    }

    let dragging = false;
    let dragStartY = 0;
    let dragStartScroll = 0;

    const onPointerDown = (e: PointerEvent) => {
      dragging = true;
      dragStartY = e.clientY;
      dragStartScroll = getScroll();
      thumb.setPointerCapture(e.pointerId);
      thumb.classList.add("is-dragging");
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      const range = trackLen - thumbLen;
      if (range <= 0) return;
      const deltaScroll = ((e.clientY - dragStartY) / range) * maxScroll;
      setScroll(dragStartScroll + deltaScroll);
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      thumb.releasePointerCapture(e.pointerId);
      thumb.classList.remove("is-dragging");
    };

    thumb.addEventListener("pointerdown", onPointerDown);
    thumb.addEventListener("pointermove", onPointerMove);
    thumb.addEventListener("pointerup", onPointerUp);

    return () => {
      hideTarget.classList.remove("no-native-scrollbar");
      resizeObserver.disconnect();
      stopScrollSource();
      thumb.removeEventListener("pointerdown", onPointerDown);
      thumb.removeEventListener("pointermove", onPointerMove);
      thumb.removeEventListener("pointerup", onPointerUp);
    };
  }, [containerRef]);

  return (
    <div
      ref={trackRef}
      className={containerRef ? "scrollbar-track" : "scrollbar-track scrollbar-track--page"}
    >
      <div ref={thumbRef} className="scrollbar-thumb" />
    </div>
  );
}
