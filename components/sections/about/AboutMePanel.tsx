"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Github, Linkedin } from "lucide-react";
import { motion } from "framer-motion";
import hansImg from "@/app/assets/myImages/hans.jpg";
import hansImg2 from "@/app/assets/myImages/hans2.jpg"
import { useTheme } from "next-themes";

export default function AboutMePanel() {

  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);



    const currentImage = mounted && resolvedTheme === "dark" ? hansImg : hansImg2;


  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.25 }}
      className="about-panel flex flex-col md:flex-row h-screen w-screen items-center justify-center px-6 md:px-12 gap-12"
    >
      {/* LEFT — PHOTO */}
      <div className="relative w-full border-2 max-w-50 md:max-w-70 shrink-0 mx-auto rounded-2xl overflow-hidden group">
        <Image
          src={currentImage}
          alt="Hanseo portrait"
          className="object-cover w-full block transition-transform duration-500 group-hover:scale-115"
          priority
        />

        <div className="absolute bottom-0 w-full bg-background/80 px-4 py-2 text-center backdrop-blur">
          <span className="text-sm font-semibold tracking-wide">Hanseo</span>
        </div>
      </div>
      {/* RIGHT — TEXT */}
      <div className="flex flex-col justify-center text-center md:text-left max-w-xl mx-auto">
        <span
          className="mb-4 text-xs uppercase tracking-[0.3em] opacity-60"
        >
          About Me
        </span>

        <p className=" text-sm sm:text-lg md:text-xl leading-relaxed opacity-85">
          I’m a full-stack developer that designs maintainable systems and gives
          importance to system architecture and user experience. I also code as
          a hobby, testing my theories when i learn something new and building a
          web application out of it.
        </p>

        <motion.p
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.25 }}
          className="mt-4 md:mt-6  text-sm sm:text-lg md:text-xl mb-2 sm:mb-0 leading-relaxed opacity-85"
        >
          I specialize in using TypeScript, React, and Django Rest Framework
          when building web applications. I focus heavily on the fundamentals
          and continuously learn and adapt to new technology to enhance
          productivity and efficiency.
        </motion.p>

        {/* ACTIONS */}
        <div className="mt-6 mb-2 flex justify-center md:justify-start gap-4 flex-wrap">
          <a
            href="https://www.linkedin.com/in/hanseooo"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 border border-foreground/20 px-4 py-2 text-sm transition hover:border-foreground/75 hover:bg-primary hover:text-white"
          >
            <Linkedin size={16} /> LinkedIn
          </a>

          <a
            href="https://github.com/Hanseooo"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 border border-foreground/20 px-4 py-2 text-sm transition hover:border-foreground/75 hover:bg-primary hover:text-white"
          >
            <Github size={16} /> GitHub
          </a>
        </div>
      </div>
    </motion.div>
  );
}
