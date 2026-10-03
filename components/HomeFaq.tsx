import Link from "next/link";

import { FAQ_SECTION, fillPrices, HOME_FAQS } from "@/lib/homepage-content";

// Render an answer paragraph, linking `link.text` where it occurs.
function answer(text: string, link?: { text: string; href: string }) {
  const i = link ? text.lastIndexOf(link.text) : -1;
  if (!link || i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <Link href={link.href}>{link.text}</Link>
      {text.slice(i + link.text.length)}
    </>
  );
}

// §9 FAQ. Native <details>: collapsed, but every answer is in the server
// HTML. The FAQPage JSON-LD (SiteJsonLd) is built from the same HOME_FAQS.
export function HomeFaq() {
  return (
    <section id="faq">
      <div className="wrap post-wrap">
        <h2 className="h2" style={{ marginBottom: 20 }}>
          {FAQ_SECTION.heading}
        </h2>
        <div className="faq-list">
          {HOME_FAQS.map((faq) => (
            <details key={faq.q} className="faq-item">
              <summary>
                <h3>{faq.q}</h3>
              </summary>
              <div className="faq-answer">
                {faq.a.map((para) => (
                  <p key={para}>{answer(fillPrices(para), faq.link)}</p>
                ))}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
