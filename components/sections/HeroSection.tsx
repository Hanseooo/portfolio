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
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[30vw] h-[30vw] rounded-full bg-red-900/20 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1400px] flex flex-col lg:flex-row items-center gap-16">
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <p className="mb-6 font-mono text-sm uppercase tracking-[0.3em] text-primary">
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
          className="flex-1 w-full max-w-md lg:max-w-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <div className="group relative mx-auto w-full overflow-hidden rounded-2xl border-2 border-border shadow-2xl">
            <Image
              src={currentImage}
              alt="Hanseo portrait"
              className="block w-full object-cover transition-transform duration-500 group-hover:scale-105"
              priority
            />
            <div className="absolute bottom-0 w-full bg-background/80 px-4 py-3 text-center backdrop-blur">
              <span className="text-sm font-semibold tracking-wide text-foreground">
                Hanseo
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
