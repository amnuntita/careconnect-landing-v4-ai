import type { PortableTextBlock } from "next-sanity";
import type { Image } from "sanity";

export type SanityImage = Image & { alt?: string };

// Shape returned by POSTS_QUERY / HIGHLIGHTS_QUERY (card projection).
export type PostCardData = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt: string;
  coverImage?: SanityImage;
  category?: string;
};

// Shape returned by POST_QUERY (full article).
export type PostData = PostCardData & {
  _updatedAt: string;
  body?: PortableTextBlock[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: SanityImage;
  };
};

export type PostSlug = {
  slug: string;
  _updatedAt: string;
};

export type BlogSettings = {
  blogTitle?: string;
  blogDescription?: string;
  ogImage?: SanityImage;
};
