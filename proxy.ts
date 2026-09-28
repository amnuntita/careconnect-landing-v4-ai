import { NextResponse, type NextRequest } from "next/server";

// Old Wix path -> new path
const REDIRECTS: Record<string, string> = {
  "/home": "/",
  "/coming-soon-03": "/",
  // No id="reviews" on the homepage yet, so this points at "/" for now.
  "/เสียงจากผู้ใช้จริง": "/",
  "/service-page/psychiatry-consultation": "/",
  "/service-page/psychology-consultation": "/",
};

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Handles Thai/encoded slugs. Crawlers do hit malformed escape sequences,
  // and decodeURIComponent throws on those — fall back to the raw pathname.
  let decoded = pathname;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    // keep the raw pathname
  }

  // 1. Exact matches (check raw + decoded)
  const target = REDIRECTS[pathname] ?? REDIRECTS[decoded];
  if (target) {
    return NextResponse.redirect(new URL(target, req.url), 308);
  }

  // 2. Any remaining old Wix blog post -> blog index
  if (decoded.startsWith("/post/")) {
    return NextResponse.redirect(new URL("/blog", req.url), 308);
  }

  // 3. Any remaining old Wix service page -> homepage (NOT /blog)
  if (decoded.startsWith("/service-page/")) {
    return NextResponse.redirect(new URL("/", req.url), 308);
  }

  return NextResponse.next();
}

export const config = {
  // Skip static assets, API routes, and files with extensions
  matcher: ["/((?!_next/|api/|images/|.*\\..*).*)"],
};
