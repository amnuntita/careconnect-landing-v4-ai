import { TRUST } from "@/lib/homepage-content";
import { FAMILIES_SERVED, REVIEW_LINKS, YEARS_OF_OPERATION } from "@/lib/site";

import { FacebookIcon, GoogleIcon } from "./Icons";
import { ReviewSlideshow } from "./ReviewSlideshow";

// Small section under the hero: the families-served line from the draft's
// §2 trust strip, with prominent links to the public review pages.
export function ReviewStrip() {
  const title = `ดูแลครอบครัวมาแล้วกว่า ${FAMILIES_SERVED} ครอบครัวในช่วง ${YEARS_OF_OPERATION} ปี`;
  // Guard against the draft and lib/site drifting apart (checked at build).
  if (title !== TRUST.items[3][0]) {
    throw new Error(`ReviewStrip families line differs from the draft: ${title}`);
  }
  const links = [
    { href: REVIEW_LINKS.google, label: TRUST.reviewLinks[0], short: "รีวิว Google", Icon: GoogleIcon },
    {
      href: REVIEW_LINKS.facebook,
      label: TRUST.reviewLinks[1],
      short: "รีวิว Facebook",
      Icon: FacebookIcon,
    },
  ].filter((l): l is typeof l & { href: string } => Boolean(l.href));

  return (
    <section className="review-strip" aria-label="รีวิวจากครอบครัวที่ใช้บริการ">
      <div className="wrap">
        {/* Two unbreakable halves so narrow screens wrap at a word boundary. */}
        <p className="review-strip-title">
          <span>ดูแลครอบครัวมาแล้ว</span>
          <span>{title.slice("ดูแลครอบครัวมาแล้ว".length)}</span>
        </p>
        <ReviewSlideshow />
        {links.length ? (
          <ul className="review-links">
            {links.map(({ href, label, short, Icon }) => (
              <li key={href}>
                <a
                  className="review-link"
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                >
                  <Icon width={22} height={22} />
                  {/* Short label on phones so both buttons fit on one row. */}
                  <span className="review-link-full">{label}</span>
                  <span className="review-link-short" aria-hidden="true">
                    {short}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
