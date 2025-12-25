"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { experience } from "@/lib/experience";

export default function Experience() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".exp-item", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.2,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 80%",
        },
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} id="experience" className="mx-auto max-w-5xl px-6 py-32">
      <h2 className="mb-20 text-primary text-5xl font-bold">Experience</h2>

      <div className="space-y-16">
        {experience.map((item, i) => (
          <div key={i} className="exp-item border-l border-foreground/20 pl-6">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-xl font-semibold">{item.role}</h3>
              <span className="text-sm opacity-60">{item.period}</span>
            </div>

            <p className="mb-4 opacity-80">{item.company}</p>

            <ul className="list-disc space-y-2 pl-5 opacity-80">
              {item.points.map((point, idx) => (
                <li key={idx}>{point}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
