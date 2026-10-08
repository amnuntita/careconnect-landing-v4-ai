import Link from "next/link";

import { CONDITION_LINKS } from "@/lib/homepage-content";
import { getPublishedSlugs } from "@/sanity/lib/posts";

const BLOG_PREFIX = "/blog/";

// §7 compact row of condition links. A /blog/ destination is linked only if
// that post is published in Sanity; items without a page (e.g. swallowing)
// are plain text. Never renders a link to a missing post.
export async function ConditionLinks() {
  const blogSlugs = CONDITION_LINKS.items
    .map((i) => i.href)
    .filter((h): h is string => Boolean(h?.startsWith(BLOG_PREFIX)))
    .map((h) => h.slice(BLOG_PREFIX.length));
  const published = await getPublishedSlugs(blogSlugs);

  return (
    <section id="conditions" className="conditions-row-section">
      <div className="wrap">
        <h2 className="h3 conditions-row-heading">{CONDITION_LINKS.heading}</h2>
        <ul className="conditions-row">
          {CONDITION_LINKS.items.map(({ label, href }) => {
            const live =
              href &&
              (!href.startsWith(BLOG_PREFIX) ||
                published.has(href.slice(BLOG_PREFIX.length)));
            return (
              <li key={label}>
                {live ? (
                  <Link href={href} className="condition-chip condition-chip--link">
                    {label}
                  </Link>
                ) : (
                  <span className="condition-chip">{label}</span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
