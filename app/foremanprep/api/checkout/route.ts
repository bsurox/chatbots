// FILE: app/foremanprep/api/checkout/route.ts
import "server-only";
import Stripe from "stripe";
import { auth } from "@/app/(auth)/auth";
import { guestRegex } from "@/lib/constants";
import { hasForemanAccess } from "@/lib/db/foreman";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");

// ForemanPrep Full Access - one-time purchase, launch price $99
// (regular $149 arrives by editing LAUNCH_PRICE_CENTS). Inline
// price_data like the credits store: no dashboard products to
// manage. The webhook grants foreman_access on payment; this route
// only creates the session. Guests cannot buy - the purchase must
// attach to a real account the buyer can log back into.

const LAUNCH_PRICE_CENTS = 9900;
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
  const successUrl = `${reqUrl.origin}/foremanprep/thanks?paid=1`;
  const cancelUrl = `${reqUrl.origin}/foremanprep/buy`;

  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: PRODUCT_NAME },
          unit_amount: LAUNCH_PRICE_CENTS,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    // Card statements read ASKEVO* FOREMAN - same doctrine as the
    // SPOTMINT suffix, so charges are recognizable and disputes stay
    // rare. Receipt goes to the signed-in account's real email.
    payment_intent_data: { statement_descriptor_suffix: "FOREMAN" },
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
// END OF FILE - app/foremanprep/api/checkout/route.ts (v1 -
// $99 launch, FOREMAN suffix)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
