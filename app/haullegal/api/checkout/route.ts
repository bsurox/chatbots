// FILE: app/haullegal/api/checkout/route.ts
import "server-only";
import Stripe from "stripe";
import { auth } from "@/app/(auth)/auth";
import { guestRegex } from "@/lib/constants";
import { getHaulAccess } from "@/lib/db/haul";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");

// HaulLegal checkout (v1) - two products, no clock:
//   {"product":"walkthrough"}  $249 one time, mode payment
//   {"product":"staylegal"}    $39 a month, mode subscription; the
//                              first 30 days are free when the
//                              account already owns the walkthrough
// Anything else (or no body) means the walkthrough, so a plain buy
// button keeps working. Same doctrine as the ForemanPrep charge
// authority: signed-in non-guest accounts only, a per-product
// already-owned guard so nobody pays twice for the same thing,
// allow_promotion_codes on, and the success URL carries
// {CHECKOUT_SESSION_ID} plus the product so the thanks page knows
// what was bought. Prices are inline price_data (no dashboard
// products to create); the subscription is an inline recurring
// price_data, which Stripe Checkout supports in subscription mode.
// The webhook (app/haullegal/api/webhook, its own endpoint) grants
// from the haullegal + hlProduct metadata on the session AND on
// the subscription (subscription_data.metadata), so renewal and
// cancellation events - which carry no session - still map back
// to the user.
// One-time purchases ask Stripe to always create a Customer so the
// billing portal and a later subscription attach to the same
// customer record; card statements read ASKEVO* HAULLEGAL for the
// one-time charge (subscription mode does not accept a suffix).

type HlProduct = "walkthrough" | "staylegal";

const WALKTHROUGH_CENTS = 24900;
const STAYLEGAL_CENTS = 3900;
const TRIAL_DAYS = 30;

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "signin-required" }, { status: 401 });
  }
  const buyerEmail = session.user.email ?? "";
  if (guestRegex.test(buyerEmail)) {
    return Response.json({ error: "account-required" }, { status: 403 });
  }

  let product: HlProduct = "walkthrough";
  try {
    const body = await request.json();
    if (body?.product === "staylegal") product = "staylegal";
  } catch {
    // no body = walkthrough
  }

  const access = await getHaulAccess(session.user.id);
  if (product === "walkthrough" && access.walkthrough) {
    return Response.json({ already: true });
  }
  if (product === "staylegal" && access.sub) {
    return Response.json({ already: true });
  }

  const reqUrl = new URL(request.url);
  const successUrl = `${reqUrl.origin}/haullegal/thanks?paid=1&product=${product}&session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${reqUrl.origin}/haullegal/buy`;
  const email = buyerEmail.includes("@") ? buyerEmail : undefined;
  const meta = { userId: session.user.id, haullegal: "1", hlProduct: product };

  if (product === "walkthrough") {
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "HaulLegal Launch Walkthrough - USDOT, authority and staying legal" },
            unit_amount: WALKTHROUGH_CENTS,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_creation: "always",
      allow_promotion_codes: true,
      payment_intent_data: { statement_descriptor_suffix: "HAULLEGAL" },
      customer_email: email,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: meta,
    });
    return Response.json({ url: checkoutSession.url });
  }

  const trial = access.walkthrough ? TRIAL_DAYS : undefined;
  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: "HaulLegal Stay Legal - deadline calendar and reminders" },
          unit_amount: STAYLEGAL_CENTS,
          recurring: { interval: "month" },
        },
        quantity: 1,
      },
    ],
    mode: "subscription",
    allow_promotion_codes: true,
    subscription_data: {
      trial_period_days: trial,
      metadata: meta,
      description: "HaulLegal Stay Legal - monthly, cancel any time",
    },
    customer: access.customerId ?? undefined,
    customer_email: access.customerId ? undefined : email,
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: meta,
  });
  return Response.json({ url: checkoutSession.url });
}

// -----------------------------------------------------------
// END OF FILE - app/haullegal/api/checkout/route.ts (v1 -
// walkthrough $249 one-time, Stay Legal $39/mo subscription with
// a 30-day trial for walkthrough owners)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
