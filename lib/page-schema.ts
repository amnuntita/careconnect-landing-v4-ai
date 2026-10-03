import type { Metadata } from "next";

import { faqAnswerText, fillTokens, type ContentPage, type Faq } from "@/lib/content-blocks";
import {
  ORGANIZATION_ID,
  PROVINCES_SERVED,
  SAMPLE_PHOTO_CAPTION,
  SITE_NAME,
  SITE_URL,
  WEBSITE_ID,
} from "@/lib/site";

// Metadata and JSON-LD for the draft-generated content pages.

export const pageUrl = (page: ContentPage) => `${SITE_URL}${page.path}`;

// The site-wide OG image (app/opengraph-image.jpg). A page that sets its own
// `openGraph` replaces the file-based image, so pages must list it again.
// Alt text matches app/opengraph-image.alt.txt (stock photo: caption required).
export const DEFAULT_OG_IMAGE = {
  url: "/opengraph-image.jpg",
  width: 3750,
  height: 1969,
  alt: `CareConnect บริการกายภาพบำบัดที่บ้าน โดยแพทย์และนักกายภาพบำบัดวิชาชีพ — ${SAMPLE_PHOTO_CAPTION}`,
};

// Full metadata (Next merges metadata shallowly, so openGraph and twitter must
// be complete here). Pages with an unresolved placeholder are noindex.
export function contentPageMetadata(
  page: ContentPage,
  { forceNoindex = false }: { forceNoindex?: boolean } = {},
): Metadata {
  const title = fillTokens(page.title);
  const description = fillTokens(page.description);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: page.path },
    openGraph: {
      type: "website",
      url: page.path,
      siteName: SITE_NAME,
      title,
      description,
      locale: "th_TH",
      images: [DEFAULT_OG_IMAGE],
    },
    twitter: { card: "summary_large_image", title, description, images: [DEFAULT_OG_IMAGE] },
    ...(page.hasPlaceholder || forceNoindex ? { robots: { index: false, follow: true } } : {}),
  };
}

export function pageFaqs(page: ContentPage): Faq[] {
  return page.blocks.flatMap((b) => (b.t === "faq" ? b.items : []));
}

export function webPageNode(page: ContentPage, type = "WebPage", extra: object = {}) {
  const url = pageUrl(page);
  return {
    "@type": type,
    "@id": `${url}#webpage`,
    url,
    name: fillTokens(page.title),
    description: fillTokens(page.description),
    inLanguage: "th-TH",
    isPartOf: { "@id": WEBSITE_ID },
    breadcrumb: { "@id": `${url}#breadcrumb` },
    ...extra,
  };
}

export function breadcrumbNode(page: ContentPage) {
  const url = pageUrl(page);
  const items = [
    { name: "หน้าแรก", item: SITE_URL },
    ...page.parents.map((p) => ({ name: p.label, item: `${SITE_URL}${p.href}` })),
    { name: fillTokens(page.h1), item: url },
  ];
  return {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, ...it })),
  };
}

export function faqPageNode(page: ContentPage) {
  const url = pageUrl(page);
  const faqs = pageFaqs(page);
  if (!faqs.length) return null;
  return {
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    isPartOf: { "@id": `${url}#webpage` },
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: fillTokens(faq.q),
      acceptedAnswer: { "@type": "Answer", text: faqAnswerText(faq) },
    })),
  };
}

export function areaServedOf(names: string[] = PROVINCES_SERVED.map((p) => p.name)) {
  return names.map((name) => ({ "@type": "AdministrativeArea", name }));
}

// A Service offered by #organization. No Offer: prices live on the homepage
// Service's single Offer.
export function serviceNode(page: ContentPage, areaNames?: string[]) {
  const url = pageUrl(page);
  return {
    "@type": "Service",
    "@id": `${url}#service`,
    name: fillTokens(page.h1),
    serviceType: fillTokens(page.h1),
    description: fillTokens(page.description),
    url,
    provider: { "@id": ORGANIZATION_ID },
    areaServed: areaServedOf(areaNames),
    mainEntityOfPage: { "@id": `${url}#webpage` },
  };
}

// Minimal nodes so @id references resolve on this page; the full
// Organization / WebSite nodes are on the homepage.
export function siteStubs() {
  return [
    { "@type": "WebSite", "@id": WEBSITE_ID, name: SITE_NAME, url: SITE_URL },
    { "@type": "Physiotherapy", "@id": ORGANIZATION_ID, name: SITE_NAME, url: SITE_URL },
  ];
}

export function graph(...nodes: (object | null)[]) {
  return { "@context": "https://schema.org", "@graph": nodes.filter(Boolean) };
}
