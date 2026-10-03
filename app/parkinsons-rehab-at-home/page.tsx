import type { Metadata } from "next";

import { ServicePage } from "@/components/ServicePage";
import { contentPageMetadata } from "@/lib/page-schema";
import { PARKINSONS_PAGE } from "@/lib/service-pages";

export const metadata: Metadata = contentPageMetadata(PARKINSONS_PAGE);

export default function Page() {
  return <ServicePage page={PARKINSONS_PAGE} />;
}
