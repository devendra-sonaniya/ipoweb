import type { ReactNode } from "react";
import { SeoPageLayout, createPageMetadata } from "@/lib/seo";

const title = "About IPOWEB | Reliable IPO Intelligence";
const description =
  "Learn about IPOWEB, our mission, values, and the reliable IPO data and market intelligence we provide to investors across India.";

export const metadata = createPageMetadata({
  title,
  description,
  path: "/about-us",
  keywords: ["about IPOWEB", "IPO intelligence platform"],
});

export default function AboutLayout({ children }: { children: ReactNode }) {
  return (
    <SeoPageLayout
      name={title}
      description={description}
      path="/about-us"
      breadcrumbLabel="About Us"
    >
      {children}
    </SeoPageLayout>
  );
}
