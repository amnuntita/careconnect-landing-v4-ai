// Lead (booking request) form: option lists and date rules shared by the form
// (components/LeadForm.tsx) and the API (app/api/lead/route.ts), so the client
// and server always accept exactly the same values.

import { PROVINCES_SERVED } from "@/lib/public-facts";

export const CONDITION_OPTIONS = [
  "โรคหลอดเลือดสมอง (อัมพฤกษ์ อัมพาต)",
  "ผู้สูงอายุอ่อนแรงหรือเสี่ยงล้ม",
  "หลังผ่าตัดสะโพกหรือข้อเข่า",
  "โรคพาร์กินสัน",
  "ผู้ป่วยติดเตียง",
  "ปัญหาการกลืนหรือสำลัก",
  "ปัญหาความจำหรือสมาธิ",
  "อื่น ๆ",
] as const;

export const MOBILITY_OPTIONS = [
  "นอนติดเตียง",
  "นั่งได้ แต่ย้ายตัวเองยังไม่ได้",
  "ยืนหรือเดินได้บ้าง แต่ต้องมีคนพยุง",
  "เดินได้เอง แต่ยังไม่คล่อง",
  "ไม่แน่ใจ",
] as const;

export const ONSET_OPTIONS = [
  "น้อยกว่า 1 เดือน",
  "1–6 เดือน",
  "มากกว่า 6 เดือน",
  "ไม่แน่ใจ",
] as const;

export const OTHER_PROVINCE = "จังหวัดอื่น";
export const PROVINCE_OPTIONS = [
  ...PROVINCES_SERVED.map((p) => p.label),
  OTHER_PROVINCE,
];

export const TIME_OPTIONS = [
  "เช้า (8:00–12:00)",
  "บ่าย (12:00–16:00)",
  "เย็น (16:00–19:00)",
] as const;

export const CONTACT_OPTIONS = ["โทรศัพท์", "LINE"] as const;

// ---- Dates (always Asia/Bangkok, never the visitor's device time zone) ----

export const LEAD_TIME_ZONE = "Asia/Bangkok";
// Earliest first session: the day after tomorrow.
export const MIN_DAYS_AHEAD = 2;

// Today's date in Bangkok as YYYY-MM-DD.
export function bangkokToday(now: Date = new Date()): string {
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: LEAD_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

// Add whole days to a YYYY-MM-DD date (calendar arithmetic in UTC, no DST).
export function addDays(isoDate: string, days: number): string {
  const d = new Date(`${isoDate}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function minFirstSessionDate(now: Date = new Date()): string {
  return addDays(bangkokToday(now), MIN_DAYS_AHEAD);
}

// Valid YYYY-MM-DD that exists on the calendar.
export function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

// "วันพฤหัสบดีที่ 8 ตุลาคม 2569" (full Thai, Buddhist era).
export function formatThaiFullDate(isoDate: string): string {
  return new Intl.DateTimeFormat("th-TH", {
    timeZone: LEAD_TIME_ZONE,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${isoDate}T12:00:00+07:00`));
}

// Thai mobile/landline numbers are 9–10 digits; allow spaces, dashes and a
// leading +66 country code while validating the underlying digit count.
export function isValidThaiPhone(tel: string): boolean {
  const digits = tel.trim().replace(/[\s-]/g, "").replace(/^\+66/, "0");
  return /^0\d{8,9}$/.test(digits);
}
