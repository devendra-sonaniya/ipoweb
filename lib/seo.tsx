import type { Metadata } from "next";
import type { ReactNode } from "react";

export const SITE_URL = "https://ipoweb.in";
export const SITE_NAME = "IPOWEB";

const DEFAULT_KEYWORDS = [
  "IPO",
  "IPO GMP",
  "upcoming IPO",
  "Mainboard IPO",
  "SME IPO",
  "IPO calendar",
  "IPO subscription",
  "IPO allotment status",
  "IPO financial analysis",
  "India IPO",
];

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  index?: boolean;
};

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}

export function createPageMetadata({
  title,
  description,
  path,
  keywords = [],
  index = true,
}: PageMetadataOptions): Metadata {
  const canonical = absoluteUrl(path);

  return {
    title,
    description,
    keywords: [...new Set([...keywords, ...DEFAULT_KEYWORDS])],
    alternates: {
      canonical,
      languages: {
        "en-IN": canonical,
      },
    },
    robots: {
      index,
      follow: index,
      googleBot: {
        index,
        follow: index,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: canonical,
      siteName: SITE_NAME,
      title,
      description,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export function StructuredData({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export function createWebPageSchema({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}) {
  const url = absoluteUrl(path);

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name,
    description,
    isPartOf: {
      "@id": `${SITE_URL}/#website`,
    },
    inLanguage: "en-IN",
  };
}

export function createBreadcrumbSchema(
  items: Array<{ name: string; path: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function SeoPageLayout({
  children,
  name,
  description,
  path,
  breadcrumbLabel,
  additionalStructuredData = [],
}: {
  children: ReactNode;
  name: string;
  description: string;
  path: string;
  breadcrumbLabel: string;
  additionalStructuredData?: object[];
}) {
  return (
    <>
      <StructuredData
        data={[
          createWebPageSchema({ name, description, path }),
          createBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: breadcrumbLabel, path },
          ]),
          ...additionalStructuredData,
        ]}
      />
      {children}
    </>
  );
}
