// FILE: lib/haullegal/twilio.ts
import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

// HaulLegal text-message layer (v1) - the only file that talks to
// Twilio, and it talks over plain HTTPS (no SDK to install). Three
// env vars switch texting on; with any of them missing every send
// is skipped and reported as "off", so the rest of the product runs
// exactly as before:
//   TWILIO_ACCOUNT_SID   ACxxxxxxxx from the Twilio console
//   TWILIO_AUTH_TOKEN    the account auth token (also signs the
//                        inbound webhook)
//   TWILIO_FROM          the sending number in +1XXXXXXXXXX form,
//                        or a Messaging Service SID (MGxxxx) if the
//                        number sits inside one
// sendSms returns Twilio's error code on failure so the caller can
// tell "this person unsubscribed" (21610) from an outage.
// verifyTwilioSignature checks X-Twilio-Signature on inbound
// webhooks the way Twilio documents it: base64(HMAC-SHA1(auth
// token, full URL + every POST field, sorted by name, key then
// value, concatenated)). SMS_WEBHOOK_URL is the exact address to
// paste into the Twilio number's "A message comes in" box.

export const SMS_WEBHOOK_URL = "https://haullegal.com/haullegal/api/sms";

// Keep every text at or under this many characters (two SMS
// segments) so a reminder never arrives as five fragments.
export const SMS_MAX_CHARS = 300;

export type SmsResult = { ok: boolean; off?: boolean; code?: number; sid?: string };

function env(name: string): string {
  return (process.env[name] ?? "").trim();
}

export function twilioConfigured(): boolean {
  return Boolean(env("TWILIO_ACCOUNT_SID") && env("TWILIO_AUTH_TOKEN") && env("TWILIO_FROM"));
}

export async function sendSms(to: string, body: string): Promise<SmsResult> {
  const sid = env("TWILIO_ACCOUNT_SID");
  const token = env("TWILIO_AUTH_TOKEN");
  const from = env("TWILIO_FROM");
  if (!sid || !token || !from) return { ok: false, off: true };
  const form = new URLSearchParams();
  form.set("To", to);
  form.set("Body", body.length > SMS_MAX_CHARS ? body.slice(0, SMS_MAX_CHARS - 3) + "..." : body);
  if (from.startsWith("MG")) {
    form.set("MessagingServiceSid", from);
  } else {
    form.set("From", from);
  }
  const auth = Buffer.from(`${sid}:${token}`).toString("base64");
  try {
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(sid)}/Messages.json`, {
      method: "POST",
      headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
    });
    const data = (await res.json().catch(() => null)) as { sid?: string; code?: number } | null;
    if (res.ok) return { ok: true, sid: data?.sid };
    return { ok: false, code: typeof data?.code === "number" ? data.code : res.status };
  } catch (err) {
    console.error("HaulLegal sms send failed:", err);
    return { ok: false };
  }
}

// Twilio error codes that mean "stop texting this number".
export function isUnsubscribedError(code: number | undefined): boolean {
  return code === 21610 || code === 21614 || code === 21211;
}

export function verifyTwilioSignature(url: string, params: Record<string, string>, signature: string | null): boolean {
  const token = env("TWILIO_AUTH_TOKEN");
  if (!token || !signature) return false;
  const keys = Object.keys(params).sort();
  let data = url;
  for (const k of keys) data += k + params[k];
  const expected = createHmac("sha1", token).update(data, "utf8").digest("base64");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

// Ten US digits -> +1XXXXXXXXXX, or null when it is not a usable
// mobile-shaped number. Accepts a leading 1 and any punctuation.
export function normalizeUsPhone(raw: string): string | null {
  let d = raw.replace(/\D/g, "");
  if (d.length === 11 && d.startsWith("1")) d = d.slice(1);
  if (d.length !== 10) return null;
  if (d[0] < "2" || d[3] < "2") return null;
  return "+1" + d;
}

// -----------------------------------------------------------
// END OF FILE - lib/haullegal/twilio.ts (v1 - sendSms over HTTPS,
// webhook signature check, US number normalizer)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
