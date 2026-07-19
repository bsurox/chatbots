import "server-only";
import { auth } from "@/app/(auth)/auth";
import { addCredits, deductCredits } from "@/lib/db/credits";

export const maxDuration = 60;

// ElevenLabs rejects very long requests; capping here means we never
// charge for a generation the provider will refuse.
const MAX_CHARS = 5000;

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  let body: { text?: unknown; voiceId?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const text = typeof body.text === "string" ? body.text : "";
  const voiceId = typeof body.voiceId === "string" ? body.voiceId.trim() : "";

  if (!text.trim() || !voiceId || voiceId.length > 64) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (text.length > MAX_CHARS) {
    return Response.json(
      { error: `Text is too long. The limit is ${MAX_CHARS.toLocaleString()} characters.` },
      { status: 400 }
    );
  }

  const characters = text.length;
  const creditCost = Math.max(1, Math.ceil(characters / 20));

  const hasCredits = await deductCredits(userId, creditCost);

  if (!hasCredits) {
    return Response.json({ error: "Not enough credits" }, { status: 402 });
  }

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": process.env.ELEVENLABS_API_KEY ?? "",
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("ElevenLabs error:", error);
      await addCredits(userId, creditCost);
      return Response.json(
        { error: "Voice generation failed. Your credits were refunded." },
        { status: 502 }
      );
    }

    const audioBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(audioBuffer).toString("base64");

    return Response.json({ audio: `data:audio/mpeg;base64,${base64}` });
  } catch (err) {
    console.error("Voice generation error:", err);
    await addCredits(userId, creditCost);
    return Response.json(
      { error: "Voice generation failed. Your credits were refunded." },
      { status: 500 }
    );
  }
}

// ============================================================
// END OF FILE - app/(chat)/api/voice/route.ts (v2 - multilingual + refunds)
// If you can see this comment, the paste was not truncated.
// ============================================================
