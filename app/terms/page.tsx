import type { Metadata } from "next";

import { ProseBlocks } from "@/components/ContentBlocks";
import { LegalPage } from "@/components/LegalPage";
import { fillTokens } from "@/lib/content-blocks";
import { contentPageMetadata } from "@/lib/page-schema";
import { TERMS_PAGE } from "@/lib/terms-page";

// Terms of service, verbatim from draft section E (lib/terms-page.ts).
// "[วันที่]" is unresolved and renders as a yellow placeholder.
// TODO: legal sign-off. Until then the page stays noindex and out of
// app/sitemap.ts, whatever its placeholders.

const PAGE = {
  ...TERMS_PAGE,
  // The draft has no meta description for /terms; this one predates it.
  description: "เงื่อนไขการใช้บริการกายภาพบำบัดและกิจกรรมบำบัดที่บ้านของ CareConnect",
};

export const metadata: Metadata = contentPageMetadata(PAGE, { forceNoindex: true });

export default function TermsPage() {
  return (
    <LegalPage title={fillTokens(PAGE.h1)}>
      <ProseBlocks blocks={PAGE.blocks} />
    </LegalPage>
  );
}
