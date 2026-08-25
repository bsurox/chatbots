// FILE: app/foremanprep/api/checkout/route.ts
import "server-only";
import Stripe from "stripe";
import { auth } from "@/app/(auth)/auth";
import { guestRegex } from "@/lib/constants";
import { hasBlAccess, hasForemanAccess } from "@/lib/db/foreman";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");

// ForemanPrep checkout - one route, two products.
// v5 notes: Full Access price reads the clock. Before Sept 7, 2026,
// 11:59 PM Mountain (= Sept 8 05:59 UTC) checkout charges the $99
// early bird; from that moment it charges the $149 regular price by
// itself - no midnight commit. This route is the charge authority;
// the landing page carries the same constant for its display
// strings. The success URL carries {CHECKOUT_SESSION_ID} so the
// thanks page can use the real session id as the ad-conversion
// transaction id, and allow_promotion_codes keeps referral codes
// (like CREW20) working.
// v6: Business & Law prep. POST body {"product":"bl"} buys B&L at
// a flat $79 (no early-bird clock); anything else - including the
// bodiless POST every existing button sends - buys Full Access
// exactly as before. Each product checks its own already-owned
// guard, so a Full Access owner CAN buy B&L (the webhook merges the
// grant to "bundle") but nobody can pay twice for the same thing.
// B&L success URLs append &product=bl so the thanks page confirms
// against the right entitlement and reports the right ad value.

const EARLY_PRICE_CENTS = 9900;
const REGULAR_PRICE_CENTS = 14900;
const BL_PRICE_CENTS = 7900;
// Sept 7, 2026, 11:59 PM MDT (UTC-6) = Sept 8, 05:59 UTC.
// Month index 8 = September.
const PRICE_FLIP_MS = Date.UTC(2026, 8, 8, 5, 59, 0);
const PRODUCT_NAME = "ForemanPrep Full Access - NASCLA Exam Prep";
const BL_PRODUCT_NAME = "ForemanPrep Business & Law Prep";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "signin-required" }, { status: 401 });
  }
  const buyerEmail = session.user.email ?? "";
  if (guestRegex.test(buyerEmail)) {
    return Response.json({ error: "account-required" }, { status: 403 });
  }

  // Which product? Tolerates the bodiless POST of older buttons.
  const body = await request.json().catch(() => null);
  const product = body?.product === "bl" ? "bl" : "gc";

  // Already own it? Never let someone pay twice for the same thing.
  if (product === "bl") {
    if (await hasBlAccess(session.user.id)) {
      return Response.json({ already: true });
    }
  } else if (await hasForemanAccess(session.user.id)) {
    return Response.json({ already: true });
  }

  const reqUrl = new URL(request.url);
  const successUrl =
    product === "bl"
      ? `${reqUrl.origin}/foremanprep/thanks?paid=1&product=bl&session_id={CHECKOUT_SESSION_ID}`
      : `${reqUrl.origin}/foremanprep/thanks?paid=1&session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${reqUrl.origin}/foremanprep/buy`;

  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: product === "bl" ? BL_PRODUCT_NAME : PRODUCT_NAME,
          },
          unit_amount:
            product === "bl"
              ? BL_PRICE_CENTS
              : Date.now() < PRICE_FLIP_MS
                ? EARLY_PRICE_CENTS
                : REGULAR_PRICE_CENTS,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    allow_promotion_codes: true,
    // Card statements read ASKEVO* FOREMANPREP - full brand name,
    // same doctrine as the SPOTMINT suffix, so charges are instantly
    // recognizable and disputes stay rare. (Stripe caps the combined
    // descriptor at 22 characters; ASKEVO* FOREMANPREP is 19.)
    // Receipt goes to the signed-in account's real email.
    payment_intent_data: { statement_descriptor_suffix: "FOREMANPREP" },
    customer_email: buyerEmail.includes("@") ? buyerEmail : undefined,
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata:
      product === "bl"
        ? { userId: session.user.id, foremanprep_bl: "1" }
        : { userId: session.user.id, foremanprep: "1" },
  });
  return Response.json({ url: checkoutSession.url });
}

// -----------------------------------------------------------
// END OF FILE - app/foremanprep/api/checkout/route.ts (v6 -
// two products: Full Access on the clock, B&L at flat $79)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
