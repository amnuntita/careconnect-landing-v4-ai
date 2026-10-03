import type { Metadata } from "next";

import { ServicePage } from "@/components/ServicePage";
import { contentPageMetadata } from "@/lib/page-schema";
import { COGNITIVE_PAGE } from "@/lib/service-pages";

export const metadata: Metadata = contentPageMetadata(COGNITIVE_PAGE);

export default function Page() {
  return <ServicePage page={COGNITIVE_PAGE} />;
}
