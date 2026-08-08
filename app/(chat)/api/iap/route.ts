// FILE: app/(chat)/api/iap/route.ts
import "server-only";
import { sql } from "drizzle-orm";
import { addCredits } from "@/lib/db/credits";
import { db } from "@/lib/db/queries";

// RevenueCat webhook (v1). Born from Apple's 3.1.1 rejection: iOS
// sells credit packs via In-App Purchase, RevenueCat validates the
// receipt with Apple, then reports the sale here. This route grants
// the credits. Same claim-then-grant idempotency as the Stripe
// webhook: the primary key on transaction_id guarantees a replayed
// event can never grant twice, and a failed grant releases the claim
// and returns 500 so RevenueCat retries until the customer has what
// they paid for. Auth = shared secret in the Authorization header,
// configured identically in RevenueCat's webhook settings and the
// IAP_WEBHOOK_SECRET env var.

const PRODUCT_CREDITS: Record<string, number> = {
  "com.askevo.spotmint.credits.starter": 220,
  "com.askevo.spotmint.credits.power2": 800,
  "com.askevo.spotmint.credits.pro": 2400,
  "com.askevo.spotmint.credits.premium": 5000,
  "com.askevo.spotmint.credits.ultra": 11750,
};

const GRANT_EVENT_TYPES = ["NON_RENEWING_PURCHASE", "INITIAL_PURCHASE"];

async function claimTransaction(transactionId: string, userId: string, productId: string, credits: number): Promise<boolean> {
  const res = await db.execute(sql`INSERT INTO iap_transactions (transaction_id, user_id, product_id, credits) VALUES (${transactionId}, ${userId}, ${productId}, ${credits}) ON CONFLICT (transaction_id) DO NOTHING RETURNING transaction_id`);
  const rows = Array.isArray(res) ? res : (res as { rows: unknown[] }).rows;
  return rows.length > 0;
}

async function releaseClaim(transactionId: string) {
  await db.execute(sql`DELETE FROM iap_transactions WHERE transaction_id = ${transactionId}`);
}

async function findUserIdByEmail(email: string): Promise<string | null> {
  const res = await db.execute(sql`SELECT id FROM "User" WHERE email = ${email} LIMIT 1`);
  const rows = (Array.isArray(res) ? res : (res as { rows: { id: string }[] }).rows) as { id: string }[];
  return rows.length > 0 ? rows[0].id : null;
}

export async function POST(request: Request) {
  const secret = process.env.IAP_WEBHOOK_SECRET ?? "";
  const header = request.headers.get("authorization") ?? "";
  if (!secret || header !== secret) {
    return new Response("Unauthorized", { status: 401 });
  }

  let payload: { event?: { type?: string; app_user_id?: string; product_id?: string; transaction_id?: string; id?: string } };
  try {
    payload = await request.json();
  } catch {
    return new Response("Bad payload", { status: 400 });
  }

  const event = payload.event;
  if (!event || !GRANT_EVENT_TYPES.includes(event.type ?? "")) {
    // Not a purchase event (test pings, transfers, etc) - acknowledge.
    return new Response("ignored", { status: 200 });
  }

  const productId = event.product_id ?? "";
  const credits = PRODUCT_CREDITS[productId] ?? 0;
  const email = event.app_user_id ?? "";
  const transactionId = event.transaction_id ?? event.id ?? "";

  if (!credits || !email || !transactionId || email.startsWith("$RCAnonymous")) {
    console.error("IAP webhook: unusable event", { productId, email, transactionId });
    return new Response("ignored", { status: 200 });
  }

  const userId = await findUserIdByEmail(email);
  if (!userId) {
    console.error("IAP webhook: no user for email", email);
    return new Response("no user", { status: 200 });
  }

  const firstDelivery = await claimTransaction(transactionId, userId, productId, credits);
  if (firstDelivery) {
    try {
      await addCredits(userId, credits);
    } catch (grantErr) {
      console.error("IAP credit grant failed, releasing claim:", grantErr);
      await releaseClaim(transactionId);
      return new Response("grant failed, retry", { status: 500 });
    }
  }

  return new Response("ok", { status: 200 });
}

// ============================================================
// END OF FILE - app/(chat)/api/iap/route.ts (v1 - RevenueCat webhook)
// If you can see this comment, the paste was not truncated.
// ============================================================
