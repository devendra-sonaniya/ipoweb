import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import MobileEnhancements from "./components/MobileEnhancements";
import {
  SITE_URL,
  StructuredData,
  createPageMetadata,
} from "@/lib/seo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

const homeTitle =
  "IPOWEB – IPO GMP, Upcoming IPOs, Mainboard IPO, SME IPO & IPO Calendar";
const homeDescription =
  "Track IPO GMP, Upcoming IPOs, Mainboard IPOs, SME IPOs, IPO Calendar, Subscription Data, Allotment Status, Financial Analysis and IPO Market Intelligence on IPOWEB.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "IPOWEB",
  category: "finance",
  icons: {
    icon: [{ url: "/favicon.ico", type: "image/x-icon" }],
    shortcut: "/favicon.ico",
  },
  ...createPageMetadata({
    title: homeTitle,
    description: homeDescription,
    path: "/",
  }),
};

const globalStructuredData = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: `${SITE_URL}/`,
    name: "IPOWEB",
    description: homeDescription,
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    inLanguage: "en-IN",
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "IPOWEB",
    url: `${SITE_URL}/`,
  },
];

const themeInitializer = `
  try {
    const theme = localStorage.getItem("ipoweb-theme") === "light" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.dataset.theme = theme;
  } catch {
    document.documentElement.classList.add("dark");
    document.documentElement.dataset.theme = "dark";
  }
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Script id="theme-initializer" strategy="beforeInteractive">
          {themeInitializer}
        </Script>
        <StructuredData data={globalStructuredData} />
        {children}
        <MobileEnhancements />
      </body>
      {gaMeasurementId && <GoogleAnalytics gaId={gaMeasurementId} />}
    </html>
  );
}
