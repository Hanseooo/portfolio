import PageTransition from "@/components/layout/PageTransition";
import { projects } from "@/lib/projects";
import Image from "next/image";
import Link from "next/link";
import BackButton from "@/components/utils/BackButton";

export default function ProjectsPage() {
  return (
    <PageTransition>
      <main className="min-h-screen pt-40 px-6 pb-24">
        <div className="mx-auto max-w-[1400px]">
          <h1 className="mb-12 text-4xl font-black uppercase tracking-tighter md:text-6xl text-foreground">
            <span className="text-primary">Projects</span>
          </h1>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, idx) => (
              <Link key={project.slug} href={`/projects/${project.slug}`} className="group block">
                <div className="relative aspect-[4/5] w-full overflow-hidden border border-border bg-card">
                  <Image
                    src={project.heroImage}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-primary/0 transition-colors duration-500 group-hover:bg-primary/5" />
                </div>
                <div className="mt-6 flex flex-col gap-2">
                  <span className="font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">
                    <span className="font-mono mr-2">0{idx + 1} {"//"}</span> {project.subtitle}
                  </span>
                  <h3 className="text-2xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                    {project.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <BackButton text="Back to Home" />
    </PageTransition>
  );
}
