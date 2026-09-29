import {
  ArrowIcon,
  HomeIcon,
  LineIcon,
  StethoscopeIcon,
} from "./Icons";
import { HeroSlideshow } from "./HeroSlideshow";

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="wrap hero-split">
        <div className="hero-copy">
          <p className="badge">
            <span className="dot" aria-hidden="true"></span>
            <span>เปิดให้บริการมากกว่า 10 จังหวัดทั่วประเทศ</span>
          </p>

          <h1 className="h1">
            กายภาพบำบัด<span className="accent">ที่บ้าน</span>
          </h1>

          <p className="hero-subhead">
            ฟื้นฟูเต็มศักยภาพจากบ้านของคุณเอง
          </p>

          <p className="lede">
            ดูแลโดยทีมสหสาขาวิชาชีพ ออกแบบโปรแกรมเฉพาะบุคคล
            โดย<b>แพทย์เวชศาสตร์ฟื้นฟู</b> ร่วมกับนักกายภาพบำบัด
            และนักกิจกรรมบำบัดมืออาชีพ
          </p>

          <div className="hero-cta-row">
            <a className="btn" href="#form">
              ทดลองทำกายภาพ <ArrowIcon />
            </a>
            <a className="btn text-xs ghost" href="https://lin.ee/S8VPTxqA">
              <LineIcon />
              ติดต่อผ่าน LINE
            </a>
          </div>

         
        </div>

        <div className="hero-art">
          <HeroSlideshow />
          <div className="floater top" aria-hidden="true">
            <div className="float-icon">
              <StethoscopeIcon />
            </div>
            <div className="float-text">
              <strong>ติดตามผลอย่างเป็นระบบ</strong>
              <span>รายงานผลระหว่างคอร์ส</span>
            </div>
          </div>
          <div className="floater bottom" aria-hidden="true">
            <div className="float-icon">
              <HomeIcon />
            </div>
            <div className="float-text">
              <strong>ที่บ้านคุณ</strong>
              <span>ไม่ต้องเข้าศูนย์ ไม่ต้องเดินทาง</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
