import Image from "next/image";

import { JsonLdScript } from "@/components/JsonLd";
import { TEAM_COPY } from "@/lib/homepage-content";
import {
  displayName,
  PHYSICIANS,
  physicianJsonLd,
  type Physician,
} from "@/lib/physicians";
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

// Doctor JSON-LD comes from lib/physicians.ts (shared with other pages).
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

// Card bullets as shown on the page (only for doctors that have them).
const CARD_DETAILS: Record<string, React.ReactNode> = {
  "dr-jiraporn": (
    <ul>
      <li><b>แพทยศาสตร์บัณฑิต</b>, มศว</li>
      <li><b>เวชศาสตร์ฟื้นฟู</b>, จุฬาลงกรณ์มหาวิทยาลัย</li>
      <li>ปัจจุบันทำงานที่โรงพยาบาลสมเด็จพระบรมราชเทวี ณ ศรีราชา</li>
    </ul>
  ),
};

function DoctorCard({ doc }: { doc: Physician }) {
  return (
    <article className={`doctor-card${doc.photo ? "" : " doctor-card--no-photo"}`}>
      {/* Missing photo (TODO in lib/physicians.ts): text-only card, no empty box. */}
      {doc.photo ? (
        <Image
          className="doctor-photo"
          src={doc.photo}
          alt={displayName(doc)}
          width={440}
          height={440}
          sizes="(max-width: 720px) 100vw, 220px"
        />
      ) : null}
      <div>
        <h3 className="dname">
          {displayName(doc)} (เลข {doc.license})
        </h3>
        <p className="dtitle">{doc.title}</p>
        {/* Practice days/hours: required on-page wherever a physician is shown. */}
        <p className="dhours">ให้บริการ{doc.hours}</p>
        {CARD_DETAILS[doc.id] ?? null}
      </div>
    </article>
  );
}

export function Team({ showHeading = true }: { showHeading?: boolean } = {}) {
  return (
    <section id="team" className="cream">
      <JsonLdScript
        data={{
          "@context": "https://schema.org",
          "@graph": [...PHYSICIANS.map(physicianJsonLd), ...ptJsonLd],
        }}
      />
      <div className="wrap">
        {showHeading ? (
          <div className="section-head">
            <h2 className="h2">{TEAM_COPY.heading}</h2>
          </div>
        ) : null}

        {PHYSICIANS.map((doc) => (
          <DoctorCard key={doc.id} doc={doc} />
        ))}

        <h3 className="h3">{TEAM_COPY.ptHeading}</h3>
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
        <p className="team-quality">{TEAM_COPY.quality}</p>
      </div>
    </section>
  );
}
