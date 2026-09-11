// FILE: app/haullegal/api/webhook/route.ts
import "server-only";
import { sql } from "drizzle-orm";
import Stripe from "stripe";
import {
  findHaulUserByCustomer,
  findHaulUserBySubscription,
  grantHaulWalkthrough,
  upsertHaulSubscription,
} from "@/lib/db/haul";
import { db } from "@/lib/db/queries";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");
const webhookSecret = process.env.HAUL_STRIPE_WEBHOOK_SECRET ?? "";

// HaulLegal's OWN Stripe webhook endpoint (v2 - the BUNDLE: checkout
// v2 sells the walkthrough and the Stay Legal trial in one session
// with hlProduct "bundle"; on completion this grants the walkthrough
// AND records the trialing subscription under the same claim. The
// old "walkthrough" and "staylegal" branches stay for the
// walkthrough-alone and calendar-alone sessions.)
// v1 notes: Registered in the
// Stripe dashboard as a second endpoint (https://haullegal.com/
// haullegal/api/webhook) with its own signing secret in the
// HAUL_STRIPE_WEBHOOK_SECRET env var, subscribed to:
//   checkout.session.completed, invoice.paid,
//   customer.subscription.updated, customer.subscription.deleted
// Why its own endpoint: the shared app/(chat)/api/webhook is the
// exam-prep money path and only knows one-time purchases; this
// island adds a subscription, and keeping its events here means
// the shared file is never edited for HaulLegal. The shared
// endpoint still receives HaulLegal checkout sessions (Stripe
// fans out to every endpoint) and ignores them - no foremanprep
// or credits metadata, so it falls through and returns ok.
// Doctrine carried over: checkout sessions are claimed exactly
// once through the shared stripe_events table (claim first, grant
// second, release + 500 on failure so Stripe retries and nobody
// pays for nothing). Renewal and cancellation events are plain
// idempotent upserts of the subscription's current state.
// API-version tolerance: the paid-through timestamp lives on the
// subscription in older Stripe API versions and on its first item
// in newer ones; the invoice's subscription id likewise moved. Both
// are read defensively so the account's API version does not
// matter.

async function claimSession(sessionId: string, userId: string): Promise<boolean> {
  const res = await db.execute(sql`INSERT INTO stripe_events (session_id, user_id, credits) VALUES (${sessionId}, ${userId}, 0) ON CONFLICT (session_id) DO NOTHING RETURNING session_id`);
  const rows = Array.isArray(res) ? res : (res as { rows: unknown[] }).rows;
  return rows.length > 0;
}

async function releaseClaim(sessionId: string) {
  await db.execute(sql`DELETE FROM stripe_events WHERE session_id = ${sessionId}`);
}

function idOf(value: unknown): string | null {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && typeof (value as { id?: unknown }).id === "string") {
    return (value as { id: string }).id;
  }
  return null;
}

function periodEndOf(sub: Stripe.Subscription): Date | null {
  const loose = sub as unknown as { current_period_end?: number; items?: { data?: Array<{ current_period_end?: number }> } };
  const secs = loose.current_period_end ?? loose.items?.data?.[0]?.current_period_end;
  return typeof secs === "number" ? new Date(secs * 1000) : null;
}

async function userIdFor(sub: Stripe.Subscription): Promise<string | null> {
  const fromMeta = sub.metadata?.userId;
  if (typeof fromMeta === "string" && fromMeta.length > 0) return fromMeta;
  const bySub = await findHaulUserBySubscription(sub.id);
  if (bySub) return bySub;
  const customerId = idOf(sub.customer);
  return customerId ? await findHaulUserByCustomer(customerId) : null;
}

async function syncSubscription(sub: Stripe.Subscription, statusOverride?: string) {
  const userId = await userIdFor(sub);
  if (!userId) {
    console.error("HaulLegal webhook: no user for subscription", sub.id);
    return;
  }
  await upsertHaulSubscription({
    userId,
    customerId: idOf(sub.customer),
    subscriptionId: sub.id,
    status: statusOverride ?? sub.status,
    periodEnd: periodEndOf(sub),
  });
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature") ?? "";

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return new Response("Webhook signature verification failed", { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const isHaul = session.metadata?.haullegal === "1";
      const product = session.metadata?.hlProduct;
      if (!userId || !isHaul) return new Response("ok", { status: 200 });

      if (product === "bundle" && session.payment_status === "paid") {
        const firstDelivery = await claimSession(session.id, userId);
        if (firstDelivery) {
          try {
            await grantHaulWalkthrough({ userId, customerId: idOf(session.customer) });
            const subId = idOf(session.subscription);
            if (subId) {
              const sub = await stripe.subscriptions.retrieve(subId);
              await upsertHaulSubscription({
                userId,
                customerId: idOf(session.customer) ?? idOf(sub.customer),
                subscriptionId: sub.id,
                status: sub.status,
                periodEnd: periodEndOf(sub),
              });
            }
          } catch (grantErr) {
            console.error("HaulLegal bundle grant failed, releasing claim:", grantErr);
            await releaseClaim(session.id);
            return new Response("Access grant failed, retry", { status: 500 });
          }
        }
      } else if (product === "walkthrough" && session.payment_status === "paid") {
        const firstDelivery = await claimSession(session.id, userId);
        if (firstDelivery) {
          try {
            await grantHaulWalkthrough({ userId, customerId: idOf(session.customer) });
          } catch (grantErr) {
            console.error("HaulLegal walkthrough grant failed, releasing claim:", grantErr);
            await releaseClaim(session.id);
            return new Response("Access grant failed, retry", { status: 500 });
          }
        }
      } else if (product === "staylegal") {
        const subId = idOf(session.subscription);
        if (subId) {
          const firstDelivery = await claimSession(session.id, userId);
          if (firstDelivery) {
            try {
              const sub = await stripe.subscriptions.retrieve(subId);
              await upsertHaulSubscription({
                userId,
                customerId: idOf(session.customer) ?? idOf(sub.customer),
                subscriptionId: sub.id,
                status: sub.status,
                periodEnd: periodEndOf(sub),
              });
            } catch (subErr) {
              console.error("HaulLegal subscription record failed, releasing claim:", subErr);
              await releaseClaim(session.id);
              return new Response("Subscription record failed, retry", { status: 500 });
            }
          }
        }
      }
    } else if (event.type === "invoice.paid") {
      const invoice = event.data.object as Stripe.Invoice;
      const loose = invoice as unknown as { subscription?: unknown; parent?: { subscription_details?: { subscription?: unknown } } };
      const subId = idOf(loose.subscription) ?? idOf(loose.parent?.subscription_details?.subscription);
      if (subId) {
        const sub = await stripe.subscriptions.retrieve(subId);
        await syncSubscription(sub);
      }
    } else if (event.type === "customer.subscription.updated") {
      await syncSubscription(event.data.object as Stripe.Subscription);
    } else if (event.type === "customer.subscription.deleted") {
      await syncSubscription(event.data.object as Stripe.Subscription, "canceled");
    }
  } catch (err) {
    console.error("HaulLegal webhook handler error:", err);
    return new Response("Handler error, retry", { status: 500 });
  }

  return new Response("ok", { status: 200 });
}

// ============================================================
// END OF FILE - app/haullegal/api/webhook/route.ts (v2 - bundle
// branch grants walkthrough + trial subscription in one claim;
// own endpoint + secret; subscription sync on renewals/cancels)
// If you can see this comment, the paste was not truncated.
// ============================================================
