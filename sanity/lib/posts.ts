import "server-only";

import { sanityFetch } from "./fetch";

// Which of these post slugs are published. Used to link to a post only once
// it exists, so pages never point at a 404. Tagged "post", so the publish
// webhook revalidates it. Fails soft (treats all as missing).
export async function getPublishedSlugs(slugs: string[]): Promise<Set<string>> {
  if (!slugs.length) return new Set();
  try {
    const found = await sanityFetch<string[]>({
      query: `*[_type == "post" && slug.current in $slugs].slug.current`,
      params: { slugs },
      tags: ["post"],
    });
    return new Set(found ?? []);
  } catch {
    return new Set();
  }
}

// Titles of the published posts among these slugs (slug → title). Used as
// link text, so a link always names the post it points to. Fails soft.
export async function getPublishedTitles(slugs: string[]): Promise<Map<string, string>> {
  if (!slugs.length) return new Map();
  try {
    const found = await sanityFetch<{ slug: string; title: string }[]>({
      query: `*[_type == "post" && slug.current in $slugs]{ "slug": slug.current, title }`,
      params: { slugs },
      tags: ["post"],
    });
    return new Map((found ?? []).map((p) => [p.slug, p.title]));
  } catch {
    return new Map();
  }
}
