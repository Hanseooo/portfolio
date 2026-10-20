import { NextResponse } from "next/server";
import { getGitHubActivity } from "@/lib/activity/github";

// ISR: one shared copy, regenerated in the background at most every 5 minutes. Must be a literal.
export const revalidate = 300;

export async function GET() {
  const payload = await getGitHubActivity();

  return NextResponse.json(payload);
}
