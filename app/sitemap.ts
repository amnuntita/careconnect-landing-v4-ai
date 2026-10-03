import type { MetadataRoute } from "next";

import { ABOUT_PAGE } from "@/lib/about-page";
import type { ContentPage } from "@/lib/content-blocks";
import { PRICING_PAGE } from "@/lib/pricing-page";
import {
  BANGKOK_PAGE,
  NONTHABURI_PAGE,
  SERVICE_AREA_PAGE,
} from "@/lib/service-areas";
import {
  BEDBOUND_PAGE,
  COGNITIVE_PAGE,
  PARKINSONS_PAGE,
  POST_SURGERY_PAGE,
  SWALLOWING_PAGE,
} from "@/lib/service-pages";
import { SITE_URL } from "@/lib/site";

// Draft-generated pages. Publish gate: a page that still has an unresolved
// placeholder is noindex (lib/page-schema.ts) and must not be listed here.
const CONTENT_PAGES: { page: ContentPage; priority: number }[] = [
  { page: PRICING_PAGE, priority: 0.9 },
  { page: BEDBOUND_PAGE, priority: 0.8 },
  { page: POST_SURGERY_PAGE, priority: 0.8 },
  { page: PARKINSONS_PAGE, priority: 0.8 },
  { page: COGNITIVE_PAGE, priority: 0.8 },
  { page: SWALLOWING_PAGE, priority: 0.8 },
  { page: SERVICE_AREA_PAGE, priority: 0.7 },
  { page: BANGKOK_PAGE, priority: 0.7 },
  { page: NONTHABURI_PAGE, priority: 0.7 },
  { page: ABOUT_PAGE, priority: 0.6 },
];
import { client } from "@/sanity/lib/client";
import { POST_SLUGS_QUERY } from "@/sanity/lib/queries";
import type { PostSlug } from "@/sanity/lib/types";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let posts: PostSlug[] = [];
  try {
    posts = await client.fetch<PostSlug[]>(POST_SLUGS_QUERY);
  } catch {
    posts = [];
  }

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post._updatedAt),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const contentEntries: MetadataRoute.Sitemap = CONTENT_PAGES.filter(
    ({ page }) => !page.hasPlaceholder,
  ).map(({ page, priority }) => ({
    url: `${SITE_URL}${page.path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority,
  }));

  // TODO: add /privacy and /terms here once their `robots: { index: false }`
  // is removed after legal sign-off (sitemaps must not list noindex pages).
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/stroke-rehab-at-home`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...contentEntries,
    ...postEntries,
  ];
}
