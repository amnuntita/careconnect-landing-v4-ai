import { PROGRAMMES_SECTION } from "@/lib/homepage-content";
import { PROGRAMMES } from "@/lib/programmes";

// §5 goal-based programmes as an accordion: each row shows the programme
// name; opening it shows who it suits. Native <details>, so the lists stay in
// the server HTML. No price here (it's once, in §6), and no per-programme
// Offer: all share the single package in lib/packages.ts.
export function Programmes() {
  const s = PROGRAMMES_SECTION;
  return (
    <section id="programmes">
      <div className="wrap">
        <div className="section-head">
          <h2 className="h2">{s.heading}</h2>
          {/* Intro hidden for now; text kept in PROGRAMMES_SECTION.intro.
          <p className="lede" style={{ marginTop: 14 }}>
            {s.intro}
          </p> */}
        </div>

        <ul className="programme-list-accordion">
          {PROGRAMMES.map((p) => {
            return (
              <li key={p.name}>
                <details className="programme-item">
                  <summary>
                    <h3 className="programme-name">{p.name}</h3>
                  </summary>
                  <div className="programme-body">
                    {/* Summary hidden for now; kept in lib/programmes.ts.
                    <p className="programme-summary">{p.summary}</p> */}
                    <p className="programme-label">{s.fitLabel}</p>
                    <ul className="programme-list">
                      {p.suitableFor.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                    {/* "ฝึกอะไรบ้าง" hidden for now: the content (p.training,
                        s.trainLabel) is kept to move to other pages later.
                    <details className="programme-more">
                      <summary>{s.trainLabel}</summary>
                      <ul className="programme-list">
                        {p.training.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    </details> */}
                  </div>
                </details>
              </li>
            );
          })}
        </ul>

        <p className="programme-closing">{s.closing}</p>
        {/* No CTA here: the sticky bottom bar already carries it. */}
      </div>
    </section>
  );
}
