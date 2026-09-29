import Image from "next/image";

import { JsonLdScript } from "@/components/JsonLd";
import { SITE_URL } from "@/lib/site";

type PT = {
  name: string;
  license: string;
  expYears: number;
  provinces: string[];
  photo: string;
};

const PTS: PT[] = [
  {
    name: "ศิริภรณ์ สมบูรณ์",
    license: "ก.5074",
    expYears: 17,
    provinces: ["กทม. และปริมณฑล"],
    photo: "PT_siriporn.jpeg",
  },
  {
    name: "มีน พรหมมนตรี",
    license: "ก.9295",
    expYears: 11,
    provinces: ["กทม.", "นนทบุรี"],
    photo: "PT_Mean.jpeg",
  },
  {
    name: "จิรวัฒน์ ดวงอินทร์",
    license: "ก.11177",
    expYears: 10,
    provinces: ["นครราชสีมา"],
    photo: "PT_Jirawat.jpeg",
  },
  {
    name: "ชัยอนันต์ บังจันทร์",
    license: "ก.9473",
    expYears: 11,
    provinces: ["ชลบุรี", "ระยอง"],
    photo: "PT_Chaianan.jpeg",
  },
];

// Structured data for the people shown in this section. Uses only what the
// cards display. No CareConnect roles: the page doesn't state them.
// TODO: supply the doctor's medical licence number and her role at
// CareConnect, then add them here (and on the card).
const doctorJsonLd = {
  "@type": "Person",
  "@id": `${SITE_URL}/#dr-jiraporn`,
  honorificPrefix: "พญ.",
  name: "จิราภรณ์ ตั้งกฤษณขจร",
  jobTitle: "แพทย์",
  image: `${SITE_URL}/images/staff/DR_Jiraporn.jpg`,
  knowsAbout: "เวชศาสตร์ฟื้นฟู",
  alumniOf: [
    {
      "@type": "CollegeOrUniversity",
      name: "มหาวิทยาลัยศรีนครินทรวิโรฒ",
      alternateName: "มศว",
    },
    { "@type": "CollegeOrUniversity", name: "จุฬาลงกรณ์มหาวิทยาลัย" },
  ],
  hasCredential: {
    "@type": "EducationalOccupationalCredential",
    credentialCategory: "degree",
    name: "แพทยศาสตรบัณฑิต",
    recognizedBy: {
      "@type": "CollegeOrUniversity",
      name: "มหาวิทยาลัยศรีนครินทรวิโรฒ",
    },
  },
  worksFor: {
    "@type": "Hospital",
    name: "โรงพยาบาลสมเด็จพระบรมราชเทวี ณ ศรีราชา",
  },
};

const ptJsonLd = PTS.map((p) => ({
  "@type": "Person",
  name: p.name,
  jobTitle: "นักกายภาพบำบัด",
  image: `${SITE_URL}/images/staff/${p.photo}`,
  hasCredential: {
    "@type": "EducationalOccupationalCredential",
    credentialCategory: "license",
    identifier: p.license,
  },
}));

export function Team() {
  return (
    <section id="team" className="cream">
      <JsonLdScript
        data={{
          "@context": "https://schema.org",
          "@graph": [doctorJsonLd, ...ptJsonLd],
        }}
      />
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow">ทีมของเรา</span>
            <h2 className="h2" style={{ marginTop: 10 }}>
              นำโดยแพทย์เวชศาสตร์ฟื้นฟู
              <br />
              ดูแลโดยทีมมืออาชีพ
            </h2>
          </div>
        </div>

        <article className="doctor-card">
          <Image
            className="doctor-photo"
            src="/images/staff/DR_Jiraporn.jpg"
            alt="พญ. จิราภรณ์ ตั้งกฤษณขจร"
            width={440}
            height={440}
            sizes="(max-width: 720px) 100vw, 220px"
          />
          <div>
            <p className="role">แพทย์</p>
            <h3 className="dname">พญ. จิราภรณ์ ตั้งกฤษณขจร</h3>
           
              <ul>
                <li><b>แพทยศาสตร์บัณฑิต</b>, มศว</li>
                <li><b>เวชศาสตร์ฟื้นฟู</b>, จุฬาลงกรณ์มหาวิทยาลัย</li>
                <li>ปัจจุบันทำงานที่โรงพยาบาลสมเด็จพระบรมราชเทวี ณ ศรีราชา</li>
              </ul>
            
          </div>
        </article>

        <h3 className="h3">ตัวอย่าง Profile นักกายภาพของเรา</h3>
        <ul className="pt-grid">
          {PTS.map((p) => (
            <li className="pt-card" key={p.name}>
              <Image
                className="pt-photo"
                src={`/images/staff/${p.photo}`}
                alt={`นักกายภาพ ${p.name}`}
                width={176}
                height={176}
                sizes="88px"
              />
              <div className="body">
                <p className="name">{p.name}</p>
                <p className="meta">
                  {p.license} ประสบการณ์ {p.expYears} ปี
                </p>
                <ul className="tags" aria-label="พื้นที่ให้บริการ">
                  {p.provinces.map((province) => (
                    <li className="tag" key={province}>
                      {province}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
