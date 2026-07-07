import "server-only";
import { auth } from "@/app/(auth)/auth";
import { addCredits, getUserCredits } from "@/lib/db/credits";
import {
  claimVideoJobRefund,
  getVideoJob,
  markVideoJobCompleted,
} from "@/lib/db/video-jobs";

const falHeaders = () => ({
  Authorization: `Key ${process.env.FAL_KEY}`,
});

async function extractVideoUrl(
  responseUrl: string | null
): Promise<string | null> {
  if (!responseUrl) return null;
  const res = await fetch(responseUrl, { headers: falHeaders() });
  if (!res.ok) return null;
  const data = await res.json();
  return data?.video?.url ?? null;
}

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const requestId = searchParams.get("requestId");
  if (!requestId) {
    return Response.json({ error: "Missing requestId" }, { status: 400 });
  }

  const job = await getVideoJob(requestId);
  if (!job) {
    return Response.json({ error: "Job not found" }, { status: 404 });
  }
  if (job.userId !== session.user.id) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  // Terminal states already recorded in our DB.
  if (job.status === "failed") {
    const credits = await getUserCredits(session.user.id);
    return Response.json({
      status: "failed",
      error: "Generation failed. Your credits were refunded.",
      credits,
    });
  }

  if (job.status === "completed") {
    const videoUrl = await extractVideoUrl(job.responseUrl);
    const credits = await getUserCredits(session.user.id);
    return Response.json({ status: "completed", videoUrl, credits });
  }

  // Otherwise ask fal where things stand.
  try {
    if (!job.statusUrl) {
      return Response.json({ status: "processing" });
    }

    const statusRes = await fetch(job.statusUrl, { headers: falHeaders() });
    if (!statusRes.ok) {
      // Transient; let the client keep polling.
      return Response.json({ status: "processing" });
    }

    const statusData = await statusRes.json();
    const falStatus = String(statusData.status ?? "").toUpperCase();

    if (falStatus === "COMPLETED") {
      const videoUrl = await extractVideoUrl(job.responseUrl);
      if (videoUrl) {
        await markVideoJobCompleted(requestId);
        const credits = await getUserCredits(session.user.id);
        return Response.json({ status: "completed", videoUrl, credits });
      }
      // Completed but produced no video -> treat as failure + refund once.
      const claimed = await claimVideoJobRefund(requestId);
      if (claimed) {
        await addCredits(claimed.userId, claimed.creditCost);
      }
      const credits = await getUserCredits(session.user.id);
      return Response.json({
        status: "failed",
        error: "Generation failed. Your credits were refunded.",
        credits,
      });
    }

    if (falStatus === "IN_QUEUE") {
      return Response.json({ status: "processing", statusLabel: "Queued..." });
    }
    if (falStatus === "IN_PROGRESS") {
      return Response.json({ status: "processing", statusLabel: "Rendering..." });
    }

    // Any explicit error/failure status from fal -> refund once.
    if (falStatus === "ERROR" || falStatus === "FAILED") {
      const claimed = await claimVideoJobRefund(requestId);
      if (claimed) {
        await addCredits(claimed.userId, claimed.creditCost);
      }
      const credits = await getUserCredits(session.user.id);
      return Response.json({
        status: "failed",
        error: "Generation failed. Your credits were refunded.",
        credits,
      });
    }

    return Response.json({ status: "processing" });
  } catch (err) {
    console.error("Video status error:", err);
    // Don't refund on a transient error; let the client keep polling.
    return Response.json({ status: "processing" });
  }
}
