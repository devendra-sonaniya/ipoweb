import type { ReactNode } from "react";
import { SeoPageLayout, createPageMetadata } from "@/lib/seo";

const title = "IPO Allotment Status | Check Latest IPO Allotment | IPOWEB";
const description =
  "Check the latest IPO allotment status, allotment dates, registrar links and estimated listing gains on IPOWEB.";

export const metadata = createPageMetadata({
  title,
  description,
  path: "/allotment-status",
  keywords: ["IPO allotment status", "IPO registrar", "check IPO allotment"],
});

export default function AllotmentStatusLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SeoPageLayout
      name={title}
      description={description}
      path="/allotment-status"
      breadcrumbLabel="IPO Allotment Status"
    >
      {children}
    </SeoPageLayout>
  );
}
