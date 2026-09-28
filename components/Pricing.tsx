import { CheckIcon } from "./Icons";

const RISK = [
  "ผ่อนชำระได้",
  "ไม่ผูกมัดการต่อคอร์ส",
  "ออกใบรับรองแพทย์ได้",
];

type Package = {
  tier: string;
  name: string;
  target: string;
  price: string;
  sub: string;
  badge?: string;
  special?: boolean;
};

const PACKAGES: Package[] = [
  {
    tier: "TRIAL",
    name: "ทดลองครั้งแรก",
    target: "ผู้ที่ต้องการทดลองใช้บริการครั้งแรก (เฉพาะคนไข้ใหม่)",
    price: "1,290",
    sub: "บาท / ชั่วโมง",
  },
  {
    tier: "HEAD START",
    name: "ทดลอง 5 ครั้ง",
    target: "ผู้ที่ต้องการทดลองใช้บริการระยะสั้น 5 ครั้ง",
    price: "8,450",
    sub: "บาท / 5 ครั้ง · 1,690/ครั้ง",
  },
  {
    tier: "STANDARD",
    name: "มาตรฐาน",
    target: "ฟื้นฟูต่อเนื่องเพื่อผลลัพธ์ที่ชัดเจน 10 ครั้ง",
    price: "15,900",
    sub: "บาท / 10 ครั้ง · 1,590/ครั้ง",
    //badge: "ยอดนิยม",
  },
  {
    tier: "GOLDEN PERIOD",
    name: "ฟื้นฟูเข้มข้น",
    target:
      "คนไข้ที่เพิ่งออกจากโรงพยาบาล ต้องการฟื้นฟูเข้มข้น 30 ครั้ง",
    price: "ราคาพิเศษ",
    sub: "ติดต่อสอบถามทีมงาน",
    special: true,
  },
];

export function Pricing() {
  return (
    <section id="pricing">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow">แพ็กเกจและราคา</span>
            <h2 className="h2" style={{ marginTop: 10 }}>
              เลือกโปรแกรม
              <br />
              ที่เหมาะกับการฟื้นฟูของคุณ
            </h2>
          </div>
         
        </div>

        <ul className="risk-row">
          {RISK.map((text) => (
            <li className="risk" key={text}>
              <span className="check">
                <CheckIcon />
              </span>
              <span>{text}</span>
            </li>
          ))}
        </ul>
        <p className="pkg-foot mb-4">
          * ราคานี้รวมค่าปรึกษาและวางแผนโดยแพทย์ ค่าเดินทาง และอุปกรณ์อื่นๆ
          (หากแพทย์วินิจฉัยว่าต้องใช้อุปกรณ์)
        </p>
        <div className="pkg-table-wrap">
          <table className="pkg-table">
            <thead>
              <tr>
                <th scope="col">โปรแกรม</th>
                <th scope="col">เหมาะสำหรับ</th>
                <th scope="col">ราคา</th>
              </tr>
            </thead>
            <tbody>
              {PACKAGES.map((p) => (
                <tr key={p.tier}>
                  <td className="pkg-cell-program">
                    <span className="tier">{p.tier}</span>
                    <div className="pname">
                      {p.name}
                      {p.badge && (
                        <span className="ribbon-inline">{p.badge}</span>
                      )}
                    </div>
                  </td>
                  <td className="pkg-cell-target">{p.target}</td>
                  <td className="pkg-cell-price">
                    <p className={`price${p.special ? " special" : ""}`}>
                      {p.special ? (
                        <span>{p.price}</span>
                      ) : (
                        <>
                          {p.price} <span className="unit">บาท</span>
                        </>
                      )}
                    </p>
                    <small>{p.sub}</small>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
