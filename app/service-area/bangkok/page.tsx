import type { Metadata } from "next";

import { ServiceAreaPage } from "@/components/ServiceAreaPage";
import { contentPageMetadata } from "@/lib/page-schema";
import { BANGKOK_PAGE } from "@/lib/service-areas";

export const metadata: Metadata = contentPageMetadata(BANGKOK_PAGE);

export default function Page() {
  return <ServiceAreaPage page={BANGKOK_PAGE} provinces={["กรุงเทพมหานคร"]} />;
}
