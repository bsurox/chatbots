// FILE: app/foremanprep/api/access/route.ts
import "server-only";
import { auth } from "@/app/(auth)/auth";
import { guestRegex } from "@/lib/constants";
import { hasForemanAccess } from "@/lib/db/foreman";

// The one question every ForemanPrep surface asks: who is this,
// and did they buy Full Access? Guests count as not signed in -
// a throwaway guest row cannot own a purchase. Client pages fetch
// this once on mount and gate their UI from the answer; the real
// enforcement for paid features lives server-side in the routes
// that do the work.

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    const email = session?.user?.email ?? "";
    const loggedIn = Boolean(userId) && !guestRegex.test(email);
    if (!loggedIn || !userId) {
      return Response.json({ loggedIn: false, paid: false });
    }
    const paid = await hasForemanAccess(userId);
    return Response.json({ loggedIn: true, paid });
  } catch (err) {
    console.error("ForemanPrep access check error:", err);
    return Response.json({ loggedIn: false, paid: false });
  }
}

// -----------------------------------------------------------
// END OF FILE - app/foremanprep/api/access/route.ts (v1)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
