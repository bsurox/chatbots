import "server-only";
import { addToWaitlist } from "@/lib/db/waitlist";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const { email, business, source } = await request.json();

    if (!email || typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
      return Response.json({ error: "Please enter a valid email." }, { status: 400 });
    }
    if (email.length > 200) {
      return Response.json({ error: "Email too long." }, { status: 400 });
    }

    await addToWaitlist({
      email,
      business: typeof business === "string" ? business.slice(0, 100) : null,
      source: typeof source === "string" ? source.slice(0, 100) : null,
    });

    return Response.json({ ok: true });
  } catch (err) {
    console.error("Waitlist error:", err);
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}
