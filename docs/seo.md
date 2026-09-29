# SEO

What's already wired up and what to remember when adding pages or content.

## Already configured

- **Root metadata** in [app/layout.tsx](../app/layout.tsx) — title template, description, Open Graph, Twitter card, robots, `metadataBase`.
- **Sitemap** at [app/sitemap.ts](../app/sitemap.ts) — served at `/sitemap.xml`.
- **Robots** at [app/robots.ts](../app/robots.ts) — served at `/robots.txt`.
- **JSON-LD** Organization + WebSite in [components/JsonLd.tsx](../components/JsonLd.tsx), rendered from [app/page.tsx](../app/page.tsx).
- **Static rendering** — every route is prerendered at build time, so crawlers get full HTML on first request.

## Site facts and the site URL

Site-wide facts (site URL, name, families served, registration numbers, social profile URLs, provinces served) live in [lib/site.ts](../lib/site.ts). Import from there instead of repeating values in components, metadata or JSON-LD. Values that aren't confirmed yet are `null` with a `// TODO`, and nothing renders them until they're filled in.

### Required env var: `NEXT_PUBLIC_SITE_URL`

Set `NEXT_PUBLIC_SITE_URL` to the canonical origin, e.g. `https://www.example.com` (no trailing path). Sitemap URLs, canonicals, Open Graph URLs and JSON-LD `@id`s all derive from it via `SITE_URL` in `lib/site.ts`.

| Environment | Missing `NEXT_PUBLIC_SITE_URL` |
| --- | --- |
| `VERCEL_ENV=production` | **Build fails** with an error naming the variable. |
| Preview / local dev | Logs a warning and falls back to `http://localhost:3000`. |

An invalid (non-absolute) value fails in every environment. Set it in Vercel → Project → Settings → Environment Variables (Production at minimum), and in `.env.local` for local work if you want real URLs.

## When adding a new page

1. **Export `metadata`** from the page file:
   ```tsx
   export const metadata: Metadata = {
     title: "Specific page title",     // becomes "Specific page title | CareConnect"
     description: "...",
     alternates: { canonical: "/path" },
   };
   ```
   `title` and `description` are the two SEO fields that matter most.

2. **Add the URL to [app/sitemap.ts](../app/sitemap.ts)** so it gets crawled.

3. **Use one `<h1>`** per page. Use `<h2>`–`<h6>` in order for sub-sections. Don't skip levels.

## JSON-LD (structured data)

[components/JsonLd.tsx](../components/JsonLd.tsx) has stubs for `Organization` and `WebSite`. Add more types as the site grows:

- **`LocalBusiness`** — if CareConnect has a physical location (address, hours, phone).
- **`Product` / `Service`** — for paid offerings.
- **`FAQPage`** — if you add an FAQ section. Each Q/A becomes a result snippet.
- **`BreadcrumbList`** — once there are sub-pages.

Validate with the [Rich Results Test](https://search.google.com/test/rich-results) before shipping.

## Open Graph image

Drop a 1200×630 image named `opengraph-image.jpg` (or `.png`) at the root of `app/`. Next auto-detects it and adds the right meta tags. Same for `twitter-image.jpg` if you want a different one for Twitter.

## Images and SEO

Two things matter:

- **`alt` text** on every `<Image>` — descriptive, not "image of...". Empty `alt=""` only for decorative images.
- **Don't oversize** — see [images.md](./images.md) for `sizes`, lazy-loading, and blur placeholders. Page weight directly affects Core Web Vitals, which affect ranking.

## Performance signals Google watches

Static rendering (already on) covers most of it. The two things to keep an eye on as you add content:

- **LCP** (Largest Contentful Paint) — usually the hero image. Keep it `priority` and well-sized. Avoid hero videos that block paint.
- **CLS** (Cumulative Layout Shift) — always set `width`/`height` on `<Image>` and reserve space for anything loaded async (embeds, fonts). `next/font` already handles fonts.

Check both with `pnpm build && pnpm start`, then run Lighthouse in Chrome DevTools.

## Quick checklist before shipping a page

- [ ] `metadata` exported with `title` + `description`
- [ ] Canonical URL set if the page is reachable via multiple paths
- [ ] One `<h1>`, headings in order
- [ ] All images have descriptive `alt`
- [ ] URL added to [app/sitemap.ts](../app/sitemap.ts)
- [ ] Relevant JSON-LD added if applicable
- [ ] Lighthouse run, LCP < 2.5s and CLS < 0.1
