import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "IPO FAQs and IPO Investing Guide | IPOWEB",
  description:
    "Find clear answers about IPO applications, GMP, allotment, subscriptions and listing on IPOWEB.",
  path: "/ipo-faq",
  keywords: ["IPO FAQ", "IPO guide", "how to apply for IPO"],
  index: false,
});

export default function LegacyFAQsLayout({ children }: { children: ReactNode }) {
  return children;
}
