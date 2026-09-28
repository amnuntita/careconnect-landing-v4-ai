import "server-only";

import type { QueryParams } from "next-sanity";

import { client } from "./client";

// Thin wrapper around client.fetch that opts the request into Next.js's Data
// Cache with tags + a time-based safety net.
//
// In this Next 16 app, Cache Components are OFF and fetch is NOT cached by
// default, so we explicitly pass `next: { tags, revalidate }`. The publish
// webhook (/api/revalidate) calls revalidateTag() against these tags to push
// edits live within seconds; `revalidate` is a fallback ceiling.
export async function sanityFetch<QueryResponse>({
  query,
  params = {},
  tags = [],
  revalidate = 3600,
}: {
  query: string;
  params?: QueryParams;
  tags?: string[];
  revalidate?: number | false;
}): Promise<QueryResponse> {
  // In development, never cache: edits published in Studio show up on the next
  // request without restarting the dev server (there's no webhook locally).
  if (process.env.NODE_ENV !== "production") {
    return client.fetch<QueryResponse>(query, params, { cache: "no-store" });
  }

  return client.fetch<QueryResponse>(query, params, {
    next: {
      revalidate: tags.length ? false : revalidate,
      tags,
    },
  });
}
