import Link from "next/link";

import { PostCard } from "@/components/PostCard";
import { BLOG_SECTION } from "@/lib/homepage-content";
import { sanityFetch } from "@/sanity/lib/fetch";
import { HIGHLIGHTS_QUERY, PINNED_POSTS_QUERY } from "@/sanity/lib/queries";
import type { PostCardData } from "@/sanity/lib/types";

// Homepage articles (§10), pinned in this order. A pinned post shows only if
// it exists in Sanity; empty slots are filled with featured/latest posts, so
// the section never links to a missing post.
const PINNED_SLUGS = [
  "stroke-after-discharge-guide",
  "stroke-warning-signs",
  "home-physiotherapy-elderly",
  "how-to-choose-home-physiotherapy",
];
const SLOTS = 4;

export async function BlogHighlights() {
  let posts: PostCardData[] = [];
  try {
    const pinned = await sanityFetch<PostCardData[]>({
      query: PINNED_POSTS_QUERY,
      params: { slugs: PINNED_SLUGS },
      tags: ["post"],
    });
    const ordered = PINNED_SLUGS.map((slug) => pinned.find((p) => p.slug === slug)).filter(
      (p): p is PostCardData => Boolean(p),
    );
    const fill =
      ordered.length < SLOTS
        ? await sanityFetch<PostCardData[]>({
            query: HIGHLIGHTS_QUERY,
            params: { exclude: PINNED_SLUGS, limit: SLOTS - ordered.length },
            tags: ["post"],
          })
        : [];
    posts = [...ordered, ...fill];
  } catch {
    // Sanity not configured / unreachable — fail soft, hide the section.
    return null;
  }

  if (!posts.length) return null;

  return (
    <section id="blog" className="cream">
      <div className="wrap">
        <div className="section-head">
          <h2 className="h2">{BLOG_SECTION.heading}</h2>
          <Link href="/blog" className="btn ghost">
            ดูบทความทั้งหมด
          </Link>
        </div>

        <ul className="post-grid">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </ul>
      </div>
    </section>
  );
}
