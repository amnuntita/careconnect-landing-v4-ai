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
