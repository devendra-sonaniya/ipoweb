import type { ReactNode } from "react";
import { SeoPageLayout, createPageMetadata } from "@/lib/seo";

const title = "IPO GMP Today – Latest Grey Market Premium | IPOWEB";
const description =
  "Track the latest IPO GMP, price bands and estimated listing gains for current and upcoming IPOs in India on IPOWEB.";

export const metadata = createPageMetadata({
  title,
  description,
  path: "/gmp",
  keywords: ["IPO GMP today", "grey market premium", "latest IPO GMP"],
});

export default function GMPLayout({ children }: { children: ReactNode }) {
  return (
    <SeoPageLayout
      name={title}
      description={description}
      path="/gmp"
      breadcrumbLabel="IPO GMP"
    >
      {children}
    </SeoPageLayout>
  );
}
