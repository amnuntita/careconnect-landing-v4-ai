import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumb } from "@/components/Breadcrumb";
import { Footer } from "@/components/Footer";
import { ArrowIcon, LineIcon } from "@/components/Icons";
import { JsonLdScript } from "@/components/JsonLd";
import { LeadForm } from "@/components/LeadForm";
import { Navbar } from "@/components/Navbar";
import { StickyCTABar } from "@/components/StickyCTABar";
import { Team } from "@/components/Team";
import { DR_JIRAPORN, DR_SUVINAI, physicianJsonLd } from "@/lib/physicians";
import {
  LINE_URL,
  ORGANIZATION_ID,
  REVIEW_LINKS,
  SITE_NAME,
  SITE_URL,
  WEBSITE_ID,
} from "@/lib/site";
import {
  STROKE_BLOCKS,
  STROKE_FAQS,
  STROKE_META,
  type StrokeBlock,
} from "@/lib/stroke-page";
import { sanityFetch } from "@/sanity/lib/fetch";

const PATH = "/stroke-rehab-at-home";
const PAGE_URL = `${SITE_URL}${PATH}`;
const LINE_HREF = LINE_URL ?? "#form";

// "ปรับปรุงข้อมูลล่าสุด" date (YYYY-MM-DD). The line and schema lastReviewed
// render only once this is set.
// TODO: supply the publication / last-reviewed date.
const LAST_REVIEWED: string | null = null;

export const metadata: Metadata = {
  title: { absolute: STROKE_META.title },
  description: STROKE_META.description,
  alternates: { canonical: PATH },
  openGraph: {
    type: "article",
    url: PATH,
    siteName: SITE_NAME,
    title: STROKE_META.title,
    description: STROKE_META.description,
    locale: "th_TH",
  },
  twitter: {
    card: "summary_large_image",
    title: STROKE_META.title,
    description: STROKE_META.description,
  },
};

// The guide post lives in Sanity. Link to it only once it's published, so the
// page never points at a 404. The "post" tag revalidates this on publish.
async function postExists(slug: string): Promise<boolean> {
  try {
    const id = await sanityFetch<string | null>({
      query: `*[_type == "post" && slug.current == $slug][0]._id`,
      params: { slug },
      tags: ["post"],
    });
    return Boolean(id);
  } catch {
    return false;
  }
}

function Cta({ items }: { items: { label: string; kind: "form" | "line" }[] }) {
  return (
    <div className="hero-cta-row longform-cta">
      {items.map((item) =>
        item.kind === "line" ? (
          <a key={item.label} className="btn line" href={LINE_HREF}>
            <LineIcon /> {item.label}
          </a>
        ) : (
          <a key={item.label} className="btn" href="#form">
            {item.label} <ArrowIcon />
          </a>
        ),
      )}
    </div>
  );
}

function Faq() {
  return (
    <div className="faq-list">
      {STROKE_FAQS.map((faq) => {
        // [อ่านเงื่อนไขการเลื่อนนัด…] → /terms is not rendered: the draft says
        // to wait for legal review. TODO: link it once /terms is published.
        const href = faq.link?.raw.includes("ต้องการ URL")
          ? REVIEW_LINKS.google
          : null;
        return (
          // Native <details>: collapsed by default, but the answer is in the
          // server HTML for crawlers.
          <details key={faq.q} className="faq-item">
            <summary>
              <h3>{faq.q}</h3>
            </summary>
            <div className="faq-answer">
              {faq.a.map((para) => (
                <p key={para}>{para}</p>
              ))}
              {faq.link && href ? (
                <p>
                  <a href={href} target="_blank" rel="noopener noreferrer">
                    {faq.link.label}
                  </a>
                </p>
              ) : null}
            </div>
          </details>
        );
      })}
    </div>
  );
}

// Renders the prose blocks. Team and the lead form are full-width sections,
// so the prose is split into chunks around them.
function renderBlock(block: StrokeBlock, key: number, blogLinkLive: boolean) {
  switch (block.t) {
    case "h2":
      return (
        <h2 key={key} id={block.id} className="h2">
          {block.text}
        </h2>
      );
    case "h3":
      return (
        <h3 key={key} className="h3">
          {block.text}
        </h3>
      );
    case "h4":
      return <h4 key={key}>{block.text}</h4>;
    case "p":
      return <p key={key}>{block.text}</p>;
    case "lede":
      return (
        <p key={key} className="lede">
          {block.text}
        </p>
      );
    case "offer":
      return (
        <p key={key} className="longform-offer">
          <strong>{block.text}</strong>
        </p>
      );
    case "note":
      return (
        <p key={key} className="small">
          {block.text}
        </p>
      );
    case "flow":
      return (
        <p key={key} className="longform-flow">
          {block.text}
        </p>
      );
    case "ul":
      return (
        <ul key={key}>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "cta":
      return <Cta key={key} items={block.items} />;
    case "toc":
      return (
        <nav key={key} className="longform-toc" aria-labelledby="toc-label">
          <p id="toc-label" className="longform-toc__label">
            {block.label}
          </p>
          <ol>
            {block.items.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`}>{item.label}</a>
              </li>
            ))}
          </ol>
        </nav>
      );
    case "table":
      return (
        <div key={key} className="scroll-table" tabIndex={0} role="region" aria-label={block.head.join(" / ")}>
          <table className="data-table">
            <thead>
              <tr>
                {block.head.map((h) => (
                  <th key={h} scope="col">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell, i) =>
                    i === 0 ? (
                      <th key={i} scope="row">
                        {cell}
                      </th>
                    ) : (
                      <td key={i}>{cell}</td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "blogLink":
      return blogLinkLive ? (
        <p key={key}>
          <Link href={`/blog/${block.slug}#${block.hash}`}>{block.label}</Link>
        </p>
      ) : null;
    case "teamLink":
      return (
        <p key={key}>
          <Link href="/#team">{block.label}</Link>
        </p>
      );
    case "faq":
      return <Faq key={key} />;
    case "byline":
      return (
        <div key={key} className="longform-byline small">
          <p>{block.author}</p>
          <p>{block.reviewer}</p>
          {LAST_REVIEWED ? (
            <p>
              {block.updatedLabel} <time dateTime={LAST_REVIEWED}>{LAST_REVIEWED}</time>
            </p>
          ) : null}
        </div>
      );
    case "disclaimer":
      return (
        <p key={key} className="small">
          {block.text}
        </p>
      );
    default:
      return null;
  }
}

function pageJsonLd() {
  const author = physicianJsonLd(DR_SUVINAI);
  const reviewer = physicianJsonLd(DR_JIRAPORN);
  const webpage = {
    "@type": "MedicalWebPage",
    "@id": `${PAGE_URL}#webpage`,
    url: PAGE_URL,
    name: STROKE_META.title,
    headline: STROKE_META.h1,
    description: STROKE_META.description,
    inLanguage: "th-TH",
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORGANIZATION_ID },
    author: { "@id": author["@id"] },
    reviewedBy: { "@id": reviewer["@id"] },
    ...(LAST_REVIEWED ? { lastReviewed: LAST_REVIEWED } : {}),
  };
  const faqPage = {
    "@type": "FAQPage",
    "@id": `${PAGE_URL}#faq`,
    isPartOf: { "@id": `${PAGE_URL}#webpage` },
    mainEntity: STROKE_FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a.join("\n\n") },
    })),
  };
  // Minimal nodes so the @id references resolve on this page; the full
  // Organization/WebSite nodes are on the homepage.
  const website = { "@type": "WebSite", "@id": WEBSITE_ID, name: SITE_NAME, url: SITE_URL };
  const organization = { "@type": "Physiotherapy", "@id": ORGANIZATION_ID, name: SITE_NAME, url: SITE_URL };
  return {
    "@context": "https://schema.org",
    "@graph": [webpage, faqPage, author, reviewer, website, organization],
  };
}

export default async function StrokeRehabPage() {
  const blogLinkLive = await postExists("stroke-after-discharge-guide");

  // Split blocks into prose chunks around the full-width Team / form sections.
  const chunks: (StrokeBlock[] | "team" | "form")[] = [[]];
  for (const block of STROKE_BLOCKS) {
    if (block.t === "team" || block.t === "form") {
      chunks.push(block.t, []);
    } else {
      (chunks[chunks.length - 1] as StrokeBlock[]).push(block);
    }
  }

  const ctaBlock = STROKE_BLOCKS.find((b) => b.t === "cta");
  const ctaItems = ctaBlock?.t === "cta" ? ctaBlock.items : [];
  const primary = ctaItems.find((i) => i.kind === "form")?.label ?? "";
  const line = ctaItems.find((i) => i.kind === "line")?.label ?? "";

  let key = 0;
  return (
    <>
      <JsonLdScript data={pageJsonLd()} />
      <Navbar />
      <main className="longform-page">
        <article>
          {chunks.map((chunk, i) => {
            if (chunk === "team") return <Team key={i} showHeading={false} />;
            if (chunk === "form") return <LeadForm key={i} />;
            if (!chunk.length) return null;
            return (
              <div key={i} className="wrap post-wrap post-body longform">
                {i === 0 ? (
                  <>
                    <Breadcrumb
                      items={[
                        { label: "กลับหน้าแรก", href: "/" },
                        { label: STROKE_META.h1 },
                      ]}
                    />
                    <h1 className="h1">{STROKE_META.h1}</h1>
                  </>
                ) : null}
                {chunk.map((block) => renderBlock(block, key++, blogLinkLive))}
              </div>
            );
          })}
        </article>
      </main>
      <Footer />
      <StickyCTABar primaryLabel={primary} lineLabel={line} lineHref={LINE_HREF} />
    </>
  );
}
