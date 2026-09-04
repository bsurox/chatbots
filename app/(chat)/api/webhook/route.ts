// FILE: app/(chat)/api/webhook/route.ts
import "server-only";
import { sql } from "drizzle-orm";
import Stripe from "stripe";
import { addCredits } from "@/lib/db/credits";
import { grantForemanAccess } from "@/lib/db/foreman";
import { db } from "@/lib/db/queries";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? "";

// Claims a checkout session exactly once. Stripe retries webhooks and can
// deliver the same event more than once; the primary key on session_id
// guarantees a grant only happens for the first delivery. ForemanPrep
// purchases claim with credits=0 - the row is the receipt, not a grant
// amount.
// v4: Business & Law purchases. Checkout marks them with metadata
// foremanprep_bl = "1"; the grant runs through the same claim/release
// discipline and lands as product "bl" (the access layer merges it to
// "bundle" for buyers who already own Full Access, and vice versa).
// v5: bundle purchases (both products, one checkout). Metadata
// foremanprep_bundle = "1" grants product "bundle" - both
// entitlements in a single claim-guarded write.
// v6: WiremanPrep purchases. Checkout marks them with metadata
// wiremanprep = "1"; the grant runs through the same claim/release
// discipline and lands as product "wm" (lib/db/foreman.ts v4
// merges it into whatever the account already owns - "full+wm",
// "bundle+wm", or plain "wm").

async function claimSession(sessionId: string, userId: string, credits: number): Promise<boolean> {
  const res = await db.execute(sql`INSERT INTO stripe_events (session_id, user_id, credits) VALUES (${sessionId}, ${userId}, ${credits}) ON CONFLICT (session_id) DO NOTHING RETURNING session_id`);
  const rows = Array.isArray(res) ? res : (res as { rows: unknown[] }).rows;
  return rows.length > 0;
}

async function releaseClaim(sessionId: string) {
  await db.execute(sql`DELETE FROM stripe_events WHERE session_id = ${sessionId}`);
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature") ?? "";

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    return new Response("Webhook signature verification failed", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const isForemanPrep = session.metadata?.foremanprep === "1";
    const isForemanBl = session.metadata?.foremanprep_bl === "1";
    const isBundle = session.metadata?.foremanprep_bundle === "1";
    const isWireman = session.metadata?.wiremanprep === "1";
    const credits = Number(session.metadata?.credits ?? 0);

    if (userId && (isForemanPrep || isForemanBl || isBundle || isWireman) && session.payment_status === "paid") {
      // ForemanPrep products - Full Access or Business & Law. Same
      // claim/release discipline as credits: claim first, grant
      // second, release and 500 on grant failure so Stripe retries
      // and the buyer never pays for nothing.
      const firstDelivery = await claimSession(session.id, userId, 0);
      if (firstDelivery) {
        try {
          await grantForemanAccess({
            userId,
            source: "stripe",
            product: isWireman
              ? "wm"
              : isBundle
                ? "bundle"
                : isForemanBl
                  ? "bl"
                  : "gc",
          });
        } catch (grantErr) {
          console.error("ForemanPrep access grant failed, releasing claim:", grantErr);
          await releaseClaim(session.id);
          return new Response("Access grant failed, retry", { status: 500 });
        }
      }
    } else if (userId && credits > 0 && session.payment_status === "paid") {
      const firstDelivery = await claimSession(session.id, userId, credits);
      if (firstDelivery) {
        try {
          await addCredits(userId, credits);
        } catch (grantErr) {
          // Grant failed after claiming: release the claim and ask Stripe
          // to retry, so the customer never pays without receiving credits.
          console.error("Credit grant failed, releasing claim:", grantErr);
          await releaseClaim(session.id);
          return new Response("Credit grant failed, retry", { status: 500 });
        }
      }
    }
  }

  return new Response("ok", { status: 200 });
}

// ============================================================
// END OF FILE - app/(chat)/api/webhook/route.ts (v6 - WiremanPrep
// purchases grant product "wm" through the same claim discipline)
// If you can see this comment, the paste was not truncated.
// ============================================================
