import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Disclaimer | IPOWEB",
  description:
    "Read the IPOWEB disclaimer covering IPO information, GMP, subscription data, listing gains, and third-party services.",
};

const sectionClass =
  "rounded-2xl border border-slate-800 bg-slate-900 p-6";
const paragraphClass = "mt-3 text-slate-400";

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-10 max-sm:px-4 max-sm:py-8">
        <nav aria-label="Breadcrumb" className="text-sm font-bold text-slate-400">
          <Link href="/" className="transition hover:text-green-400">
            Home
          </Link>
          <span aria-hidden="true" className="mx-2">→</span>
          <span aria-current="page" className="text-white">
            Disclaimer
          </span>
        </nav>

        <h1 className="mt-6 text-4xl font-black text-green-400 max-sm:text-3xl">
          Disclaimer
        </h1>
        <p className="mt-3 text-slate-400">Last Updated: August 2026</p>

        <article className="mt-8 space-y-6">
          <section className={sectionClass}>
            <h2 className="text-xl font-black">1. Informational Purpose</h2>
            <p className={paragraphClass}>
              IPOWEB provides IPO-related content solely for educational and
              informational purposes. Information published on IPOWEB is intended
              to help users understand IPO markets and publicly available data.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className="text-xl font-black">2. No Investment Advice</h2>
            <p className={paragraphClass}>
              Nothing on IPOWEB constitutes investment, financial, legal or tax
              advice, or a recommendation to buy, sell or subscribe to any
              security. Users should conduct their own research and consult a
              qualified financial advisor before making investment decisions.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className="text-xl font-black">3. No Guarantee of Accuracy</h2>
            <p className={paragraphClass}>
              IPOWEB makes reasonable efforts to provide accurate and updated
              information but does not guarantee that any content is complete,
              current, accurate or error-free. IPO details may change without
              notice.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className="text-xl font-black">4. GMP Disclaimer</h2>
            <p className={paragraphClass}>
              Grey Market Premium (GMP) is unofficial, unregulated and subject to
              rapid change. GMP information does not guarantee an IPO&apos;s listing
              price, listing gain or future market performance and should not be
              the sole basis for an investment decision.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className="text-xl font-black">
              5. Subscription Data Disclaimer
            </h2>
            <p className={paragraphClass}>
              IPO subscription figures may be delayed, revised or sourced from
              exchanges and other public sources. Subscription levels do not
              assure allotment, listing gains or future returns.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className="text-xl font-black">6. Listing Gain Disclaimer</h2>
            <p className={paragraphClass}>
              Any estimated listing price, listing gain or return is illustrative
              only. IPOWEB does not guarantee profits, positive returns or any
              particular investment outcome. Securities may list or trade below
              their issue price.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className="text-xl font-black">
              7. Third-Party Links Disclaimer
            </h2>
            <p className={paragraphClass}>
              IPOWEB may link to external websites for convenience. We do not
              control or endorse their content and are not responsible for their
              accuracy, security, availability, privacy practices or services.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className="text-xl font-black">
              8. External Broker &amp; Registrar Disclaimer
            </h2>
            <p className={paragraphClass}>
              Applications, allotment checks and other transactions completed
              through broker, registrar, exchange or company websites are governed
              by those providers. IPOWEB is not a party to those transactions and
              is not responsible for their execution, availability or security.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className="text-xl font-black">9. Limitation of Liability</h2>
            <p className={paragraphClass}>
              To the fullest extent permitted by law, IPOWEB shall not be liable
              for direct, indirect, incidental or consequential loss arising from
              reliance on website content, investment decisions, data errors,
              service interruptions or third-party platforms.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className="text-xl font-black">10. User Responsibility</h2>
            <p className={paragraphClass}>
              Users are solely responsible for evaluating information, assessing
              risk and making their own financial decisions. Use of IPOWEB and
              reliance on its content are entirely at the user&apos;s own risk.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className="text-xl font-black">11. Intellectual Property</h2>
            <p className={paragraphClass}>
              Original IPOWEB content, branding, graphics, analysis, presentation
              and tools are protected intellectual property. Unauthorized copying,
              redistribution or commercial use is prohibited.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className="text-xl font-black">12. Changes to Disclaimer</h2>
            <p className={paragraphClass}>
              IPOWEB may update this Disclaimer at any time. Changes become
              effective when the revised Disclaimer is published on this page.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className="text-xl font-black">13. Contact Information</h2>
            <p className={paragraphClass}>
              Questions about this Disclaimer may be submitted through IPOWEB&apos;s
              Contact menu or official social media channels.
            </p>
          </section>
        </article>
      </div>
    </main>
  );
}
