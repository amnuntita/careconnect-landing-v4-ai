import { CONCERNS, fillPrices } from "@/lib/homepage-content";

// §3: the six questions families ask, each answered. Plain server-rendered
// text so search engines and AI crawlers read every answer.
export function ConcernCards() {
  return (
    <section id="concerns" className="cream">
      <div className="wrap">
        <div className="section-head">
          <h2 className="h2">{CONCERNS.heading}</h2>
        </div>
        <ul className="concern-grid">
          {CONCERNS.cards.map((card) => (
            <li className="concern-card" key={card.q}>
              <h3 className="concern-q">{card.q}</h3>
              {card.a.map((para) => (
                <p key={para}>{fillPrices(para)}</p>
              ))}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
