import type { Metadata } from "next";

import { LegalPage, PendingSection } from "@/components/LegalPage";
import { COMPANY_REGISTRATION_NUMBER, LEGAL_NAME, SITE_NAME } from "@/lib/site";

// DRAFT skeleton, not legal text. Everything here is limited to what the code
// actually does (see app/api/lead/route.ts, components/LeadForm.tsx,
// app/layout.tsx). TODO: legal review of the whole page before publishing.

const TITLE = "นโยบายความเป็นส่วนตัว";
const DESCRIPTION =
  "นโยบายความเป็นส่วนตัวของ CareConnect: ข้อมูลที่เราเก็บจากแบบฟอร์ม วัตถุประสงค์การใช้ และสิทธิของเจ้าของข้อมูลส่วนบุคคล";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/privacy" },
  openGraph: {
    type: "website",
    url: "/privacy",
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
    locale: "th_TH",
  },
  // TODO: remove noindex once legal review is done, then add /privacy to app/sitemap.ts.
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <LegalPage title={TITLE}>
      <h2 className="h2">ผู้ควบคุมข้อมูลส่วนบุคคล</h2>
      <p>
        {LEGAL_NAME} (เลขทะเบียนนิติบุคคล {COMPANY_REGISTRATION_NUMBER})
      </p>
      {/* TODO: legal review — registered address and DPO contact (if appointed). */}

      <h2 className="h2">ข้อมูลที่เราเก็บรวบรวม</h2>
      <p>เมื่อคุณส่งแบบฟอร์มขอรับคำปรึกษาบนเว็บไซต์ เราจะได้รับข้อมูลดังนี้</p>
      <ul>
        <li>กลุ่มอาการของคนไข้</li>
        <li>จังหวัด และเขต / อำเภอ</li>
        <li>ชื่อผู้ติดต่อ</li>
        <li>เบอร์โทรศัพท์</li>
        <li>เวลาที่ต้องการปรึกษาคุณหมอ</li>
        <li>อาการเบื้องต้นของคนไข้ และระยะเวลาที่เป็น</li>
        <li>วันและเวลาที่ส่งแบบฟอร์ม</li>
      </ul>
      {/* TODO: legal review — condition/symptom fields are health data
          (sensitive personal data under PDPA s.26). Confirm the legal basis
          and whether explicit consent must be collected on the form. */}

      <h2 className="h2">วัตถุประสงค์ในการใช้ข้อมูล</h2>
      <ul>
        <li>ติดต่อกลับเพื่อให้ข้อมูลเกี่ยวกับบริการและนัดหมาย</li>
        <li>ตรวจสอบว่าที่อยู่ของคนไข้อยู่ในพื้นที่ให้บริการ</li>
        <li>เตรียมข้อมูลเบื้องต้นสำหรับการปรึกษากับทีมของเรา</li>
      </ul>
      {/* TODO: legal review — confirm purposes and legal basis for each. */}

      <h2 className="h2">การจัดเก็บข้อมูล</h2>
      <p>
        ข้อมูลจากแบบฟอร์มจะถูกบันทึกลงในระบบ Google Sheets ที่บริษัทใช้งาน
      </p>
      {/* TODO: legal review — who can access the sheet, security measures,
          and cross-border transfer wording (Google stores data outside Thailand). */}

      <h2 className="h2">การติดต่อผ่าน LINE</h2>
      <p>
        หากคุณเลือกติดต่อเราผ่าน LINE Official Account ข้อมูลที่คุณส่งในแชต LINE
        จะอยู่ภายใต้การให้บริการของ LINE และนโยบายความเป็นส่วนตัวของ LINE ด้วย
      </p>
      {/* TODO: legal review — how chat data is used/retained on our side. */}

      <h2 className="h2">คุกกี้และเครื่องมือวิเคราะห์</h2>
      <p>
        เว็บไซต์นี้ใช้ Google Tag Manager
        ในการจัดการแท็กสำหรับวัดผลการใช้งานเว็บไซต์
        ซึ่งอาจมีการใช้คุกกี้หรือเทคโนโลยีที่คล้ายกัน
      </p>
      {/* TODO: legal review — list the tags actually configured in container
          GTM-PK9DP4KB (e.g. analytics / ads pixels), the cookies they set, and
          whether a cookie consent banner is required. Not knowable from code. */}

      <h2 className="h2">ระยะเวลาการเก็บรักษาข้อมูล</h2>
      {/* TODO: legal review — retention period for leads and patient records. */}
      <PendingSection />

      <h2 className="h2">สิทธิของเจ้าของข้อมูลส่วนบุคคล</h2>
      <p>
        ภายใต้พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 คุณมีสิทธิ
      </p>
      <ul>
        <li>ขอเข้าถึงและขอรับสำเนาข้อมูลส่วนบุคคลของคุณ</li>
        <li>ขอแก้ไขข้อมูลให้ถูกต้องและเป็นปัจจุบัน</li>
        <li>ขอให้ลบ ทำลาย หรือระงับการใช้ข้อมูล</li>
        <li>คัดค้านการเก็บรวบรวม ใช้ หรือเปิดเผยข้อมูล</li>
        <li>ขอโอนย้ายข้อมูล</li>
        <li>ถอนความยินยอมที่เคยให้ไว้</li>
        <li>ร้องเรียนต่อสำนักงานคณะกรรมการคุ้มครองข้อมูลส่วนบุคคล</li>
      </ul>
      {/* TODO: legal review — rights wording, conditions/exceptions, response timeline. */}

      <h2 className="h2">ติดต่อเรา</h2>
      <p>
        หากต้องการใช้สิทธิหรือสอบถามเกี่ยวกับข้อมูลส่วนบุคคล ติดต่อได้ที่โทร{" "}
        <a href="tel:02-114-7168">02-114-7168</a>
      </p>
      {/* TODO: legal review — add a dedicated privacy contact email if available. */}

      <h2 className="h2">การปรับปรุงนโยบาย</h2>
      {/* TODO: legal review — effective date and change-notification process. */}
      <PendingSection />
    </LegalPage>
  );
}
