import { ContentPageView } from "@/components/ContentBlocks";
import { JsonLdScript } from "@/components/JsonLd";
import type { ContentPage } from "@/lib/content-blocks";
import {
  breadcrumbNode,
  faqPageNode,
  graph,
  pageUrl,
  serviceNode,
  siteStubs,
  webPageNode,
} from "@/lib/page-schema";
import { getPublishedTitles } from "@/sanity/lib/posts";

// Shared layout for the service landing pages (/bedbound-rehab-at-home, …).
// Everything comes from the page data in lib/service-pages.ts: Breadcrumb, one
// H1, hero copy + CTAs, sections in draft order, ProcessDiagram, FAQ (answers
// in the HTML), LeadForm (#form) and the sticky CTA bar. JSON-LD: WebPage,
// Service, FAQPage (same FAQ data) and BreadcrumbList. No Offer.
export async function ServicePage({ page }: { page: ContentPage }) {
  const blogSlugs = page.blocks.flatMap((b) => (b.t === "blogLink" ? [b.slug] : []));
  const published = await getPublishedTitles(blogSlugs);

  const jsonLd = graph(
    webPageNode(page, "WebPage", { about: { "@id": `${pageUrl(page)}#service` } }),
    serviceNode(page),
    faqPageNode(page),
    breadcrumbNode(page),
    ...siteStubs(),
  );

  return (
    <ContentPageView
      page={page}
      published={published}
      jsonLd={<JsonLdScript data={jsonLd} />}
    />
  );
}
