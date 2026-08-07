import type { ReactNode } from "react";
import { SeoPageLayout, createPageMetadata } from "@/lib/seo";

const title = "Upcoming IPOs – Mainboard and SME IPO List | IPOWEB";
const description =
  "Discover upcoming Mainboard and SME IPOs with open dates, close dates, price bands and latest GMP on IPOWEB.";

export const metadata = createPageMetadata({
  title,
  description,
  path: "/upcoming-ipo",
  keywords: ["upcoming IPO", "upcoming Mainboard IPO", "upcoming SME IPO"],
});

export default function UpcomingLayout({ children }: { children: ReactNode }) {
  return (
    <SeoPageLayout
      name={title}
      description={description}
      path="/upcoming-ipo"
      breadcrumbLabel="Upcoming IPOs"
    >
      {children}
    </SeoPageLayout>
  );
}
