import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Risk Disclosure | IPOWEB",
  description:
    "Review the IPOWEB Risk Disclosure covering investment, market, IPO, liquidity, valuation, business, and technology risks.",
};

const sectionClass =
  "rounded-2xl border border-slate-800 bg-slate-900 p-6";
const paragraphClass = "mt-3 text-slate-400";

export default function RiskDisclosurePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-10 max-sm:px-4 max-sm:py-8">
        <nav aria-label="Breadcrumb" className="text-sm font-bold text-slate-400">
          <Link href="/" className="transition hover:text-green-400">
            Home
          </Link>
          <span aria-hidden="true" className="mx-2">→</span>
          <span aria-current="page" className="text-white">
            Risk Disclosure
          </span>
        </nav>

        <h1 className="mt-6 text-4xl font-black text-green-400 max-sm:text-3xl">
          Risk Disclosure
        </h1>
        <p className="mt-3 text-slate-400">Last Updated: August 2026</p>

        <article className="mt-8 space-y-6">
          <section className={sectionClass}>
            <h2 className="text-xl font-black">1. Investment Risk</h2>
            <p className={paragraphClass}>
              All investments in securities involve risk, including the possible
              loss of some or all invested capital. Past performance, demand or
              market sentiment does not guarantee future results.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className="text-xl font-black">2. Market Risk</h2>
            <p className={paragraphClass}>
              Security prices may fluctuate because of market sentiment, interest
              rates, investor behavior, global events and other factors. Market
              movements can materially affect an IPO before and after listing.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className="text-xl font-black">3. IPO Risk</h2>
            <p className={paragraphClass}>
              IPOs may have limited trading history, uncertain price discovery and
              incomplete information about public-market performance. An IPO may
              be withdrawn, delayed, undersubscribed or list below its issue price.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className="text-xl font-black">4. Liquidity Risk</h2>
            <p className={paragraphClass}>
              There may be insufficient buyers or sellers for an IPO security.
              Limited liquidity can make it difficult to enter or exit a position
              at the expected price or within the desired time.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className="text-xl font-black">5. Valuation Risk</h2>
            <p className={paragraphClass}>
              An IPO&apos;s issue price may not reflect its fair or sustainable value.
              Valuation assumptions, peer comparisons, growth expectations and
              market conditions may prove inaccurate.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className="text-xl font-black">6. Business Risk</h2>
            <p className={paragraphClass}>
              Issuers face risks relating to competition, management, operations,
              debt, profitability, customer concentration and execution. These
              risks may negatively affect the company and its securities.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className="text-xl font-black">7. Regulatory Risk</h2>
            <p className={paragraphClass}>
              Changes in securities law, taxation, listing requirements or other
              regulation may affect an IPO, the issuer, market access or investor
              returns.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className="text-xl font-black">8. Economic Risk</h2>
            <p className={paragraphClass}>
              Inflation, interest rates, currency movements, political events,
              recessions and global economic conditions may adversely affect
              issuers, industries and securities markets.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className="text-xl font-black">9. Data Accuracy Risk</h2>
            <p className={paragraphClass}>
              IPO schedules, GMP, subscription figures, financial data and other
              information may be delayed, revised, incomplete or inaccurate.
              Decisions should be checked against official offer documents and
              exchange disclosures.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className="text-xl font-black">10. Technology Risk</h2>
            <p className={paragraphClass}>
              Website outages, connectivity failures, software defects, cyber
              incidents or delayed updates may affect access to IPOWEB and the
              availability or timeliness of information.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className="text-xl font-black">
              11. Third-Party Platform Risk
            </h2>
            <p className={paragraphClass}>
              Brokers, registrars, exchanges and other external platforms operate
              independently of IPOWEB. Their outages, errors, security incidents or
              transaction failures are outside IPOWEB&apos;s control.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className="text-xl font-black">12. User Responsibility</h2>
            <p className={paragraphClass}>
              Users must assess their objectives, financial position and risk
              tolerance, conduct independent research and review official
              documents. Users should consult a qualified financial advisor before
              investing when professional guidance is needed.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className="text-xl font-black">13. Final Risk Warning</h2>
            <p className={paragraphClass}>
              IPOWEB provides educational and informational content only. No
              information, analysis, GMP figure or market signal guarantees profit
              or a successful investment outcome. All investments in securities
              involve risk, and users may lose some or all of their invested
              capital.
            </p>
          </section>
        </article>
      </div>
    </main>
  );
}
