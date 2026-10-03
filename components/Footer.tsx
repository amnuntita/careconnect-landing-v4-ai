import Image from "next/image";
import Link from "next/link";

import {
  ADDRESS_TEXT,
  CLINIC_NAME,
  COMPANY_REGISTRATION_NUMBER,
  EMAIL,
  FACILITY_REGISTRATION_NUMBER,
  LEGAL_NAME,
  LINE_ID,
  LINE_URL,
  PROVINCES_SERVED,
} from "@/lib/site";
import { getServiceLinks } from "@/lib/service-links";

export async function Footer() {
  // Same service links as the Navbar; unpublished blog posts are left out.
  const services = (await getServiceLinks()).filter((l) => l.live);
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="top">
          <div>
            <Link href="/" className="logo" aria-label="CareConnect">
              <Image
                src="/images/CareConnect Logo.png"
                alt="CareConnect"
                width={2000}
                height={2000}
                className="brand-logo brand-logo--footer"
              />
            </Link>
            <p className="blurb">
              บริการกายภาพบำบัดและกิจกรรมบำบัดที่บ้าน
               ครอบคลุม {PROVINCES_SERVED.length} จังหวัดทั่วประเทศ ดูแลโดยนักกายภาพบำบัดวิชาชีพ
              ภายใต้การกำกับของแพทย์เวชศาสตร์ฟื้นฟู
            </p>
          </div>

          <div>
            <h3 className="col-h">ติดต่อ</h3>
            <ul>
              <li>
                <a href="tel:02-114-7168">โทร: 02-114-7168</a>
              </li>
              <li>
                <a href={LINE_URL}>
                  LINE ID: {LINE_ID} (<u>คลิกเพื่อแอดไลน์</u>)
                </a>
              </li>
              <li>
                <a href="https://www.facebook.com/share/r/1BEzYEYdGC/">
                  Facebook: CareConnect กายภาพบำบัดที่บ้าน
                </a>
              </li>
              <li>
                <a href={`mailto:${EMAIL}`}>อีเมล: {EMAIL}</a>
              </li>
              <li>
                {LEGAL_NAME}
                <br />
                {ADDRESS_TEXT}
              </li>
            </ul>
          </div>

          <div>
            <h3 className="col-h">บริการ</h3>
            <ul>
              {services.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="col-h">ข้อมูล</h3>
            <ul>
              <li>
                <Link href="/pricing">แพ็กเกจและราคา</Link>
              </li>
              <li>
                <Link href="/about#team">ทีมของเรา</Link>
              </li>
              <li>
                <Link href="/terms">เงื่อนไขการใช้บริการ</Link>
              </li>
              <li>
                <Link href="/privacy">นโยบายความเป็นส่วนตัว</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="bottom">
          <p>© {new Date().getFullYear()} {LEGAL_NAME} — สงวนสิทธิ์ทุกประการ</p>
          <p>เลขทะเบียนนิติบุคคล: {COMPANY_REGISTRATION_NUMBER}</p>
          <p>
            {CLINIC_NAME} ใบอนุญาตประกอบกิจการสถานพยาบาลเลขที่{" "}
            {FACILITY_REGISTRATION_NUMBER}
          </p>
        </div>
      </div>
    </footer>
  );
}
