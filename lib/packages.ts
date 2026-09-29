// Service packages. Rendered by components/Pricing.tsx and turned into
// Offer nodes in components/JsonLd.tsx, so the page and structured data
// cannot drift apart.

export type Package = {
  tier: string;
  name: string;
  target: string;
  // Price in THB for the whole package; null = quoted on request (no Offer).
  price: number | null;
  // Label shown instead of a number when price is null.
  priceLabel?: string;
  sessions: number;
  sub: string;
  badge?: string;
};

export const PACKAGES: Package[] = [
  {
    tier: "TRIAL",
    name: "ทดลองครั้งแรก",
    target: "ผู้ที่ต้องการทดลองใช้บริการครั้งแรก (เฉพาะคนไข้ใหม่)",
    price: 1290,
    sessions: 1,
    sub: "บาท / ชั่วโมง",
  },
  {
    tier: "HEAD START",
    name: "ทดลอง 5 ครั้ง",
    target: "ผู้ที่ต้องการทดลองใช้บริการระยะสั้น 5 ครั้ง",
    price: 8450,
    sessions: 5,
    sub: "บาท / 5 ครั้ง · 1,690/ครั้ง",
  },
  {
    tier: "STANDARD",
    name: "มาตรฐาน",
    target: "ฟื้นฟูต่อเนื่องเพื่อผลลัพธ์ที่ชัดเจน 10 ครั้ง",
    price: 15900,
    sessions: 10,
    sub: "บาท / 10 ครั้ง · 1,590/ครั้ง",
    //badge: "ยอดนิยม",
  },
  {
    tier: "GOLDEN PERIOD",
    name: "ฟื้นฟูเข้มข้น",
    target:
      "คนไข้ที่เพิ่งออกจากโรงพยาบาล ต้องการฟื้นฟูเข้มข้น 30 ครั้ง",
    price: null,
    priceLabel: "ราคาพิเศษ",
    sessions: 30,
    sub: "ติดต่อสอบถามทีมงาน",
  },
];

// "15900" -> "15,900", matching the previous hard-coded display strings.
export function formatPrice(price: number): string {
  return price.toLocaleString("en-US");
}
