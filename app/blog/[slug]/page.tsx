import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { Breadcrumb } from "@/components/Breadcrumb";
import { Footer } from "@/components/Footer";
import { BlogPostingJsonLd } from "@/components/JsonLd";
import { Navbar } from "@/components/Navbar";
import { PortableTextBody } from "@/components/PortableTextBody";
import { formatThaiDate } from "@/lib/format";
import { client } from "@/sanity/lib/client";
import { sanityFetch } from "@/sanity/lib/fetch";
import { urlFor } from "@/sanity/lib/image";
import { POST_QUERY, POST_SLUGS_QUERY } from "@/sanity/lib/queries";
import type { PostData, PostSlug } from "@/sanity/lib/types";

type Params = { slug: string };

// Pre-render known posts at build time (fast + SEO). New slugs render on demand.
export async function generateStaticParams(): Promise<Params[]> {
  try {
    const slugs = await client.fetch<PostSlug[]>(POST_SLUGS_QUERY);
    return slugs.map((s) => ({ slug: s.slug }));
  } catch {
    return [];
  }
}

async function getPost(slug: string): Promise<PostData | null> {
  try {
    return await sanityFetch<PostData | null>({
      query: POST_QUERY,
      params: { slug },
      tags: ["post", `post:${slug}`],
    });
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  const title = post.seo?.metaTitle || post.title;
  const description = post.seo?.metaDescription || post.excerpt;
  const ogSource = post.seo?.ogImage ?? post.coverImage;
  const ogImage = ogSource?.asset
    ? urlFor(ogSource).width(1200).height(630).fit("crop").url()
    : undefined;

  return {
    title,
    description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      type: "article",
      url: `/blog/${slug}`,
      title,
      description,
      locale: "th_TH",
      publishedTime: post.publishedAt,
      modifiedTime: post._updatedAt,
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const ogSource = post.seo?.ogImage ?? post.coverImage;
  const ogImage = ogSource?.asset
    ? urlFor(ogSource).width(1200).height(630).fit("crop").url()
    : undefined;

  return (
    <>
      <BlogPostingJsonLd
        title={post.title}
        description={post.excerpt}
        slug={post.slug}
        datePublished={post.publishedAt}
        dateModified={post._updatedAt}
        imageUrl={ogImage}
      />
      <Navbar />
      <main>
        <article className="post">
          <div className="wrap post-wrap">
            <Breadcrumb
              items={[
                { label: "กลับหน้าแรก", href: "/" },
                { label: "บทความ", href: "/blog" },
                { label: post.title },
              ]}
            />

            <header className="post-header">
              <div className="post-card-meta">
                {post.category ? (
                  <span className="pill">{post.category}</span>
                ) : null}
                <time dateTime={post.publishedAt} className="small">
                  {formatThaiDate(post.publishedAt)}
                </time>
              </div>
              <h1 className="h1">{post.title}</h1>
              {post.excerpt ? (
                <p className="lede" style={{ marginTop: 16 }}>
                  {post.excerpt}
                </p>
              ) : null}
            </header>

            {post.coverImage?.asset ? (
              <Image
                src={urlFor(post.coverImage)
                  .width(1600)
                  .height(900)
                  .fit("crop")
                  .auto("format")
                  .url()}
                alt={post.coverImage.alt ?? post.title}
                width={1600}
                height={900}
                sizes="(max-width: 800px) 100vw, 800px"
                priority
                className="post-cover"
              />
            ) : null}

            {post.body?.length ? <PortableTextBody value={post.body} /> : null}
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
