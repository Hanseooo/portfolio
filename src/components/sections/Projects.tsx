// components/sections/Projects.tsx - COMPLETE FIXED VERSION
import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type ProjectInfo } from "@/types/projects";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { ExternalLink, Github } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { Vortex } from "../ui/shadcn-io/vortex";

// Register plugin at module level with SSR check
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const featuredProjects: ProjectInfo[] = [
  {
    id: "p1",
    name: "The Podium",
    description:
      "A web application for managing and tracking seminars. Tracks attendance, evaluate attended seminars, generates certificates then sent to email, and a seminar evaluation analytics for the admin. Built for WS101 during my 3rd year of college.",
    github: "https://github.com/Hanseooo/attendance-evaluation-certification",
    hostedUrl: null,
    images: ["/projects/Podium/1.png", "/projects/Podium/2.png", "/projects/Podium/3.png", "/projects/Podium/4.png", 
      "/projects/Podium/5.png", "/projects/Podium/6.png", "/projects/Podium/7.png", "/projects/Podium/8.png", 
      "/projects/Podium/9.png", "/projects/Podium/10.png", "/projects/Podium/11.png", "/projects/Podium/12.png", 
      "/projects/Podium/13.png", "/projects/Podium/14.png", "/projects/Podium/15.png", "/projects/Podium/16.png", 
    ],
    tech: ["React", "TypeScript", "Tailwind", "Shadcn", "Brevo Api", "Cloudinary", "Django", "Postgres", "Pillow"],
  },
  {
    id: "p2",
    name: "HCDC Lost and Found Management System (ongoing)",
    description: "A web application that lets users post either a lost or found item and notifies them if someone wants to claim or report that they found the item. An admin manages the posts. Built during my 3rd year of college for my IM101 subject.",
    github: "https://github.com/Hanseooo/lfms",
    hostedUrl: null,
    images: ["/projects/lfms/1.png","/projects/lfms/2.png","/projects/lfms/3.png","/projects/lfms/4.png","/projects/lfms/5.png","/projects/lfms/6.png","/projects/lfms/7.png",],
    tech: ["React", "Typescript", "Tailwind", "Postgres", "Django", "Cloudinary", "Shadcn"],
  },
    {
    id: "p3",
    name: "H-Lens",
    description: "A pure frontend photobooth web application. Created during the second semester of my Sophomore year to practice React.",
    github: "https://github.com/Hanseooo/H-lens",
    hostedUrl: "https://h-lens.vercel.app/",
    images: ["/projects/H-Lens/1.png","/projects/H-Lens/2.png","/projects/H-Lens/3.png","/projects/H-Lens/4.png","/projects/H-Lens/5.png", ],
    tech: ["HTML", "CSS", "Typescript", "React", "React-Bootstrap"],
  },
  {
    id: "p4",
    name: "QuickFlash",
    description: "A simple web application that aims to help users study and memorize effectively using flashcards. Created during the early days of my Sophomore year to improve my frontend skills.",
    github: "https://github.com/Hanseooo/quickflash",
    hostedUrl: "https://quickflash-psi.vercel.app/",
    images: ["/projects/QuickFlash/hero.png", "/projects/QuickFlash/cards.png", "/projects/QuickFlash/quiz.png", "/projects/QuickFlash/about.png"],
    tech: ["HTML", "CSS", "Javascript", "Bootstrap"],
  },
];

const otherProjects : ProjectInfo[] = [
  {
    id: "p1",
    name: "Dummy Game (unfinished)",
    description:
      "A 2D hack and slash game. Player and monster sprites are drawn by me. Created this game out of curiosity and as a hobby.",
    github: "https://github.com/Hanseooo/dummy-game-project",
    hostedUrl: "https://drive.google.com/file/d/16TDplpZJYbnWAEjYTfe6w-3W4JL4WqYE/view?usp=sharing",
    images: ["/projects/Other/dummy-game.gif", 
    ],
    tech: ["GML", "GameMaker", "Aseprite", ],
  },
  {
    id: "p2",
    name: "Arduino Simon Memory Game",
    description:
      "A simple memory game using Arduino Uno. Created to teach myself about its fundamentals and as a hobby.",
    github: null,
    hostedUrl: null,
    images: ["/projects/Other/simon-memory-game.jpg", 
    ],
    tech: ["C++", "Arduino IDE", "UNO R3", ],
  },
]

/* Image Fallback */
function ImageFallback({ name }: { name?: string }) {
  return (
    <div className="flex items-center justify-center w-full h-56 md:h-64 bg-primary/10 rounded-md text-muted-foreground">
      <span className="font-medium">{name ? "No Image Available" : "No Image"}</span>
    </div>
  );
}

/* Embla Carousel */
function EmblaCarousel({ images, alt }: { images: string[]; alt: string }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 6 });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const autoPlayInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  /* AUTOPLAY */
  useEffect(() => {
    if (!emblaApi || images.length <= 1) return;

    const play = () => {
      autoPlayInterval.current = setInterval(() => {
        if (!emblaApi) return;
        emblaApi.scrollNext();
      }, 5000);
    };

    play();

    emblaApi.on("pointerDown", () => {
      if (autoPlayInterval.current) clearInterval(autoPlayInterval.current);
    });
    emblaApi.on("pointerUp", () => {
      if (autoPlayInterval.current) clearInterval(autoPlayInterval.current);
      play();
    });

    return () => {
      if (autoPlayInterval.current) clearInterval(autoPlayInterval.current);
    };
  }, [emblaApi, images.length]);

  /* ACTIVE DOT SYNC */
  useEffect(() => {
    if (!emblaApi) return;

    const update = () => {
      setActiveIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", update);
    update();
  }, [emblaApi]);

  /* FALLBACKS */
  if (!images || images.length === 0) return <ImageFallback name={alt} />;

  if (images.length === 1) {
    return (
      <>
        <img
          src={images[0]}
          alt={alt}
          onClick={() => setSelectedImage(images[0])}
          className="w-full h-56 md:h-64 object-cover rounded-md cursor-pointer"
        />

        {/* Image Dialog */}
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl p-0 overflow-hidden">
            <img src={selectedImage ?? ""} className="w-full h-auto object-contain" />
          </DialogContent>
        </Dialog>
      </>
    );
  }

  /* MULTI-IMAGE CAROUSEL */
  return (
    <>
      <div className="embla relative w-full rounded-md overflow-hidden">
        {/* VIEWPORT */}
        <div ref={emblaRef} className="embla__viewport h-56 md:h-64">
          <div className="embla__container flex h-full">
            {images.map((src, idx) => (
              <div key={idx} className="embla__slide flex-[0_0_100%] h-full">
                <img
                  src={src}
                  alt={`${alt} ${idx + 1}`}
                  onClick={() => setSelectedImage(src)}
                  className="w-full h-full object-cover cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>

        {/* FLOATING NEXT/PREV BUTTONS (Style B) */}
        <button
          onClick={() => {
            if (emblaApi) emblaApi.scrollPrev();
            // if (autoPlayInterval.current) clearInterval(autoPlayInterval.current); // stop autoplay
          }}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full text-primary hover:cursor-pointer text-xl"
        >
          ‹
        </button>
        <button
          onClick={() => {
            if (emblaApi) emblaApi.scrollNext();
            // if (autoPlayInterval.current) clearInterval(autoPlayInterval.current); // stop autoplay
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full text-primary hover:cursor-pointer text-xl"
        >
          ›
        </button>

        {/* DOTS */}
        <div className="flex justify-center gap-2 mt-3">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                if (emblaApi) emblaApi.scrollTo(i);
                if (autoPlayInterval.current) clearInterval(autoPlayInterval.current); // stop autoplay
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                activeIndex === i ? "bg-primary" : "bg-foreground/40"
              }`}
            />
          ))}
        </div>
      </div>

      {/* IMAGE DIALOG */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <img src={selectedImage ?? ""} className="w-full h-auto object-contain" />
        </DialogContent>
      </Dialog>

      <style>{`
        .embla__viewport { overflow: hidden; width: 100%; }
        .embla__container { display: flex; height: 100%; user-select: none; }
      `}</style>
    </>
  );
}


/* ProjectCard Content */
function ProjectCardContent({ project }: { project: ProjectInfo }) {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <>
      <div className="flex flex-col md:flex-row items-stretch">
        <div className="md:w-1/2 p-4">
          {project.images && project.images.length > 0 ? (
            <EmblaCarousel images={project.images} alt={project.name} />
          ) : (
            <ImageFallback name={project.name} />
          )}
        </div>
        <div className="md:w-1/2 p-6 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-xl font-semibold text-start">{project.name}</h3>
            <div className="flex items-center gap-2">
              {project.hostedUrl && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className="p-2 rounded hover:bg-muted"
                      aria-label="Open hosted site"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(project.hostedUrl as string, "_blank", "noopener,noreferrer");
                      }}
                    >
                      <ExternalLink size={18} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Open hosted site (new tab)</TooltipContent>
                </Tooltip>
              )}
              {project.github && (
                
                  <a href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded hover:bg-muted text-muted-foreground"
                  onClick={(e) => e.stopPropagation()}
                  aria-label="View GitHub"
                >
                  <Github size={18} />
                </a>
              )}
            </div>
          </div>
          <p className="text-sm text-muted-foreground text-start">{project.description}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <Badge key={t} className="py-1 px-2">
                {t}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Not hosted</DialogTitle>
            <DialogDescription>This project is not hosted.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setOpenDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

/* FeaturedProjects Section */
export default function FeaturedProjects({ projects = featuredProjects }: { projects?: ProjectInfo[] }) {
  const featured = useMemo(() => projects.slice(0, projects.length), [projects]);
  const sectionRef = useRef<HTMLElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!sectionRef.current || !cardsContainerRef.current) return;

    const section = sectionRef.current;
    const cardsContainer = cardsContainerRef.current;
    const cards = cardsContainer.querySelectorAll<HTMLElement>(".project-card");

    if (cards.length === 0) return;

    const ctx = gsap.context(() => {
      // Create a timeline that triggers when section enters viewport
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top bottom", // Start when section top enters viewport bottom
          end: "bottom top", // End when section bottom exits viewport top
          scrub: 1, // Smooth scrubbing
          invalidateOnRefresh: true,
          // markers: true, // Uncomment for debugging
        },
      });

      // Animate all cards together, moving up faster than scroll
      cards.forEach((card, index) => {
        // Each card moves up at slightly different speed for depth effect
        // Negative values = move up, larger negative = faster upward movement
        const yDistance = -150 - (index * 50); // First: -150, Second: -200, Third: -250

        tl.to(
          card,
          {
            y: yDistance,
            ease: "none",
            duration: 1,
          },
          0 // All cards animate at the same time (position 0 in timeline)
        );
      });
    }, section);

    return () => {
      ctx.revert();
    };
  }, [featured]);

  return (
    <>
        <Vortex
          backgroundColor="transparent"
          particleCount={25}
          baseHue={120}
          rangeY={2000}
          baseSpeed={0.0}
          rangeSpeed={0.2}
          className="w-full will-change-transform"
      >
      <section ref={sectionRef} id="featured-projects" className="pt-6 md:pt-4 pb-24">
        
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
                className="text-center mb-8"
                initial={{ opacity: 0, scale: 1.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.75, ease: "easeOut" }}
                viewport={{ once: false, amount: 0.5 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-20">Featured Projects</h2>

            </motion.div>
            <div ref={cardsContainerRef} className="flex flex-col gap-8 items-center">
              {featured.map((project) => (
                <article
                  key={project.id}
                  className="project-card backdrop-blur-xs bg-background/25 border-2 border-primary/10 rounded-2xl shadow-md overflow-hidden w-full max-w-3xl will-change-transform"
                >
                  <ProjectCardContent project={project} />
                </article>
              ))}
            </div>
        </div>
      </section>

      <section ref={sectionRef} id="featured-projects" className="pt-6 md:pt-4 pb-12">
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, scale: 1.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.75, ease: "easeOut" }}
              viewport={{ once: false, amount: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-20">Other Projects</h2>
          </motion.div>
          <div ref={cardsContainerRef} className="flex flex-col gap-8 items-center">
              {otherProjects.map((project) => (
                <article
                  key={project.id}
                  className="project-card backdrop-blur-xs bg-background/25 border-2 border-primary/10 rounded-2xl shadow-md overflow-hidden w-full max-w-3xl will-change-transform"
                >
                  <ProjectCardContent project={project} />
                </article>
              ))}
            </div>
            
      </section>
      </Vortex>
    </>
  );
}