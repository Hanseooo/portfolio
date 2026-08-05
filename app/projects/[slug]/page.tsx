// app/projects/[slug]/page.tsx
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { getProjectDetail } from "@/lib/content/detail-projections";
import { PageFamilyFrame, CompactMasthead } from "@/components/frames";
import { RecordContinuation, EmptySafeActions } from "@/components/evidence";
import ProjectLocalNav, {
  type LocalNavSection,
} from "@/components/routes/ProjectLocalNav";
import ProjectEvidenceBody from "@/components/routes/ProjectEvidenceBody";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectDetail(slug);

  if (!project) notFound();

  // Build local nav sections — only include sections with content
  const localSections: LocalNavSection[] = [
    { id: "project-brief", label: "Brief" },
  ];
  if (project.technicalDecisions.length > 0) {
    localSections.push({ id: "project-decisions", label: "Decisions" });
  }
  if (project.stack.length > 0) {
    localSections.push({ id: "project-system", label: "System" });
  }
  if (project.features.length > 0) {
    localSections.push({ id: "project-capabilities", label: "Capabilities" });
  }
  if (project.gallery.length > 0) {
    localSections.push({ id: "project-screenshots", label: "Screenshots" });
  }

  // Build actions — only non-null when URL exists
  const actions = [
    project.githubUrl
      ? {
          key: "github",
          element: (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-2 border border-[color:var(--cs-structural-line-strong)] px-4 font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[color:var(--cs-text-primary)] transition-colors hover:border-[color:var(--cs-signal)] hover:text-[color:var(--cs-signal)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--cs-focus-ring)]"
            >
              Source Code <ArrowUpRight size={12} aria-hidden="true" />
            </a>
          ),
        }
      : null,
    project.liveUrl
      ? {
          key: "live",
          element: (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-2 bg-[color:var(--cs-signal)] px-4 font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[color:var(--cs-signal-inverse)] transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--cs-focus-ring)]"
            >
              Live Preview <ArrowUpRight size={12} aria-hidden="true" />
            </a>
          ),
        }
      : null,
  ];

  // Build continuation targets
  const prevTarget = project.prevSlug
    ? {
        label: `← Previous`,
        href: `/projects/${project.prevSlug}`,
      }
    : null;
  const nextTarget = project.nextSlug
    ? {
        label: `Next →`,
        href: `/projects/${project.nextSlug}`,
      }
    : null;

  return (
    <PageFamilyFrame
      masthead={
        <CompactMasthead
          parentLabel="All Projects"
          parentHref="/projects"
          index={`${String(project.position).padStart(2, "0")} of ${String(project.totalInCollection).padStart(2, "0")}`}
          title={project.title}
          subtitle={project.subtitle}
          metadata={
            <>
              <span>{project.year}</span>
              <span>{project.role}</span>
              {project.client && <span>Client: {project.client}</span>}
            </>
          }
          actions={<EmptySafeActions actions={actions} />}
        />
      }
      localNav={<ProjectLocalNav sections={localSections} />}
      continuation={
        <RecordContinuation
          parent={{ label: "All Projects", href: "/projects" }}
          prev={prevTarget}
          next={nextTarget}
        />
      }
    >
      <ProjectEvidenceBody project={project} />
    </PageFamilyFrame>
  );
}
