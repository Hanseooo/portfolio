"use client";

import Image, { StaticImageData } from "next/image";
import { easeOut, motion } from "framer-motion";

const itemVariants = {
  hidden: {
    opacity: 0,
    scale: 0.985,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.45,
      ease: easeOut,
    },
  },
};

export default function ProjectGallery({
  images,
}: {
  images: StaticImageData[];
}) {
  return (
    <section className="mx-auto max-w-5xl px-6 py-24 space-y-16">
      {images.map((img, i) => (
        <motion.div
          key={i}
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="
            relative overflow-hidden rounded-md
            border border-foreground/10
            transition-colors duration-300
            hover:border-primary
            will-change-transform
          "
        >
          {/* Aspect ratio lock = no flashing */}
          <div className="relative w-full aspect-video">
            <Image
              src={img}
              alt={`Project image ${i + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 900px"
              className="object-cover"
              priority={i === 0}
            />
          </div>
        </motion.div>
      ))}
    </section>
  );
}
