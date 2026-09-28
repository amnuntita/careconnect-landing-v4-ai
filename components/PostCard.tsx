import Image from "next/image";
import Link from "next/link";

import { formatThaiDate } from "@/lib/format";
import { urlFor } from "@/sanity/lib/image";
import type { PostCardData } from "@/sanity/lib/types";

export function PostCard({ post }: { post: PostCardData }) {
  return (
    <li className="post-card">
      <Link href={`/blog/${post.slug}`} className="post-card-link">
        <div className="post-card-media">
          {post.coverImage?.asset ? (
            <Image
              src={urlFor(post.coverImage)
                .width(800)
                .height(500)
                .fit("crop")
                .auto("format")
                .url()}
              alt={post.coverImage.alt ?? post.title}
              width={800}
              height={500}
              sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 380px"
              className="post-card-img"
            />
          ) : (
            <div className="ph wide" aria-hidden="true">
              CareConnect
            </div>
          )}
        </div>
        <div className="post-card-body">
          <div className="post-card-meta">
            {post.category ? (
              <span className="pill">{post.category}</span>
            ) : null}
            <time dateTime={post.publishedAt} className="small">
              {formatThaiDate(post.publishedAt)}
            </time>
          </div>
          <h3 className="post-card-title">{post.title}</h3>
          {post.excerpt ? (
            <p className="post-card-excerpt">{post.excerpt}</p>
          ) : null}
        </div>
      </Link>
    </li>
  );
}
