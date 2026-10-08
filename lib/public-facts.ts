// Site facts with no side effects, so client components (e.g. LeadForm) can
// import them without pulling in lib/site.ts's SITE_URL guard. lib/site.ts
// re-exports everything here; change values in this file only.

export const TELEPHONE_DISPLAY = "02-114-7168";

// LINE Official Account. Every visible handle and every LINE link on the site
// must come from these two constants.
export const LINE_ID = "@careconnect";
export const LINE_URL = "https://line.me/R/ti/p/@careconnect";

// Provinces served (22), ordered by the number of active physiotherapists.
// `label` is the short form used in copy and as the lead-form / Sheet value;
// `name` is the official province name used in structured data.
export const PROVINCES_SERVED: { label: string; name: string }[] = [
  { label: "กทม.", name: "กรุงเทพมหานคร" },
  { label: "นนทบุรี", name: "นนทบุรี" },
  { label: "ปทุมธานี", name: "ปทุมธานี" },
  { label: "นครปฐม", name: "นครปฐม" },
  { label: "สมุทรปราการ", name: "สมุทรปราการ" },
  { label: "ราชบุรี", name: "ราชบุรี" },
  { label: "นครนายก", name: "นครนายก" },
  { label: "ชลบุรี", name: "ชลบุรี" },
  { label: "อยุธยา", name: "พระนครศรีอยุธยา" },
  { label: "ฉะเชิงเทรา", name: "ฉะเชิงเทรา" },
  { label: "ขอนแก่น", name: "ขอนแก่น" },
  { label: "สมุทรสาคร", name: "สมุทรสาคร" },
  { label: "สระบุรี", name: "สระบุรี" },
  { label: "ปราจีนบุรี", name: "ปราจีนบุรี" },
  { label: "มหาสารคาม", name: "มหาสารคาม" },
  { label: "สมุทรสงคราม", name: "สมุทรสงคราม" },
  { label: "นครราชสีมา", name: "นครราชสีมา" },
  { label: "ลพบุรี", name: "ลพบุรี" },
  { label: "เชียงใหม่", name: "เชียงใหม่" },
  { label: "นครศรีธรรมราช", name: "นครศรีธรรมราช" },
  { label: "ชัยภูมิ", name: "ชัยภูมิ" },
  { label: "ลำพูน", name: "ลำพูน" },
];

// Guard: exactly 22 unique provinces (copy across the site says "22 จังหวัด").
if (
  PROVINCES_SERVED.length !== 22 ||
  new Set(PROVINCES_SERVED.map((p) => p.name)).size !== 22
) {
  throw new Error("PROVINCES_SERVED must list exactly 22 unique provinces.");
}
