import { formatPrice, PACKAGES } from "@/lib/packages";
import {
  COMPANY_REGISTRATION_NUMBER,
  FACILITY_REGISTRATION_NUMBER,
  LEGAL_NAME,
  LOGO_URL,
  ORGANIZATION_ID,
  PROVINCES_SERVED,
  SAME_AS,
  SITE_NAME,
  SITE_URL,
  TELEPHONE,
  WEBSITE_ID,
} from "@/lib/site";
import type { Author } from "@/sanity/lib/types";

const SERVICE_DESCRIPTION =
  "บริการกายภาพบำบัดและกิจกรรมบำบัดที่บ้านครอบคลุมมากกว่า 10 จังหวัดทั่วประเทศ วางแผนรายเคสโดยแพทย์เวชศาสตร์ฟื้นฟู";

// Renders JSON-LD, escaping "<" so string values can't close the <script>
// tag (per the Next.js JSON-LD guide).
export function JsonLdScript({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

const areaServed = PROVINCES_SERVED.map((p) => ({
  "@type": "AdministrativeArea",
  name: p.name,
}));

// Homepage structured data as a single @graph: the business, the website, the
// homepage itself, and the home physiotherapy service with its priced
// packages. No AggregateRating/Review: self-served reviews are ineligible.
export function SiteJsonLd({
  pageName,
  pageDescription,
}: {
  pageName: string;
  pageDescription: string;
}) {
  const identifier = [
    {
      "@type": "PropertyValue",
      name: "เลขทะเบียนนิติบุคคล",
      value: COMPANY_REGISTRATION_NUMBER,
    },
    ...(FACILITY_REGISTRATION_NUMBER
      ? [
          {
            "@type": "PropertyValue",
            name: "เลขทะเบียนสถานพยาบาล (กระทรวงสาธารณสุข)",
            value: FACILITY_REGISTRATION_NUMBER,
          },
        ]
      : []),
  ];

  const organization = {
    // "Physiotherapy" is a schema.org MedicalBusiness subtype. It replaces
    // MedicalBusiness + medicalSpecialty: medicalSpecialty is not a property
    // of MedicalBusiness, and "PhysicalTherapy"/"Rehabilitation" are not
    // MedicalSpecialty values.
    "@type": "Physiotherapy",
    "@id": ORGANIZATION_ID,
    name: SITE_NAME,
    legalName: LEGAL_NAME,
    url: SITE_URL,
    logo: LOGO_URL,
    image: LOGO_URL,
    description: SERVICE_DESCRIPTION,
    telephone: TELEPHONE,
    address: {
      "@type": "PostalAddress",
      addressCountry: "TH",
      addressRegion: "กรุงเทพมหานคร",
    },
    areaServed,
    identifier,
    ...(SAME_AS.length ? { sameAs: SAME_AS } : {}),
  };

  const website = {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "th-TH",
    publisher: { "@id": ORGANIZATION_ID },
  };

  const webpage = {
    "@type": "WebPage",
    "@id": `${SITE_URL}/#webpage`,
    url: `${SITE_URL}/`,
    name: pageName,
    description: pageDescription,
    inLanguage: "th-TH",
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORGANIZATION_ID },
  };

  // Offers only for packages with a published price ("ราคาพิเศษ" has none).
  const offers = PACKAGES.flatMap((p) =>
    p.price === null
      ? []
      : [
          {
            "@type": "Offer",
            name: `${p.name} (${p.tier})`,
            description: `${p.target} · ${formatPrice(p.price)} ${p.sub}`,
            url: `${SITE_URL}/#pricing`,
            price: p.price,
            priceCurrency: "THB",
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: p.price,
              priceCurrency: "THB",
              referenceQuantity: {
                "@type": "QuantitativeValue",
                value: p.sessions,
                unitText: "ครั้ง",
              },
            },
          },
        ],
  );

  const service = {
    "@type": "Service",
    "@id": `${SITE_URL}/#home-physiotherapy`,
    name: "กายภาพบำบัดที่บ้าน",
    serviceType: "กายภาพบำบัดที่บ้าน",
    description: SERVICE_DESCRIPTION,
    provider: { "@id": ORGANIZATION_ID },
    areaServed,
    offers,
  };

  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@graph": [organization, website, webpage, service],
      }}
    />
  );
}

function personJsonLd(person: Author) {
  return {
    "@type": "Person",
    name: person.name,
    ...(person.credentials ? { jobTitle: person.credentials } : {}),
    ...(person.bio ? { description: person.bio } : {}),
    ...(person.licenseNumber
      ? {
          hasCredential: {
            "@type": "EducationalOccupationalCredential",
            credentialCategory: "license",
            identifier: person.licenseNumber,
          },
        }
      : {}),
  };
}

// Blog post structured data as a @graph: the BlogPosting plus the page it
// lives on. With a medical reviewer, the page is a MedicalWebPage carrying
// reviewedBy/lastReviewed; otherwise a plain WebPage.
export function BlogPostingJsonLd({
  title,
  description,
  slug,
  datePublished,
  dateModified,
  imageUrl,
  author,
  reviewedBy,
  reviewedAt,
}: {
  title: string;
  description?: string;
  slug: string;
  datePublished: string;
  dateModified?: string;
  imageUrl?: string;
  author?: Author | null;
  reviewedBy?: Author | null;
  reviewedAt?: string | null;
}) {
  const url = `${SITE_URL}/blog/${slug}`;
  const pageId = `${url}#webpage`;
  const articleId = `${url}#article`;

  const organization = {
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: SITE_NAME,
    url: SITE_URL,
    logo: { "@type": "ImageObject", url: LOGO_URL },
  };

  const article = {
    "@type": "BlogPosting",
    "@id": articleId,
    headline: title,
    ...(description ? { description } : {}),
    ...(imageUrl ? { image: imageUrl } : {}),
    datePublished,
    dateModified: dateModified ?? datePublished,
    inLanguage: "th-TH",
    mainEntityOfPage: { "@id": pageId },
    url,
    author: author ? personJsonLd(author) : organization,
    publisher: organization,
  };

  const page = {
    "@type": reviewedBy ? "MedicalWebPage" : "WebPage",
    "@id": pageId,
    url,
    name: title,
    inLanguage: "th-TH",
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: { "@id": articleId },
    ...(reviewedBy ? { reviewedBy: personJsonLd(reviewedBy) } : {}),
    ...(reviewedBy && reviewedAt ? { lastReviewed: reviewedAt } : {}),
  };

  return (
    <JsonLdScript
      data={{ "@context": "https://schema.org", "@graph": [article, page] }}
    />
  );
}
