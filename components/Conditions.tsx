import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import {
  ActivityIcon,
  BoneIcon,
  BrainIcon,
  HeartIcon,
  PillIcon,
  WalkerIcon,
} from "./Icons";

type Condition = {
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  sub: string;
  // Dedicated landing page for this condition, if any.
  href?: string;
};

const CONDITIONS: Condition[] = [
  {
    Icon: BrainIcon,
    title: "Stroke (อัมพฤกษ์ อัมพาต)",
    sub: "ฟื้นฟูผู้ป่วยติดเตียง ฝึกเดิน ฝึกการใช้มือ",
    href: "/stroke-rehab-at-home",
  },
  {
    Icon: ActivityIcon,
    title: "ฝึกกลืน · ปัญหาการสำลัก",
    sub: "ป้องกันสำลักอาหาร ฝึกปอด ไล่เสมหะ",
  },
  {
    Icon: BoneIcon,
    title: "ผ่าตัดเข่า · สะโพก",
    sub: "ฟื้นฟูหลังผ่าตัดอย่างปลอดภัย",
  },
  {
    Icon: HeartIcon,
    title: "อุบัติเหตุ · บาดเจ็บ",
    sub: "ฟื้นฟูหลังบาดเจ็บจากอุบัติเหตุ",
  },
  {
    Icon: PillIcon,
    title: "ปวดเรื้อรัง",
    sub: "ปวดหลัง คอ บ่า ไหล่ ที่เป็นมาเรื้อรัง",
  },
  {
    Icon: WalkerIcon,
    title: "ภาวะอ่อนแรงในผู้สูงอายุ",
    sub: "Sarcopenia กล้ามเนื้อน้อย ทรงตัวไม่ดี",
  },
];

export function Conditions() {
  return (
    <section id="conditions" className="cream">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow">กลุ่มอาการที่ดูแล</span>
            <h2 className="h2" style={{ marginTop: 10 }}>
              ดูแลครอบคลุม
              <br />
              ทุกกลุ่มอาการการฟื้นฟู
            </h2>
          </div>
        
        </div>

        <ul className="cond-grid">
          {CONDITIONS.map(({ Icon, title, sub, href }) => {
            const content = (
              <>
                <span
                  className="check"
                  style={{
                    flex: "0 0 36px",
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                  }}
                >
                  <Icon style={{ width: 18, height: 18 }} />
                </span>
                <div>
                  <p className="title">{title}</p>
                  <p className="sub">{sub}</p>
                </div>
              </>
            );
            return (
              <li className="cond" key={title}>
                {/* display: contents keeps the tile's flex layout unchanged. */}
                {href ? (
                  <Link href={href} className="cond-link">
                    {content}
                  </Link>
                ) : (
                  content
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
