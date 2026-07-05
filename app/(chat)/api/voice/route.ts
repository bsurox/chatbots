import "server-only";
import { auth } from "@/app/(auth)/auth";
import { deductCredits } from "@/lib/db/credits";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { text, voiceId } = await request.json();

  if (!text || !voiceId) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const characters = text.length;
  const creditCost = Math.max(1, Math.ceil(characters / 20));

  const hasCredits = await deductCredits(session.user.id, creditCost);

  if (!hasCredits) {
    return Response.json({ error: "Not enough credits" }, { status: 402 });
  }

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY ?? "",
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_monolingual_v1",
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
    return Response.json({ error: "Voice generation failed" }, { status: 500 });
  }

  const audioBuffer = await response.arrayBuffer();
  const base64 = Buffer.from(audioBuffer).toString("base64");

  return Response.json({ audio: `data:audio/mpeg;base64,${base64}` });
}
