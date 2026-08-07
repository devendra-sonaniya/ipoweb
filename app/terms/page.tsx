import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions | IPOWEB",
  description:
    "Read the official IPOWEB Terms & Conditions governing use of the website and its IPO information services.",
};

const sectionClass =
  "rounded-2xl border border-slate-800 bg-slate-900 p-6";
const paragraphClass = "mt-3 text-slate-400";
const listClass = "mt-3 list-disc space-y-2 pl-6 text-slate-400";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-10 max-sm:px-4 max-sm:py-8">
        <nav aria-label="Breadcrumb" className="text-sm font-bold text-slate-400">
          <Link href="/" className="transition hover:text-green-400">
            Home
          </Link>
          <span aria-hidden="true" className="mx-2">→</span>
          <span aria-current="page" className="text-white">
            Terms &amp; Conditions
          </span>
        </nav>

        <h1 className="mt-6 text-4xl font-black text-green-400 max-sm:text-3xl">
          Terms &amp; Conditions
        </h1>
        <p className="mt-3 text-slate-400">Last Updated: August 2026</p>

        <article className="mt-8 space-y-6">
          <section className={sectionClass}>
            <p className="text-slate-400">Welcome to IPOWEB.</p>
            <p className={paragraphClass}>
              By accessing or using IPOWEB, you agree to comply with these Terms
              &amp; Conditions. If you do not agree with any part of these Terms,
              please discontinue using the website.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className="text-xl font-black">1. Purpose of IPOWEB</h2>
            <p className={paragraphClass}>
              IPOWEB is an informational platform that provides IPO-related
              information including:
            </p>
            <ul className={listClass}>
              <li>IPO Calendar</li>
              <li>IPO GMP (Grey Market Premium)</li>
              <li>Subscription Data</li>
              <li>Company Financials</li>
              <li>Company Overview</li>
              <li>IPO News</li>
              <li>Listing Information</li>
              <li>Allotment Status</li>
              <li>Registrar Links</li>
              <li>Market Intelligence</li>
              <li>Educational IPO Content</li>
            </ul>
            <p className={paragraphClass}>
              All information is provided for educational and informational
              purposes only.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className="text-xl font-black">2. No Investment Advice</h2>
            <p className={paragraphClass}>
              IPOWEB does not provide investment, legal, tax or financial advice.
            </p>
            <p className={paragraphClass}>
              Any IPO analysis, GMP, Data Signal, Market Intelligence, ratings,
              opinions or commentary published on IPOWEB should not be considered
              a recommendation to buy, sell or subscribe to any security.
            </p>
            <p className={paragraphClass}>
              Users should always conduct their own research and consult a
              qualified financial advisor before making any investment decision.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className="text-xl font-black">3. Data Accuracy</h2>
            <p className={paragraphClass}>
              IPOWEB makes every effort to keep information accurate and updated.
            </p>
            <p className={paragraphClass}>
              However, we do not guarantee that all information will always be
              complete, accurate or error-free.
            </p>
            <p className={paragraphClass}>
              IPO schedules, GMP, subscription data, listing dates, allotment
              details and financial information may change without prior notice.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className="text-xl font-black">4. Third-Party Links</h2>
            <p className={paragraphClass}>
              IPOWEB may contain links to third-party websites including:
            </p>
            <ul className={listClass}>
              <li>Registrar Websites</li>
              <li>Broker IPO Application Pages</li>
              <li>NSE</li>
              <li>BSE</li>
              <li>Company Websites</li>
            </ul>
            <p className={paragraphClass}>
              IPOWEB is not responsible for the content, security, availability or
              services provided by these third-party websites.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className="text-xl font-black">5. Intellectual Property</h2>
            <p className={paragraphClass}>
              Unless otherwise stated, all original content available on IPOWEB
              including:
            </p>
            <ul className={listClass}>
              <li>Website Design</li>
              <li>IPOWEB Branding</li>
              <li>Logo</li>
              <li>Graphics</li>
              <li>Articles</li>
              <li>Market Intelligence</li>
              <li>Data Presentation</li>
              <li>Custom Tools</li>
            </ul>
            <p className={paragraphClass}>belongs to IPOWEB.</p>
            <p className={paragraphClass}>
              Unauthorized copying, reproduction or commercial use is strictly
              prohibited without prior written permission.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className="text-xl font-black">6. User Responsibilities</h2>
            <p className={paragraphClass}>Users agree to:</p>
            <ul className={listClass}>
              <li>Use IPOWEB lawfully.</li>
              <li>Not attempt to hack or damage the website.</li>
              <li>Not misuse automated tools to scrape website content.</li>
              <li>Not copy or redistribute website content without permission.</li>
            </ul>
          </section>

          <section className={sectionClass}>
            <h2 className="text-xl font-black">7. Limitation of Liability</h2>
            <p className={paragraphClass}>
              IPOWEB shall not be liable for any direct or indirect financial loss
              resulting from:
            </p>
            <ul className={listClass}>
              <li>Investment decisions</li>
              <li>Market fluctuations</li>
              <li>Website downtime</li>
              <li>Data inaccuracies</li>
              <li>Technical issues</li>
              <li>Third-party websites</li>
            </ul>
            <p className={paragraphClass}>
              Users access and use IPOWEB entirely at their own risk.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className="text-xl font-black">8. Privacy</h2>
            <p className={paragraphClass}>
              Use of IPOWEB is also governed by the IPOWEB Privacy Policy.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className="text-xl font-black">9. Changes to These Terms</h2>
            <p className={paragraphClass}>
              IPOWEB reserves the right to modify these Terms &amp; Conditions at
              any time without prior notice.
            </p>
            <p className={paragraphClass}>
              The updated version becomes effective immediately after publication.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className="text-xl font-black">10. Contact</h2>
            <p className={paragraphClass}>
              For questions regarding these Terms &amp; Conditions, users may
              contact IPOWEB through the Contact page or our official social media
              channels.
            </p>
          </section>
        </article>
      </div>
    </main>
  );
}
