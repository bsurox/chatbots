// FILE: app/haullegal/api/checkout/route.ts
import "server-only";
import Stripe from "stripe";
import { auth } from "@/app/(auth)/auth";
import { guestRegex } from "@/lib/constants";
import { getHaulAccess } from "@/lib/db/haul";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");

// HaulLegal checkout (v2 - THE FREE MONTH IS AUTOMATIC, his call):
//   {"product":"walkthrough"}  ONE checkout: $249 charged today as a
//                              one-time line item PLUS Stay Legal
//                              attached on the same card with a
//                              30-day free trial, then $39/month
//                              until canceled (mode subscription,
//                              hlProduct "bundle"). Stripe's own
//                              checkout page prints "due today" and
//                              "then $39.00/month starting <date>"
//                              above the pay button - the required
//                              auto-renew disclosure, on top of the
//                              buy card copy and the terms.
//                              If the account ALREADY has Stay Legal
//                              running, the walkthrough is sold alone
//                              in mode payment (no second
//                              subscription, ever).
//   {"product":"staylegal"}    $39 a month on its own, mode
//                              subscription, no trial (the free month
//                              is the walkthrough's perk) - for people
//                              who only want the calendar.
// Anything else (or no body) means the walkthrough, so a plain buy
// button keeps working. Same doctrine as the ForemanPrep charge
// authority: signed-in non-guest accounts only, per-product
// already-owned guards so nobody pays twice for the same thing,
// allow_promotion_codes on, and the success URL carries
// {CHECKOUT_SESSION_ID} plus the product so the thanks page knows
// what was bought. Prices are inline price_data (no dashboard
// products); one-time items are allowed in subscription-mode
// Checkout and are invoiced immediately. The webhook (app/haullegal/
// api/webhook, its own endpoint) grants from the haullegal +
// hlProduct metadata on the session AND on the subscription
// (subscription_data.metadata), so renewal and cancellation events
// - which carry no session - still map back to the user.
// Statement descriptor: subscription mode does not accept a suffix,
// so the bundled $249 reads ASKEVO on the card statement; the
// walkthrough-alone path keeps ASKEVO* HAULLEGAL.

type HlProduct = "walkthrough" | "staylegal";
type HlCharge = "bundle" | "walkthrough" | "staylegal";

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
  const cancelUrl = `${reqUrl.origin}/haullegal/buy`;
  const email = buyerEmail.includes("@") ? buyerEmail : undefined;
  // What this checkout actually charges: the bundle (walkthrough +
  // free-month subscription) unless Stay Legal is already running.
  const charge: HlCharge = product === "staylegal" ? "staylegal" : access.sub ? "walkthrough" : "bundle";
  const successUrl = `${reqUrl.origin}/haullegal/thanks?paid=1&product=${charge}&session_id={CHECKOUT_SESSION_ID}`;
  const meta = { userId: session.user.id, haullegal: "1", hlProduct: charge };

  if (charge === "bundle") {
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
        {
          price_data: {
            currency: "usd",
            product_data: { name: "HaulLegal Stay Legal - deadline calendar and reminders (first 30 days free)" },
            unit_amount: STAYLEGAL_CENTS,
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      allow_promotion_codes: true,
      subscription_data: {
        trial_period_days: TRIAL_DAYS,
        metadata: meta,
        description: "HaulLegal Stay Legal - monthly after your free first month, cancel any time",
      },
      customer: access.customerId ?? undefined,
      customer_email: access.customerId ? undefined : email,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: meta,
    });
    return Response.json({ url: checkoutSession.url });
  }

  if (charge === "walkthrough") {
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
// END OF FILE - app/haullegal/api/checkout/route.ts (v2 - ONE
// checkout: $249 walkthrough + Stay Legal on a 30-day free trial;
// walkthrough alone if Stay Legal already runs; Stay Legal alone
// with no trial)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
