import type { ReactNode } from "react";

import { Breadcrumb } from "@/components/Breadcrumb";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Segs } from "@/components/Segs";
import { Footer } from "@/components/Footer";
import { ArrowIcon, LineIcon } from "@/components/Icons";
import { LeadForm } from "@/components/LeadForm";
import { Navbar } from "@/components/Navbar";
import { ProcessDiagram } from "@/components/ProcessDiagram";
import { StickyCTABar } from "@/components/StickyCTABar";
import { Team } from "@/components/Team";
import { fillTokens, type Block, type ContentPage } from "@/lib/content-blocks";
import { LINE_URL } from "@/lib/site";

// Renders the draft-generated content pages (lib/content-blocks.ts).

export const CTA_LABELS = {
  form: "ทดลองทำกายภาพ",
  line: "สอบถามผ่าน LINE",
} as const;

export function CtaRow({ items }: { items: ("form" | "line")[] }) {
  return (
    <div className="hero-cta-row longform-cta" data-sticky-hide>
      {items.map((kind) =>
        kind === "line" ? (
          // Ghost style: white on LINE green (#06C755) is only 2.26:1.
          <a key={kind} className="btn ghost" href={LINE_URL}>
            <LineIcon /> {CTA_LABELS.line}
          </a>
        ) : (
          <a key={kind} className="btn" href="#form">
            {CTA_LABELS.form} <ArrowIcon />
          </a>
        ),
      )}
    </div>
  );
}

// Blocks rendered as full-width sections rather than inside the prose column.
const FULL_WIDTH = new Set<Block["t"]>(["team", "form", "process", "closing", "inclusions"]);

export type CustomRender = (block: Block, key: number) => ReactNode | undefined;

function ProseBlock({
  block,
  published,
  custom,
  index,
}: {
  block: Block;
  // Published blog posts among this page's blogLink slugs: slug → title.
  published: Map<string, string>;
  custom?: CustomRender;
  index: number;
}) {
  const own = custom?.(block, index);
  if (own !== undefined) return <>{own}</>;
  switch (block.t) {
    case "h2":
      return (
        <h2 className="h2" id={block.id}>
          {fillTokens(block.text)}
        </h2>
      );
    case "h3":
      return <h3 className="h3">{fillTokens(block.text)}</h3>;
    case "p":
      return (
        <p className={block.style === "signature" ? "signature" : block.style}>
          <Segs segs={block.segs} />
        </p>
      );
    case "ul":
      return (
        <ul>
          {block.items.map((item, i) => (
            <li key={i}>
              <Segs segs={item} />
            </li>
          ))}
        </ul>
      );
    case "cards":
      return (
        <ul className="value-cards">
          {block.items.map((card) => (
            <li key={card.title} className="value-card">
              <h3 className="h3">{card.title}</h3>
              <p>{card.text}</p>
            </li>
          ))}
        </ul>
      );
    case "dl":
      return (
        <dl className="facts-list">
          {block.items.map((item) => (
            <div key={item.label}>
              <dt>{item.label}:</dt>
              <dd>
                <Segs segs={item.value} />
              </dd>
            </div>
          ))}
        </dl>
      );
    case "cta":
      return <CtaRow items={block.items} />;
    case "faq":
      return (
        <section aria-labelledby={`${block.id}-heading`}>
          <h2 className="h2" id={`${block.id}-heading`}>
            {fillTokens(block.heading)}
          </h2>
          <FaqAccordion items={block.items} />
        </section>
      );
    case "blogLink":
      // Link only to a published post, never to a 404. The link text is the
      // post's own title, so it always names the page it points to.
      return published.has(block.slug) ? (
        <p>
          <Segs
            segs={block.segs.map((seg) =>
              typeof seg === "object" && "href" in seg && seg.href === `/blog/${block.slug}`
                ? { ...seg, text: published.get(block.slug) || seg.text }
                : seg,
            )}
          />
        </p>
      ) : null;
    default:
      return null;
  }
}

function FullWidthBlock({ block, custom, index }: { block: Block; custom?: CustomRender; index: number }) {
  const own = custom?.(block, index);
  if (own !== undefined) return <>{own}</>;
  switch (block.t) {
    case "team":
      return <Team showHeading={false} />;
    case "form":
      return <LeadForm />;
    case "process":
      return <ProcessDiagram heading={fillTokens(block.heading)} />;
    case "closing":
      return (
        <section className="content-closing">
          <div className="wrap post-wrap">
            <h2 className="h2">{fillTokens(block.heading)}</h2>
            <CtaRow items={block.cta} />
          </div>
        </section>
      );
    default:
      return null;
  }
}

// A full content page: Navbar, breadcrumb, H1, the blocks in draft order,
// Footer, and the sticky CTA bar when the page has a lead form.
export function ContentPageView({
  page,
  published = new Map(),
  custom,
  jsonLd,
}: {
  page: ContentPage;
  published?: Map<string, string>;
  custom?: CustomRender;
  jsonLd?: ReactNode;
}) {
  // Split into prose chunks around the full-width sections.
  const chunks: (Block[] | Block)[] = [[]];
  page.blocks.forEach((block) => {
    if (FULL_WIDTH.has(block.t)) chunks.push(block, []);
    else (chunks[chunks.length - 1] as Block[]).push(block);
  });
  const indexOf = new Map(page.blocks.map((b, i) => [b, i]));
  const hasForm = page.blocks.some((b) => b.t === "form");

  return (
    <>
      {jsonLd}
      <Navbar />
      <main className="longform-page content-page">
        <article>
          {chunks.map((chunk, i) => {
            if (!Array.isArray(chunk)) {
              return <FullWidthBlock key={i} block={chunk} custom={custom} index={indexOf.get(chunk)!} />;
            }
            if (i !== 0 && !chunk.length) return null;
            return (
              <div key={i} className="wrap post-wrap post-body longform">
                {i === 0 ? (
                  <>
                    <Breadcrumb
                      items={[
                        { label: "กลับหน้าแรก", href: "/" },
                        ...page.parents,
                        { label: fillTokens(page.h1) },
                      ]}
                    />
                    <h1 className="h1">{fillTokens(page.h1)}</h1>
                  </>
                ) : null}
                {chunk.map((block) => (
                  <ProseBlock
                    key={indexOf.get(block)}
                    block={block}
                    published={published}
                    custom={custom}
                    index={indexOf.get(block)!}
                  />
                ))}
              </div>
            );
          })}
        </article>
      </main>
      <Footer />
      {hasForm ? (
        <StickyCTABar primaryLabel={CTA_LABELS.form} lineLabel={CTA_LABELS.line} lineHref={LINE_URL} />
      ) : null}
    </>
  );
}

// Prose-only rendering (used inside LegalPage for /terms).
export function ProseBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, i) => (
        <ProseBlock key={i} block={block} published={new Map()} index={i} />
      ))}
    </>
  );
}
