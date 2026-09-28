import Image from "next/image";

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

export function Team() {
  return (
    <section id="team" className="cream">
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
