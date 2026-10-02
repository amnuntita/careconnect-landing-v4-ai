// Site facts with no side effects, so client components (e.g. LeadForm) can
// import them without pulling in lib/site.ts's SITE_URL guard. lib/site.ts
// re-exports everything here; change values in this file only.

export const TELEPHONE_DISPLAY = "02-114-7168";

// LINE Official Account. Every visible handle and every LINE link on the site
// must come from these two constants.
export const LINE_ID = "@careconnect";
export const LINE_URL = "https://line.me/R/ti/p/@careconnect";

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
