import type { ReactNode } from "react";
import { SeoPageLayout, createPageMetadata } from "@/lib/seo";

const title = "Risk Disclosure | IPOWEB";
const description =
  "Review the IPOWEB Risk Disclosure covering investment, market, IPO, liquidity, valuation, business, and technology risks.";

export const metadata = createPageMetadata({
  title,
  description,
  path: "/risk-disclosure",
  keywords: ["IPO risk disclosure", "investment risk", "IPOWEB risk"],
});

export default function RiskLayout({ children }: { children: ReactNode }) {
  return (
    <SeoPageLayout
      name={title}
      description={description}
      path="/risk-disclosure"
      breadcrumbLabel="Risk Disclosure"
    >
      {children}
    </SeoPageLayout>
  );
}
