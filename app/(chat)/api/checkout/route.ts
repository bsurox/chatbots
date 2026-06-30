import "server-only";
import Stripe from "stripe";
import { auth } from "@/app/(auth)/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");

const PRICE_MAP: Record<string, { price: number; credits: number; name: string }> = {
  starter: { price: 500, credits: 220, name: "Starter Pack" },
  power: { price: 1500, credits: 800, name: "Power Pack" },
  pro: { price: 4000, credits: 2400, name: "Pro Pack" },
};

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { bundle } = await request.json();
  const selected = PRICE_MAP[bundle];

  if (!selected) {
    return new Response("Invalid bundle", { status: 400 });
  }

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
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/credits/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/credits`,
    metadata: {
      userId: session.user.id,
      credits: String(selected.credits),
    },
  });

  return Response.json({ url: checkoutSession.url });
}
