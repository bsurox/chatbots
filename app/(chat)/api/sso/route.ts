// FILE: app/(chat)/api/sso/route.ts
import { createHmac, timingSafeEqual } from "node:crypto";
import { encode } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import { guestRegex, isDevelopmentEnvironment } from "@/lib/constants";

// Cross-domain single sign-on bridge (v1). foremanprep.com and
// wiremanprep.com share one app, one database, and one auth
// secret - but browsers wall cookies off per domain, so a login
// on one domain is invisible to the other. This route is the
// bridge: the cross-brand badges point here instead of straight
// at the sister site, and a logged-in user gets silently walked
// across.
//
// DEPART (GET /api/sso?to=fp|bl|wm): runs on the domain the user
// is leaving. If they hold a real (non-guest) session, mint a
// signed 60-second one-time-style pass naming the user and the
// destination, and redirect to the destination domain's arrive
// door with the pass in tow. No session, or a guest session?
// Plain redirect - the links behave exactly as before.
//
// ARRIVE (GET /api/sso?token=...&go=/...): runs on the domain the
// user lands on. Verify the pass (HMAC over the payload with
// AUTH_SECRET, constant-time compare, 60s expiry, audience must
// match this host). If it checks out, mint the same session JWE
// cookie next-auth itself would set at login - same salt (the
// cookie name), same secret, same claim shape the jwt callback
// produces (id, type, email, sub) - drop it on the response, and
// redirect to the landing page. A bad or stale pass just
// redirects without logging anyone in: the site works, they log
// in by hand, nothing breaks loudly.
//
// SECURITY NOTES: the pass rides a URL over HTTPS between our own
// two domains, lives 60 seconds, names its audience so a WM pass
// cannot be replayed against FP, and is signed with AUTH_SECRET -
// nobody can forge one without the server's own secret. Guests
// never get passes: a throwaway guest row on one domain should
// not colonize the other.
// LIMITS (his brief, stated plainly): the walk-across happens on
// our links only - typing wiremanprep.com into a fresh browser
// cannot know about a foremanprep.com session. And logout stays
// per-domain.

const TOKEN_TTL_MS = 60 * 1000;
const SESSION_MAX_AGE_S = 30 * 24 * 60 * 60;

// Destination table: badge short-codes -> where the user is going.
// go is the path ON the destination domain after its host rewrite.
const DESTS: Record<string, { origin: string; go: string }> = {
  fp: { origin: "https://foremanprep.com", go: "/" },
  bl: { origin: "https://foremanprep.com", go: "/bl-prep" },
  wm: { origin: "https://wiremanprep.com", go: "/" },
};

function b64url(buf: Buffer): string {
  return buf.toString("base64url");
}

function sign(payloadB64: string, secret: string): string {
  return b64url(createHmac("sha256", secret).update(payloadB64).digest());
}

function cookieName(secure: boolean): string {
  return secure ? "__Secure-authjs.session-token" : "authjs.session-token";
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    return NextResponse.redirect(new URL("/", url.origin));
  }

  const token = url.searchParams.get("token");

  // ---------------- ARRIVE ----------------
  if (token) {
    const go = url.searchParams.get("go") ?? "/";
    const dest = new URL(go.startsWith("/") ? go : "/", url.origin);
    const fallthrough = NextResponse.redirect(dest);

    const dot = token.indexOf(".");
    if (dot <= 0) return fallthrough;
    const payloadB64 = token.slice(0, dot);
    const sig = token.slice(dot + 1);
    const expected = sign(payloadB64, secret);
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return fallthrough;

    let claims: {
      id?: string;
      type?: string;
      email?: string;
      aud?: string;
      exp?: number;
    };
    try {
      claims = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8"));
    } catch {
      return fallthrough;
    }
    if (
      !claims.id ||
      !claims.email ||
      claims.type !== "regular" ||
      typeof claims.exp !== "number" ||
      Date.now() > claims.exp ||
      claims.aud !== url.hostname
    ) {
      return fallthrough;
    }

    const secure = !isDevelopmentEnvironment;
    const session = await encode({
      token: {
        id: claims.id,
        type: "regular",
        email: claims.email,
        sub: claims.id,
      },
      secret,
      salt: cookieName(secure),
      maxAge: SESSION_MAX_AGE_S,
    });
    const res = NextResponse.redirect(dest);
    res.cookies.set(cookieName(secure), session, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE_S,
    });
    return res;
  }

  // ---------------- DEPART ----------------
  const to = url.searchParams.get("to") ?? "";
  const dest = DESTS[to];
  if (!dest) {
    return NextResponse.redirect(new URL("/", url.origin));
  }
  const plain = new URL(dest.go, dest.origin);

  const session = await auth();
  const id = session?.user?.id;
  const email = session?.user?.email ?? "";
  const realUser =
    Boolean(id) && session?.user?.type === "regular" && !guestRegex.test(email);
  if (!realUser || !id) {
    return NextResponse.redirect(plain);
  }

  const payload = {
    id,
    type: "regular",
    email,
    aud: new URL(dest.origin).hostname,
    exp: Date.now() + TOKEN_TTL_MS,
  };
  const payloadB64 = b64url(Buffer.from(JSON.stringify(payload), "utf8"));
  const pass = `${payloadB64}.${sign(payloadB64, secret)}`;

  const arrive = new URL("/api/sso", dest.origin);
  arrive.searchParams.set("token", pass);
  arrive.searchParams.set("go", dest.go);
  return NextResponse.redirect(arrive);
}

// ============================================================
// END OF FILE - app/(chat)/api/sso/route.ts (v1 - cross-domain
// silent login handoff between foremanprep.com and
// wiremanprep.com)
// If you can see this comment, the paste was not truncated.
// ============================================================
