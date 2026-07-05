import { getCapabilities, chatModels } from "@/lib/ai/models";

export async function GET() {
  const headers = {
    "Cache-Control": "no-store, max-age=0",
  };
  const capabilities = await getCapabilities();
  return Response.json({ capabilities, models: chatModels }, { headers });
}
