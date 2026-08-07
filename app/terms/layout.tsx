import type { ReactNode } from "react";
import { SeoPageLayout, createPageMetadata } from "@/lib/seo";

const title = "Terms & Conditions | IPOWEB";
const description =
  "Read the official IPOWEB Terms & Conditions governing use of the website and its IPO information services.";

export const metadata = createPageMetadata({
  title,
  description,
  path: "/terms",
  keywords: ["IPOWEB terms", "terms and conditions"],
});

export default function TermsLayout({ children }: { children: ReactNode }) {
  return (
    <SeoPageLayout
      name={title}
      description={description}
      path="/terms"
      breadcrumbLabel="Terms & Conditions"
    >
      {children}
    </SeoPageLayout>
  );
}
