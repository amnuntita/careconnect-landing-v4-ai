import {
  BALANCE,
  DEPOSIT,
  formatPrice,
  PACKAGES,
  perSessionLabel,
} from "@/lib/packages";

import { CheckIcon } from "./Icons";

const RISK = [
  "ผ่อนชำระได้",
  "ไม่ผูกมัดการต่อคอร์ส",
  "ออกใบรับรองแพทย์ได้",
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
                <tr key={p.name}>
                  <td className="pkg-cell-program">
                    <div className="pname">
                      {p.name}
                      {p.badge && (
                        <span className="ribbon-inline">{p.badge}</span>
                      )}
                    </div>
                  </td>
                  <td className="pkg-cell-target">{p.target}</td>
                  <td className="pkg-cell-price">
                    <p className="price">
                      {formatPrice(p.price)} <span className="unit">บาท</span>
                    </p>
                    <small>{perSessionLabel(p)}</small>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* The deposit is explanatory copy only, never a separate Offer. */}
        <div className="pkg-deposit" style={{ marginTop: 20 }}>
          <p>
            <strong>เริ่มก่อนเพียง {formatPrice(DEPOSIT)} บาท</strong>
          </p>
          <p>ครอบคลุมการประเมินโดยแพทย์และการฝึกที่บ้านครั้งแรก</p>
          <p>
            หากต้องการฝึกต่อ จึงชำระส่วนที่เหลือ {formatPrice(BALANCE)} บาท
            เพื่อรับบริการต่อจนครบ 10 ครั้ง โดยสามารถแบ่งชำระได้ตามเงื่อนไขของบริการ
          </p>
        </div>
      </div>
    </section>
  );
}
