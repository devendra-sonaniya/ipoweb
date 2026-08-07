import type { ReactNode } from "react";
import { SeoPageLayout, createPageMetadata } from "@/lib/seo";

const title = "IPO Allotment Status and Registrar Links | IPOWEB";
const description =
  "Find IPO allotment dates and official registrar links to check your latest IPO allotment status.";

export const metadata = createPageMetadata({
  title,
  description,
  path: "/ipo-allotment-status",
  keywords: ["IPO allotment", "IPO registrar links", "allotment date"],
});

export default function IPOAllotmentLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SeoPageLayout
      name={title}
      description={description}
      path="/ipo-allotment-status"
      breadcrumbLabel="IPO Allotment Status"
    >
      {children}
    </SeoPageLayout>
  );
}
