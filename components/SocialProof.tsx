import Image from "next/image";

import { FAMILIES_SERVED, REVIEW_LINKS, YEARS_OF_OPERATION } from "@/lib/site";

type Review = {
  image: string;
  alt: string;
  // Transcription of the screenshot, for screen readers and crawlers.
  // Only fill in with text the patient has consented to publish.
  text?: string;
};

// Screenshot reviews. Filenames don't describe their content, so the alt text
// stays neutral.
// TODO: supply consented transcriptions (`text`) and, if useful, more
// descriptive alt text for each screenshot.
const REVIEWS: Review[] = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({
  image: `/images/careconnect_customer_reviews/${n}.png`,
  alt: `ภาพหน้าจอรีวิวจากคนไข้ ${n}`,
}));

// Accessible-but-invisible text, so transcriptions don't change the layout.
const visuallyHidden: React.CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0,
};

const reviewLinks = [
  { href: REVIEW_LINKS.google, label: "ดูรีวิวบน Google" },
  { href: REVIEW_LINKS.facebook, label: "ดูรีวิวบน Facebook" },
].filter((link): link is { href: string; label: string } => Boolean(link.href));

export function SocialProof() {
  return (
    <section className="tight" aria-label="ความน่าเชื่อถือและรีวิว">
      <div className="wrap">
        <div className="stats">
          <div className="stat">
            <p className="num">{FAMILIES_SERVED}+</p>
            <p className="label">
              ครอบครัวที่เราดูแล
              <br />
              ในช่วง {YEARS_OF_OPERATION} ปี
            </p>
          </div>

        </div>
      </div>

      <div className="wrap">
        <ul className="reviews" aria-label="รีวิวจากคนไข้">
          {REVIEWS.map((review) => (
            <li className="review" key={review.image}>
              <Image
                className="review-img"
                src={review.image}
                alt={review.alt}
                width={320}
                height={320}
                sizes="320px"
              />
              {review.text ? (
                <p style={visuallyHidden}>{review.text}</p>
              ) : null}
            </li>
          ))}
        </ul>
        {reviewLinks.length ? (
          <p className="small" style={{ marginTop: 12 }}>
            {reviewLinks.map((link, i) => (
              <span key={link.href}>
                {i > 0 ? " · " : null}
                <a href={link.href} target="_blank" rel="noopener noreferrer">
                  <u>{link.label}</u>
                </a>
              </span>
            ))}
          </p>
        ) : null}
      </div>
    </section>
  );
}
