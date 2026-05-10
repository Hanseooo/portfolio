import type { GitHubActivity } from "@/lib/activity/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type GitHubHeatmapProps = {
  data: GitHubActivity["calendar"];
};

export default function GitHubHeatmap({ data }: GitHubHeatmapProps) {
  if (!data || data.length === 0) return null;

  // Split into weeks (arrays of 7 days)
  const weeks: typeof data[] = [];
  let currentWeek: typeof data = [];
  
  data.forEach((day, i) => {
    currentWeek.push(day);
    // 7 days per column, or last item
    if (currentWeek.length === 7 || i === data.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  const getLevelColor = (level: number) => {
    switch (level) {
      case 1: return "bg-primary/30";
      case 2: return "bg-primary/50";
      case 3: return "bg-primary/80";
      case 4: return "bg-primary shadow-[0_0_8px_rgba(var(--primary),0.8)]";
      default: return "bg-foreground/5";
    }
  };

  return (
    <TooltipProvider delayDuration={100}>
      <div className="flex w-full justify-between gap-[2px] sm:gap-1 overflow-hidden pb-2">
        {weeks.map((week, weekIdx) => (
          <div key={weekIdx} className="flex flex-col gap-[2px] sm:gap-1 flex-1 max-w-[12px] sm:max-w-[14px]">
            {week.map((day, dayIdx) => (
              <Tooltip key={day.date}>
                <TooltipTrigger asChild>
                  <div
                    className={`aspect-square w-full rounded-[2px] ${getLevelColor(day.level)} transition-colors hover:border hover:border-foreground/30`}
                  />
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-background/95 border-foreground/20 text-xs text-foreground px-2 py-1">
                  <p>
                    <span className="font-bold">{day.count}</span> contributions on{" "}
                    {new Date(day.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        ))}
      </div>
    </TooltipProvider>
  );
}
