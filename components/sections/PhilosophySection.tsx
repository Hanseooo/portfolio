"use client";

import { motion } from "framer-motion";

export default function PhilosophySection({ id }: { id: string }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <section id={id} className="relative flex min-h-screen items-center px-6 py-32">
      <div className="mx-auto w-full max-w-[1400px]">
        <motion.div 
          className="grid grid-cols-1 gap-16 lg:grid-cols-2"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Header */}
          <motion.div variants={itemVariants}>
            <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-black leading-none tracking-tighter text-foreground">
              Design Systems, <br />
              <span className="text-primary">Then Ship Them.</span>
            </h2>
          </motion.div>
          
          {/* Content */}
          <div className="flex flex-col justify-center space-y-12">
            <motion.div variants={itemVariants}>
              <h3 className="mb-4 font-mono text-xs uppercase tracking-widest text-muted-foreground/80">01 / Architecture</h3>
              <p className="text-xl text-muted-foreground">
                I design architectures from PRDs before implementation so delivery stays clear, scalable, and maintainable.
              </p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="h-px w-full bg-border origin-left scale-x-0 animate-[grow_1s_ease-out_forwards] [animation-delay:0.5s]" style={{ transformOrigin: 'left' }} />
            
            <motion.div variants={itemVariants}>
              <h3 className="mb-4 font-mono text-xs uppercase tracking-widest text-muted-foreground/80">02 / Execution</h3>
              <p className="text-xl text-muted-foreground">
                Responsive interfaces with accessible interaction patterns, built on solid API-driven features across client and server boundaries.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
