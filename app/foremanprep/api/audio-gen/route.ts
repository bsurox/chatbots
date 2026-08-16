// FILE: app/foremanprep/api/audio-gen/route.ts
import "server-only";
import { put } from "@vercel/blob";
import { getQuestion } from "@/lib/foremanprep/questions";

export const maxDuration = 60;

// ForemanPrep audio generator (v1) - the one-time factory behind
// the Listen feature. POSTs here turn a question into spoken audio
// via ElevenLabs (same REST pattern as the AskEvo voice tool) and
// park the mp3 in Vercel Blob at a deterministic path, so the
// player can address every file by question id with no database.
// kind "q" = question + choices; kind "e" = answer + explanation.
// Gated by FOREMAN_AUDIO_KEY (set in Vercel env) - this route
// spends ElevenLabs characters, so only the admin page with the
// key can run it. Voice: ElevenLabs stock "Adam", overridable per
// request for testing without a redeploy.

const DEFAULT_VOICE = "pNInz6obpgDQGcFmaJgB";
const LETTERS = ["A", "B", "C", "D"];

function questionText(id: string): string | null {
  const q = getQuestion(id);
  if (!q) return null;
  const choices = q.choices
    .map((c, i) => `Option ${LETTERS[i]}: ${c}.`)
    .join(" ");
  return `${q.q} ${choices}`;
}

function explainText(id: string): string | null {
  const q = getQuestion(id);
  if (!q) return null;
  const letter = LETTERS[q.answer] ?? "";
  return `The correct answer is ${letter}: ${q.choices[q.answer]}. ${q.explain} Reference: ${q.cite}.`;
}

export async function POST(request: Request) {
  let body: { key?: unknown; kind?: unknown; id?: unknown; voiceId?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const key = typeof body.key === "string" ? body.key : "";
  const adminKey = process.env.FOREMAN_AUDIO_KEY ?? "";
  if (!adminKey || key !== adminKey) {
    return Response.json({ error: "Not authorized." }, { status: 401 });
  }

  const kind = body.kind === "q" || body.kind === "e" ? body.kind : null;
  const id = typeof body.id === "string" ? body.id.trim() : "";
  if (!kind || !id || id.length > 40) {
    return Response.json({ error: "Missing kind or id." }, { status: 400 });
  }

  const text = kind === "q" ? questionText(id) : explainText(id);
  if (!text) {
    return Response.json({ error: `Unknown question id: ${id}` }, { status: 404 });
  }

  const voiceId =
    typeof body.voiceId === "string" && body.voiceId.trim() && body.voiceId.length <= 64
      ? body.voiceId.trim()
      : DEFAULT_VOICE;

  try {
    const tts = await fetch(
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

    if (!tts.ok) {
      const error = await tts.text();
      console.error("ForemanPrep audio-gen ElevenLabs error:", error);
      return Response.json(
        { error: "Voice generation failed - check the ElevenLabs quota." },
        { status: 502 }
      );
    }

    const audio = Buffer.from(await tts.arrayBuffer());
    const blob = await put(`foremanprep-audio/${kind}-${id}.mp3`, audio, {
      access: "public",
      addRandomSuffix: false,
      contentType: "audio/mpeg",
    });

    return Response.json({ ok: true, url: blob.url, chars: text.length });
  } catch (err) {
    console.error("ForemanPrep audio-gen error:", err);
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}

// -----------------------------------------------------------
// END OF FILE - app/foremanprep/api/audio-gen/route.ts (v1 -
// question + explanation audio factory)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
