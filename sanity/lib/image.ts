import { createImageUrlBuilder } from "@sanity/image-url";
import type { Image } from "sanity";

import { dataset, projectId } from "../env";

const builder = createImageUrlBuilder({ projectId, dataset });

// Build an optimized image URL from a Sanity image reference.
// Usage: urlFor(post.coverImage).width(1200).height(630).url()
export function urlFor(source: Image) {
  return builder.image(source);
}
