"use client";

import { motion } from "framer-motion";
import { Playfair_Display } from "next/font/google";
import { useRouter } from "next/navigation";

const bbhBartle = Playfair_Display({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export default function NotFound() {
  const router = useRouter();

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-center text-center px-6 ${bbhBartle.className}`}
    >
      {/* Bold 404 text similar to Hero */}
      <motion.h1
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 2 }}
        className="leading-[0.9] tracking-tight text-[clamp(3rem,10vw,8rem)] text-primary"
      >
        404
      </motion.h1>

      {/* Not found message */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut", delay: 2.25 }}
        className="mt-4 text-sm uppercase tracking-[0.3em] opacity-80"
      >
        Page Not Found
      </motion.p>

      {/* Back Home button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
        onClick={() => router.push("/")}
        className="mt-10 border border-primary px-6 py-3 text-sm text-primary transition hover:bg-primary hover:text-background"
      >
        back to home
      </motion.button>
    </main>
  );
}
