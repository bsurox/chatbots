import "server-only";
import { parseBuffer } from "music-metadata";
import { auth } from "@/app/(auth)/auth";
import { addCredits, deductCredits } from "@/lib/db/credits";

export const maxDuration = 300;

const CREDITS_PER_MINUTE = 3;
const MIN_CREDITS = 3;
const MAX_FILE_BYTES = 25 * 1024 * 1024; // Whisper's hard upload limit.
// Upfront estimate fallback when no duration is known from the file or the
// client: assume roughly 1MB per minute (128kbps audio).
const FALLBACK_BYTES_PER_MINUTE = 1000000;

function costForSeconds(seconds: number): number {
  return Math.max(MIN_CREDITS, Math.ceil(seconds / 60) * CREDITS_PER_MINUTE);
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ error: "Invalid upload." }, { status: 400 });
  }

  const audioEntry = formData.get("audio");
  if (!(audioEntry instanceof File) || audioEntry.size === 0) {
    return Response.json({ error: "No audio file provided" }, { status: 400 });
  }
  const audio = audioEntry;
  if (audio.size > MAX_FILE_BYTES) {
    return Response.json({ error: "Audio file is too large. The limit is 25MB." }, { status: 400 });
  }

  // Duration for the upfront charge, in order of trust: parsed from the file
  // itself, then the client-reported recording timer, then a size-based guess.
  // Final billing always settles against the duration Whisper reports back.
  let knownSeconds: number | null = null;
  try {
    const bytes = new Uint8Array(await audio.arrayBuffer());
    const meta = await parseBuffer(bytes);
    const parsed = meta.format.duration;
    if (typeof parsed === "number" && Number.isFinite(parsed) && parsed > 0) {
      knownSeconds = parsed;
    }
  } catch {
    // Unparseable container (common for browser recordings) - fall through.
  }

  if (knownSeconds === null) {
    const clientSeconds = Number(formData.get("duration"));
    if (Number.isFinite(clientSeconds) && clientSeconds > 0) {
      knownSeconds = clientSeconds;
    }
  }
  if (knownSeconds === null) {
    knownSeconds = Math.ceil(audio.size / FALLBACK_BYTES_PER_MINUTE) * 60;
  }

  const estimatedCost = costForSeconds(knownSeconds);
  const hasCredits = await deductCredits(userId, estimatedCost);
  if (!hasCredits) {
    return Response.json({ error: "Not enough credits" }, { status: 402 });
  }

  try {
    const whisperForm = new FormData();
    whisperForm.append("file", audio, audio.name || "audio.webm");
    whisperForm.append("model", "whisper-1");
    whisperForm.append("response_format", "verbose_json");

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
      await addCredits(userId, estimatedCost);
      return Response.json(
        { error: "Transcription failed. Your credits were refunded." },
        { status: 502 }
      );
    }

    const data = await response.json();
    const text = typeof data.text === "string" ? data.text : "";

    // Settle against the duration Whisper actually processed.
    let charged = estimatedCost;
    const actualSeconds = Number(data.duration);
    if (Number.isFinite(actualSeconds) && actualSeconds > 0) {
      const actualCost = costForSeconds(actualSeconds);
      if (actualCost > estimatedCost) {
        const settled = await deductCredits(userId, actualCost - estimatedCost);
        if (settled) {
          charged = actualCost;
        }
        // If the balance cannot cover the difference we still deliver the
        // transcript; the 25MB cap bounds the exposure.
      } else if (actualCost < estimatedCost) {
        await addCredits(userId, estimatedCost - actualCost);
        charged = actualCost;
      }
    }

    return Response.json({ text, creditsCharged: charged });
  } catch (err) {
    console.error("Transcription error:", err);
    await addCredits(userId, estimatedCost);
    return Response.json(
      { error: "Transcription failed. Your credits were refunded." },
      { status: 500 }
    );
  }
}

// ============================================================
// END OF FILE - app/(chat)/api/transcribe/route.ts (v3 - real billing)
// If you can see this comment, the paste was not truncated.
// ============================================================
