// Shared data model for the draft-generated content pages (/about, /terms,
// /pricing, the service pages and the service-area pages). The page copy lives
// in generated lib/*-page.ts files; components/ContentBlocks.tsx renders it.

import { fillPrices } from "@/lib/homepage-content";
import {
  ADDRESS_TEXT,
  CLINIC_NAME,
  COMPANY_REGISTRATION_NUMBER,
  EMAIL,
  FACILITY_REGISTRATION_NUMBER,
  LEGAL_NAME,
  LINE_ID,
  LINE_URL,
  TELEPHONE_DISPLAY,
} from "@/lib/site";
import { PROGRAMMES } from "@/lib/programmes";

export const PROGRAMME_NAMES = PROGRAMMES.map((p) => p.name);

// Inline text: plain string, a link, or (on /pricing) the programme names.
export type Seg = string | { text: string; href: string } | { programmes: true };

export type Faq = { q: string; a: Seg[][] };

export type Block =
  | { t: "h2"; text: string; id?: string }
  | { t: "h3"; text: string }
  | { t: "p"; segs: Seg[]; style?: "lede" | "small" | "signature" }
  | { t: "ul"; items: Seg[][] }
  | { t: "cards"; items: { title: string; text: string }[] }
  | { t: "dl"; items: { label: string; value: Seg[] }[] }
  | { t: "cta"; items: ("form" | "line")[] }
  | { t: "closing"; heading: string; cta: ("form" | "line")[] }
  // An H2 rendered as the heading of the ProcessDiagram section.
  | { t: "process"; heading: string }
  | { t: "faq"; heading: string; id: string; items: Faq[] }
  // A "read more" line shown only once the blog post is published.
  | { t: "blogLink"; slug: string; segs: Seg[] }
  | { t: "team" }
  | { t: "form" }
  // /pricing: the §6 inclusion groups, from the homepage data.
  | { t: "inclusions" }
  // /service-area: PROVINCES_SERVED minus the provinces that have a section.
  | { t: "provinces"; exclude: string[] }
  // /service-area/bangkok: district zones (lib/service-areas.ts).
  | { t: "districts" }
  // Links to each service page (lib/service-links.ts).
  | { t: "services" };

export type ContentPage = {
  path: string;
  title: string;
  description: string;
  h1: string;
  // Breadcrumb parents between the homepage and this page.
  parents: { label: string; href: string }[];
  blocks: Block[];
  // True if any unresolved draft placeholder ([...]) is left on the page.
  // Such pages are noindex and stay out of the sitemap (publish gate).
  hasPlaceholder: boolean;
};

// Facts that the generator turns into tokens, so the rendered values always
// come from lib/site.ts / lib/public-facts.ts.
const FACT_TOKENS: Record<string, string> = {
  "{CLINIC_NAME}": CLINIC_NAME,
  "{FACILITY_NO}": FACILITY_REGISTRATION_NUMBER,
  "{LEGAL_NAME}": LEGAL_NAME,
  "{COMPANY_NO}": COMPANY_REGISTRATION_NUMBER,
  "{ADDRESS}": ADDRESS_TEXT,
  "{TEL}": TELEPHONE_DISPLAY,
  "{EMAIL}": EMAIL,
  "{LINE_ID}": LINE_ID,
  "{LINE_URL}": LINE_URL,
};

// Fill price tokens ({DEPOSIT}, {PRICE}, …) and fact tokens.
export function fillTokens(text: string): string {
  let out = fillPrices(text);
  for (const [token, value] of Object.entries(FACT_TOKENS)) {
    out = out.replaceAll(token, value);
  }
  return out;
}

// Plain text of a run of segments (for JSON-LD).
export function segsText(segs: Seg[]): string {
  return segs
    .map((s) =>
      typeof s === "string"
        ? fillTokens(s)
        : "programmes" in s
          ? PROGRAMME_NAMES.join(" · ")
          : fillTokens(s.text),
    )
    .join("");
}

export function faqAnswerText(faq: Faq): string {
  return faq.a.map((p) => segsText(p)).join("\n\n");
}
