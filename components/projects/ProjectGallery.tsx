"use client";

import Image, { StaticImageData } from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function ProjectGallery({
  images,
}: {
  images: StaticImageData[];
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".gallery-item", {
        y: 80,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
        stagger: 0.25,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 80%",
        },
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="space-y-8 sm:space-y-16">
      {images.map((img, i) => (
        <div
          key={i}
          className="gallery-item relative rounded-md grid grid-cols-1 md:grid-cols-2 gap-8 aspect-video h-fit overflow-hidden border"
        >
          <Image
            src={img}
            alt={`Project screenshot ${i + 1}`}
            fill
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}
