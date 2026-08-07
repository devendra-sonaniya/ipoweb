import type { ReactNode } from "react";
import { SeoPageLayout, createPageMetadata } from "@/lib/seo";

const title = "Privacy Policy | IPOWEB";
const description = "Read the official IPOWEB Privacy Policy and data practices.";

export const metadata = createPageMetadata({
  title,
  description,
  path: "/privacy-policy",
  keywords: ["IPOWEB privacy policy", "privacy"],
});

export default function PrivacyLayout({ children }: { children: ReactNode }) {
  return (
    <SeoPageLayout
      name={title}
      description={description}
      path="/privacy-policy"
      breadcrumbLabel="Privacy Policy"
    >
      {children}
    </SeoPageLayout>
  );
}
