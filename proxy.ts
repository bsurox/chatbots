import { type NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { guestRegex, isDevelopmentEnvironment } from "./lib/constants";

// AdReel kill switch. The promo run is over, so /adreel returns a 404.
// To bring the page back later, change this to true and commit.
const ADREEL_ENABLED = false;

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/ping")) {
    return new Response("pong", { status: 200 });
  }

  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/webhook")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/adreel")) {
    if (!ADREEL_ENABLED) {
      return NextResponse.rewrite(new URL("/adreel-disabled", request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/waitlist")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/privacy")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/terms")) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    secureCookie: !isDevelopmentEnvironment,
  });

  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  if (!token) {
    const redirectUrl = encodeURIComponent(new URL(request.url).pathname);
    return NextResponse.redirect(
      new URL(`${base}/api/auth/guest?redirectUrl=${redirectUrl}`, request.url)
    );
  }

  const isGuest = guestRegex.test(token?.email ?? "");

  if (token && !isGuest && ["/login", "/register"].includes(pathname)) {
    return NextResponse.redirect(new URL(`${base}/`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/chat/:id",
    "/api/:path*",
    "/login",
    "/register",
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

// -----------------------------------------------------------
// END OF FILE - proxy.ts (v2 - adreel kill switch)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
