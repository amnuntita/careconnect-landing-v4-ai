import Image from "next/image";
import Link from "next/link";
import { PhoneIcon } from "./Icons";

export function Navbar() {
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

        <nav
          aria-label="เมนูหลัก"
          style={{ display: "flex", alignItems: "center", gap: 8 }}
        >
          <Link href="/#conditions" className="nav-text-link">
            กลุ่มอาการ
          </Link>
          <Link href="/#pricing" className="nav-text-link">
            ราคา
          </Link>
          <Link href="/#team" className="nav-text-link">
            ทีมของเรา
          </Link>
          <Link href="/blog" className="nav-text-link">
            บทความ
          </Link>
          <Link href="/#form" className="nav-text-link">
            เช็กพื้นที่
          </Link>
        </nav>

        <div className="nav-actions">
          <a href="tel:021147168" className="icon-btn" aria-label="โทรหาเรา">
            <PhoneIcon />
            <span>โทรติดต่อ</span>
          </a>
        </div>
      </div>
    </header>
  );
}
