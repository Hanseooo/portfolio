"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

function TourGalleryCard({
  src,
  title,
  caption,
  index = 0,
}: {
  src: string;
  title?: string;
  caption?: string;
  index?: number;
}) {
  return (
    <article
      className={cn(
        "tour-card shrink-0 rounded-2xl overflow-hidden will-change-transform",
        "w-[420px] md:w-[480px] h-[500px] md:h-[520px] flex flex-col"
      )}
      aria-label={title ?? `Tour photo ${index + 1}`}
    >
      <Card className="h-full border-b-2 border-foreground/20 bg-background/20 backdrop-blur-md md:backdrop-blur-lg shadow-2xl flex flex-col">
        <div className="p-3 shrink-0">
          <div className="relative h-80 md:h-[360px] bg-linear-to-br from-background/5 to-background/20 overflow-hidden rounded-xl">
            <img
              src={src}
              alt={title ?? `Tour photo ${index + 1}`}
              className="w-full h-full object-cover"
              style={{ objectFit: 'cover' }}
              draggable={false}
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent pointer-events-none" />
            <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.15)] pointer-events-none rounded-xl" />
          </div>
        </div>

        <CardContent className="px-5 pb-5 pt-2 bg-linear-to-b from-background/5 to-transparent flex-1 flex flex-col">
          <CardHeader className="p-0 shrink-0">
            <CardTitle className="text-xl font-bold line-clamp-2">{title ?? `Site ${index + 1}`}</CardTitle>
          </CardHeader>
          {caption && (
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed line-clamp-3 flex-1">
              {caption}
            </p>
          )}
        </CardContent>
      </Card>
    </article>
  );
}

export default function TourGallerySection() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const introRef = useRef<HTMLDivElement | null>(null);

  const [images] = useState<string[]>(
    Array.from({ length: 10 }).map((_, i) => `/tour/classPhotos/${i + 1}.jpeg`)
  );
  
  const cardContent = [
    {
      title: "University of The Philippines Cebu",
      caption: "",
    },
    {
      title: "Dynata Philippines Inc.",
      caption: "",
    },
    {
      title: "UP CeBu InIT",
      caption: "",
    },
    {
      title: "Chocolate Hills",
      caption: "",
    },
    {
      title: "Chocolate Hills #2",
      caption: "",
    },
    {
      title: "Magellan's Cross",
      caption: "",
    },
    {
      title: "Monument and Battle of Mactan Painting",
      caption: "",
    },
    {
      title: "Mata Technologies Inc.",
      caption: "",
    },
    {
      title: "Mactan Shrine",
      caption: "",
    },
    {
      title: "SM City Cebu",
      caption: "",
    },
  ];

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const containerEl = containerRef.current;
    const scrollerEl = scrollerRef.current;
    const bgEl = bgRef.current;
    const overlayEl = overlayRef.current;
    const introEl = introRef.current;

    if (!containerEl || !scrollerEl || !bgEl || !overlayEl || !introEl) {
      return;
    }

    let ctx: gsap.Context | null = null;
    let resizeTimeout: number | undefined;

    // Set initial opacity to 0 for fade-in
    gsap.set(containerEl, { opacity: 0 });

    const preloadImages = async (urls: string[]) =>
      Promise.all(
        urls.map(
          (url) =>
            new Promise<void>((resolve) => {
              const img = new Image();
              img.src = url;
              img.onload = () => resolve();
              img.onerror = () => resolve();
            })
        )
      );

    const setupAnimation = () => {
      // Kill all existing ScrollTriggers
      ScrollTrigger.getAll().forEach((st) => st.kill());

      // Calculate scroll distance
      const scrollWidth = scrollerEl.scrollWidth;
      const viewportWidth = window.innerWidth;
      const maxScroll = scrollWidth - viewportWidth;

      if (maxScroll <= 0) {
        return;
      }

      // Mobile performance optimizations
      const scrubSpeed = isMobile ? 0.5 : 1.8; // Faster scrub on mobile
      const cardScrubSpeed = isMobile ? 0.75 : 2.5; // Faster card animations on mobile

      ctx = gsap.context(() => {
        // Fade in animation
        gsap.fromTo(
          containerEl,
          { opacity: 0 },
          {
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: containerEl,
              start: "top 70%",
              end: "top top",
              scrub: true,
            },
          }
        );

        // Single ScrollTrigger with pinning
        ScrollTrigger.create({
          trigger: containerEl,
          start: "top top",
          end: `+=${maxScroll * 2}`,
          pin: true,
          scrub: scrubSpeed,
          anticipatePin: 1,
          markers: false,
          id: "gallery-pin",
        });

        // Horizontal scroll
        gsap.to(scrollerEl, {
          x: -maxScroll,
          ease: "none",
          scrollTrigger: {
            trigger: containerEl,
            start: "top top",
            end: `+=${maxScroll * 2}`,
            scrub: scrubSpeed,
            id: "gallery-scroll",
          },
        });

        // Background parallax (disabled on mobile for performance)
        if (!isMobile) {
          gsap.to(bgEl, {
            x: -maxScroll * 0.25,
            ease: "none",
            scrollTrigger: {
              trigger: containerEl,
              start: "top top",
              end: `+=${maxScroll * 2}`,
              scrub: 2,
            },
          });
        }

        // Overlay fade
        gsap.fromTo(
          overlayEl,
          { opacity: 0 },
          {
            opacity: 0.7,
            ease: "none",
            scrollTrigger: {
              trigger: containerEl,
              start: "top top",
              end: `+=${maxScroll * 2}`,
              scrub: 2,
            },
          }
        );

        // Intro fade
        gsap.to(introEl, {
          y: isMobile ? -80 : -120, // Less movement on mobile
          opacity: 0.4,
          ease: "none",
          scrollTrigger: {
            trigger: containerEl,
            start: "top top",
            end: `+=${maxScroll * 2}`,
            scrub: 2,
          },
        });

        // Card animations (simplified on mobile)
        gsap.utils.toArray<HTMLElement>(".tour-card").forEach((cardEl, i) => {
          // Reduced vertical parallax on mobile
          const verticalOffset = isMobile 
            ? (i % 2 === 0 ? 1 : -1) * 6 
            : (i % 2 === 0 ? 1 : -1) * (12 + (i % 3) * 8);
          
          const scaleTo = isMobile ? 1.01 : 1.02 + (i % 3) * 0.005;

          gsap.to(cardEl, {
            y: verticalOffset,
            ease: "none",
            scrollTrigger: {
              trigger: containerEl,
              start: "top top",
              end: `+=${maxScroll * 2}`,
              scrub: cardScrubSpeed,
            },
          });

          // Simplified shadow animation on mobile
          if (!isMobile) {
            gsap.fromTo(
              cardEl,
              { scale: 1, boxShadow: "0px 10px 40px rgba(0,0,0,0.1)" },
              {
                scale: scaleTo,
                boxShadow: "0px 25px 60px rgba(0,0,0,0.2)",
                ease: "none",
                scrollTrigger: {
                  trigger: containerEl,
                  start: "top top",
                  end: `+=${maxScroll * 2}`,
                  scrub: cardScrubSpeed,
                },
              }
            );
          }
        });

        ScrollTrigger.refresh();
      }, containerEl);
    };

    const init = async () => {
      await preloadImages(images);
      
      setTimeout(() => {
        setupAnimation();
      }, 100);
    };

    init();

    const handleResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(() => {
        setupAnimation();
      }, 250);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (resizeTimeout) clearTimeout(resizeTimeout);
      if (ctx) ctx.revert();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [images, isMobile]);

  return (
    <section className="relative w-full">
      <div 
        ref={containerRef}
        className="relative w-full h-screen overflow-hidden bg-background"
        style={{
          maskImage: "linear-gradient(to bottom, transparent 0%, black 20%, black 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 20%, black 100%)",
        }}
      >
        {/* Background */}
        <div
          ref={bgRef}
          className="absolute inset-0 w-[520vw] md:w-[300vw] h-full -z-20 will-change-transform"
          style={{ left: "-75vw" }}
          aria-hidden="true"
        >
          <img
            src="/tour/bg/loboc-river.jpg"
            alt=""
            className="w-full h-full object-cover"
            style={{ objectPosition: "center 60%" }}
            draggable={false}
            loading="eager"
          />
        </div>

        {/* Overlay */}
        <div
          ref={overlayRef}
          className="absolute inset-0 -z-10 bg-background pointer-events-none"
          style={{ opacity: 0 }}
          aria-hidden="true"
        />

        {/* Scrolling content */}
        <div className="relative z-10 h-full flex items-center overflow-visible">
          <div
            ref={scrollerRef}
            className="flex items-center gap-12 px-8 md:px-12 lg:px-20 will-change-transform"
          >
            {/* Intro */}
            <div
              ref={introRef}
              className="shrink-0 w-[360px] md:w-[420px]"
            >
              <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
                Educational Tour <span className="text-primary">Gallery</span>
              </h2>
              <p className="mt-4 text-neutral-300 text-base md:text-lg">
                Highlights from our Cebu – Bohol Educational Tour. Scroll down to traverse the gallery.
              </p>
            </div>

            {/* Cards */}
            {images.map((src, i) => (
              <TourGalleryCard
                key={src}
                src={src}
                index={i}
                title={cardContent[i].title}
                caption={cardContent[i].caption}
              />
            ))}

            {/* End spacer */}
            <div className="shrink-0 w-60" />
          </div>
        </div>
      </div>
    </section>
  );
}