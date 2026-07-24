import "server-only";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// v2: a light rate limit so nobody can script-flood the support
// inbox or burn the Resend quota. Five messages per visitor per 15
// minutes, tracked in this server's memory. Honest limits of the
// approach: memory resets on each deploy and heavy traffic spreads
// across servers, so this stops casual abuse rather than a
// determined attacker - the bulletproof version needs a shared
// store and is not worth it unless real abuse shows up.
const WINDOW_MS = 15 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function isLimited(key: string): boolean {
  const now = Date.now();
  if (hits.size > 500) {
    for (const [k, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  return false;
}

export async function POST(request: Request) {
  try {
    const ip = (request.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
    if (isLimited(ip)) {
      return Response.json(
        { error: "Too many messages - please wait a few minutes and try again." },
        { status: 429 }
      );
    }

    const { name, email, comment } = await request.json();

    if (!name || typeof name !== "string" || !name.trim() || name.length > 100) {
      return Response.json({ error: "Please enter your name." }, { status: 400 });
    }
    if (!email || typeof email !== "string" || !EMAIL_RE.test(email.trim()) || email.length > 200) {
      return Response.json({ error: "Please enter a valid email." }, { status: 400 });
    }
    if (!comment || typeof comment !== "string" || !comment.trim() || comment.length > 5000) {
      return Response.json({ error: "Please enter a message." }, { status: 400 });
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "AskEvo Support Form <noreply@askevo.ai>",
        to: ["support@askevo.ai"],
        reply_to: email.trim(),
        subject: `AskEvo support request from ${name.trim()}`,
        text: `Name: ${name.trim()}\nEmail: ${email.trim()}\n\nMessage:\n${comment.trim()}`,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Resend error:", errText);
      return Response.json(
        { error: "Could not send your message. Please email support@askevo.ai directly." },
        { status: 502 }
      );
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("Support form error:", err);
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}

// -----------------------------------------------------------
// END OF FILE - app/(chat)/api/support/route.ts (v2 - rate
// limit)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
