import "server-only";
import { and, desc, eq } from "drizzle-orm";
import { auth } from "@/app/(auth)/auth";
import { db } from "@/lib/db/queries";
import { videoJobs } from "@/lib/db/video-jobs";

// Library backing route: the signed-in user's ten most recent
// completed ads. The video URL is never stored in our DB - it is
// resolved per item from fal's response endpoint, exactly like the
// status route does. Items whose files have aged off fal's storage
// resolve to null and simply drop out of the list, which is why the
// Library presents as "recent ads". Queried with drizzle directly
// here to keep this a one-file change; if more callers appear, the
// list helper moves into lib/db/video-jobs.ts.

const falHeaders = () => ({
  Authorization: `Key ${process.env.FAL_KEY}`,
});

async function extractVideoUrl(
  responseUrl: string | null
): Promise<string | null> {
  if (!responseUrl) return null;
  try {
    const res = await fetch(responseUrl, { headers: falHeaders() });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.video?.url ?? null;
  } catch {
    return null;
  }
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await db
    .select()
    .from(videoJobs)
    .where(and(eq(videoJobs.userId, session.user.id), eq(videoJobs.status, "completed")))
    .orderBy(desc(videoJobs.createdAt))
    .limit(10);

  const resolved = await Promise.all(
    rows.map(async (job) => {
      const videoUrl = await extractVideoUrl(job.responseUrl);
      if (!videoUrl) return null;
      return {
        requestId: job.requestId,
        createdAt: job.createdAt.toISOString(),
        videoUrl,
      };
    })
  );

  const videos: { requestId: string; createdAt: string; videoUrl: string }[] = [];
  for (const item of resolved) {
    if (item) videos.push(item);
  }

  return Response.json({ videos });
}

// -----------------------------------------------------------
// END OF FILE - app/(chat)/api/video/history/route.ts (v1 -
// library data)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
