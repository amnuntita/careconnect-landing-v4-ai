import { CLOSING, fillPrices } from "@/lib/homepage-content";
import { LINE_URL } from "@/lib/site";

import { ArrowIcon, LineIcon } from "./Icons";

// §11 closing copy, directly above the lead form (#form).
export function Closing() {
  return (
    <section id="start" className="closing-section">
      <div className="wrap">
        <h2 className="h2">{CLOSING.heading}</h2>
        <p className="lede" style={{ marginTop: 14 }}>
          {fillPrices(CLOSING.body)}
        </p>
        <div className="hero-cta-row" style={{ marginTop: 20 }}>
          <a className="btn" href="#form">
            {CLOSING.ctaForm} <ArrowIcon />
          </a>
          <a className="btn line" href={LINE_URL ?? "#form"}>
            <LineIcon />
            {CLOSING.ctaLine}
          </a>
        </div>
      </div>
    </section>
  );
}
