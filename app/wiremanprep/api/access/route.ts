// FILE: app/wiremanprep/api/access/route.ts
import "server-only";
import { auth } from "@/app/(auth)/auth";
import { guestRegex } from "@/lib/constants";
import {
  hasWiremanAccess,
  hasWiremanJourneymanAccess,
  hasWiremanResidentialAccess,
} from "@/lib/db/foreman";

// The one question every WiremanPrep surface asks: who is this,
// and did they buy the electrical course? Same doctrine as the
// ForemanPrep access route: guests count as not signed in (a
// throwaway guest row cannot own a purchase), client pages fetch
// this once on mount and gate their UI from the answer, and the
// real enforcement for paid features lives server-side in the
// routes that do the work. "paid" here still means the MASTER
// electrical course specifically (the wm flag) so every existing
// surface keeps working unchanged; v2 adds "wj" (Journeyman) and
// "wr" (Residential) alongside it - three independent flags off
// the shared plan column that lib/db/foreman.ts v5 decodes, so a
// ForemanPrep-only customer is NOT paid on this site (and the
// other way around), and owning one electrical level never
// implies another.

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    const email = session?.user?.email ?? "";
    const loggedIn = Boolean(userId) && !guestRegex.test(email);
    if (!loggedIn || !userId) {
      return Response.json({ loggedIn: false, paid: false, wj: false, wr: false });
    }
    const [paid, wj, wr] = await Promise.all([
      hasWiremanAccess(userId),
      hasWiremanJourneymanAccess(userId),
      hasWiremanResidentialAccess(userId),
    ]);
    return Response.json({ loggedIn: true, paid, wj, wr });
  } catch (err) {
    console.error("WiremanPrep access check error:", err);
    return Response.json({ loggedIn: false, paid: false, wj: false, wr: false });
  }
}

// -----------------------------------------------------------
// END OF FILE - app/wiremanprep/api/access/route.ts (v2 - adds
// wj + wr flags beside paid; one answer for all three products)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
