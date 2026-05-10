import PageTransition from "@/components/layout/PageTransition";
import { experience } from "@/lib/experience";
import BackButton from "@/components/utils/BackButton";

export default function ExperiencePage() {
  return (
    <PageTransition>
      <main className="min-h-screen pt-40 px-6 pb-24">
        <div className="mx-auto max-w-[1000px]">
          <h1 className="mb-12 text-4xl font-black uppercase tracking-tighter md:text-6xl text-foreground">
            <span className="text-primary">Experience</span>
          </h1>
          <div className="space-y-16">
            {experience.map((item, idx) => (
              <div key={idx} className="group relative border-l border-border pl-8 transition-colors hover:border-primary">
                <span className="absolute -left-[5px] top-2 h-2 w-2 rounded-full bg-border transition-colors group-hover:bg-primary" />
                <h3 className="mb-2 text-3xl font-bold text-foreground">{item.role}</h3>
                <p className="mb-6 font-mono text-sm uppercase tracking-widest text-primary">
                  {item.company} {"//"} {item.period}
                </p>
                <ul className="list-disc space-y-3 pl-5 text-muted-foreground">
                  {item.points.map((point, i) => (
                    <li key={i} className="text-lg leading-relaxed">{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </main>
      <BackButton text="Back to Home" />
    </PageTransition>
  );
}
