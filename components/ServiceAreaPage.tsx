import Link from "next/link";

import { ContentPageView } from "@/components/ContentBlocks";
import { JsonLdScript } from "@/components/JsonLd";
import type { ContentPage } from "@/lib/content-blocks";
import {
  breadcrumbNode,
  faqPageNode,
  graph,
  pageUrl,
  serviceNode,
  siteStubs,
  webPageNode,
} from "@/lib/page-schema";
import { getServiceLinks, SERVICE_LINKS } from "@/lib/service-links";
import { AREA_SERVICE_LABELS, BANGKOK_DISTRICT_ZONES } from "@/lib/service-areas";
import { PROVINCES_SERVED } from "@/lib/site";

// Guard: the draft's "บริการที่ให้…" row must match the service links.
const ROW_LABELS = SERVICE_LINKS.map((l) => l.areaLabel ?? l.label);
if (JSON.stringify(ROW_LABELS) !== JSON.stringify(AREA_SERVICE_LABELS)) {
  throw new Error("AREA_SERVICE_LABELS no longer match SERVICE_LINKS.");
}
// Guard: 50 unique Bangkok districts.
if (new Set(BANGKOK_DISTRICT_ZONES.flatMap((z) => z.districts)).size !== 50) {
  throw new Error("BANGKOK_DISTRICT_ZONES must list the 50 Bangkok districts.");
}

// Shared layout for /service-area and its province pages. "พื้นที่ให้บริการ"
// only: never "สาขา". No LocalBusiness and no address in JSON-LD: these are
// service areas, not branches. `provinces` = areaServed of this page (all
// PROVINCES_SERVED on the hub).
export async function ServiceAreaPage({
  page,
  provinces,
}: {
  page: ContentPage;
  provinces?: string[];
}) {
  const services = await getServiceLinks();

  const jsonLd = graph(
    webPageNode(page, "WebPage", { about: { "@id": `${pageUrl(page)}#service` } }),
    serviceNode(page, provinces),
    faqPageNode(page),
    breadcrumbNode(page),
    ...siteStubs(),
  );

  return (
    <ContentPageView
      page={page}
      jsonLd={<JsonLdScript data={jsonLd} />}
      custom={(block) => {
        if (block.t === "provinces") {
          return (
            <ul className="chip-list">
              {PROVINCES_SERVED.filter((p) => !block.exclude.includes(p.name)).map((p) => (
                <li key={p.name}>{p.name}</li>
              ))}
            </ul>
          );
        }
        if (block.t === "districts") {
          return (
            <>
              {BANGKOK_DISTRICT_ZONES.map((zone) => (
                <div key={zone.zone}>
                  <h3 className="h3">{zone.zone}</h3>
                  <ul className="chip-list">
                    {zone.districts.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </>
          );
        }
        if (block.t === "services") {
          return (
            <ul className="chip-list chip-list--links">
              {services.map((s) => (
                <li key={s.href}>
                  {/* A blog post that isn't published yet stays plain text. */}
                  {s.live ? <Link href={s.href}>{s.areaLabel ?? s.label}</Link> : s.areaLabel ?? s.label}
                </li>
              ))}
            </ul>
          );
        }
        return undefined;
      }}
    />
  );
}
