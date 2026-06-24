"use client";

import { Github, Linkedin, Mail, ArrowUpRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  LINKEDIN_URL,
  GITHUB_URL,
  EMAIL_ADDRESS,
} from "@/components/utils/externalLinks";

const links = [
  {
    icon: Linkedin,
    label: "LinkedIn",
    handle: "hanseooo",
    href: LINKEDIN_URL,
  },
  {
    icon: Mail,
    label: "Email",
    handle: EMAIL_ADDRESS,
    href: `mailto:${EMAIL_ADDRESS}`,
  },
  {
    icon: Github,
    label: "GitHub",
    handle: "Hanseooo",
    href: GITHUB_URL,
  },
];

export default function ConnectModal({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-w-sm p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
          <DialogTitle className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
            Let&apos;s Connect
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col divide-y divide-border">
          {links.map(({ icon: Icon, label, handle, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("mailto") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="group flex items-center gap-4 px-6 py-5 transition-colors hover:bg-primary/5"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors group-hover:border-primary/40 group-hover:text-primary">
                <Icon size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-mono uppercase tracking-[0.15em] text-muted-foreground">
                  {label}
                </p>
                <p className="mt-0.5 truncate font-medium text-foreground transition-colors group-hover:text-primary">
                  {handle}
                </p>
              </div>
              <ArrowUpRight
                size={16}
                className="shrink-0 text-muted-foreground/40 transition-all group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          ))}
        </div>

        <div className="px-6 py-4 border-t border-border">
          <p className="text-center font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50">
            Open to opportunities
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
