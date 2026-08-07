import type { Metadata } from "next";
import type { ReactNode } from "react";
import { cache } from "react";
import { connectToDatabase } from "@/lib/mongodb";
import {
  SeoPageLayout,
  createPageMetadata,
} from "@/lib/seo";

type Props = {
  children: ReactNode;
  params: Promise<{ slug: string }>;
};

type IPOSEOData = {
  name: string;
};

function createSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const getIPOBySlug = cache(async (slug: string): Promise<IPOSEOData | null> => {
  try {
    const db = await connectToDatabase();
    const ipos = await db
      .collection<IPOSEOData>("ipos")
      .find({}, { projection: { _id: 0, name: 1 } })
      .toArray();

    return ipos.find((ipo) => createSlug(ipo.name) === slug) ?? null;
  } catch (error) {
    console.error("Unable to load IPO SEO data.", error);
    return null;
  }
});

function getIPOSEO(name: string, slug: string) {
  return {
    title: `${name} IPO GMP, Review, Subscription, Financials & Listing Date | IPOWEB`,
    description: `Complete analysis of ${name} IPO including GMP, subscription status, financial performance, valuation, peer comparison, allotment, registrar and listing date.`,
    path: `/ipo/${slug}`,
  };
}

export async function generateMetadata({
  params,
}: Omit<Props, "children">): Promise<Metadata> {
  const { slug } = await params;
  const ipo = await getIPOBySlug(slug);

  if (!ipo) {
    return createPageMetadata({
      title: "IPO Not Found | IPOWEB",
      description: "The requested IPO page could not be found on IPOWEB.",
      path: `/ipo/${slug}`,
      index: false,
    });
  }

  const seo = getIPOSEO(ipo.name, slug);

  return createPageMetadata({
    ...seo,
    keywords: [
      `${ipo.name} IPO`,
      `${ipo.name} IPO GMP`,
      `${ipo.name} IPO review`,
      `${ipo.name} IPO subscription`,
      `${ipo.name} listing date`,
    ],
  });
}

export default async function IPODetailLayout({ children, params }: Props) {
  const { slug } = await params;
  const ipo = await getIPOBySlug(slug);

  if (!ipo) {
    return children;
  }

  const seo = getIPOSEO(ipo.name, slug);

  return (
    <SeoPageLayout
      name={seo.title}
      description={seo.description}
      path={seo.path}
      breadcrumbLabel={`${ipo.name} IPO`}
    >
      {children}
    </SeoPageLayout>
  );
}
