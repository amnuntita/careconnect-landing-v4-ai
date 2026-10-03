import Link from "next/link";
import type { ComponentType, SVGProps } from "react";

import { fillPrices, INCLUSIONS } from "@/lib/homepage-content";

import {
  ActivityIcon,
  ArrowIcon,
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

// §6. The inclusion cards are the prominent element; the price is a normal
// sentence read from lib/packages.ts (via fillPrices), not a headline number,
// and there is no per-session price.
export function Inclusions() {
  const s = INCLUSIONS;
  return (
    <section id="pricing" className="cream">
      <div className="wrap">
        <div className="section-head">
          <div>
            <h2 className="h2">{s.heading}</h2>
            <p className="lede" style={{ marginTop: 14 }}>
              {s.intro}
            </p>
          </div>
        </div>

        <ul className="inclusion-grid">
          {s.groups.map((g, i) => {
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

        <p className="inclusion-callout">{s.callout}</p>

        <div className="price-block">
          <p className="price-line">{fillPrices(s.price)}</p>
          <p className="price-link">
            <Link href={s.pricingLink.href}>
              {s.pricingLink.text} <ArrowIcon />
            </Link>
          </p>
          <p className="price-note">{s.priceNote}</p>

          <h3 className="h3 first-step-heading">{s.firstStepHeading}</h3>
          <div className="first-step">
            <p>{fillPrices(s.firstStepIntro)}</p>
            <ul>
              {s.firstStepItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p>{fillPrices(s.balance)}</p>
          </div>

          <div className="hero-cta-row">
            <a className="btn" href="#form">
              {s.cta} <ArrowIcon />
            </a>
          </div>

          <div className="coverage-note">
            <h3 className="coverage-heading">{s.coverageHeading}</h3>
            <p>{s.coverage}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
