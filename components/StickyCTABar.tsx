"use client";

import { useEffect, useState } from "react";

import { ArrowIcon, LineIcon } from "./Icons";

// Sticky CTA bar used on the homepage and long landing pages, on every
// viewport. Hides while the lead form (#form) or the footer is on screen so it
// never covers either. Bottom padding respects safe-area insets.
export function StickyCTABar({
  primaryLabel,
  lineLabel,
  lineHref,
}: {
  primaryLabel: string;
  lineLabel: string;
  lineHref: string;
}) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const targets = [
      document.getElementById("form"),
      document.querySelector("footer.site-footer"),
    ].filter((el): el is Element => Boolean(el));
    if (!targets.length) return;

    const visible = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      }
      setHidden(visible.size > 0);
    });
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`sticky-cta sticky-cta--always${hidden ? " is-hidden" : ""}`}
      aria-hidden={hidden}
    >
      <a className="btn sticky-cta__primary" href="#form" tabIndex={hidden ? -1 : 0}>
        {primaryLabel} <ArrowIcon />
      </a>
      <a
        className="btn line sticky-cta__line"
        href={lineHref}
        aria-label={lineLabel}
        tabIndex={hidden ? -1 : 0}
      >
        <LineIcon width={30} height={30} />
      </a>
    </div>
  );
}
