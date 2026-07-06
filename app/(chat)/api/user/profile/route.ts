import { auth } from "@/app/(auth)/auth";
import { getUser } from "@/lib/db/queries";

export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return Response.json({ name: null });
  }

  try {
    const [dbUser] = await getUser(session.user.email);
    return Response.json({ name: dbUser?.name ?? null });
  } catch {
    return Response.json({ name: null });
  }
}
