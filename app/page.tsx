import type { Metadata } from "next";

import { BlogHighlights } from "@/components/BlogHighlights";
import { BottomCTA } from "@/components/BottomCTA";
import { ConcernCards } from "@/components/ConcernCards";
import { ConditionLinks } from "@/components/ConditionLinks";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { HomeFaq } from "@/components/HomeFaq";
import { SiteJsonLd } from "@/components/JsonLd";
import { LeadForm } from "@/components/LeadForm";
import { Navbar } from "@/components/Navbar";
import { Inclusions } from "@/components/Inclusions";
import { ProcessDiagram } from "@/components/ProcessDiagram";
import { Programmes } from "@/components/Programmes";
import { StickyCTA } from "@/components/StickyCTA";
import { Team } from "@/components/Team";
import { TrustStrip } from "@/components/TrustStrip";
import { fillPrices, HOME_FAQS, HOME_META } from "@/lib/homepage-content";
import { SITE_NAME } from "@/lib/site";

// Meta title/description verbatim from the BOFU homepage draft (v4).
const TITLE = HOME_META.title;
const DESCRIPTION = HOME_META.description;

export const metadata: Metadata = {
  // `absolute` skips the layout's "%s | CareConnect" template (brand is already in the title).
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  // Metadata merges shallowly, so openGraph/twitter must be complete here.
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
    locale: "th_TH",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function Home() {
  return (
    <>
      <SiteJsonLd
        pageName={TITLE}
        pageDescription={DESCRIPTION}
        faqs={HOME_FAQS.map((f) => ({ q: f.q, a: f.a.map(fillPrices) }))}
      />
      <Navbar />
      <main>
        <Hero />
        <TrustStrip />
        <ConcernCards />
        <ProcessDiagram />
        <Programmes />
        <Inclusions />
        <ConditionLinks />
        <LeadForm />
        <Team />
        <HomeFaq />
        <BlogHighlights />
        {/* <BottomCTA /> */}
      </main>
      <Footer />
      <StickyCTA />
    </>
  );
}
