import { defineQuery } from "next-sanity";

// Shared projection for post cards (list + landing highlights).
const cardFields = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  coverImage,
  "category": category->title
`;

// All posts, newest first — for the /blog listing.
export const POSTS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
    ${cardFields}
  }
`);

// Latest posts for the landing-page section (featured pinned first).
export const HIGHLIGHTS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)]
    | order(coalesce(featured, false) desc, publishedAt desc)[0...$limit] {
    ${cardFields}
  }
`);

// Slugs (+ last-modified) for generateStaticParams and the sitemap.
export const POST_SLUGS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)] {
    "slug": slug.current,
    _updatedAt
  }
`);

// Person fields for post bylines and medical review.
const authorFields = /* groq */ `
  name,
  credentials,
  licenseNumber,
  photo,
  bio
`;

// A single post by slug — full body for the article page.
export const POST_QUERY = defineQuery(`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    _updatedAt,
    coverImage,
    body,
    "category": category->title,
    seo,
    "author": author->{ ${authorFields} },
    "reviewedBy": reviewedBy->{ ${authorFields} },
    reviewedAt
  }
`);

// Blog index page copy (optional singleton).
export const SETTINGS_QUERY = defineQuery(`
  *[_type == "settings"][0] {
    blogTitle,
    blogDescription,
    ogImage
  }
`);
