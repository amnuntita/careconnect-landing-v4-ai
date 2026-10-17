"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

import { ChevronRightIcon } from "./Icons";

// Screenshots of client reviews: public Google reviews, then messages from
// CareConnect's review graphics (all trimmed to a common width).
// Alt text carries the review text so it stays readable without the image.
const REVIEWS = [
  {
    src: "/images/reviews/google-review-1.png",
    width: 578,
    height: 464,
    alt: "รีวิว 5 ดาวบน Google จาก aom pkm: ช่วงนี้ดูแลคุณแม่ที่บ้าน มีอาการสโตรก เดินได้ แต่ยังต้องทำกายภาพต่อ ติดแค่ว่าไม่ค่อยมีเวลาพาไปคลินิก เลยลองกายภาพบำบัดที่บ้านกับ CareConnect นัดง่าย มาเป็นเวลา แล้วก็ใจเย็นกับคุณแม่มาก มีประเมินอาการ + สอนท่าทำต่อเอง สะดวกมาก ไม่ต้องพาออกจากบ้านให้เหนื่อย แนะนำเลยค่ะ",
  },
  {
    src: "/images/reviews/google-review-2.png",
    width: 578,
    height: 275,
    alt: "รีวิว 5 ดาวบน Google จาก TH Pongsupa (Pa): บริการดีและสะดวกมากสำหรับคนที่หานักกายภาพมาที่บ้านค่ะ คุณพ่อเป็นหลอดเลือดสมองตีบ ทางศูนย์มีคุณหมอจัดโปรแกรมให้ นักกายภาพดีมาก เป็นมืออาชีพและสุภาพ คุณพ่อมีพัฒนาการที่ดีขึ้นตามลำดับ แนะนำที่นี่นะคะ",
  },
  {
    src: "/images/reviews/google-review-3.png",
    width: 578,
    height: 370,
    alt: "รีวิว 5 ดาวบน Google จาก Tid Tor: รู้สึกประทับใจ CareConnect มากๆ เลยค่ะ นักกายภาพเก่งและใส่ใจดูแลดี ทำให้คนป่วยมีกำลังขาขึ้น ขาข้างที่ขยับไม่ได้สามารถลุกขึ้นยืนได้บ้างได้นิดหน่อย ทำให้ทุกคนดีใจมากๆ เลยค่ะ คนป่วยมีกำลังใจสู้ขึ้นเยอะเลยค่ะ ขอบคุณมากๆ นะคะ จากตอนแรกนอนขยับตัวไม่ได้เลย ตอนนี้ดีขึ้นมากแล้วค่ะ ขอบคุณคุณหมอณัฐกรมากค่ะ ใส่ใจดูแลคนไข้ดีมากๆ เลยต้องตนนี้เลย",
  },
  {
    src: "/images/reviews/client-review-1.png",
    width: 578,
    height: 302,
    alt: "รีวิวจากผู้ใช้บริการ: แอดมินตอบคำถามข้อสงสัยต่างๆ รวดเร็ว ชัดเจน มีคุณหมอช่วยวางแผนการรักษาและสามารถปรับเปลี่ยนตามอาการคนไข้ได้ค่ะ นักกายภาพบำบัดคือให้กำลังใจและช่วยกระตุ้นคนไข้ดีมากค่ะ มาตรงเวลา ช่วยเช็คอาการคนไข้ พร้อมให้กำลังใจญาติ",
  },
  {
    src: "/images/reviews/client-review-2.png",
    width: 578,
    height: 382,
    alt: "รีวิวจากผู้ใช้บริการ: ตรงต่อเวลา พูดจาดี บริการดี และกายภาพดีค่ะ ดูเชี่ยวชาญ คอยสังเกตอาการของคนไข้ ไม่ได้ให้กายภาพมากจนเกินไป เพราะคนไข้อาจจะเหนื่อยได้ รวมๆ แล้วพึงพอใจกับการกายภาพครั้งนี้ค่ะ ขอบคุณนะคะ ได้รู้เรื่องดวงตาของแม่เพิ่มด้วย ดีมากๆ ค่ะ",
  },
  {
    src: "/images/reviews/client-review-3.png",
    width: 578,
    height: 263,
    alt: "รีวิวจากผู้ใช้บริการ: ขอบคุณมากค่ะ ตอนนี้คุณพิสุทธิ์เดินได้ดีขึ้นมากแล้วค่ะ ไปทำงานได้แล้ว และไปทำกายภาพบำบัดที่ รพ. อาทิตย์ละ 1 วันค่ะ",
  },
];

export function ReviewSlideshow() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" }, [
    Autoplay({ delay: 6000, stopOnInteraction: false, stopOnMouseEnter: true }),
  ]);
  // With loop on, every slide is a snap point, so there is one dot per review.
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <div className="review-slideshow" aria-roledescription="carousel" aria-label="รีวิวจากผู้ใช้บริการ">
      <div className="review-slideshow__viewport" ref={emblaRef}>
        <ul className="review-slideshow__container">
          {REVIEWS.map((r, i) => (
            <li
              className="review-slideshow__slide"
              key={r.src}
              aria-roledescription="slide"
              aria-label={`${i + 1} จาก ${REVIEWS.length}`}
            >
              <div className="review-card">
                <Image
                  src={r.src}
                  alt={r.alt}
                  width={r.width}
                  height={r.height}
                  sizes="(max-width: 880px) 92vw, 540px"
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="review-slideshow__controls">
        <button
          type="button"
          className="review-slideshow__arrow review-slideshow__arrow--prev"
          onClick={() => emblaApi?.scrollPrev()}
          aria-label="รีวิวก่อนหน้า"
        >
          <ChevronRightIcon />
        </button>
        <div className="review-slideshow__dots">
          {REVIEWS.map((r, i) => (
            <button
              type="button"
              key={r.src}
              className="review-slideshow__dot"
              aria-label={`ไปที่รีวิวที่ ${i + 1}`}
              aria-current={i === selected}
              onClick={() => emblaApi?.scrollTo(i)}
            />
          ))}
        </div>
        <button
          type="button"
          className="review-slideshow__arrow"
          onClick={() => emblaApi?.scrollNext()}
          aria-label="รีวิวถัดไป"
        >
          <ChevronRightIcon />
        </button>
      </div>
    </div>
  );
}
