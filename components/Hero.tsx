import { fillPrices, HERO } from "@/lib/homepage-content";
import { LINE_URL, SAMPLE_PHOTO_CAPTION } from "@/lib/site";

import { ArrowIcon, LineIcon } from "./Icons";
import { HeroSlideshow } from "./HeroSlideshow";

// §1 of the BOFU homepage draft. The only <h1> on the homepage.
export function Hero() {
  const [lede, offer, area] = HERO.body.map(fillPrices);
  return (
    <section className="hero" id="top">
      <div className="wrap hero-split">
        <div className="hero-copy">
          <h1 className="h1">{fillPrices(HERO.h1)}</h1>

          <p className="lede">{lede}</p>

          <p className="hero-subhead">{offer}</p>

          <p className="hero-area">{area}</p>

          {/* The sticky CTA bar stays hidden while these buttons are on screen. */}
          <div className="hero-cta-row" data-sticky-hide>
            <a className="btn" href="#form">
              {HERO.ctaPrimary} <ArrowIcon />
            </a>
            <a className="btn ghost" href={LINE_URL ?? "#form"}>
              <LineIcon />
              {HERO.ctaLine}
            </a>
          </div>
        </div>

        <figure className="hero-art">
          <HeroSlideshow />
          {/* Required under every sample/stock photo (all 10 slides are sample photos). */}
          <figcaption className="photo-caption">{SAMPLE_PHOTO_CAPTION}</figcaption>
        </figure>
      </div>
    </section>
  );
}
