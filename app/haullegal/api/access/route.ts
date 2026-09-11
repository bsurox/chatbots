// FILE: app/haullegal/api/access/route.ts
import "server-only";
import { auth } from "@/app/(auth)/auth";
import { guestRegex } from "@/lib/constants";
import { getHaulAccess } from "@/lib/db/haul";

// The one question every HaulLegal surface asks (v1): who is this,
// did they buy the walkthrough, and is Stay Legal on? Same doctrine
// as the ForemanPrep and WiremanPrep access routes: guests count as
// not signed in (a throwaway guest row cannot own a purchase),
// client pages fetch this once on mount and gate their UI from the
// answer, and the real enforcement for paid features lives
// server-side in the routes that do the work. "paid" means the
// walkthrough (the same key every landing/start page reads); "sub"
// is the Stay Legal subscription (trialing or active, or paid
// through a future date); subStatus and periodEnd feed the account
// page. Reads lib/db/haul.ts - never the exam-prep tables, so a
// ForemanPrep or WiremanPrep customer is NOT paid here.

export async function GET() {
  const empty = { loggedIn: false, paid: false, sub: false, subStatus: "none", periodEnd: null };
  try {
    const session = await auth();
    const userId = session?.user?.id;
    const email = session?.user?.email ?? "";
    const loggedIn = Boolean(userId) && !guestRegex.test(email);
    if (!loggedIn || !userId) {
      return Response.json(empty);
    }
    const access = await getHaulAccess(userId);
    return Response.json({
      loggedIn: true,
      paid: access.walkthrough,
      sub: access.sub,
      subStatus: access.subStatus,
      periodEnd: access.periodEnd ? access.periodEnd.toISOString() : null,
    });
  } catch (err) {
    console.error("HaulLegal access check error:", err);
    return Response.json(empty);
  }
}

// -----------------------------------------------------------
// END OF FILE - app/haullegal/api/access/route.ts (v1 - paid =
// walkthrough, sub = Stay Legal, status + paid-through date)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
