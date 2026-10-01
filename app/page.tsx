import type { Metadata } from "next";

import { BlogHighlights } from "@/components/BlogHighlights";
import { BottomCTA } from "@/components/BottomCTA";
import { Conditions } from "@/components/Conditions";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { SiteJsonLd } from "@/components/JsonLd";
import { LeadForm } from "@/components/LeadForm";
import { Navbar } from "@/components/Navbar";
import { Pricing } from "@/components/Pricing";
import { SocialProof } from "@/components/SocialProof";
import { StickyCTA } from "@/components/StickyCTA";
import { Team } from "@/components/Team";
import { PROVINCES_SERVED, SITE_NAME } from "@/lib/site";

// General home-physiotherapy framing across all six condition groups. Stroke
// terms are owned by /stroke-rehab-at-home, so the homepage doesn't lead with them.
const TITLE = `กายภาพบำบัดที่บ้าน วางแผนโดยแพทย์เวชศาสตร์ฟื้นฟู | ${SITE_NAME}`;
const DESCRIPTION = `กายภาพบำบัดที่บ้านใน ${PROVINCES_SERVED.length} จังหวัด วางแผนโดยแพทย์เวชศาสตร์ฟื้นฟู ดูแลหลังผ่าตัดเข่า สะโพก อุบัติเหตุ ปวดเรื้อรัง ฝึกกลืน ผู้สูงอายุอ่อนแรง และอัมพฤกษ์ อัมพาต`;

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
      <SiteJsonLd pageName={TITLE} pageDescription={DESCRIPTION} />
      <Navbar />
      <main>
        <Hero />
        <SocialProof />
        <Conditions />
        <Pricing />
        <LeadForm />
        <Team />
        <BlogHighlights />
        {/* <BottomCTA /> */}
      </main>
      <Footer />
      <StickyCTA />
    </>
  );
}
