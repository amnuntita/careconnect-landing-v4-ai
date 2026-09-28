import { NextStudio } from "next-sanity/studio";

import config from "../../../sanity.config";

// The Studio is a static asset shell; content loads client-side from Sanity.
export const dynamic = "force-static";

// Studio-specific metadata (and a noindex viewport) from next-sanity.
export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
