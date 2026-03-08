import { NextRequest, NextResponse } from "next/server";
import { activityConfig } from "@/lib/activity/config";
import { getSpotifyActivity } from "@/lib/activity/spotify";

export async function GET(request: NextRequest) {
  const detailsParam = request.nextUrl.searchParams.get("details");
  const detailScope =
    detailsParam === "recent" || detailsParam === "top" || detailsParam === "all"
      ? detailsParam
      : detailsParam === "1" || detailsParam === "true"
        ? "all"
        : "none";

  const payload = await getSpotifyActivity(detailScope);

  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": `s-maxage=${activityConfig.spotifyRevalidateSeconds}, stale-while-revalidate=${Math.max(
        20,
        activityConfig.spotifyRevalidateSeconds
      )}`,
    },
  });
}
