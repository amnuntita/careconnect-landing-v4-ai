import { LINE_ID } from "@/lib/public-facts";

import { ArrowIcon, PhoneIcon } from "./Icons";

export function BottomCTA() {
  return (
    <section aria-label="ติดต่อเรา">
      <div className="wrap">
        <div className="bigcta">
          <div>
            <span className="eyebrow">เริ่มต้นวันนี้</span>
            <h2 className="h2" style={{ marginTop: 12 }}>
              เริ่มดูแลวันนี้
              <br />
              เพื่อก้าวต่อไปที่มั่นคง
            </h2>
            <p className="lede" style={{ marginBottom: 24 }}>
              ปรึกษาทีมงานเพื่อรับคำแนะนำเบื้องต้นและแผนการรักษาที่เหมาะสม
              สำหรับคนที่คุณรัก
            </p>
            <div className="hero-cta-row">
              <a className="btn lg" href="#form">
                เช็กพื้นที่บริการ <ArrowIcon />
              </a>
              <a href="tel:021147168" className="btn lg ghost">
                <PhoneIcon /> 02-114-7168
              </a>
            </div>
          </div>

          <div className="qrbox">
            {/* TODO: replace with <Image src="/images/line-qr.png"
                alt="QR code สำหรับเพิ่มเพื่อนใน LINE Official Account ของ CareConnect"
                width={160} height={160} sizes="160px" /> */}
            <div
              className="ph square"
              role="img"
              aria-label="QR code สำหรับเพิ่มเพื่อนใน LINE Official Account ของ CareConnect"
              style={{
                width: 160,
                height: 160,
                aspectRatio: "auto",
                borderRadius: 8,
              }}
            >
              [QR LINE OA]
            </div>
            <p style={{ fontWeight: 600, fontSize: 16, margin: 0 }}>
              Line ID: {LINE_ID}
            </p>
            <p style={{ fontSize: 13, color: "var(--muted)", margin: 0 }}>
              สแกนเพื่อแอดเพื่อน
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
