// The service package. Rendered by components/Pricing.tsx and turned into
// the Offer in components/JsonLd.tsx, so the page and structured data
// cannot drift apart.

export type Package = {
  name: string;
  // Price in THB for the whole package.
  price: number;
  sessions: number;
  badge?: string;
};

// The only package offered. (The old TRIAL / HEAD START / STANDARD tiers did
// not exist and were removed; "GOLDEN PERIOD" was an internal name for this.)
export const PACKAGES: Package[] = [
  {
    name: "โปรแกรมฟื้นฟูที่บ้าน 10 ครั้ง",
    price: 15900,
    sessions: 10,
  },
];

export const MAIN_PACKAGE = PACKAGES[0];

// Paid up front for the doctor's assessment + first home session. It is a
// DEPOSIT toward MAIN_PACKAGE, not a separate service: never emit it as an
// Offer in structured data.
export const DEPOSIT = 1500;
// Remaining balance if the family continues, payable in instalments.
export const BALANCE = MAIN_PACKAGE.price - DEPOSIT;
// The balance can be split into equal instalments (before sessions 2, 5, 8).
export const INSTALMENT_COUNT = 3;
export const INSTALMENT = BALANCE / INSTALMENT_COUNT;
if (!Number.isInteger(INSTALMENT)) {
  throw new Error("BALANCE must split into whole-baht instalments.");
}

// 15900 -> "15,900"
export function formatPrice(price: number): string {
  return price.toLocaleString("en-US");
}
