import type { ComponentType, SVGProps } from "react";

import { PROGRAMMES_SECTION } from "@/lib/homepage-content";
import { PROGRAMMES, type ProgrammeIcon } from "@/lib/programmes";

import { ArrowIcon, BedIcon, BrainIcon, HandIcon, SitStandIcon, WalkerIcon } from "./Icons";

const ICONS: Record<ProgrammeIcon, ComponentType<SVGProps<SVGSVGElement>>> = {
  bed: BedIcon,
  sitStand: SitStandIcon,
  walk: WalkerIcon,
  hand: HandIcon,
  brain: BrainIcon,
};

// §5 goal-based programmes. No price on the cards (it's once, in §6), and no
// per-programme Offer: all share the single package in lib/packages.ts.
export function Programmes() {
  const s = PROGRAMMES_SECTION;
  return (
    <section id="programmes">
      <div className="wrap">
        <div className="section-head">
          <div>
            <h2 className="h2">{s.heading}</h2>
            <p className="lede" style={{ marginTop: 14 }}>
              {s.intro}
            </p>
          </div>
        </div>

        <ul className="programme-grid">
          {PROGRAMMES.map((p) => {
            const Icon = ICONS[p.icon];
            return (
              <li className="programme-card" key={p.name}>
                <div className="programme-head">
                  <span className="programme-icon" aria-hidden="true">
                    <Icon />
                  </span>
                  <div>
                    <h3 className="programme-name">
                      <span className="programme-n">{p.n})</span> {p.name}
                    </h3>
                    <p className="programme-summary">{p.summary}</p>
                  </div>
                </div>
                <p className="programme-label">{s.fitLabel}</p>
                <ul className="programme-list">
                  {p.suitableFor.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                {/* Collapsed by default; the list is in the server HTML. */}
                <details className="programme-more">
                  <summary>{s.trainLabel}</summary>
                  <ul className="programme-list">
                    {p.training.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </details>
              </li>
            );
          })}
        </ul>

        <p className="programme-closing">{s.closing}</p>
        <div className="hero-cta-row">
          <a className="btn" href="#form">
            {s.cta} <ArrowIcon />
          </a>
        </div>
      </div>
    </section>
  );
}
