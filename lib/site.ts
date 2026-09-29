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

export const LOGO_URL = `${SITE_URL}/images/CareConnect%20Logo.png`;

export const TELEPHONE = "+66-2-114-7168";

// Families served, and the period that figure covers. Always show both together.
export const FAMILIES_SERVED = 400;
export const YEARS_OF_OPERATION = 3;

// Legal entity, as shown in the footer.
export const LEGAL_NAME = "CareConnect Co., Ltd.";
export const COMPANY_REGISTRATION_NUMBER = "0125567028210";

// สถานพยาบาล registration number (Ministry of Public Health).
// TODO: supply the facility registration number. Stays out of JSON-LD while null.
export const FACILITY_REGISTRATION_NUMBER: string | null = null;

export const FACEBOOK_URL: string | null = "https://www.facebook.com/bcareconnect";
export const GOOGLE_BUSINESS_PROFILE_URL: string | null =
  "https://maps.app.goo.gl/oHrjV8fQV5unRYXw6";
export const LINE_URL: string | null = "https://lin.ee/S8VPTxqA";

// Profiles that represent CareConnect elsewhere (JSON-LD `sameAs`).
export const SAME_AS: string[] = [
  FACEBOOK_URL,
  GOOGLE_BUSINESS_PROFILE_URL,
  LINE_URL,
].filter((url): url is string => Boolean(url));

// Provinces served. `label` is the short form used in copy; `name` is the
// official province name used in structured data.
export const PROVINCES_SERVED: { label: string; name: string }[] = [
  { label: "กทม.", name: "กรุงเทพมหานคร" },
  { label: "นนทบุรี", name: "นนทบุรี" },
  { label: "สมุทรปราการ", name: "สมุทรปราการ" },
  { label: "สมุทรสาคร", name: "สมุทรสาคร" },
  { label: "ปทุมธานี", name: "ปทุมธานี" },
  { label: "นครปฐม", name: "นครปฐม" },
  { label: "เชียงใหม่", name: "เชียงใหม่" },
  { label: "ลำพูน", name: "ลำพูน" },
  { label: "นครสวรรค์", name: "นครสวรรค์" },
  { label: "อยุธยา", name: "พระนครศรีอยุธยา" },
  { label: "สุพรรณบุรี", name: "สุพรรณบุรี" },
  { label: "สระบุรี", name: "สระบุรี" },
  { label: "ร้อยเอ็ด", name: "ร้อยเอ็ด" },
  { label: "ขอนแก่น", name: "ขอนแก่น" },
  { label: "อุดรธานี", name: "อุดรธานี" },
  { label: "นครราชสีมา", name: "นครราชสีมา" },
  { label: "ชลบุรี", name: "ชลบุรี" },
  { label: "ระยอง", name: "ระยอง" },
  { label: "สงขลา", name: "สงขลา" },
  { label: "ตรัง", name: "ตรัง" },
  { label: "เชียงราย", name: "เชียงราย" },
  { label: "ภูเก็ต", name: "ภูเก็ต" },
];
