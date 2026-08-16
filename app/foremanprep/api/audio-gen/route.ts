// FILE: app/foremanprep/api/audio-gen/route.ts
import "server-only";
import { put } from "@vercel/blob";
import { getQuestion } from "@/lib/foremanprep/questions";
import { getLesson } from "@/lib/foremanprep/lessons";

export const maxDuration = 300;

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
// v2: the blob store is connected with the FPMEDIA env prefix, so
// the write token is FPMEDIA_READ_WRITE_TOKEN and gets passed to
// put() explicitly; a missing token now fails with a clear
// message instead of a generic 500.
// v3: kind "lesson" voices a drive-time lesson script (id = the
// domain key, from lib/foremanprep/lessons). Long scripts are
// split at paragraph breaks into chunks under the ElevenLabs
// request ceiling and the mp3 buffers concatenated - same-codec
// MPEG frames chain cleanly. maxDuration raised for the longer
// lesson generations.

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

// ElevenLabs rejects very long requests; lessons get split at
// paragraph boundaries into requests under this ceiling.
const CHUNK_LIMIT = 4500;

function chunkScript(script: string): string[] {
  const paras = script.split("\n\n");
  const chunks: string[] = [];
  let current = "";
  for (const p of paras) {
    const joined = current ? `${current}\n\n${p}` : p;
    if (joined.length > CHUNK_LIMIT && current) {
      chunks.push(current);
      current = p;
    } else {
      current = joined;
    }
  }
  if (current) chunks.push(current);
  return chunks;
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

  const kind =
    body.kind === "q" || body.kind === "e" || body.kind === "lesson" ? body.kind : null;
  const id = typeof body.id === "string" ? body.id.trim() : "";
  if (!kind || !id || id.length > 40) {
    return Response.json({ error: "Missing kind or id." }, { status: 400 });
  }

  const text =
    kind === "q"
      ? questionText(id)
      : kind === "e"
        ? explainText(id)
        : getLesson(id)?.script ?? null;
  if (!text) {
    return Response.json({ error: `Unknown ${kind === "lesson" ? "lesson" : "question"} id: ${id}` }, { status: 404 });
  }

  const voiceId =
    typeof body.voiceId === "string" && body.voiceId.trim() && body.voiceId.length <= 64
      ? body.voiceId.trim()
      : DEFAULT_VOICE;

  const blobToken = process.env.FPMEDIA_READ_WRITE_TOKEN ?? "";
  if (!blobToken) {
    return Response.json(
      { error: "Storage not configured - FPMEDIA_READ_WRITE_TOKEN is missing." },
      { status: 500 }
    );
  }

  try {
    const pieces: Buffer[] = [];
    for (const chunk of chunkScript(text)) {
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
            text: chunk,
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

      pieces.push(Buffer.from(await tts.arrayBuffer()));
    }

    const audio = Buffer.concat(pieces);
    const blob = await put(`foremanprep-audio/${kind}-${id}.mp3`, audio, {
      access: "public",
      addRandomSuffix: false,
      contentType: "audio/mpeg",
      token: blobToken,
    });

    return Response.json({ ok: true, url: blob.url, chars: text.length });
  } catch (err) {
    console.error("ForemanPrep audio-gen error:", err);
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}

// -----------------------------------------------------------
// END OF FILE - app/foremanprep/api/audio-gen/route.ts (v3 -
// lesson kind + chunked long scripts)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
