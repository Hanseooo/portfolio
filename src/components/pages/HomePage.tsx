// HomePage.tsx - CORRECT GSAP PIN IMPLEMENTATION
import { useEffect, useRef } from "react";
import { animate } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroSection from "@/components/sections/HeroSection";
import { useScrollStore } from "@/store/scrollStore";
import TechStackMarquee from "../sections/TechStackMarquee";
// import sprinkle from "@/assets/svg/layered-waves-haikei.svg"
import FeaturedProjects from "../sections/Projects";
import { Particles } from "../ui/shadcn-io/particles";
import { BackgroundBeams } from "../ui/shadcn-io/background-beams";
import AboutMe from "../sections/AboutMe";
import { isInAppBrowser } from "@/utils/browserInfo";

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger);
const isMobile = /iPhone|iPad|iPod|Android|BlackBerry|IEMobile|Opera Mini/i.test(
  navigator.userAgent
);


export default function HomePage() {
  const setScrollY = useScrollStore((state) => state.setScrollY);
  const sectionRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const aboutMeRef = useRef<HTMLDivElement>(null);
  const marqueeWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);

    // Animate scroll to top on page load
    const scrollAnim = animate(window.scrollY, 0, {
      duration: 1,
      onUpdate: (v) => window.scrollTo(0, v),
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      scrollAnim.stop();
    };
  }, [setScrollY]);

  // GSAP ScrollTrigger PIN effect
  useEffect(() => {
    if (!sectionRef.current || !marqueeWrapperRef.current) return;

    const section = sectionRef.current;
    const marqueeWrapper = marqueeWrapperRef.current;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top", // Pin when section center reaches viewport center
        end: "+=300%", // Stay pinned for 2 viewport heights of scrolling
        pin: marqueeWrapper, // Pin this element
        pinSpacing: true, // Add spacing to prevent layout jump
        scrub: true, // Smooth scrubbing
        // markers: true, // Uncomment for debugging
      });
    }, section);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // PROJECTS PARALLAX SCROLL (entire section moves up/down)
  useEffect(() => {
    if (!projectsRef.current || isInAppBrowser()) {
      return;
    }

    const el = projectsRef.current;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y: -150 }, 
        {
          y: -800,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",   
            end: "bottom 20%", 
            scrub: isMobile ? 0.8 : 3,
            invalidateOnRefresh: true,
            markers: false,      
            // onUpdate: (self) => console.log("Scroll progress:", self.progress),
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);


useEffect(() => {
  if (!projectsRef.current || !aboutMeRef.current|| isInAppBrowser()) return;

  const triggerEl = projectsRef.current.querySelector("div");
  const el = aboutMeRef.current;

  const ctx = gsap.context(() => {
    gsap.fromTo(
      el,
      { y: 0 },   // start offset
      {
        y: -950,   // end offset (different from Projects)
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: triggerEl,   // use Projects section as trigger
          start: "top 80%",     // when Projects enters viewport
          end: "bottom 10%",    // when Projects leaves viewport
          scrub: isMobile ? 0.5 : 2,
          invalidateOnRefresh: true,
          // markers: true,      // for debugging
        },
      }
    );
  });

  return () => ctx.revert();
}, []);




  return (
    <main className="w-full overflow-x-hidden relative bg-linear-to-r from-background via-primary/10 to-background">
      <HeroSection />

      {/* Tech Stack Marquee Section - WITH GSAP PIN */}
      <section 
        ref={sectionRef}
        className="relative w-full mt-64 h-[460vh]"style={{
        // backgroundImage: `url(${sprinkle})`,
        // backgroundRepeat: "no-repeat",
        // backgroundPosition: "bottom",
        // backgroundSize: "cover",
    }}
      >
      <Particles
        className="absolute inset-0 will-change-transform"
        quantity={isMobile ? 80 : 120}
        ease={80}
        staticity={100}
        color="#ffffff"
        size={1}
      />
        <div 
          ref={marqueeWrapperRef}
          className="w-full h-screen flex flex-col justify-center items-center"
        >
          <TechStackMarquee />
        </div>
      </section>

      {/* PROJECTS */}
      <section
        id="projects-section"
        className="relative  py-8 text-center"
      >

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 will-change-transform"
        ref={projectsRef}
        >
          <FeaturedProjects />
        </div>

      </section>


      {/* ABOUT ME */}
      <section
        ref={aboutMeRef}
        className="relative py-20 text-center will-change-transform"
      >
        <BackgroundBeams className="absolute inset-0 -z-10" />

        <div className="relative">
          <AboutMe />
        </div>
      </section>

    </main>
  );
}