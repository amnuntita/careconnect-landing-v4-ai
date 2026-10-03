import Image from "next/image";
import Link from "next/link";

import { getServiceLinks, NAV_LINKS } from "@/lib/service-links";

import { ChevronDownIcon, MenuIcon, PhoneIcon } from "./Icons";
import { NavMenuCloser } from "./NavMenuCloser";

// Desktop (≥1024px): "บริการ" dropdown + top-level links.
// Mobile: one "เมนู" panel listing everything. Both are native <details>, so
// they work without JS; NavMenuCloser adds Escape / click-outside.
export async function Navbar() {
  // "ผู้สูงอายุ" points at a Sanity post: shown only once it's published.
  const services = (await getServiceLinks()).filter((l) => l.live);

  return (
    <header className="nav">
      <div className="wrap inner">
        <Link href="/" className="logo" aria-label="CareConnect">
          <Image
            src="/images/CareConnect Logo.png"
            alt="CareConnect"
            width={2000}
            height={2000}
            priority
            className="brand-logo"
          />
        </Link>

        <nav aria-label="เมนูหลัก" className="nav-desktop">
          <details className="nav-dropdown" data-nav-menu>
            <summary className="nav-text-link">
              บริการ <ChevronDownIcon />
            </summary>
            <ul className="nav-dropdown-panel">
              {services.map((s) => (
                <li key={s.href}>
                  <Link href={s.href}>{s.label}</Link>
                </li>
              ))}
            </ul>
          </details>
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="nav-text-link">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="nav-actions">
          <a href="tel:021147168" className="icon-btn" aria-label="โทรหาเรา">
            <PhoneIcon />
            <span>โทรติดต่อ</span>
          </a>
          <details className="nav-mobile" data-nav-menu>
            <summary className="icon-btn nav-mobile-toggle" aria-label="เปิดเมนู">
              <MenuIcon />
              <span>เมนู</span>
            </summary>
            <nav aria-label="เมนูหลัก" className="nav-mobile-panel">
              <p className="nav-mobile-heading">บริการ</p>
              <ul>
                {services.map((s) => (
                  <li key={s.href}>
                    <Link href={s.href}>{s.label}</Link>
                  </li>
                ))}
              </ul>
              <ul className="nav-mobile-top">
                {NAV_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          </details>
        </div>
      </div>
      <NavMenuCloser />
    </header>
  );
}
