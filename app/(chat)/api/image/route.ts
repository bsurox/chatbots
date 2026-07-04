import "server-only";
import { auth } from "@/app/(auth)/auth";
import { deductCredits } from "@/lib/db/credits";

const CREDIT_COSTS = {
  core: 8,
  ultra: 18,
};

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { prompt, width, height, quality } = await request.json();

  if (!prompt || !width || !height) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const creditCost = quality === "ultra" ? CREDIT_COSTS.ultra : CREDIT_COSTS.core;

  const hasCredits = await deductCredits(session.user.id, creditCost);

  if (!hasCredits) {
    return Response.json({ error: "Not enough credits" }, { status: 402 });
  }

  const formData = new FormData();
  formData.append("prompt", prompt);
  formData.append("output_format", "png");
  formData.append("width", String(width));
  formData.append("height", String(height));

  const model = quality === "ultra" ? "ultra" : "core";

  const response = await fetch(
    `https://api.stability.ai/v2beta/stable-image/generate/${model}`,
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
    return Response.json({ error: "Image generation failed" }, { status: 500 });
  }

  const imageBuffer = await response.arrayBuffer();
  const base64 = Buffer.from(imageBuffer).toString("base64");

  return Response.json({ image: `data:image/png;base64,${base64}` });
}
