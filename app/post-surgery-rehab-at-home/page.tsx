import type { Metadata } from "next";

import { ServicePage } from "@/components/ServicePage";
import { contentPageMetadata } from "@/lib/page-schema";
import { POST_SURGERY_PAGE } from "@/lib/service-pages";

export const metadata: Metadata = contentPageMetadata(POST_SURGERY_PAGE);

export default function Page() {
  return <ServicePage page={POST_SURGERY_PAGE} />;
}
