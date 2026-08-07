import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About IPOWEB | Reliable IPO Intelligence",
  description:
    "Learn about IPOWEB, our mission, values, and the reliable IPO data and market intelligence we provide to investors across India.",
};

const sectionClass = "rounded-2xl border border-slate-800 bg-slate-900 p-6";
const paragraphClass = "mt-3 text-slate-400";
const listClass = "mt-3 list-disc space-y-2 pl-6 text-slate-400";

export default function AboutUsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-10 max-sm:px-4 max-sm:py-8">
        <nav aria-label="Breadcrumb" className="text-sm font-bold text-slate-400">
          <Link href="/" className="transition hover:text-green-400">
            Home
          </Link>
          <span aria-hidden="true" className="mx-2">
            →
          </span>
          <span aria-current="page" className="text-white">
            About Us
          </span>
        </nav>

        <h1 className="mt-6 text-4xl font-black text-green-400 max-sm:text-3xl">
          About IPOWEB
        </h1>
        <p className="mt-3 text-slate-400">
          Empowering Investors with Reliable IPO Intelligence
        </p>

        <article className="mt-8 space-y-6">
          <section className={sectionClass}>
            <h2 className="text-xl font-black">About Us</h2>
            <p className={paragraphClass}>
              IPOWEB is a dedicated IPO information and market intelligence
              platform designed to help investors make informed decisions through
              accurate, timely, and easy-to-understand IPO data.
            </p>
            <p className={paragraphClass}>
              Our mission is to simplify the IPO market by bringing essential
              information together in one place, including IPO calendars, GMP
              updates, subscription data, company financials, valuation metrics,
              peer comparisons, allotment information, listing details, and
              educational resources.
            </p>
            <p className={paragraphClass}>
              Whether you are a first-time investor or an experienced market
              participant, IPOWEB aims to provide a clean, fast, and transparent
              experience for researching public issues.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className="text-xl font-black">What We Provide</h2>
            <ul className={listClass}>
              <li>IPO Calendar</li>
              <li>Live GMP Updates</li>
              <li>IPO Subscription Data</li>
              <li>Company Financial Performance</li>
              <li>Valuation Analysis</li>
              <li>Peer Company Comparison</li>
              <li>IPO Timeline</li>
              <li>Allotment Status Links</li>
              <li>Registrar Information</li>
              <li>Market Intelligence</li>
              <li>IPO Guides &amp; FAQs</li>
            </ul>
          </section>

          <section className={sectionClass}>
            <h2 className="text-xl font-black">Our Mission</h2>
            <p className={paragraphClass}>
              To make IPO investing simpler by delivering reliable,
              well-organized, and easy-to-access information for every investor.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className="text-xl font-black">Our Vision</h2>
            <p className={paragraphClass}>
              To become one of India&apos;s most trusted IPO information platforms
              by continuously improving data quality, transparency, and user
              experience.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className="text-xl font-black">Our Values</h2>
            <ul className={listClass}>
              <li>Accuracy</li>
              <li>Transparency</li>
              <li>Simplicity</li>
              <li>Reliability</li>
              <li>Continuous Improvement</li>
            </ul>
          </section>

          <section className={sectionClass}>
            <h2 className="text-xl font-black">Important Notice</h2>
            <p className={paragraphClass}>IPOWEB is an informational platform.</p>
            <p className={paragraphClass}>
              We do not provide investment, legal, tax, or financial advice.
            </p>
            <p className={paragraphClass}>
              Users should conduct their own research and consult a qualified
              financial advisor before making investment decisions.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className="text-xl font-black">Contact</h2>
            <p className={paragraphClass}>
              Users can connect with IPOWEB through the official Contact page and
              our verified social media channels.
            </p>
          </section>
        </article>
      </div>
    </main>
  );
}
