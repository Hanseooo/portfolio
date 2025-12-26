"use client";

import { experience } from "@/lib/experience";
import { motion } from "framer-motion";


export default function Experience() {

  return (
    <section id="experience" className="mx-auto max-w-5xl px-6 py-32">
      <motion.h2
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.5 }}
        className="mb-20 text-primary text-5xl font-bold"
      >
        Experience
      </motion.h2>

      <div className="space-y-16">
        {experience.map((item, i) => (
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            viewport={{ once: true, amount: 1 }}
            key={i}
            className="exp-item border-l border-foreground/20 pl-6"
          >
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
          </motion.div>
        ))}
      </div>
    </section>
  );
}
