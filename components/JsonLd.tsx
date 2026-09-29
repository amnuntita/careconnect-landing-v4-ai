import { SITE_URL } from "@/lib/site";

export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: "CareConnect",
    url: SITE_URL,
    logo: `${SITE_URL}/images/CareConnect%20Logo.png`,
    description:
      "บริการกายภาพบำบัดและกิจกรรมบำบัดที่บ้านครอบคลุมมากกว่า 10 จังหวัดทั่วประเทศ วางแผนรายเคสโดยแพทย์เวชศาสตร์ฟื้นฟู",
    telephone: "+66-2-114-7168",
    areaServed: [
      { "@type": "AdministrativeArea", name: "กรุงเทพมหานคร" },
      { "@type": "AdministrativeArea", name: "นนทบุรี" },
      { "@type": "AdministrativeArea", name: "ปทุมธานี" },
      { "@type": "AdministrativeArea", name: "สมุทรปราการ" },
      { "@type": "AdministrativeArea", name: "นครปฐม" },
    ],
    address: {
      "@type": "PostalAddress",
      addressCountry: "TH",
      addressRegion: "กรุงเทพมหานคร",
    },
    medicalSpecialty: ["PhysicalTherapy", "Rehabilitation"],
    // TODO: add sameAs once social URLs are confirmed
    // sameAs: ["https://line.me/R/ti/p/@careconnect", "https://facebook.com/..."],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function BlogPostingJsonLd({
  title,
  description,
  slug,
  datePublished,
  dateModified,
  imageUrl,
}: {
  title: string;
  description?: string;
  slug: string;
  datePublished: string;
  dateModified?: string;
  imageUrl?: string;
}) {
  const url = `${SITE_URL}/blog/${slug}`;
  const data = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    ...(description ? { description } : {}),
    ...(imageUrl ? { image: imageUrl } : {}),
    datePublished,
    dateModified: dateModified ?? datePublished,
    inLanguage: "th-TH",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    author: { "@type": "Organization", name: "CareConnect", url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: "CareConnect",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/CareConnect%20Logo.png`,
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function WebSiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "CareConnect",
    url: SITE_URL,
    inLanguage: "th-TH",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
