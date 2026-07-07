import "server-only";
import { auth } from "@/app/(auth)/auth";
import { addCredits, deductCredits, getUserCredits } from "@/lib/db/credits";
import { createVideoJob } from "@/lib/db/video-jobs";

type TierId = "fast" | "standard" | "premium" | "cinematic";

type TierConfig = {
  modelId: string;
  credits: Record<number, number>;
  buildInput: (prompt: string, seconds: number) => Record<string, unknown>;
};

const VIDEO_CONFIG: Record<TierId, TierConfig> = {
  fast: {
    modelId: "fal-ai/kling-video/v2.5-turbo/pro/text-to-video",
    credits: { 5: 75, 10: 150 },
    buildInput: (prompt, seconds) => ({ prompt, duration: String(seconds), aspect_ratio: "16:9" }),
  },
  standard: {
    modelId: "fal-ai/kling-video/v2.6/pro/text-to-video",
    credits: { 5: 110, 10: 220 },
    buildInput: (prompt, seconds) => ({ prompt, duration: String(seconds), aspect_ratio: "16:9", generate_audio: false }),
  },
  premium: {
    modelId: "fal-ai/kling-video/v2.6/pro/text-to-video",
    credits: { 5: 250, 10: 500 },
    buildInput: (prompt, seconds) => ({ prompt, duration: String(seconds), aspect_ratio: "16:9", generate_audio: true }),
  },
  cinematic: {
    modelId: "fal-ai/veo3",
    credits: { 8: 375 },
    buildInput: (prompt, seconds) => ({ prompt, duration: `${seconds}s`, aspect_ratio: "16:9", resolution: "720p", generate_audio: true }),
  },
};

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { prompt, tier, length } = await request.json();

  if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
    return Response.json({ error: "Missing prompt" }, { status: 400 });
  }

  const config = VIDEO_CONFIG[tier as TierId];
  if (!config) {
    return Response.json({ error: "Invalid tier" }, { status: 400 });
  }

  const seconds = Number(length);
  const creditCost = config.credits[seconds];
  if (!creditCost) {
    return Response.json({ error: "Invalid length for this tier" }, { status: 400 });
  }

  const hasCredits = await deductCredits(session.user.id, creditCost);
  if (!hasCredits) {
    return Response.json({ error: "Not enough credits" }, { status: 402 });
  }

  try {
    const submitRes = await fetch(`https://queue.fal.run/${config.modelId}`, {
      method: "POST",
      headers: {
        Authorization: `Key ${process.env.FAL_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(config.buildInput(prompt.trim(), seconds)),
    });

    if (!submitRes.ok) {
      const errText = await submitRes.text();
      console.error("fal submit error:", errText);
      await addCredits(session.user.id, creditCost);
      return Response.json({ error: "Could not start video generation." }, { status: 502 });
    }

    const submitData = await submitRes.json();
    const requestId: string | undefined = submitData.request_id ?? submitData.requestId;

    if (!requestId) {
      await addCredits(session.user.id, creditCost);
      return Response.json({ error: "Could not start video generation." }, { status: 502 });
    }

    await createVideoJob({
      requestId,
      userId: session.user.id,
      creditCost,
      statusUrl: submitData.status_url ?? null,
      responseUrl: submitData.response_url ?? null,
    });

    const credits = await getUserCredits(session.user.id);
    return Response.json({ requestId, credits });
  } catch (err) {
    console.error("Video start error:", err);
    await addCredits(session.user.id, creditCost);
    return Response.json({ error: "Something went wrong starting the video." }, { status: 500 });
  }
}
