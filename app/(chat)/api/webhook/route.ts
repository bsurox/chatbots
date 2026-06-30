import "server-only";
import Stripe from "stripe";
import { addCredits } from "@/lib/db/credits";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? "";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature") ?? "";

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    return new Response("Webhook signature verification failed", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const credits = Number(session.metadata?.credits ?? 0);

    if (userId && credits > 0) {
      await addCredits(userId, credits);
    }
  }

  return new Response("ok", { status: 200 });
}
