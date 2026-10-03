import type { Metadata } from "next";

import { ServiceAreaPage } from "@/components/ServiceAreaPage";
import { contentPageMetadata } from "@/lib/page-schema";
import { SERVICE_AREA_PAGE } from "@/lib/service-areas";

export const metadata: Metadata = contentPageMetadata(SERVICE_AREA_PAGE);

export default function Page() {
  return <ServiceAreaPage page={SERVICE_AREA_PAGE} />;
}
