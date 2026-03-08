import { NextResponse } from "next/server";
import { activityConfig } from "@/lib/activity/config";
import { getDiscordActivity } from "@/lib/activity/discord";

export async function GET() {
  const payload = await getDiscordActivity();

  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": `s-maxage=${activityConfig.discordRevalidateSeconds}, stale-while-revalidate=${Math.max(
        20,
        activityConfig.discordRevalidateSeconds
      )}`,
    },
  });
}
