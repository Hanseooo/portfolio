import ScreenshotFrame from "@/components/evidence/ScreenshotFrame";
import { ShotThumb, type Shot } from "@/components/evidence/ScreenshotViewer";

/**
 * Project screenshots: first image wide, the rest paired from md. Each opens in the
 * surrounding ScreenshotViewer; `offset` is the first shot's index in that viewer.
 */
export default function ScreenshotGallery({ shots, offset = 0 }: { shots: Shot[]; offset?: number }) {
  const thumbnail = (shot: Shot, i: number, wide: boolean) => (
    <ShotThumb key={i} index={offset + i}>
      <ScreenshotFrame src={shot.src} alt={shot.alt} wide={wide} />
    </ShotThumb>
  );

  return (
    <div className="space-y-6">
      {thumbnail(shots[0], 0, true)}
      {shots.length > 1 && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {shots.slice(1).map((shot, i) => thumbnail(shot, i + 1, false))}
        </div>
      )}
    </div>
  );
}
