import type { ComponentType, SVGProps } from "react";

import { TRUST } from "@/lib/homepage-content";
import {
  CLINIC_NAME,
  FACILITY_REGISTRATION_NUMBER,
  FAMILIES_SERVED,
  REVIEW_LINKS,
  YEARS_OF_OPERATION,
} from "@/lib/site";

import { AwardIcon, HeartIcon, ShieldIcon, StethoscopeIcon } from "./Icons";

// §2 trust strip. Copy is the draft's; the licence number and the families
// figure come from lib/site.ts so they always match the rest of the site.
export function TrustStrip() {
  const [facility, doctor, licensed, families] = TRUST.items;
  const reviewLinks = [
    { href: REVIEW_LINKS.google, label: TRUST.reviewLinks[0] },
    { href: REVIEW_LINKS.facebook, label: TRUST.reviewLinks[1] },
  ].filter((l): l is { href: string; label: string } => Boolean(l.href));

  const items: {
    Icon: ComponentType<SVGProps<SVGSVGElement>>;
    title: string;
    detail?: React.ReactNode;
  }[] = [
    {
      Icon: ShieldIcon,
      title: facility[0],
      detail: `ภายใต้${CLINIC_NAME} ใบอนุญาตเลขที่ ${FACILITY_REGISTRATION_NUMBER}`,
    },
    { Icon: StethoscopeIcon, title: doctor[0] },
    { Icon: AwardIcon, title: licensed[0] },
    {
      Icon: HeartIcon,
      title: `ดูแลครอบครัวมาแล้วกว่า ${FAMILIES_SERVED} ครอบครัวในช่วง ${YEARS_OF_OPERATION} ปี`,
      detail: reviewLinks.length ? (
        <span className="trust-links">
          {reviewLinks.map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer">
              {l.label}
            </a>
          ))}
        </span>
      ) : undefined,
    },
  ];
  // Guard against the draft and lib/site drifting apart (checked at build).
  if (items[3].title !== families[0]) {
    throw new Error(`TrustStrip families line differs from the draft: ${items[3].title}`);
  }
  if (items[0].detail !== facility[1]) {
    throw new Error(`TrustStrip licence line differs from the draft: ${String(items[0].detail)}`);
  }

  return (
    <section className="trust-strip" aria-label="ข้อมูลความน่าเชื่อมั่น">
      <div className="wrap">
        <ul className="trust-grid">
          {items.map(({ Icon, title, detail }) => (
            <li className="trust-item" key={title}>
              <span className="trust-icon" aria-hidden="true">
                <Icon />
              </span>
              <div>
                <p className="trust-title">{title}</p>
                {detail ? <p className="trust-detail">{detail}</p> : null}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
