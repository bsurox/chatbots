import "server-only";
import { sql } from "drizzle-orm";
import Stripe from "stripe";
import { addCredits } from "@/lib/db/credits";
import { db } from "@/lib/db/queries";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? "";

// Claims a checkout session exactly once. Stripe retries webhooks and can
// deliver the same event more than once; the primary key on session_id
// guarantees credits are only granted for the first delivery.
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
    const credits = Number(session.metadata?.credits ?? 0);

    if (userId && credits > 0 && session.payment_status === "paid") {
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
// END OF FILE - app/(chat)/api/webhook/route.ts (v2 - idempotent)
// If you can see this comment, the paste was not truncated.
// ============================================================
