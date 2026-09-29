import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Thai, Sarabun } from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";

import { SITE_NAME, SITE_URL } from "@/lib/site";

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
const SITE_DESCRIPTION =
  "บริการกายภาพบำบัดและกิจกรรมบำบัดที่บ้านครอบคลุมมากกว่า 10 จังหวัดทั่วประเทศ ดูแลโดยทีมสหสาขาวิชาชีพ วางแผนรายเคสโดยแพทย์เวชศาสตร์ฟื้นฟู";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TAGLINE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    title: SITE_TAGLINE,
    description: SITE_DESCRIPTION,
    locale: "th_TH",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TAGLINE,
    description: SITE_DESCRIPTION,
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
