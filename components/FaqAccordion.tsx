import { Segs } from "@/components/Segs";
import { fillTokens, type Faq } from "@/lib/content-blocks";

// Shared FAQ list. Native <details>: collapsed by default, but every answer is
// in the server HTML for crawlers. The page's FAQPage JSON-LD is built from the
// same items (lib/page-schema.ts), so the two can't drift.
export function FaqAccordion({ items }: { items: Faq[] }) {
  return (
    <div className="faq-list">
      {items.map((faq) => (
        <details key={faq.q} className="faq-item">
          <summary>
            <h3>{fillTokens(faq.q)}</h3>
          </summary>
          <div className="faq-answer">
            {faq.a.map((para, i) => (
              <p key={i}>
                <Segs segs={para} />
              </p>
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}
