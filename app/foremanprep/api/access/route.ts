// FILE: app/foremanprep/api/access/route.ts
import "server-only";
import { auth } from "@/app/(auth)/auth";
import { guestRegex } from "@/lib/constants";
import { hasBlAccess, hasForemanAccess } from "@/lib/db/foreman";

// The one question every ForemanPrep surface asks: who is this,
// and what did they buy? Guests count as not signed in - a
// throwaway guest row cannot own a purchase. Client pages fetch
// this once on mount and gate their UI from the answer; the real
// enforcement for paid features lives server-side in the routes
// that do the work.
// v2: the answer now carries BOTH products. "paid" keeps its
// original meaning (ForemanPrep Full Access - the GC exam) so
// every existing page reads exactly what it always read; "bl" is
// new and answers for Business & Law prep. Bundle owners get true
// on both.

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    const email = session?.user?.email ?? "";
    const loggedIn = Boolean(userId) && !guestRegex.test(email);
    if (!loggedIn || !userId) {
      return Response.json({ loggedIn: false, paid: false, bl: false });
    }
    const paid = await hasForemanAccess(userId);
    const bl = await hasBlAccess(userId);
    return Response.json({ loggedIn: true, paid, bl });
  } catch (err) {
    console.error("ForemanPrep access check error:", err);
    return Response.json({ loggedIn: false, paid: false, bl: false });
  }
}

// -----------------------------------------------------------
// END OF FILE - app/foremanprep/api/access/route.ts (v2 - adds
// the bl flag for Business & Law prep)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
