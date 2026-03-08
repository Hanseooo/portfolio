import type { GitHubActivity } from "@/lib/activity/types";

type WeeklyActivityBarsProps = {
  data: GitHubActivity["weeklyActivity"];
};

export default function WeeklyActivityBars({ data }: WeeklyActivityBarsProps) {
  const maxCount = data.reduce((max, item) => Math.max(max, item.count), 0);

  return (
    <div className="space-y-2">
      <div className="flex h-14 items-end gap-1.5">
        {data.map((item) => {
          const ratio = maxCount === 0 ? 0 : item.count / maxCount;
          const height = Math.max(0.15, ratio) * 100;

          return (
            <div key={item.day} className="flex flex-1 flex-col items-center gap-2">
              <div className="relative flex h-11 w-full items-end">
                <div
                  className="w-full rounded-sm bg-primary/80"
                  style={{ height: `${height}%` }}
                  aria-label={`${item.day} ${item.count} commits`}
                  title={`${item.day}: ${item.count} commits`}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-1.5 text-[0.65rem] uppercase tracking-[0.14em] text-foreground/65">
        {data.map((item) => (
          <span key={item.day} className="flex-1 text-center">
            {item.day}
          </span>
        ))}
      </div>
    </div>
  );
}
