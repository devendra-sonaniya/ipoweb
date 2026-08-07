import type { ReactNode } from "react";
import { SeoPageLayout, createPageMetadata } from "@/lib/seo";

const title = "Mainboard IPO – GMP, Subscription and IPO Details | IPOWEB";
const description =
  "Track Mainboard IPO GMP, subscription, price bands, dates, financial analysis and listing information on IPOWEB.";

export const metadata = createPageMetadata({
  title,
  description,
  path: "/mainboard-ipo",
  keywords: ["Mainboard IPO", "NSE IPO", "BSE IPO"],
});

export default function MainboardLayout({ children }: { children: ReactNode }) {
  return (
    <SeoPageLayout
      name={title}
      description={description}
      path="/mainboard-ipo"
      breadcrumbLabel="Mainboard IPO"
    >
      {children}
    </SeoPageLayout>
  );
}
