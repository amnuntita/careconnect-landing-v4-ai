import type { Metadata } from "next";

import { ServicePage } from "@/components/ServicePage";
import { contentPageMetadata } from "@/lib/page-schema";
import { SWALLOWING_PAGE } from "@/lib/service-pages";

export const metadata: Metadata = contentPageMetadata(SWALLOWING_PAGE);

export default function Page() {
  return <ServicePage page={SWALLOWING_PAGE} />;
}
