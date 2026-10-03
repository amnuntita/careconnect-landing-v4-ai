import type { Metadata } from "next";

import { ContentPageView } from "@/components/ContentBlocks";
import { JsonLdScript } from "@/components/JsonLd";
import { ABOUT_PAGE } from "@/lib/about-page";
import {
  breadcrumbNode,
  contentPageMetadata,
  graph,
  siteStubs,
  webPageNode,
} from "@/lib/page-schema";
import { DR_JIRAPORN, DR_SUVINAI, physicianJsonLd } from "@/lib/physicians";
import { ORGANIZATION_ID } from "@/lib/site";

const PAGE = ABOUT_PAGE;

export const metadata: Metadata = contentPageMetadata(PAGE);

function jsonLd() {
  const founder = physicianJsonLd(DR_SUVINAI);
  const physician = physicianJsonLd(DR_JIRAPORN);
  return graph(
    webPageNode(PAGE, "AboutPage", {
      about: { "@id": ORGANIZATION_ID },
      mainEntity: { "@id": ORGANIZATION_ID },
      mentions: [{ "@id": founder["@id"] }, { "@id": physician["@id"] }],
    }),
    breadcrumbNode(PAGE),
    // The Person nodes themselves are emitted by <Team /> on this page.
    ...siteStubs(),
  );
}

export default function AboutPage() {
  return <ContentPageView page={PAGE} jsonLd={<JsonLdScript data={jsonLd()} />} />;
}
