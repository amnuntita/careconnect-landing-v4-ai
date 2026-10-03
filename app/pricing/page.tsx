import type { Metadata } from "next";

import { ContentPageView } from "@/components/ContentBlocks";
import { InclusionGroups } from "@/components/Inclusions";
import { JsonLdScript } from "@/components/JsonLd";
import {
  breadcrumbNode,
  contentPageMetadata,
  faqPageNode,
  graph,
  siteStubs,
  webPageNode,
} from "@/lib/page-schema";
import { PRICING_PAGE } from "@/lib/pricing-page";
import { SITE_URL } from "@/lib/site";

// /pricing, verbatim from draft section G (lib/pricing-page.ts). Prices are
// tokens from lib/packages.ts; the inclusion groups are the homepage §6 data;
// programme names come from lib/programmes.ts.
const PAGE = PRICING_PAGE;

export const metadata: Metadata = contentPageMetadata(PAGE);

// The homepage Service node carries the single Offer (components/JsonLd.tsx);
// this page points at it instead of repeating the Offer.
const HOME_SERVICE_ID = `${SITE_URL}/#home-physiotherapy`;

function jsonLd() {
  return graph(
    webPageNode(PAGE, "WebPage", { about: { "@id": HOME_SERVICE_ID } }),
    faqPageNode(PAGE),
    breadcrumbNode(PAGE),
    ...siteStubs(),
  );
}

export default function PricingPage() {
  return (
    <ContentPageView
      page={PAGE}
      jsonLd={<JsonLdScript data={jsonLd()} />}
      custom={(block) =>
        block.t === "inclusions" ? (
          <section className="cream content-inclusions">
            <div className="wrap">
              <InclusionGroups />
            </div>
          </section>
        ) : undefined
      }
    />
  );
}
