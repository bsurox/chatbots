import "server-only";
import { auth } from "@/app/(auth)/auth";
import { deductCredits } from "@/lib/db/credits";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const audio = formData.get("audio") as File;
  const duration = Number(formData.get("duration") ?? 1);

  if (!audio) {
    return Response.json({ error: "No audio file provided" }, { status: 400 });
  }

  const creditCost = Math.max(5, Math.ceil(duration) * 5);

  const hasCredits = await deductCredits(session.user.id, creditCost);

  if (!hasCredits) {
    return Response.json({ error: "Not enough credits" }, { status: 402 });
  }

  const whisperForm = new FormData();
  whisperForm.append("file", audio, "audio.webm");
  whisperForm.append("model", "whisper-1");
  whisperForm.append("response_format", "text");

  const response = await fetch(
    "https://api.openai.com/v1/audio/transcriptions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: whisperForm,
    }
  );

  if (!response.ok) {
    const error = await response.text();
    console.error("Whisper error:", error);
    return Response.json({ error: "Transcription failed" }, { status: 500 });
  }

  const text = await response.text();
  return Response.json({ text });
}
