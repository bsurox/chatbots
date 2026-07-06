import { auth } from "@/app/(auth)/auth";
import { getUser } from "@/lib/db/queries";

export async function GET() {
  const session = await auth();

  const email = session?.user?.email ?? null;

  if (!email) {
    return Response.json({ name: null, email: null });
  }

  try {
    const [dbUser] = await getUser(email);
    return Response.json({
      name: dbUser?.name ?? null,
      email: dbUser?.email ?? email,
    });
  } catch {
    return Response.json({ name: null, email });
  }
}
