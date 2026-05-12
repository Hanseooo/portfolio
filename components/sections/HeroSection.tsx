"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTheme } from "next-themes";
import hansImg from "@/app/assets/myImages/hans.webp";
import hansImg2 from "@/app/assets/myImages/hans2.webp";
import { useClientReady } from "@/components/utils/useClientReady";

export default function HeroSection({ id }: { id: string }) {
  const { resolvedTheme } = useTheme();
  const isClient = useClientReady();
  const currentImage = isClient && resolvedTheme === "dark" ? hansImg : hansImg2;

  return (
    <section
      id={id}
      className="relative flex min-h-screen items-center justify-center px-6 pt-20 overflow-hidden"
    >
      <div className="relative z-10 mx-auto w-full max-w-[1400px] flex flex-col lg:grid lg:grid-cols-12 lg:gap-8 items-center">
        <motion.div
          className="lg:col-span-7"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <p className="mb-6 font-bold text-xs uppercase tracking-[0.2em] text-primary">
            Hans Amoguis
          </p>
          <h1 className="font-sans text-[clamp(3rem,8vw,8rem)] font-black leading-[0.85] tracking-tighter text-foreground">
            Building
            <br />
            <span className="text-muted-foreground">With Intent.</span>
          </h1>
          <p className="mt-8 max-w-xl text-lg md:text-xl text-muted-foreground leading-relaxed">
            I build maintainable systems with proper architecture, modular
            implementation, and good user experience. A Full-stack architect
            & AI product engineer focused on providing solutions that are not 
            only functional but also intuitive and scalable.
          </p>
        </motion.div>

        <motion.div
          className="lg:col-span-5 w-full mt-12 lg:mt-0"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <div className="group relative mx-auto w-full max-w-md lg:max-w-none overflow-hidden">
            <Image
              src={currentImage}
              alt="Hanseo portrait"
              className="block w-full object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
            <div className="absolute bottom-0 w-full bg-background/80 px-4 py-3 text-center backdrop-blur">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-foreground">
                Hanseo
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
