import "server-only";
import { auth } from "@/app/(auth)/auth";
import { getUserCredits } from "@/lib/db/credits";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ credits: 0 });
  }

  const credits = await getUserCredits(session.user.id);
  return Response.json({ credits });
}
