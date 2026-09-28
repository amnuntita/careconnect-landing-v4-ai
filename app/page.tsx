import { BlogHighlights } from "@/components/BlogHighlights";
import { BottomCTA } from "@/components/BottomCTA";
import { Conditions } from "@/components/Conditions";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/JsonLd";
import { LeadForm } from "@/components/LeadForm";
import { Navbar } from "@/components/Navbar";
import { Pricing } from "@/components/Pricing";
import { SocialProof } from "@/components/SocialProof";
import { StickyCTA } from "@/components/StickyCTA";
import { Team } from "@/components/Team";

export default function Home() {
  return (
    <>
      <OrganizationJsonLd />
      <WebSiteJsonLd />
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
