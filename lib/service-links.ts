import "server-only";

import { getPublishedSlugs } from "@/sanity/lib/posts";

// Service pages, in menu order. Used by the Navbar "บริการ" menu, the Footer
// and the "บริการที่ให้…" row on the service-area pages.
export type ServiceLink = {
  label: string;
  href: string;
  // Shorter label used on the service-area pages, where the draft differs.
  areaLabel?: string;
  // Set when the destination is a Sanity post: linked only once published.
  blogSlug?: string;
};

export const SERVICE_LINKS: ServiceLink[] = [
  { label: "ผู้ป่วยโรคหลอดเลือดสมอง", href: "/stroke-rehab-at-home" },
  {
    label: "ผู้สูงอายุ",
    href: "/blog/home-physiotherapy-elderly",
    blogSlug: "home-physiotherapy-elderly",
  },
  { label: "ผู้ป่วยติดเตียง", href: "/bedbound-rehab-at-home" },
  { label: "หลังผ่าตัดเข่าและสะโพก", href: "/post-surgery-rehab-at-home" },
  { label: "โรคพาร์กินสัน", href: "/parkinsons-rehab-at-home" },
  { label: "ฝึกกลืน", href: "/swallowing-therapy-at-home" },
  {
    label: "ทักษะสมองและความจำ",
    areaLabel: "ทักษะสมอง",
    href: "/cognitive-rehab-at-home",
  },
];

// Each link with `live` = false when it points at an unpublished post.
export async function getServiceLinks(): Promise<(ServiceLink & { live: boolean })[]> {
  const slugs = SERVICE_LINKS.flatMap((l) => (l.blogSlug ? [l.blogSlug] : []));
  const published = await getPublishedSlugs(slugs);
  return SERVICE_LINKS.map((l) => ({
    ...l,
    live: !l.blogSlug || published.has(l.blogSlug),
  }));
}

// Top-level menu links after "บริการ".
export const NAV_LINKS = [
  { label: "ค่าบริการ", href: "/pricing" },
  { label: "พื้นที่ให้บริการ", href: "/service-area" },
  { label: "บทความ", href: "/blog" },
  { label: "เกี่ยวกับเรา", href: "/about" },
];
