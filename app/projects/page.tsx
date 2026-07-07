import PageTransition from "@/components/layout/PageTransition";
import { projects } from "@/lib/projects";
import BackButton from "@/components/utils/BackButton";
import ProjectCard from "@/components/cards/ProjectCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Selected full-stack and AI product engineering projects by Hans Amoguis, including Le Doux, Clarift, and SimplyNote.",
  alternates: {
    canonical: "/projects",
  },
};

export default function ProjectsPage() {
  return (
    <PageTransition>
      <main className="min-h-screen pt-40 px-6 pb-24">
        <div className="mx-auto max-w-[1400px]">
          <h1 className="mb-12 text-4xl font-black uppercase tracking-tighter md:text-6xl text-foreground">
            <span className="text-primary">Projects</span>
          </h1>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, idx) => (
              <ProjectCard key={project.slug} project={project} idx={idx} />
            ))}
          </div>
        </div>
      </main>
      <BackButton text="Back to Home" />
    </PageTransition>
  );
}
