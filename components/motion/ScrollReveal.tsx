"use client";

import { useRef, useEffect, ReactNode } from "react";
import gsap from "gsap";

export function FadeIn(children : ReactNode ) {
  const ref = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      ref.current,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 80%",
        },
      }
    );
  }, []);

  return <div ref={ref}>{children}</div>;
}
