// Physicians shown on the site. One source for the Team cards and every
// page's Person JSON-LD, so licence numbers and titles can't drift.
import { ORGANIZATION_ID, SITE_URL } from "@/lib/site";

export type Physician = {
  id: string;
  honorificPrefix: string;
  name: string;
  // Medical Council licence (ใบอนุญาตประกอบวิชาชีพเวชกรรม).
  license: string;
  title: string;
  photo: string | null;
  // CareConnect role, when confirmed. Adds affiliation → the organization.
  careConnectRole?: string;
  // Facts as shown on the Team card.
  education?: { degree?: string; field?: string; institution: string; alternateName?: string }[];
  currentHospital?: string;
};

export const DR_SUVINAI: Physician = {
  id: "dr-suvinai",
  honorificPrefix: "นพ.",
  name: "สุวินัย จิระบุญศรี",
  license: "ว.78040",
  title: "แพทย์ผู้ดูแลคุณภาพ",
  // TODO: supply a photo (e.g. /images/staff/DR_Suvinai.jpg); the card renders text-only until then.
  photo: null,
  careConnectRole: "แพทย์ผู้ดูแลคุณภาพ",
};

export const DR_JIRAPORN: Physician = {
  id: "dr-jiraporn",
  honorificPrefix: "พญ.",
  name: "จิราภรณ์ ตั้งกฤษณขจร",
  license: "ว.56081",
  title: "แพทย์เวชศาสตร์ฟื้นฟู",
  photo: "/images/staff/DR_Jiraporn.jpg",
  // TODO: confirm her role at CareConnect (title above is her specialty).
  education: [
    {
      degree: "แพทยศาสตรบัณฑิต",
      institution: "มหาวิทยาลัยศรีนครินทรวิโรฒ",
      alternateName: "มศว",
    },
    { field: "เวชศาสตร์ฟื้นฟู", institution: "จุฬาลงกรณ์มหาวิทยาลัย" },
  ],
  currentHospital: "โรงพยาบาลสมเด็จพระบรมราชเทวี ณ ศรีราชา",
};

export const PHYSICIANS: Physician[] = [DR_JIRAPORN, DR_SUVINAI];

export const physicianId = (p: Physician) => `${SITE_URL}/#${p.id}`;

export function displayName(p: Physician): string {
  return `${p.honorificPrefix}${p.name}`;
}

// schema.org "Physician"/"IndividualPhysician" are organization types
// (MedicalOrganization/LocalBusiness), so a doctor as a person is a Person
// with a licence credential. Valid as author/reviewedBy.
export function physicianJsonLd(p: Physician) {
  const degrees = (p.education ?? []).filter((e) => e.degree);
  const fields = (p.education ?? []).flatMap((e) => (e.field ? [e.field] : []));
  return {
    "@type": "Person",
    "@id": physicianId(p),
    honorificPrefix: p.honorificPrefix,
    name: p.name,
    jobTitle: p.title,
    ...(p.photo ? { image: `${SITE_URL}${p.photo}` } : {}),
    ...(fields.length ? { knowsAbout: fields } : {}),
    ...(p.education?.length
      ? {
          alumniOf: p.education.map((e) => ({
            "@type": "CollegeOrUniversity",
            name: e.institution,
            ...(e.alternateName ? { alternateName: e.alternateName } : {}),
          })),
        }
      : {}),
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "license",
        name: "ใบอนุญาตประกอบวิชาชีพเวชกรรม",
        identifier: p.license,
      },
      ...degrees.map((e) => ({
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "degree",
        name: e.degree,
        recognizedBy: { "@type": "CollegeOrUniversity", name: e.institution },
      })),
    ],
    ...(p.currentHospital
      ? { worksFor: { "@type": "Hospital", name: p.currentHospital } }
      : {}),
    ...(p.careConnectRole ? { affiliation: { "@id": ORGANIZATION_ID } } : {}),
  };
}
