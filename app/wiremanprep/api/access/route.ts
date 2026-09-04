// FILE: app/wiremanprep/api/access/route.ts
import "server-only";
import { auth } from "@/app/(auth)/auth";
import { guestRegex } from "@/lib/constants";
import { hasWiremanAccess } from "@/lib/db/foreman";

// The one question every WiremanPrep surface asks: who is this,
// and did they buy the electrical course? Same doctrine as the
// ForemanPrep access route: guests count as not signed in (a
// throwaway guest row cannot own a purchase), client pages fetch
// this once on mount and gate their UI from the answer, and the
// real enforcement for paid features lives server-side in the
// routes that do the work. "paid" here means WiremanPrep
// electrical access specifically - reads the wm flag that
// lib/db/foreman.ts v4 decodes from the shared plan column, so a
// ForemanPrep-only customer is NOT paid on this site (and the
// other way around).

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    const email = session?.user?.email ?? "";
    const loggedIn = Boolean(userId) && !guestRegex.test(email);
    if (!loggedIn || !userId) {
      return Response.json({ loggedIn: false, paid: false });
    }
    const paid = await hasWiremanAccess(userId);
    return Response.json({ loggedIn: true, paid });
  } catch (err) {
    console.error("WiremanPrep access check error:", err);
    return Response.json({ loggedIn: false, paid: false });
  }
}

// -----------------------------------------------------------
// END OF FILE - app/wiremanprep/api/access/route.ts (v1 - the
// wm entitlement answer for every WiremanPrep surface)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
