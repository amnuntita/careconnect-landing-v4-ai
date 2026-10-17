import { fillPrices, HERO, HERO_OFFER, HERO_POINTS } from "@/lib/homepage-content";
import { LINE_URL } from "@/lib/site";

import { ArrowIcon, CheckIcon, LineIcon } from "./Icons";
import { HeroSlideshow } from "./HeroSlideshow";

// §1 of the BOFU homepage draft. The only <h1> on the homepage.
export function Hero() {
  const area = fillPrices(HERO.body[2]);
  return (
    <section className="hero" id="top">
      <div className="wrap hero-split">
        <div className="hero-copy">
          <h1 className="h1">{fillPrices(HERO.h1)}</h1>

          <ul className="hero-points">
            {HERO_POINTS.map((point) => (
              <li key={point}>
                <span className="hero-point-icon" aria-hidden="true">
                  <CheckIcon />
                </span>
                {point}
              </li>
            ))}
          </ul>

          <p className="hero-area">{area}</p>

          <p className="hero-offer-line">{HERO_OFFER.line}</p>

          {/* The sticky CTA bar stays hidden while these buttons are on screen. */}
          <div className="hero-cta-row" data-sticky-hide>
            <a className="btn" href="#form">
              {HERO.ctaPrimary}
              <span className="btn-price">{fillPrices(HERO_OFFER.ctaPrice)}</span>
              <ArrowIcon />
            </a>
            <a className="btn ghost" href={LINE_URL}>
              <LineIcon />
              {HERO.ctaLine}
            </a>
          </div>
        </div>

        {/* Real CareConnect home visits, published with written consent, so no
            sample-photo caption (that applies to the stock OG image only). */}
        <div className="hero-art">
          <HeroSlideshow />
        </div>
      </div>
    </section>
  );
}
