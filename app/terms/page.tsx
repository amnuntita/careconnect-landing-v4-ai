import type { Metadata } from "next";

import { ProseBlocks } from "@/components/ContentBlocks";
import { LegalPage } from "@/components/LegalPage";
import { fillTokens } from "@/lib/content-blocks";
import { contentPageMetadata } from "@/lib/page-schema";
import { TERMS_PAGE } from "@/lib/terms-page";

// Terms of service, approved by legal. Content (incl. meta title and
// description) is in lib/terms-page.ts, generated verbatim from
// content-drafts/terms-web.txt.

const PAGE = TERMS_PAGE;

export const metadata: Metadata = contentPageMetadata(PAGE);

export default function TermsPage() {
  return (
    <LegalPage title={fillTokens(PAGE.h1)}>
      <ProseBlocks blocks={PAGE.blocks} />
    </LegalPage>
  );
}
