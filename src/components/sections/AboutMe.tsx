"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import myImg from "@/assets/images/me2.jpg";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { isInAppBrowser } from "@/utils/browserInfo";
import { useAssetPreloader } from "@/hooks/useAssetPreloader";
import { ASSETS_TO_LOAD } from "@/utils/assetsToLoad";
import { useNavigate } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);


export default function AboutMe() {
  const leftRef = useRef<HTMLDivElement | null>(null);
  const { isLoaded } = useAssetPreloader(ASSETS_TO_LOAD);
  const navigate = useNavigate()

//   const rightSectionsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) return;
  if (isInAppBrowser()) return;


    const ctx = gsap.context(() => {
      // LEFT COLUMN — up/down parallax depending on scroll direction
      if (leftRef.current) {
        gsap.fromTo(
          leftRef.current,
          { y: -80 },
          {
            y: 120,
            ease: "none",
            scrollTrigger: {
              trigger: leftRef.current,
              start: "top 75%",
              end: "bottom 25%",
              scrub: true, 
            },
          }
        );
      }

      // RIGHT SECTIONS — each has its own up/down parallax
    //   rightSectionsRef.current.forEach((el) => {
    //     if (!el) return;

    //     gsap.fromTo(
    //       el,
    //       { y: 0, opacity: 0 },
    //       {
    //         y: -80,
    //         opacity: 1,
    //         ease: "power1.out",
    //         scrollTrigger: {
    //           trigger: el,
    //           start: "top bottom",
    //           end: "bottom 95%",
    //           scrub: 1,
    //           markers: false,
    //         },
    //       }
    //     );
    //   });
    });

    return () => ctx.revert();
  }, [isLoaded]);

  const content = [
    {
      title: "About Me",
      text: `I’m a 3rd-year BSIT student from the Philippines, a self-taught full-stack developer with a strong focus on TypeScript, React, and Python. I enjoy building clean, functional, and useful web applications.`,
    },
    {
      title: "Strengths",
      text: `I specialize in TypeScript and Python, and solving logical problems and building web applications that are functional and easy to use.`,
    },
    {
      title: "My Journey",
      text: `I started coding during my first year in college in 2023. Since then, I’ve explored different technologies to strengthen my engineering foundations to build projects.`,
    },
    {
      title: "Currently Looking For",
      text: `I’m currently looking for mentors and internship opportunities to gain experience, apply my skills, and grow as a developer.`,
    },
  ];

  return (
    <section className="w-full pt-12 pb-96">
      <div className="max-w-5xl mx-auto px-4 gap-24 grid grid-cols-1 md:grid-cols-[260px_1fr]">

        {/* LEFT COLUMN */}
        <motion.div
          ref={leftRef}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: false, amount: 0.5 }}
          className="flex flex-col items-center justify-center pt-24 space-y-6 will-change-transform"
        >
          <div className="w-40 h-40 rounded-full overflow-hidden shadow-lg ring-2 ring-border/40">
            <img src={myImg} alt="Hans Amoguis" className="object-cover w-full h-full" />
          </div>

          <div className="text-center space-y-1">
            <h1 className="text-2xl font-semibold">Hans Amoguis</h1>
            <p className="text-muted-foreground">Full-stack Developer</p>
          </div>

          <p className="text-sm text-muted-foreground italic text-center max-w-[220px]">
            “Technology is constantly changing so I continuously learn to adapt.”
          </p>

          <div className="w-full flex flex-col space-y-2">
            <Button variant="default" size="sm" className="w-full" onClick={ () => {
              navigate("/certificates")
              }
            }>
                Certificates
            </Button>
            <Button variant="outline" size="sm" className="w-full" onClick={ () => {
              navigate("educational-tour")
            }}>
                Educational Tour
            </Button>
          </div>
        </motion.div>

        {/* RIGHT COLUMN */}
        <div  className="flex flex-col gap-2 justify-center ">
          {content.map((section, i) => (
            <div
              key={i}
            //   ref={(el) => {
            //     rightSectionsRef.current[i] = el; // FIXED (no return value)
            //   }}
              className="space-y-2 max-w-2xl will-change-transform"
            >
              <h2 className="text-lg font-semibold">{section.title}</h2>
              <p className="text-muted-foreground md:text-start pb-4 leading-relaxed">
                {section.text}
              </p>

              {i < content.length - 1 && (
                <div className="h-px bg-border/40 mt-4" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
