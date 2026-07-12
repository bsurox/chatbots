import "server-only";
import { addToWaitlist } from "@/lib/db/waitlist";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ADREEL_SOURCE = "adreel-landing";
const ADREEL_PROMO_CREDITS = 200;

async function notifySupport(email: string, business: string | null, promoCredits: number) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return;
  }
  try {
    const lines = [
      "New AdReel signup",
      "",
      "Email: " + email,
      "Business: " + (business || "not provided"),
      "Promo credits attached: " + String(promoCredits),
      "",
      "They were sent to /register to claim their credits.",
    ];
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "AdReel Signups <noreply@askevo.ai>",
        to: ["support@askevo.ai"],
        subject: "New AdReel signup: " + email,
        text: lines.join("\n"),
      }),
    });
  } catch (err) {
    console.error("Waitlist notify error:", err);
  }
}

export async function POST(request: Request) {
  try {
    const { email, business, source } = await request.json();
    if (!email || typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
      return Response.json({ error: "Please enter a valid email." }, { status: 400 });
    }
    if (email.length > 200) {
      return Response.json({ error: "Email too long." }, { status: 400 });
    }
    const cleanBusiness = typeof business === "string" ? business.slice(0, 100) : null;
    const cleanSource = typeof source === "string" ? source.slice(0, 100) : null;
    const promoCredits = cleanSource === ADREEL_SOURCE ? ADREEL_PROMO_CREDITS : 0;
    await addToWaitlist({
      email,
      business: cleanBusiness,
      source: cleanSource,
      promoCredits,
    });
    if (promoCredits > 0) {
      await notifySupport(email.toLowerCase().trim(), cleanBusiness, promoCredits);
    }
    return Response.json({ ok: true });
  } catch (err) {
    console.error("Waitlist error:", err);
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}

// ============================================================
// END OF FILE - app/(chat)/api/waitlist/route.ts
// If you can see this comment, the paste was not truncated.
// ============================================================
