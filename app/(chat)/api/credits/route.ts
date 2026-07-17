import "server-only";
import { auth } from "@/app/(auth)/auth";
import { getFreeStatus, getUserCredits } from "@/lib/db/credits";
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ credits: 0, freeRemaining: 0 });
  }
  if (session.user.type === "guest") {
    const credits = await getUserCredits(session.user.id);
    return Response.json({ credits, freeRemaining: 0 });
  }
  const status = await getFreeStatus(session.user.id);
  return Response.json({ credits: status.credits, freeRemaining: status.freeRemaining });
}

// ============================================================
// END OF FILE - app/(chat)/api/credits/route.ts (v2 - free tier)
// If you can see this comment, the paste was not truncated.
// ============================================================
