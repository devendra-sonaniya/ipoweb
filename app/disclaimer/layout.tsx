import type { ReactNode } from "react";
import { SeoPageLayout, createPageMetadata } from "@/lib/seo";

const title = "Disclaimer | IPOWEB";
const description =
  "Read the IPOWEB disclaimer covering IPO information, GMP, subscription data, listing gains, and third-party services.";

export const metadata = createPageMetadata({
  title,
  description,
  path: "/disclaimer",
  keywords: ["IPOWEB disclaimer", "IPO GMP disclaimer"],
});

export default function DisclaimerLayout({ children }: { children: ReactNode }) {
  return (
    <SeoPageLayout
      name={title}
      description={description}
      path="/disclaimer"
      breadcrumbLabel="Disclaimer"
    >
      {children}
    </SeoPageLayout>
  );
}
