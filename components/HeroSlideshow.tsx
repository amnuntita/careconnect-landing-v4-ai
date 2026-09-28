"use client";

import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";

const SLIDES = Array.from({ length: 10 }, (_, i) => `/images/patients/${i + 1}.png`);

export function HeroSlideshow() {
  const [emblaRef] = useEmblaCarousel({ loop: true, duration: 80 }, [
    Fade(),
    Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: false }),
  ]);

  return (
    <div className="hero-slideshow" ref={emblaRef} role="img" aria-label="ภาพประกอบ: นักกายภาพบำบัดกำลังดูแลผู้สูงอายุที่บ้าน">
      <div className="hero-slideshow__container">
        {SLIDES.map((src, i) => (
          <div className="hero-slideshow__slide" key={src}>
            <Image
              src={src}
              alt=""
              fill
              sizes="(max-width: 880px) 100vw, 50vw"
              preload={i === 0}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
