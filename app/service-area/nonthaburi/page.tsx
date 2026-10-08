import type { Metadata } from "next";

import { ServiceAreaPage } from "@/components/ServiceAreaPage";
import { contentPageMetadata } from "@/lib/page-schema";
import { NONTHABURI_PAGE } from "@/lib/service-areas";

export const metadata: Metadata = contentPageMetadata(NONTHABURI_PAGE);

export default function Page() {
  return <ServiceAreaPage page={NONTHABURI_PAGE} provinces={["นนทบุรี"]} />;
}
