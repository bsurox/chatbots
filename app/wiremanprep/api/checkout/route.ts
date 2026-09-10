// FILE: app/wiremanprep/api/checkout/route.ts
import "server-only";
import Stripe from "stripe";
import { auth } from "@/app/(auth)/auth";
import { guestRegex } from "@/lib/constants";
import {
  hasWiremanAccess,
  hasWiremanJourneymanAccess,
  hasWiremanResidentialAccess,
} from "@/lib/db/foreman";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");

// WiremanPrep checkout (v2) - three products, three flat prices,
// no clock: Master $149 (the default, so every existing buy
// button keeps working with an empty body), Journeyman $99,
// Residential $79. The POST body picks one: {"product":"wj"} or
// {"product":"wr"}; anything else means Master ("wm"). There is
// no early-bird machinery on this island on purpose. Same
// doctrine as the ForemanPrep charge authority otherwise:
// signed-in non-guest accounts only, a PER-PRODUCT already-owned
// guard so nobody can pay twice for the same level (owning one
// level never blocks buying another), allow_promotion_codes on,
// and the success URL carries {CHECKOUT_SESSION_ID} plus the
// product so the thanks page knows what was bought. The webhook
// grants from the wiremanprep metadata key plus the new wmProduct
// key (absent on old in-flight sessions = Master, so nothing
// mid-purchase breaks). Card statements read ASKEVO* WIREMANPREP
// for all three.

type WmProduct = "wm" | "wj" | "wr";

const CATALOG: Record<WmProduct, { cents: number; name: string }> = {
  wm: { cents: 14900, name: "WiremanPrep Full Access - NASCLA Electrical Exam Prep" },
  wj: { cents: 9900, name: "WiremanPrep Journeyman - NASCLA Journeyman Electrician Exam Prep" },
  wr: { cents: 7900, name: "WiremanPrep Residential - NASCLA Residential Electrical Contractor Exam Prep" },
};

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "signin-required" }, { status: 401 });
  }
  const buyerEmail = session.user.email ?? "";
  if (guestRegex.test(buyerEmail)) {
    return Response.json({ error: "account-required" }, { status: 403 });
  }

  let product: WmProduct = "wm";
  try {
    const body = await request.json();
    if (body?.product === "wj" || body?.product === "wr") product = body.product;
  } catch {
    // no body = Master, the v1 behavior
  }
  const item = CATALOG[product];

  // Already own THIS level? Never let someone pay twice for the
  // same thing - but owning one level never blocks another.
  const owned =
    product === "wj"
      ? await hasWiremanJourneymanAccess(session.user.id)
      : product === "wr"
        ? await hasWiremanResidentialAccess(session.user.id)
        : await hasWiremanAccess(session.user.id);
  if (owned) {
    return Response.json({ already: true });
  }

  const reqUrl = new URL(request.url);
  const successUrl = `${reqUrl.origin}/wiremanprep/thanks?paid=1&product=${product}&session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl =
    product === "wm"
      ? `${reqUrl.origin}/wiremanprep/buy`
      : `${reqUrl.origin}/wiremanprep/buy?product=${product}`;

  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: item.name },
          unit_amount: item.cents,
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
    metadata: { userId: session.user.id, wiremanprep: "1", wmProduct: product },
  });
  return Response.json({ url: checkoutSession.url });
}

// -----------------------------------------------------------
// END OF FILE - app/wiremanprep/api/checkout/route.ts (v2 -
// three products wm $149 / wj $99 / wr $79, per-product owned
// guard, wmProduct metadata for the webhook)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
