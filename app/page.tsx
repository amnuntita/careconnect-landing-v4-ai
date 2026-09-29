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
import { SITE_NAME } from "@/lib/site";

const TITLE = `กายภาพบำบัดที่บ้าน ฟื้นฟูผู้ป่วยโรคหลอดเลือดสมอง | ${SITE_NAME}`;
const DESCRIPTION =
  "กายภาพบำบัดที่บ้านสำหรับผู้ป่วยโรคหลอดเลือดสมอง (Stroke) และผู้ที่ต้องฟื้นฟูร่างกาย วางแผนรายเคสโดยแพทย์เวชศาสตร์ฟื้นฟู ให้บริการมากกว่า 10 จังหวัด";

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
