import "server-only";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
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
