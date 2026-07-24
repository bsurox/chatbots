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

  // Spotmint app fence (v4). The wrapped app appends "SpotmintApp" to
  // its User-Agent. App traffic may only reach the Spotmint surface,
  // the auth doors, the legal pages, the API plumbing, and static
  // files - anything else bounces home to /spotmint. This is what
  // keeps the rest of the site unreachable from inside the app.
  const userAgent = request.headers.get("user-agent") ?? "";
  if (userAgent.includes("SpotmintApp")) {
    // v7: the one /spotmint path the app must NEVER see is the Stripe
    // store page - purchase machinery inside the app would break the
    // zero-commission doctrine. App traffic aiming there lands on the
    // wallet, the in-app credits surface. Web and store-host traffic
    // is untouched.
    if (pathname.startsWith("/spotmint/credits")) {
      return NextResponse.redirect(new URL("/spotmint/wallet", request.url));
    }
    const appAllowed =
      pathname.startsWith("/spotmint") ||
      pathname === "/login" ||
      pathname === "/register" ||
      pathname.startsWith("/api/") ||
      pathname.startsWith("/privacy") ||
      pathname.startsWith("/terms") ||
      pathname.includes(".");
    if (!appAllowed) {
      return NextResponse.redirect(new URL("/spotmint", request.url));
    }
  }

  // Spotmint store island (v6). spotmint.store serves only the
  // Spotmint-dressed store page and its doors - the AskEvo credits
  // page (sidebar, banner and all) no longer exists on this host, so
  // there is nothing AskEvo-branded to escape into.
  const hostname = request.nextUrl.hostname;
  if (hostname === "spotmint.store" || hostname.endsWith(".spotmint.store")) {
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/spotmint/credits", request.url));
    }
    const storeAllowed =
      pathname === "/login" ||
      pathname === "/register" ||
      pathname.startsWith("/api/") ||
      pathname.startsWith("/privacy") ||
      pathname.startsWith("/terms") ||
      pathname.startsWith("/spotmint") ||
      pathname.includes(".");
    if (!storeAllowed) {
      return NextResponse.redirect(new URL("/spotmint/credits", request.url));
    }
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

  if (pathname.startsWith("/updates")) {
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
// END OF FILE - proxy.ts (v7 - store page blocked in-app)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
