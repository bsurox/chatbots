// FILE: app/wiremanprep/api/checkout/route.ts
import "server-only";
import Stripe from "stripe";
import { auth } from "@/app/(auth)/auth";
import { guestRegex } from "@/lib/constants";
import { hasWiremanAccess } from "@/lib/db/foreman";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");

// WiremanPrep checkout (v1) - one product, one price, no clock.
// $149 flat for Full Access to the electrical course; there is no
// early-bird machinery on this island on purpose, so this route
// carries no price-flip constant and never will unless pricing
// strategy changes. Same doctrine as the ForemanPrep charge
// authority otherwise: signed-in non-guest accounts only, an
// already-owned guard so nobody can pay twice (reads the wm flag
// from lib/db/foreman.ts v4), allow_promotion_codes on so future
// discount codes work with zero code changes, and the success URL
// carries {CHECKOUT_SESSION_ID} so the thanks page can use the
// real session id as an ad-conversion transaction id when pixels
// arrive. The webhook grants access from the wiremanprep metadata
// key. Card statements read ASKEVO* WIREMANPREP (19 characters,
// under Stripe's 22-char descriptor cap).

const PRICE_CENTS = 14900;
const PRODUCT_NAME = "WiremanPrep Full Access - NASCLA Electrical Exam Prep";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "signin-required" }, { status: 401 });
  }
  const buyerEmail = session.user.email ?? "";
  if (guestRegex.test(buyerEmail)) {
    return Response.json({ error: "account-required" }, { status: 403 });
  }

  // Already own it? Never let someone pay twice for the same thing.
  if (await hasWiremanAccess(session.user.id)) {
    return Response.json({ already: true });
  }

  const reqUrl = new URL(request.url);
  const successUrl = `${reqUrl.origin}/wiremanprep/thanks?paid=1&session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${reqUrl.origin}/wiremanprep/buy`;

  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: PRODUCT_NAME },
          unit_amount: PRICE_CENTS,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    allow_promotion_codes: true,
    payment_intent_data: { statement_descriptor_suffix: "WIREMANPREP" },
    customer_email: buyerEmail.includes("@") ? buyerEmail : undefined,
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: { userId: session.user.id, wiremanprep: "1" },
  });
  return Response.json({ url: checkoutSession.url });
}

// -----------------------------------------------------------
// END OF FILE - app/wiremanprep/api/checkout/route.ts (v1 -
// $149 flat, wm already-owned guard, wiremanprep metadata)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
