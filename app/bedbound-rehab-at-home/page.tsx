import type { Metadata } from "next";

import { ServicePage } from "@/components/ServicePage";
import { contentPageMetadata } from "@/lib/page-schema";
import { BEDBOUND_PAGE } from "@/lib/service-pages";

export const metadata: Metadata = contentPageMetadata(BEDBOUND_PAGE);

export default function Page() {
  return <ServicePage page={BEDBOUND_PAGE} />;
}
