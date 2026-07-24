import "server-only";
import Stripe from "stripe";
import { auth } from "@/app/(auth)/auth";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");
const PRICE_MAP: Record<string, { price: number; credits: number; name: string }> = {
  starter: { price: 500, credits: 220, name: "Starter" },
  power: { price: 1500, credits: 800, name: "Power" },
  pro: { price: 4000, credits: 2400, name: "Pro" },
  premium: { price: 7500, credits: 5000, name: "Premium" },
  ultra: { price: 15000, credits: 11750, name: "Ultra" },
};
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }
  const buyerEmail = session.user.email ?? "";
  const { bundle } = await request.json();
  const selected = PRICE_MAP[bundle];
  if (!selected) {
    return new Response("Invalid bundle", { status: 400 });
  }
  // Return the buyer to the storefront they started on (v2): askevo.ai
  // purchases return to askevo.ai, spotmint.store purchases stay on
  // spotmint.store - no post-payment domain whiplash. The webhook and
  // credit granting are untouched; only the return addresses change.
  const reqUrl = new URL(request.url);
  const isSpotmintStore =
    reqUrl.hostname === "spotmint.store" || reqUrl.hostname.endsWith(".spotmint.store");
  const successUrl = isSpotmintStore
    ? `${reqUrl.origin}/spotmint/credits?success=1`
    : `${reqUrl.origin}/credits/success`;
  const cancelUrl = isSpotmintStore ? `${reqUrl.origin}/spotmint/credits` : `${reqUrl.origin}/credits`;

  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: selected.name },
          unit_amount: selected.price,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    // v3: purchases started on spotmint.store carry a SPOTMINT
    // statement suffix, so card statements read ASKEVO* SPOTMINT
    // instead of bare AskEvo. Requires the shortened statement
    // descriptor to be set in the Stripe dashboard first. The
    // buyer's account email is locked into checkout so receipts
    // and the charge always tie to the signed-in account (guest
    // ids are not real emails, hence the guard).
    payment_intent_data: isSpotmintStore ? { statement_descriptor_suffix: "SPOTMINT" } : undefined,
    customer_email: buyerEmail.includes("@") ? buyerEmail : undefined,
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId: session.user.id,
      credits: String(selected.credits),
    },
  });
  return Response.json({ url: checkoutSession.url });
}

// -----------------------------------------------------------
// END OF FILE - app/(chat)/api/checkout/route.ts (v3 - spotmint
// statement suffix + receipt email)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
