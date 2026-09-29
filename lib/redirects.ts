// Old Wix URL -> new URL. Checked by proxy.ts before any prefix fallback.
//
// Keys are paths as they appeared on the Wix site (Thai slugs may be written
// decoded; proxy.ts matches both the raw and decoded request path). Values
// are paths on this site.
//
// TODO: fill in the old Wix blog URLs, from the old Wix sitemap
// (the /sitemap.xml index links to its blog-posts sitemap) or Search Console → Pages / Links, each mapped
// to its matching /blog/<slug>. Unmapped /post/* URLs fall back to /blog,
// which Google treats as a soft 404, so every post with traffic or
// backlinks should have an exact entry here.
export const WIX_REDIRECTS: Record<string, string> = {
  "/home": "/",
  "/coming-soon-03": "/",
  // No id="reviews" on the homepage yet, so this points at "/" for now.
  "/เสียงจากผู้ใช้จริง": "/",
  "/service-page/psychiatry-consultation": "/",
  "/service-page/psychology-consultation": "/",

  // Template (one line per old post):
  // "/post/<old-wix-slug>": "/blog/<new-sanity-slug>",
};
