import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Thai, Sarabun } from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";

import { PROVINCES_SERVED, SITE_NAME, SITE_URL } from "@/lib/site";

import "./globals.css";

const ibmPlexSansThai = IBM_Plex_Sans_Thai({
  variable: "--font-heading",
  subsets: ["latin", "thai"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const sarabun = Sarabun({
  variable: "--font-body",
  subsets: ["latin", "thai"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const SITE_TAGLINE = "CareConnect — กายภาพบำบัดที่บ้าน";
const SITE_DESCRIPTION = `บริการกายภาพบำบัดและกิจกรรมบำบัดที่บ้านครอบคลุม ${PROVINCES_SERVED.length} จังหวัดทั่วประเทศ ดูแลโดยทีมสหสาขาวิชาชีพ วางแผนรายเคสโดยแพทย์เวชศาสตร์ฟื้นฟู`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TAGLINE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  // No `alternates.canonical` or `openGraph.url` here: they would be inherited
  // by every page that forgets to set its own. Each page sets its canonical.
  //
  // The social share image is app/opengraph-image.jpg (+ .alt.txt); Next.js
  // detects it and emits og:image, and twitter:image is filled from it.
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_TAGLINE,
    description: SITE_DESCRIPTION,
    locale: "th_TH",
  },
  // Only the card type: Next.js fills twitter:title/description/image from
  // each page's openGraph, so pages don't inherit the homepage tagline.
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#fdfbf5",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${ibmPlexSansThai.variable} ${sarabun.variable}`}
    >
      <GoogleTagManager gtmId="GTM-PK9DP4KB" />
      <body>{children}</body>
    </html>
  );
}
