"use client";

import { motion } from "framer-motion";
import Image, { StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { Github, ExternalLink } from "lucide-react";
import { useMagnetic } from "@/components/motion/useMagnetic";

type Props = {
  slug: string;
  title: string;
  subtitle: string;
  heroImage: string | StaticImageData ;
  github?: string | null;
  live?: string | null;
};

export default function ProjectCard({
  slug,
  title,
  subtitle,
  heroImage,
  github,
  live,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useMagnetic(ref);

  return (
    <motion.article
      onClick={() => router.push(`/projects/${slug}`)}
      className="project-card  group relative cursor-pointer hover:text-primary"
      initial={{ scale: 1 }}
      whileHover={{ scale: 0.98 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* IMAGE */}
      <div
        ref={ref}
        className="relative aspect-video w-full overflow-hidden rounded-md sm:aspect-auto sm:h-[60vh]"
      >
        <motion.div
          className="h-full w-full"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Image
            src={heroImage}
            alt={title}
            fill
            className="object-cover"
            priority
          />
        </motion.div>

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />

        {/* ACTION ICONS */}
        {(github || live) && (
          <div className="absolute bottom-4 right-4 z-20 flex gap-3">
            {github && (
              <motion.a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                // Change initial opacity to 1 on mobile, 0 on desktop
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                // For desktop hover
                whileHover={{ scale: 1.1 }}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-background/90 text-foreground backdrop-blur-md transition-colors hover:bg-primary hover:text-background sm:opacity-0 sm:group-hover:opacity-100"
              >
                <Github size={20} />
              </motion.a>
            )}

            {live && (
              <motion.a
                href={live}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.1 }}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-background/90 text-foreground backdrop-blur-md transition-colors hover:bg-primary hover:text-background sm:opacity-0 sm:group-hover:opacity-100"
              >
                <ExternalLink size={20} />
              </motion.a>
            )}
          </div>
        )}
      </div>
      {/* TEXT */}
      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
        <h3 className="text-2xl sm:text-3xl font-semibold leading-tight">
          {title}
        </h3>

        {/* Remove whitespace-nowrap or make it conditional */}
        <span className="text-sm opacity-70 sm:whitespace-nowrap">
          {subtitle}
        </span>
      </div>
    </motion.article>
  );
}
