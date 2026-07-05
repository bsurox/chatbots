import "server-only";
import { auth } from "@/app/(auth)/auth";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const response = await fetch("https://api.elevenlabs.io/v1/voices", {
    headers: {
      "xi-api-key": process.env.ELEVENLABS_API_KEY ?? "",
    },
  });

  if (!response.ok) {
    return Response.json({ error: "Failed to fetch voices" }, { status: 500 });
  }

  const data = await response.json();

  const voices = data.voices.map((v: { voice_id: string; name: string; category: string; labels: Record<string, string> }) => ({
    id: v.voice_id,
    name: v.name,
    category: v.category,
    accent: v.labels?.accent ?? "",
    gender: v.labels?.gender ?? "",
    age: v.labels?.age ?? "",
    description: v.labels?.description ?? "",
  }));

  return Response.json({ voices });
}
