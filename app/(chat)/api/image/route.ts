import "server-only";
import sharp from "sharp";
import { auth } from "@/app/(auth)/auth";
import { addCredits, deductCredits } from "@/lib/db/credits";

export const maxDuration = 60;

const CREDIT_COSTS = {
  core: 8,
  ultra: 18,
};

const MIN_DIM = 512;
const MAX_DIM = 2048;

// Aspect ratios the Stability core/ultra endpoints accept. The route
// generates at the closest one, then crops and resizes to the exact
// requested pixels.
const SUPPORTED_RATIOS: { id: string; value: number }[] = [
  { id: "21:9", value: 21 / 9 },
  { id: "16:9", value: 16 / 9 },
  { id: "3:2", value: 3 / 2 },
  { id: "5:4", value: 5 / 4 },
  { id: "1:1", value: 1 },
  { id: "4:5", value: 4 / 5 },
  { id: "2:3", value: 2 / 3 },
  { id: "9:16", value: 9 / 16 },
  { id: "9:21", value: 9 / 21 },
];

function clampDimension(value: unknown): number {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) {
    return 1024;
  }
  return Math.min(MAX_DIM, Math.max(MIN_DIM, Math.round(n)));
}

function closestAspectRatio(width: number, height: number): string {
  const target = Math.log(width / height);
  let best = SUPPORTED_RATIOS[0];
  let bestDiff = Number.POSITIVE_INFINITY;
  for (const ratio of SUPPORTED_RATIOS) {
    const diff = Math.abs(target - Math.log(ratio.value));
    if (diff < bestDiff) {
      bestDiff = diff;
      best = ratio;
    }
  }
  return best.id;
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  let body: { prompt?: unknown; width?: unknown; height?: unknown; quality?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
  if (!prompt) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const width = clampDimension(body.width);
  const height = clampDimension(body.height);
  const quality = body.quality === "ultra" ? "ultra" : "core";
  const creditCost = quality === "ultra" ? CREDIT_COSTS.ultra : CREDIT_COSTS.core;

  const hasCredits = await deductCredits(userId, creditCost);

  if (!hasCredits) {
    return Response.json({ error: "Not enough credits" }, { status: 402 });
  }

  try {
    const formData = new FormData();
    formData.append("prompt", prompt);
    formData.append("output_format", "png");
    formData.append("aspect_ratio", closestAspectRatio(width, height));

    const response = await fetch(
      `https://api.stability.ai/v2beta/stable-image/generate/${quality}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
          Accept: "image/*",
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("Stability AI error:", error);
      await addCredits(userId, creditCost);
      return Response.json(
        { error: "Image generation failed. Your credits were refunded." },
        { status: 502 }
      );
    }

    const generated = Buffer.from(await response.arrayBuffer());

    // Exact-fit: center-crop and resize the generated image to the
    // requested pixels. If the resize step itself fails, return the raw
    // generated image rather than losing a paid generation.
    let output = generated;
    try {
      output = await sharp(generated)
        .resize(width, height, { fit: "cover", position: "centre" })
        .png()
        .toBuffer();
    } catch (resizeErr) {
      console.error("Resize error, returning raw image:", resizeErr);
    }

    const base64 = output.toString("base64");
    return Response.json({ image: `data:image/png;base64,${base64}` });
  } catch (err) {
    console.error("Image generation error:", err);
    await addCredits(userId, creditCost);
    return Response.json(
      { error: "Image generation failed. Your credits were refunded." },
      { status: 500 }
    );
  }
}

// ============================================================
// END OF FILE - app/(chat)/api/image/route.ts (v2 - real sizes + refunds)
// If you can see this comment, the paste was not truncated.
// ============================================================
