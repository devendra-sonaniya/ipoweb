import type { ReactNode } from "react";
import { SeoPageLayout, createPageMetadata } from "@/lib/seo";

const title = "SME IPO – GMP, Subscription and IPO Details | IPOWEB";
const description =
  "Track SME IPO GMP, subscription, price bands, dates, financial analysis and listing information on IPOWEB.";

export const metadata = createPageMetadata({
  title,
  description,
  path: "/sme-ipo",
  keywords: ["SME IPO", "BSE SME IPO", "NSE Emerge IPO"],
});

export default function SMELayout({ children }: { children: ReactNode }) {
  return (
    <SeoPageLayout
      name={title}
      description={description}
      path="/sme-ipo"
      breadcrumbLabel="SME IPO"
    >
      {children}
    </SeoPageLayout>
  );
}
