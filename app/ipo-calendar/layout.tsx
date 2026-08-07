import type { ReactNode } from "react";
import { SeoPageLayout, createPageMetadata } from "@/lib/seo";

const title = "IPO Calendar – Upcoming Mainboard and SME IPOs | IPOWEB";
const description =
  "View the IPO calendar for upcoming Mainboard and SME IPOs with open dates, close dates, price bands and current GMP.";

export const metadata = createPageMetadata({
  title,
  description,
  path: "/ipo-calendar",
  keywords: ["IPO calendar", "upcoming IPO dates", "IPO schedule India"],
});

export default function IPOCalendarLayout({ children }: { children: ReactNode }) {
  return (
    <SeoPageLayout
      name={title}
      description={description}
      path="/ipo-calendar"
      breadcrumbLabel="IPO Calendar"
    >
      {children}
    </SeoPageLayout>
  );
}
