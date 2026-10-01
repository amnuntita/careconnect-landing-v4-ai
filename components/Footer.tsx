import Image from "next/image";

import {
  ADDRESS_TEXT,
  CLINIC_NAME,
  COMPANY_REGISTRATION_NUMBER,
  EMAIL,
  FACILITY_REGISTRATION_NUMBER,
  LEGAL_NAME,
  PROVINCES_SERVED,
} from "@/lib/site";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="top">
          <div>
            <a href="#top" className="logo" aria-label="CareConnect">
              <Image
                src="/images/CareConnect Logo.png"
                alt="CareConnect"
                width={2000}
                height={2000}
                className="brand-logo brand-logo--footer"
              />
            </a>
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
                <a href="https://lin.ee/S8VPTxqA">
                  LINE ID: @careconnect (<u>คลิกเพื่อแอดไลน์</u>)
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
            <h3 className="col-h">ข้อมูล</h3>
            <ul>
              <li>
                <a href="#pricing">แพ็กเกจและราคา</a>
              </li>
              <li>
                <a href="#team">ทีมของเรา</a>
              </li>
              <li>
                <a href="/terms">เงื่อนไขการใช้บริการ</a>
              </li>
              <li>
                <a href="/privacy">นโยบายความเป็นส่วนตัว</a>
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
