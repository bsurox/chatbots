import "server-only";
import { addToWaitlist, countRecentPromoSignups } from "@/lib/db/waitlist";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ADREEL_SOURCE = "adreel-landing";
const ADREEL_PROMO_CREDITS = 200;
const MAX_PROMO_PER_IP_PER_DAY = 2;

const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com",
  "guerrillamail.com",
  "sharklasers.com",
  "10minutemail.com",
  "temp-mail.org",
  "tempmail.com",
  "tempmail.net",
  "yopmail.com",
  "getnada.com",
  "trashmail.com",
  "mintemail.com",
  "dispostable.com",
  "maildrop.cc",
  "mohmal.com",
  "throwawaymail.com",
  "fakeinbox.com",
  "mailnesia.com",
  "tempinbox.com",
  "emailondeck.com",
  "mail-temp.com",
]);

function getClientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) {
    const first = fwd.split(",")[0].trim();
    if (first) {
      return first.slice(0, 64);
    }
  }
  const real = request.headers.get("x-real-ip");
  if (real) {
    return real.trim().slice(0, 64);
  }
  return "unknown";
}

async function notifySupport(email: string, business: string | null, promoCredits: number, reason: string, ip: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return;
  }
  try {
    const subject = promoCredits > 0 ? "New AdReel signup: " + email : "AdReel signup (promo withheld): " + email;
    const lines = [
      "New AdReel signup",
      "",
      "Email: " + email,
      "Business: " + (business || "not provided"),
      "Promo credits attached: " + String(promoCredits),
      "Reason: " + reason,
      "IP: " + ip,
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
        subject: subject,
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
    const cleanEmail = email.toLowerCase().trim();
    const cleanBusiness = typeof business === "string" ? business.slice(0, 100) : null;
    const cleanSource = typeof source === "string" ? source.slice(0, 100) : null;
    const ip = getClientIp(request);

    let promoCredits = 0;
    let reason = "not an AdReel signup";
    if (cleanSource === ADREEL_SOURCE) {
      const domain = cleanEmail.split("@")[1] || "";
      if (process.env.ADREEL_PROMO_DISABLED === "true") {
        reason = "promo disabled by kill switch";
      } else if (DISPOSABLE_DOMAINS.has(domain)) {
        reason = "disposable email domain";
      } else {
        const recent = await countRecentPromoSignups(ip, 24);
        if (recent >= MAX_PROMO_PER_IP_PER_DAY) {
          reason = "IP reached daily promo limit";
        } else {
          promoCredits = ADREEL_PROMO_CREDITS;
          reason = "promo granted";
        }
      }
    }

    await addToWaitlist({
      email: cleanEmail,
      business: cleanBusiness,
      source: cleanSource,
      promoCredits,
      ip,
    });

    if (cleanSource === ADREEL_SOURCE) {
      await notifySupport(cleanEmail, cleanBusiness, promoCredits, reason, ip);
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("Waitlist error:", err);
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}

// ============================================================
// END OF FILE - app/(chat)/api/waitlist/route.ts (v2 - hardened)
// If you can see this comment, the paste was not truncated.
// ============================================================
