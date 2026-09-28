"use client";

import { useEffect, useState } from "react";
import { ArrowIcon, LineIcon } from "./Icons";

// Persistent mobile action bar. Gives a shortcut to the lead form (#form) from
// anywhere on the long mobile scroll, plus a LINE fallback. Hidden once the
// form itself is on screen so it never covers the submit button, and hidden on
// desktop (>=880px) via CSS where the reordered form suffices.
export function StickyCTA() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const form = document.getElementById("form");
    if (!form) return;

    const observer = new IntersectionObserver(
      ([entry]) => setHidden(entry.isIntersecting),
      { rootMargin: "0px 0px -20% 0px" },
    );
    observer.observe(form);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`sticky-cta${hidden ? " is-hidden" : ""}`}
      aria-hidden={hidden}
    >
      <a className="btn sticky-cta__primary" href="#form">
        ทดลองทำกายภาพ <ArrowIcon />
      </a>
      <a
        className="btn line sticky-cta__line"
        href="https://lin.ee/S8VPTxqA"
        aria-label="ติดต่อทาง LINE"
      >
        <LineIcon width={30} height={30} />
      </a>
    </div>
  );
}
