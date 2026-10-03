import type { Metadata } from "next";

import { Breadcrumb } from "@/components/Breadcrumb";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { PostCard } from "@/components/PostCard";
import { DEFAULT_OG_IMAGE } from "@/lib/page-schema";
import { SITE_NAME } from "@/lib/site";
import { sanityFetch } from "@/sanity/lib/fetch";
import { POSTS_QUERY, SETTINGS_QUERY } from "@/sanity/lib/queries";
import type { BlogSettings, PostCardData } from "@/sanity/lib/types";

const DEFAULT_TITLE = "บทความและความรู้";
const DEFAULT_DESCRIPTION =
  "สาระน่ารู้เรื่องการฟื้นฟู กายภาพบำบัด และการดูแลผู้ป่วยที่บ้าน โดยทีม CareConnect";

export const metadata: Metadata = {
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    url: "/blog",
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    locale: "th_TH",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
};

export default async function BlogIndexPage() {
  const [settings, posts] = await Promise.all([
    sanityFetch<BlogSettings | null>({
      query: SETTINGS_QUERY,
      tags: ["settings"],
    }).catch(() => null),
    sanityFetch<PostCardData[]>({
      query: POSTS_QUERY,
      tags: ["post"],
    }).catch(() => []),
  ]);

  const title = settings?.blogTitle || DEFAULT_TITLE;
  const description = settings?.blogDescription || DEFAULT_DESCRIPTION;

  return (
    <>
      <Navbar />
      <main>
        <section>
          <div className="wrap">
            <Breadcrumb
              items={[{ label: "กลับหน้าแรก", href: "/" }, { label: "บทความ" }]}
            />
            <div className="section-head">
              <div>
                <span className="eyebrow">บทความและความรู้</span>
                <h1 className="h1" style={{ marginTop: 10 }}>
                  {title}
                </h1>
                <p className="lede" style={{ marginTop: 16 }}>
                  {description}
                </p>
              </div>
            </div>

            {posts.length ? (
              <ul className="post-grid">
                {posts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </ul>
            ) : (
              <p className="lede">ยังไม่มีบทความในขณะนี้ โปรดกลับมาใหม่เร็วๆ นี้</p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
