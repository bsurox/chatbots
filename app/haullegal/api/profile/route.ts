// FILE: app/haullegal/api/profile/route.ts
import "server-only";
import { auth } from "@/app/(auth)/auth";
import { guestRegex } from "@/lib/constants";
import { getHaulProfile, saveHaulProfile } from "@/lib/db/haul";
import { normalizeUsPhone } from "@/lib/haullegal/twilio";

// Saved Stay Legal profile + walkthrough progress (v2 - TEXT
// REMINDERS: the body may carry phone (a US mobile number, any
// punctuation) and sms (the consent box). Rules: phone absent =
// leave the stored number alone (the walkthrough page never sends
// it); phone "" = clear the number and switch texts off; a number
// that is not ten US digits is rejected with 400 bad-phone; sms
// true without a valid number is rejected the same way. GET now
// returns phone (digits only) and sms so the calendar can show the
// saved state.)
// v1 notes - GET returns
// what the account has saved (or null); POST saves it. Any real,
// signed-in account may save - the data is tiny and it is what
// makes reminders and cross-device progress possible - while the
// reminder job itself only runs for accounts whose Stay Legal is
// live (that check lives in lib/db/haul.ts listReminderCandidates).
// Payload guards: the profile must be a plain object under 4 KB,
// progress a list of at most 60 short step ids, reminders a
// boolean; anything else is rejected with 400 so a bad client can
// never bloat the table.

const MAX_PROFILE_BYTES = 4096;
const MAX_PROGRESS = 60;

async function whoAmI(): Promise<string | null> {
  const session = await auth();
  const userId = session?.user?.id;
  const email = session?.user?.email ?? "";
  if (!userId || guestRegex.test(email)) return null;
  return userId;
}

export async function GET() {
  try {
    const userId = await whoAmI();
    if (!userId) return Response.json({ saved: null });
    const row = await getHaulProfile(userId);
    if (!row) return Response.json({ saved: null });
    return Response.json({
      saved: {
        profile: row.profile,
        progress: row.progress,
        reminders: row.reminders,
        phone: row.phone ? row.phone.replace(/^\+1/, "") : "",
        sms: row.sms,
        updatedAt: row.updatedAt.toISOString(),
      },
    });
  } catch (err) {
    console.error("HaulLegal profile read error:", err);
    return Response.json({ saved: null });
  }
}

export async function POST(request: Request) {
  const userId = await whoAmI();
  if (!userId) {
    return Response.json({ error: "signin-required" }, { status: 401 });
  }
  let body: { profile?: unknown; progress?: unknown; reminders?: unknown; phone?: unknown; sms?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "bad-json" }, { status: 400 });
  }
  const profile = body.profile;
  if (!profile || typeof profile !== "object" || Array.isArray(profile)) {
    return Response.json({ error: "bad-profile" }, { status: 400 });
  }
  if (JSON.stringify(profile).length > MAX_PROFILE_BYTES) {
    return Response.json({ error: "profile-too-large" }, { status: 400 });
  }
  const progress = Array.isArray(body.progress) ? body.progress : [];
  if (progress.length > MAX_PROGRESS || progress.some((p) => typeof p !== "string" || p.length > 40)) {
    return Response.json({ error: "bad-progress" }, { status: 400 });
  }
  const reminders = body.reminders === undefined ? true : Boolean(body.reminders);
  let phone: string | null | undefined;
  let sms: boolean | undefined;
  if (body.phone !== undefined) {
    if (typeof body.phone !== "string") {
      return Response.json({ error: "bad-phone" }, { status: 400 });
    }
    if (body.phone.trim() === "") {
      phone = null;
      sms = false;
    } else {
      phone = normalizeUsPhone(body.phone);
      if (!phone) return Response.json({ error: "bad-phone" }, { status: 400 });
      sms = body.sms === undefined ? undefined : Boolean(body.sms);
    }
  } else if (body.sms !== undefined) {
    sms = Boolean(body.sms);
    if (sms) {
      const row = await getHaulProfile(userId);
      if (!row?.phone) return Response.json({ error: "bad-phone" }, { status: 400 });
    }
  }
  await saveHaulProfile({ userId, profile, progress, reminders, phone, sms });
  return Response.json({ ok: true });
}

// -----------------------------------------------------------
// END OF FILE - app/haullegal/api/profile/route.ts (v2 - phone +
// text opt-in; saved calendar profile + walkthrough progress,
// size-guarded)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
