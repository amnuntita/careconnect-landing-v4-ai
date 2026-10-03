import type { Metadata } from "next";

import { LegalPage } from "@/components/LegalPage";
import { POLICY_BLOCKS, POLICY_META, type PolicyBlock } from "@/lib/privacy-policy";
import { DEFAULT_OG_IMAGE } from "@/lib/page-schema";
import { EMAIL, SITE_NAME, TELEPHONE_DISPLAY } from "@/lib/site";

// The real customer privacy policy (content in lib/privacy-policy.ts, verbatim
// from the draft). TODO: legal review — the draft must be approved by legal
// counsel before publishing. Unresolved [..] values render as placeholders.

const TITLE = POLICY_META.h1;
const DESCRIPTION =
  "นโยบายคุ้มครองข้อมูลส่วนบุคคลสำหรับลูกค้าของ CareConnect ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/privacy" },
  openGraph: {
    type: "website",
    url: "/privacy",
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
    locale: "th_TH",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [DEFAULT_OG_IMAGE] },
  // TODO: remove noindex once legal review is done, then add /privacy to app/sitemap.ts.
  robots: { index: false, follow: true },
};

// Wrap unresolved "[...]" values so they stand out as placeholders.
function withPlaceholders(text: string) {
  return text.split(/(\[[^\]]+\])/).map((part, i) =>
    part.startsWith("[") && part.endsWith("]") ? (
      <mark key={i} className="todo-placeholder">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

// Make the phone number and email in the contact lines clickable.
function contactLine(line: string) {
  if (line.endsWith(TELEPHONE_DISPLAY)) {
    const label = line.slice(0, -TELEPHONE_DISPLAY.length);
    return (
      <>
        {label}
        <a href={`tel:${TELEPHONE_DISPLAY}`}>{TELEPHONE_DISPLAY}</a>
      </>
    );
  }
  if (line.endsWith(EMAIL)) {
    const label = line.slice(0, -EMAIL.length);
    return (
      <>
        {label}
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
      </>
    );
  }
  return line;
}

function renderBlock(block: PolicyBlock, key: number) {
  switch (block.t) {
    case "updated":
      return (
        <p key={key} className="small">
          {withPlaceholders(block.text)}
        </p>
      );
    case "h2":
      return (
        <h2 key={key} className="h2">
          {block.text}
        </h2>
      );
    case "h3":
      return (
        <h3 key={key} className="h3">
          {block.text}
        </h3>
      );
    case "p":
      return <p key={key}>{withPlaceholders(block.text)}</p>;
    case "ul":
      return (
        <ul key={key}>
          {block.items.map((item) => (
            <li key={item}>{withPlaceholders(item)}</li>
          ))}
        </ul>
      );
    case "table":
      return (
        <div key={key} className="scroll-table" tabIndex={0} role="region" aria-label={block.head.join(" / ")}>
          <table className="data-table">
            <thead>
              <tr>
                {block.head.map((h) => (
                  <th key={h} scope="col">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell, i) =>
                    i === 0 ? (
                      <th key={i} scope="row">
                        {cell}
                      </th>
                    ) : (
                      <td key={i}>{cell}</td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "contact":
      return (
        <p key={key}>
          {block.lines.map((line, i) => (
            <span key={line}>
              {i > 0 ? <br /> : null}
              {contactLine(line)}
            </span>
          ))}
        </p>
      );
  }
}

export default function PrivacyPage() {
  return (
    <LegalPage title={TITLE}>
      {POLICY_BLOCKS.map((block, i) => renderBlock(block, i))}
    </LegalPage>
  );
}
