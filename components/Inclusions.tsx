import Link from "next/link";
import type { ComponentType, SVGProps } from "react";

import { fillPrices, INCLUSIONS } from "@/lib/homepage-content";

import {
  ActivityIcon,
  CheckIcon,
  StethoscopeIcon,
  UsersIcon,
  WalkerIcon,
  WalletIcon,
} from "./Icons";

// One icon per inclusion group, in the draft's order.
const GROUP_ICONS: ComponentType<SVGProps<SVGSVGElement>>[] = [
  StethoscopeIcon, // จากแพทย์เวชศาสตร์ฟื้นฟู
  WalkerIcon, // จากนักกายภาพบำบัดหรือนักกิจกรรมบำบัด
  ActivityIcon, // อุปกรณ์ทางการแพทย์ที่นำไปที่บ้าน
  UsersIcon, // สำหรับครอบครัว
  WalletIcon, // ความยืดหยุ่น
];

// The five "what's included" groups. Shared by homepage §6 and /pricing, so
// the copy exists once (INCLUSIONS in lib/homepage-content.ts).
export function InclusionGroups() {
  return (
    <ul className="inclusion-grid">
      {INCLUSIONS.groups.map((g, i) => {
        const Icon = GROUP_ICONS[i];
        return (
          <li className="inclusion-card" key={g.title}>
            <span className="inclusion-icon" aria-hidden="true">
              <Icon />
            </span>
            <h3 className="inclusion-title">{g.title}</h3>
            <ul className="inclusion-list">
              {g.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </li>
        );
      })}
    </ul>
  );
}

// §6 on the homepage: what every programme includes as five one-line bullets
// (the full groups are on /pricing via InclusionGroups) and the price as a
// plain breakdown: first visit, the rest, total. Amounts come from
// lib/packages.ts via fillPrices.
export function Inclusions() {
  const s = INCLUSIONS;
  return (
    <section id="pricing" className="cream">
      <div className="wrap">
        <div className="section-head">
          <h2 className="h2">{s.heading}</h2>
        </div>

        <div className="course-split">
          <div>
            <h3 className="course-label">{s.includedLabel}</h3>
            <ul className="course-included">
              {s.summary.map((item) => (
                <li key={item}>
                  <CheckIcon aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="course-label">{s.priceLabel}</h3>
            <dl className="course-price">
              {s.priceRows.map((row) => (
                <div className="course-price-row" key={row.label}>
                  <dt>
                    {row.label}
                    <span className="course-price-note">{fillPrices(row.note)}</span>
                  </dt>
                  <dd>{fillPrices(row.amount)} บาท</dd>
                </div>
              ))}
              <div className="course-price-row is-total">
                <dt>{s.priceTotal.label}</dt>
                <dd>{fillPrices(s.priceTotal.amount)} บาท</dd>
              </div>
            </dl>
            <p className="course-price-includes">{s.priceIncludes}</p>
            <p className="price-link">
              <Link href={s.pricingLink.href}>{s.pricingLink.text}</Link>
              {s.pricingLink.rest}
            </p>
          </div>
        </div>

        {/* No CTA here (the sticky bottom bar carries it), and no insurance
            coverage note: that is covered on /pricing. */}
      </div>
    </section>
  );
}
