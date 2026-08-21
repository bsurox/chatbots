// FILE: app/foremanprep/api/checkout/route.ts
import "server-only";
import Stripe from "stripe";
import { auth } from "@/app/(auth)/auth";
import { guestRegex } from "@/lib/constants";
import { hasForemanAccess } from "@/lib/db/foreman";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");

// ForemanPrep Full Access - one-time purchase, launch price $99
// (the $149 regular price arrives on its own at PRICE_FLIP_MS,
// no edit needed - see v5 note below). Inline
// price_data like the credits store: no dashboard products to
// manage. The webhook grants foreman_access on payment; this route
// only creates the session. Guests cannot buy - the purchase must
// attach to a real account the buyer can log back into.
// v3: the success URL carries {CHECKOUT_SESSION_ID} - Stripe swaps
// in the real session id at redirect time, and the thanks page uses
// it as the ad-conversion transaction id so a refresh of the thanks
// page can never double-count a purchase in Google Ads.
// v4: allow_promotion_codes on the session - the Stripe checkout
// page now shows an optional "Add promotion code" field, so
// referral codes created in the dashboard (like CREW20) can be
// redeemed. No code entered = normal price, nothing else changes.
// v5: the price reads the clock. Before Sept 7, 2026, 11:59 PM
// Mountain (= Sept 8 05:59 UTC) checkout charges the $99 early
// bird; from that moment it charges the $149 regular price by
// itself - no midnight commit. This route is the charge authority;
// landing v14 carries the same constant for its display strings.

const EARLY_PRICE_CENTS = 9900;
const REGULAR_PRICE_CENTS = 14900;
// Sept 7, 2026, 11:59 PM MDT (UTC-6) = Sept 8, 05:59 UTC.
// Month index 8 = September.
const PRICE_FLIP_MS = Date.UTC(2026, 8, 8, 5, 59, 0);
const PRODUCT_NAME = "ForemanPrep Full Access - NASCLA Exam Prep";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "signin-required" }, { status: 401 });
  }
  const buyerEmail = session.user.email ?? "";
  if (guestRegex.test(buyerEmail)) {
    return Response.json({ error: "account-required" }, { status: 403 });
  }

  // Already own it? Never let someone pay twice.
  if (await hasForemanAccess(session.user.id)) {
    return Response.json({ already: true });
  }

  const reqUrl = new URL(request.url);
  const successUrl = `${reqUrl.origin}/foremanprep/thanks?paid=1&session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${reqUrl.origin}/foremanprep/buy`;

  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: PRODUCT_NAME },
          unit_amount: Date.now() < PRICE_FLIP_MS ? EARLY_PRICE_CENTS : REGULAR_PRICE_CENTS,
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
    metadata: {
      userId: session.user.id,
      foremanprep: "1",
    },
  });
  return Response.json({ url: checkoutSession.url });
}

// -----------------------------------------------------------
// END OF FILE - app/foremanprep/api/checkout/route.ts (v5 -
// price flips itself to $149 at Sept 7, 11:59 PM MDT)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
