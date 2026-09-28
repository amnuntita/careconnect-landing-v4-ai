import Link from "next/link";

import { PostCard } from "@/components/PostCard";
import { sanityFetch } from "@/sanity/lib/fetch";
import { HIGHLIGHTS_QUERY } from "@/sanity/lib/queries";
import type { PostCardData } from "@/sanity/lib/types";

// Landing-page section showing the latest articles. Renders nothing when there
// are no posts yet, so the page never shows an empty section.
export async function BlogHighlights() {
  let posts: PostCardData[] = [];
  try {
    posts = await sanityFetch<PostCardData[]>({
      query: HIGHLIGHTS_QUERY,
      params: { limit: 3 },
      tags: ["post"],
    });
  } catch {
    // Sanity not configured / unreachable — fail soft, hide the section.
    return null;
  }

  if (!posts?.length) return null;

  return (
    <section id="blog" className="cream">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow">บทความและความรู้</span>
            <h2 className="h2" style={{ marginTop: 10 }}>
              สาระน่ารู้เรื่องการฟื้นฟู
            </h2>
          </div>
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
