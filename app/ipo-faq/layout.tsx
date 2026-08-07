import type { ReactNode } from "react";
import {
  SeoPageLayout,
  absoluteUrl,
  createPageMetadata,
} from "@/lib/seo";

const title = "IPO FAQs and How to Apply for an IPO | IPOWEB";
const description =
  "Learn about IPO applications, allotment, GMP, subscription, listing, UPI mandates and IPO investing through IPOWEB FAQs.";

const faqPageSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${absoluteUrl("/ipo-faq")}#faq`,
  mainEntity: [
    {
      "@type": "Question",
      name: "What is an IPO?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "An IPO is when a private company offers its shares to the public for the first time through a stock exchange.",
      },
    },
    {
      "@type": "Question",
      name: "How to apply for an IPO?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Apply through a broker app, bank net banking using ASBA, or a UPI-based IPO application with a valid Demat account and PAN.",
      },
    },
    {
      "@type": "Question",
      name: "How is IPO allotment decided?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Retail allotment may use a computerized lottery when an IPO is oversubscribed, while other categories may receive proportionate or discretionary allotment.",
      },
    },
    {
      "@type": "Question",
      name: "What is IPO GMP?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "IPO GMP is the unofficial grey market premium at which IPO shares may trade before their official stock-exchange listing.",
      },
    },
    {
      "@type": "Question",
      name: "Does GMP guarantee listing gain?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. GMP is unofficial and unregulated, and it does not guarantee an IPO's listing price or investment return.",
      },
    },
  ],
};

export const metadata = createPageMetadata({
  title,
  description,
  path: "/ipo-faq",
  keywords: ["IPO FAQ", "IPO guide", "how to apply for IPO", "IPO GMP FAQ"],
});

export default function IPOFAQLayout({ children }: { children: ReactNode }) {
  return (
    <SeoPageLayout
      name={title}
      description={description}
      path="/ipo-faq"
      breadcrumbLabel="IPO FAQs"
      additionalStructuredData={[faqPageSchema]}
    >
      {children}
    </SeoPageLayout>
  );
}
