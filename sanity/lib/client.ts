import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

// Read-only client for published content.
// No token is configured: we never read drafts (no preview mode).
// In production we use the CDN (fast, cached). In development we skip it so
// local testing always reflects the latest published content immediately.
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === "production",
});
