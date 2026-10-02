// Facts that are safe to import from client components (no env guard).
export { LINE_ID, LINE_URL, PROVINCES_SERVED, TELEPHONE_DISPLAY } from "@/lib/public-facts";
import { LINE_URL } from "@/lib/public-facts";

// Single source of truth for site-wide facts used in metadata, JSON-LD and copy.
// Only confirmed values belong here. Unknown values stay `null` with a TODO so
// nothing downstream renders them.

export const SITE_NAME = "CareConnect";

const LOCAL_SITE_URL = "http://localhost:3000";

// Canonical origin (no trailing slash). Sitemap URLs, canonicals, OG URLs and
// JSON-LD @ids all derive from it, so a wrong value in production is costly:
// fail the production build instead of silently shipping a placeholder.
function resolveSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const isProduction = process.env.VERCEL_ENV === "production";

  if (!raw) {
    if (isProduction) {
      throw new Error(
        "NEXT_PUBLIC_SITE_URL is not set. It is required when VERCEL_ENV=production " +
          "(canonicals, sitemap and structured data depend on it). " +
          "Set it in Vercel → Project → Settings → Environment Variables, e.g. https://www.example.com",
      );
    }
    console.warn(
      `[site] NEXT_PUBLIC_SITE_URL is not set; falling back to ${LOCAL_SITE_URL}.`,
    );
    return LOCAL_SITE_URL;
  }

  try {
    return new URL(raw).origin;
  } catch {
    throw new Error(
      `NEXT_PUBLIC_SITE_URL is not a valid absolute URL: "${raw}". Expected e.g. https://www.example.com`,
    );
  }
}

export const SITE_URL = resolveSiteUrl();

// Stable JSON-LD @ids so nodes on different pages can reference each other.
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export const LOGO_URL = `${SITE_URL}/images/CareConnect%20Logo.png`;

export const TELEPHONE = "+66-2-114-7168";

// Families served, and the period that figure covers. Always show both together.
export const FAMILIES_SERVED = 400;
export const YEARS_OF_OPERATION = 3;

// Legal entity. CareConnect is the trade name of services operated by this
// company, which owns and operates the licensed clinic below.
export const LEGAL_NAME = "บริษัท บางกอกดิจิทัลเฮลท์ จำกัด";
export const COMPANY_REGISTRATION_NUMBER = "0125567028210";

// The licensed facility (สถานพยาบาล, Ministry of Public Health).
export const CLINIC_NAME = "เวชการคลีนิกเวชกรรม";
export const FACILITY_REGISTRATION_NUMBER = "12101007245";

// Registered office (HQ). This is NOT the service area — see PROVINCES_SERVED.
export const ADDRESS = {
  streetAddress: "32 ถนนเรวดี",
  subdistrict: "ตำบลตลาดขวัญ",
  district: "อำเภอเมืองนนทบุรี",
  province: "นนทบุรี",
  postalCode: "11000",
};
export const ADDRESS_TEXT = `${ADDRESS.streetAddress} ${ADDRESS.subdistrict} ${ADDRESS.district} จังหวัด${ADDRESS.province} ${ADDRESS.postalCode}`;

export const EMAIL = "sales@careconnectth.org";

export const FACEBOOK_URL: string | null = "https://www.facebook.com/bcareconnect";
export const GOOGLE_BUSINESS_PROFILE_URL: string | null =
  "https://maps.app.goo.gl/oHrjV8fQV5unRYXw6";

// Profiles that represent CareConnect elsewhere (JSON-LD `sameAs`).
export const SAME_AS: string[] = [
  FACEBOOK_URL,
  GOOGLE_BUSINESS_PROFILE_URL,
  LINE_URL,
].filter((url): url is string => Boolean(url));

// Public review pages linked under the reviews section. Rendered only when set.
export const REVIEW_LINKS: { google: string | null; facebook: string | null } = {
  google: GOOGLE_BUSINESS_PROFILE_URL,
  facebook: "https://www.facebook.com/bcareconnect/reviews",
};

// Caption required under every sample/stock photo (Thai advertising rules).
export const SAMPLE_PHOTO_CAPTION =
  "ภาพตัวอย่างที่ใช้ในการประชาสัมพันธ์ ไม่ใช่ผู้ให้บริการหรือผู้รับบริการจริง";

// First assessment can usually be scheduled within this many hours of contact.
export const FIRST_ASSESSMENT_WITHIN_HOURS = 24;

// Shown at the end of every blog post. Edit the wording here.
export const MEDICAL_DISCLAIMER =
  "เนื้อหานี้เป็นข้อมูลความรู้ทั่วไป ไม่สามารถใช้แทนคำแนะนำ การวินิจฉัย หรือการรักษาจากแพทย์ผู้ดูแลของคุณได้";
