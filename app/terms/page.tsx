import type { Metadata } from "next";
import Link from "next/link";

import { LegalPage, PendingSection } from "@/components/LegalPage";
import { PROVINCES_SERVED, SITE_NAME } from "@/lib/site";

// DRAFT skeleton, not legal text. Only restates what the site already says
// elsewhere. TODO: legal review of the whole page before publishing.

const TITLE = "เงื่อนไขการใช้บริการ";
const DESCRIPTION =
  "เงื่อนไขการใช้บริการกายภาพบำบัดและกิจกรรมบำบัดที่บ้านของ CareConnect";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/terms" },
  openGraph: {
    type: "website",
    url: "/terms",
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
    locale: "th_TH",
  },
  // TODO: remove noindex once legal review is done, then add /terms to app/sitemap.ts.
  robots: { index: false, follow: true },
};

export default function TermsPage() {
  return (
    <LegalPage title={TITLE}>
      <h2 className="h2">บริการของเรา</h2>
      <p>
        {SITE_NAME} ให้บริการกายภาพบำบัดและกิจกรรมบำบัดที่บ้านของคนไข้
        โดยนักกายภาพบำบัดวิชาชีพ วางแผนรายเคสโดยแพทย์เวชศาสตร์ฟื้นฟู
      </p>
      <p>
        พื้นที่ให้บริการ: {PROVINCES_SERVED.map((p) => p.label).join(", ")}
      </p>
      {/* TODO: legal review — scope of service and what is not covered. */}

      <h2 className="h2">แพ็กเกจและราคา</h2>
      <p>
        ดูแพ็กเกจและราคาปัจจุบันได้ที่{" "}
        <Link href="/#pricing">หน้าแพ็กเกจและราคา</Link>{" "}
        ราคารวมค่าปรึกษาและวางแผนโดยแพทย์ ค่าเดินทาง และอุปกรณ์อื่นๆ
        (หากแพทย์วินิจฉัยว่าต้องใช้อุปกรณ์)
      </p>
      {/* TODO: legal review — price validity, payment terms, instalments. */}

      <h2 className="h2">การนัดหมาย</h2>
      {/* TODO: legal review — booking process and confirmation. */}
      <PendingSection />

      <h2 className="h2">การเลื่อนและยกเลิกนัด</h2>
      {/* TODO: legal review — rescheduling/cancellation notice period and fees. */}
      <PendingSection />

      <h2 className="h2">การชำระเงินและการคืนเงิน</h2>
      {/* TODO: legal review — payment methods, unused-session refunds. */}
      <PendingSection />

      <h2 className="h2">ข้อมูลบนเว็บไซต์</h2>
      {/* TODO: legal review — website content disclaimer / limitation of liability. */}
      <PendingSection />

      <h2 className="h2">ติดต่อเรา</h2>
      <p>
        โทร <a href="tel:02-114-7168">02-114-7168</a>
      </p>
    </LegalPage>
  );
}
