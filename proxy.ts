import { NextResponse, type NextRequest } from "next/server";

import { WIX_REDIRECTS } from "@/lib/redirects";

// 308 = permanent. Search engines treat it the same as 301 (ranking signals
// pass to the target); unlike 301 it also preserves the request method.
const PERMANENT = 308;

function stripTrailingSlash(path: string): string {
  return path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
}

export function proxy(req: NextRequest) {
  const pathname = stripTrailingSlash(req.nextUrl.pathname);

  // Handles Thai/encoded slugs. Crawlers do hit malformed escape sequences,
  // and decodeURIComponent throws on those — fall back to the raw pathname.
  let decoded = pathname;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    // keep the raw pathname
  }

  // 1. Exact old -> new mappings (check raw + decoded)
  const target = WIX_REDIRECTS[pathname] ?? WIX_REDIRECTS[decoded];
  if (target) {
    return NextResponse.redirect(new URL(target, req.url), PERMANENT);
  }

  // 2. Unmapped old Wix blog post -> blog index (soft-404 risk: map it above)
  if (decoded.startsWith("/post/")) {
    return NextResponse.redirect(new URL("/blog", req.url), PERMANENT);
  }

  // 3. Unmapped old Wix service page -> homepage (NOT /blog)
  if (decoded.startsWith("/service-page/")) {
    return NextResponse.redirect(new URL("/", req.url), PERMANENT);
  }

  return NextResponse.next();
}

export const config = {
  // Skip static assets, API routes, and files with extensions
  matcher: ["/((?!_next/|api/|images/|.*\\..*).*)"],
};
