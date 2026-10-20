// lib/resources.ts — single source of truth for /resources.
// Notes are omitted until Hans approves the draft copy in the R5 spec.

export type ResourceGroupId = "creators" | "skills" | "tools";

export type ResourceEntry = {
  name: string;
  href: string;
  note?: string;
  meta?: string;
  secondary?: { label: string; href: string };
};

export type ResourceGroup = {
  id: ResourceGroupId;
  title: string;
  entries: ResourceEntry[];
  sources?: { label: string; href: string }[];
};

const MATT_SKILLS = "https://github.com/mattpocock/skills/tree/main/skills";
const HAN_SKILLS = "https://github.com/Hanseooo/hanseo-skills/tree/main/skills";

export const resourceGroups: ResourceGroup[] = [
  {
    id: "creators",
    title: "Creators",
    entries: [
      {
        name: "Matt Pocock",
        href: "https://www.youtube.com/@mattpocockuk",
        meta: "YouTube",
        secondary: { label: "GitHub", href: "https://github.com/mattpocock" },
      },
      {
        name: "Lauren Tan",
        href: "https://x.com/poteto",
        meta: "X",
        secondary: { label: "GitHub", href: "https://github.com/poteto" },
      },
      { name: "Better Stack", href: "https://www.youtube.com/@betterstack", meta: "YouTube" },
      { name: "IBM Technology", href: "https://www.youtube.com/@IBMTechnology", meta: "YouTube" },
      { name: "Nate Herk", href: "https://www.youtube.com/@nateherk", meta: "YouTube" },
      { name: "Codehead", href: "https://www.youtube.com/@codehead01", meta: "YouTube" },
      { name: "The AI Automators", href: "https://www.youtube.com/@theaiautomators", meta: "YouTube" },
    ],
  },
  {
    id: "skills",
    title: "Skills",
    sources: [
      { label: "mattpocock/skills", href: "https://github.com/mattpocock/skills" },
      { label: "Hanseooo/hanseo-skills", href: "https://github.com/Hanseooo/hanseo-skills" },
    ],
    entries: [
      { name: "grill-me", href: `${MATT_SKILLS}/productivity/grill-me`, meta: "mattpocock/skills" },
      { name: "to-tickets", href: `${MATT_SKILLS}/engineering/to-tickets`, meta: "mattpocock/skills" },
      { name: "wayfinder", href: `${MATT_SKILLS}/engineering/wayfinder`, meta: "mattpocock/skills" },
      { name: "grill-with-docs", href: `${MATT_SKILLS}/engineering/grill-with-docs`, meta: "mattpocock/skills" },
      { name: "to-spec", href: `${MATT_SKILLS}/engineering/to-spec`, meta: "mattpocock/skills" },
      { name: "han-grill", href: `${HAN_SKILLS}/han-grill`, meta: "hanseo-skills" },
      { name: "han-to-spec", href: `${HAN_SKILLS}/han-to-spec`, meta: "hanseo-skills" },
      { name: "han-to-tickets", href: `${HAN_SKILLS}/han-to-tickets`, meta: "hanseo-skills" },
    ],
  },
  {
    id: "tools",
    title: "Tools",
    entries: [
      { name: "Claude Code", href: "https://claude.com/claude-code", meta: "Pro plan" },
      { name: "Codex", href: "https://openai.com/codex", meta: "Plus plan" },
      { name: "Orca", href: "https://onorca.dev" },
      { name: "herdr", href: "https://herdr.dev" },
    ],
  },
];
