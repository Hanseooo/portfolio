import type { SvgId } from "@/lib/svgMap";

export type AboutSkillGroup = {
  title: string;
  items: string[];
};

export type AboutTool = {
  label: string;
  id: SvgId;
};

export type AboutToolGroup = {
  title: string;
  tools: AboutTool[];
};

export const aboutContent = {
  profile: {
    eyebrow: "About Me",
    title: "Full-Stack Engineer focused on AI Product Engineering",
    intro:
      "I build maintainable systems with strong architecture, clean implementation, and practical user experience.",
    detail:
      "My work blends product thinking with engineering execution, turning requirements into clear technical decisions and reliable software.",
    highlights: [
      "System design from product requirements",
      "Spec-driven implementation and iteration",
      "AI-enabled workflows built for real usage",
    ],
  },
  skills: {
    eyebrow: "Skills",
    title: "Building\nWith Intent",
    groups: [
      {
        title: "Product Engineering Foundations",
        items: [
          "Responsive interfaces with accessible interaction patterns",
          "API-driven features across client and server boundaries",
          "Design-to-code implementation with consistent visual quality",
          "AI-assisted product features for practical workflows",
        ],
      },
      {
        title: "Systems and Problem Solving",
        items: [
          "Architecture planning from PRDs and constraints",
          "Complex feature breakdown into clear implementation specs",
          "Maintainable code structure and pragmatic abstractions",
          "Trade-off decisions balancing speed and long-term quality",
        ],
      },
      {
        title: "Delivery Workflow",
        items: [
          "PRD-to-spec implementation planning",
          "Feature branching, pull requests, and iterative reviews",
          "Component-driven development and reuse",
          "Continuous learning and adaptation to emerging tools",
        ],
      },
    ] as AboutSkillGroup[],
  },
  tools: {
    eyebrow: "Tools",
    title: "The Stack\nI Trust",
    groups: [
      {
        title: "Frontend",
        tools: [
          { label: "Next.js", id: "nextjs" },
          { label: "TypeScript", id: "typescript" },
          { label: "React", id: "react" },
          { label: "Tailwind CSS", id: "tailwind" },
          { label: "Shadcn Ui", id: "shadcnui" },
          { label: "React Query", id: "reactquery" },
          { label: "JavaScript", id: "javascript" },
          { label: "Bootstrap", id: "bootstrap" },
        ],
      },
      {
        title: "AI + Backend",
        tools: [
          { label: "LangChain", id: "langchain" },
          { label: "FastAPI", id: "fastapi" },
          { label: "Python", id: "python" },
          { label: "Django", id: "django" },
          { label: "PostgreSQL", id: "postgres" },
          { label: "MySQL", id: "mysql" },
        ],
      },
      {
        title: "Platform + Workflow",
        tools: [
          { label: "Git", id: "git" },
          { label: "Github", id: "github" },
          { label: "Supabase", id: "supabase" },
          { label: "Firebase", id: "firebase" },
          { label: "AI Studio", id: "ai-studio" },
        ],
      },
    ] as AboutToolGroup[],
  },
  philosophy: {
    eyebrow: "Current Focus",
    title: "Design systems,\nthen ship them.",
    lines: [
      "I design architectures from PRDs before implementation so delivery stays clear, scalable, and maintainable.",
      "I practice spec-driven development to reduce rework and keep engineering decisions explicit.",
      "I am currently deepening Next.js, LangChain, and FastAPI while continuously adapting to new technology.",
    ],
  },
};
