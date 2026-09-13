// FILE: app/haullegal/api/sms/route.ts
import "server-only";
import { setSmsByPhone } from "@/lib/db/haul";
import { SMS_WEBHOOK_URL, verifyTwilioSignature } from "@/lib/haullegal/twilio";

// Inbound text webhook (v1). Twilio POSTs here (form-encoded) every
// time someone texts the HaulLegal number; the number's "A message
// comes in" box in the Twilio console must hold exactly
// SMS_WEBHOOK_URL. Every request is checked against
// X-Twilio-Signature with the auth token, so nothing else can flip
// an opt-in. Handled keywords (case-insensitive, whitespace
// trimmed):
//   STOP / STOPALL / UNSUBSCRIBE / CANCEL / END / QUIT
//       -> sms off for every profile with that number. Twilio also
//          blocks the number on its side and sends the carrier-
//          required confirmation itself, so we answer with empty
//          TwiML.
//   START / YES / UNSTOP
//       -> sms back on, only for a number that consented on the
//          web form; short confirmation.
//   HELP / INFO
//       -> the help line the campaign promised.
//   anything else
//       -> a one-line pointer to the site (no back-and-forth).
// Replies are TwiML so Twilio sends them from the same number.
// Numbers arrive from Twilio already in +1XXXXXXXXXX form.

const HELP = "HaulLegal reminders: deadline texts for your Stay Legal calendar. Msg & data rates may apply, frequency varies. Reply STOP to cancel. Help: support@askevo.ai";
const STARTED = "HaulLegal: text reminders are on. Msg & data rates may apply, frequency varies. Reply STOP to cancel, HELP for help.";
const NOT_FOUND = "HaulLegal: this number has no text reminders set up. Turn them on at haullegal.com/calendar. Reply STOP to cancel, HELP for help.";
const OTHER = "HaulLegal is an automated reminder line. Manage your reminders at haullegal.com/calendar. Reply STOP to cancel, HELP for help.";

const STOP_WORDS = new Set(["STOP", "STOPALL", "UNSUBSCRIBE", "CANCEL", "END", "QUIT"]);
const START_WORDS = new Set(["START", "YES", "UNSTOP"]);
const HELP_WORDS = new Set(["HELP", "INFO"]);

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function twiml(message: string | null): Response {
  const body = message ? `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${escapeXml(message)}</Message></Response>` : `<?xml version="1.0" encoding="UTF-8"?><Response></Response>`;
  return new Response(body, { status: 200, headers: { "Content-Type": "text/xml" } });
}

export async function POST(request: Request) {
  let params: Record<string, string> = {};
  try {
    const form = await request.formData();
    form.forEach((v, k) => {
      if (typeof v === "string") params[k] = v;
    });
  } catch {
    return new Response("Bad request", { status: 400 });
  }
  if (!verifyTwilioSignature(SMS_WEBHOOK_URL, params, request.headers.get("x-twilio-signature"))) {
    return new Response("Forbidden", { status: 403 });
  }
  const from = (params.From ?? "").trim();
  const word = (params.Body ?? "").trim().toUpperCase().replace(/[.!]+$/, "");
  if (!from) return twiml(null);

  try {
    if (STOP_WORDS.has(word)) {
      await setSmsByPhone(from, false);
      return twiml(null);
    }
    if (START_WORDS.has(word)) {
      const n = await setSmsByPhone(from, true);
      return twiml(n > 0 ? STARTED : NOT_FOUND);
    }
    if (HELP_WORDS.has(word)) {
      return twiml(HELP);
    }
    return twiml(OTHER);
  } catch (err) {
    console.error("HaulLegal inbound sms error:", err);
    return twiml(null);
  }
}

// -----------------------------------------------------------
// END OF FILE - app/haullegal/api/sms/route.ts (v1 - Twilio inbound
// webhook: STOP / START / HELP, signature-checked)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
