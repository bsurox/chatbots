// FILE: app/haullegal/api/portal/route.ts
import "server-only";
import Stripe from "stripe";
import { auth } from "@/app/(auth)/auth";
import { guestRegex } from "@/lib/constants";
import { getHaulAccess } from "@/lib/db/haul";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");

// Stripe Customer Portal door (v1). The account page POSTs here and
// gets back a one-time portal URL where the customer can update the
// card, see invoices, and cancel Stay Legal themselves - no support
// email needed, and cancellation flows back through the webhook as
// customer.subscription.updated / deleted. Requires the Customer
// Portal to be switched on once in the Stripe dashboard (Settings >
// Billing > Customer portal) - until then Stripe returns an error
// and this route answers 503 with a plain message. Only real,
// signed-in accounts with a Stripe customer on file get a URL.

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "signin-required" }, { status: 401 });
  }
  if (guestRegex.test(session.user.email ?? "")) {
    return Response.json({ error: "account-required" }, { status: 403 });
  }
  const access = await getHaulAccess(session.user.id);
  if (!access.customerId) {
    return Response.json({ error: "no-customer" }, { status: 404 });
  }
  const reqUrl = new URL(request.url);
  try {
    const portal = await stripe.billingPortal.sessions.create({
      customer: access.customerId,
      return_url: `${reqUrl.origin}/haullegal/account`,
    });
    return Response.json({ url: portal.url });
  } catch (err) {
    console.error("HaulLegal portal session error:", err);
    return Response.json({ error: "portal-unavailable" }, { status: 503 });
  }
}

// -----------------------------------------------------------
// END OF FILE - app/haullegal/api/portal/route.ts (v1 - Stripe
// Customer Portal session for card updates and cancellation)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
