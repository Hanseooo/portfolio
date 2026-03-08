import { NextResponse } from "next/server";
import { activityConfig } from "@/lib/activity/config";
import { getGitHubActivity } from "@/lib/activity/github";

export async function GET() {
  const payload = await getGitHubActivity();

  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": `s-maxage=${activityConfig.githubRevalidateSeconds}, stale-while-revalidate=${Math.max(
        60,
        activityConfig.githubRevalidateSeconds
      )}`,
    },
  });
}
