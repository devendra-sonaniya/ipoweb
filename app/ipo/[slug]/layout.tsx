import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { getIPOBySlug } from "@/lib/ipoRepository";
import {
  SeoPageLayout,
  createPageMetadata,
} from "@/lib/seo";

type Props = {
  children: ReactNode;
  params: Promise<{ slug: string }>;
};

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
  const lookup = await getIPOBySlug(slug);

  if (!lookup) notFound();

  const seo = getIPOSEO(lookup.ipo.name, lookup.canonicalSlug);

  return createPageMetadata({
    ...seo,
    keywords: [
      `${lookup.ipo.name} IPO`,
      `${lookup.ipo.name} IPO GMP`,
      `${lookup.ipo.name} IPO review`,
      `${lookup.ipo.name} IPO subscription`,
      `${lookup.ipo.name} listing date`,
    ],
  });
}

export default async function IPODetailLayout({ children, params }: Props) {
  const { slug } = await params;
  const lookup = await getIPOBySlug(slug);

  if (!lookup) notFound();

  const seo = getIPOSEO(lookup.ipo.name, lookup.canonicalSlug);

  return (
    <SeoPageLayout
      name={seo.title}
      description={seo.description}
      path={seo.path}
      breadcrumbLabel={`${lookup.ipo.name} IPO`}
    >
      {children}
    </SeoPageLayout>
  );
}
