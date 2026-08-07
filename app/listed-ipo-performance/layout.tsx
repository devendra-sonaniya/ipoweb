import type { ReactNode } from "react";
import { SeoPageLayout, createPageMetadata } from "@/lib/seo";

const title = "Listed IPO Performance – Listing Price and Gains | IPOWEB";
const description =
  "Compare listed IPO issue prices, listing prices, listing gains and listing dates on IPOWEB.";

export const metadata = createPageMetadata({
  title,
  description,
  path: "/listed-ipo-performance",
  keywords: ["listed IPO", "IPO listing price", "IPO listing gain"],
});

export default function ListedIPOPerformanceLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SeoPageLayout
      name={title}
      description={description}
      path="/listed-ipo-performance"
      breadcrumbLabel="Listed IPO Performance"
    >
      {children}
    </SeoPageLayout>
  );
}
