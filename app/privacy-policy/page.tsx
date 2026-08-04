import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | IPOWEB",
  description: "Read the official IPOWEB Privacy Policy.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <nav aria-label="Breadcrumb" className="text-sm font-bold text-slate-400">
          <Link href="/" className="transition hover:text-green-400">
            Home
          </Link>
          <span aria-hidden="true" className="mx-2">→</span>
          <span aria-current="page" className="text-white">
            Privacy Policy
          </span>
        </nav>

        <h1 className="mt-6 text-4xl font-black text-green-400">
          Privacy Policy
        </h1>
        <p className="mt-3 text-slate-400">Last Updated: 05 August 2026</p>

        <article className="mt-8 space-y-6">
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-black">1. Introduction</h2>
            <p className="mt-3 text-slate-400">
              IPOWEB.in (&ldquo;IPOWeb&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) respects your privacy. This Privacy Policy explains how we collect, use, disclose, and protect information when you use our Website.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-black">2. Information We Collect</h2>
            <p className="mt-3 text-slate-400">
              We may collect information you provide directly, such as your name, email address, and messages sent through our contact channels. We may also collect technical information such as device details, browser type, IP address, and usage data.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-black">3. How We Use Information</h2>
            <p className="mt-3 text-slate-400">
              We use information to operate and improve IPOWeb, respond to requests, understand Website usage, maintain security, and provide relevant content and services.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-black">4. Cookies</h2>
            <p className="mt-3 text-slate-400">
              IPOWeb may use cookies and similar technologies to remember preferences, analyze Website traffic, and improve your browsing experience. You can control cookies through your browser settings.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-black">5. Log Data</h2>
            <p className="mt-3 text-slate-400">
              When you visit the Website, our servers may automatically collect log data, including your IP address, browser information, pages visited, and the time and date of your visit.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-black">6. Third-Party Services</h2>
            <p className="mt-3 text-slate-400">
              We may use third-party service providers to support Website analytics, advertising, hosting, and other operations. Their use of information is governed by their respective privacy policies.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-black">7. External Links</h2>
            <p className="mt-3 text-slate-400">
              The Website may link to external websites. IPOWeb is not responsible for the privacy practices, content, or security of third-party websites.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-black">8. Data Security</h2>
            <p className="mt-3 text-slate-400">
              We use reasonable administrative and technical safeguards to protect information. However, no transmission or storage method is completely secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-black">9. Data Retention</h2>
            <p className="mt-3 text-slate-400">
              We retain personal information only for as long as reasonably necessary for the purposes described in this Privacy Policy or as required by applicable law.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-black">10. Children&apos;s Privacy</h2>
            <p className="mt-3 text-slate-400">
              IPOWeb is not intended for children under the age of 18. We do not knowingly collect personal information from children.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-black">11. Your Choices</h2>
            <p className="mt-3 text-slate-400">
              You may choose not to provide certain information, disable cookies through your browser, or contact us to request access, correction, or deletion of personal data where applicable.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-black">12. Communications</h2>
            <p className="mt-3 text-slate-400">
              If you contact us, we may use the information you provide to respond to your request and maintain records of our communications.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-black">13. Changes to This Privacy Policy</h2>
            <p className="mt-3 text-slate-400">
              We may update this Privacy Policy from time to time. Updates will be posted on this page with a revised Last Updated date.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-black">14. Consent</h2>
            <p className="mt-3 text-slate-400">
              By using IPOWEB.in, you consent to this Privacy Policy and the collection and use of information as described here.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-black">15. Questions About Privacy</h2>
            <p className="mt-3 text-slate-400">
              If you have questions about this Privacy Policy or our privacy practices, please contact us using the details below.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-black">16. Contact Us</h2>
            <p className="mt-3 text-slate-400">
              For privacy-related questions, please contact IPOWeb at{" "}
              <a href="mailto:contact@ipoweb.in" className="font-bold text-green-400 hover:underline">
                contact@ipoweb.in
              </a>.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-black">17. Financial Disclaimer</h2>
            <p className="mt-3 text-slate-400">IPOWeb provides IPO-related information, Grey Market Premium (GMP), financial data, company analysis, IPO reviews, news, educational content, and market insights solely for informational and educational purposes.</p>
            <p className="mt-3 text-slate-400">Nothing published on this Website constitutes investment advice, financial advice, legal advice, tax advice, or a recommendation to buy, sell, or subscribe to any security.</p>
            <p className="mt-3 text-slate-400">Users should conduct their own research and consult a SEBI-registered Investment Adviser (IA) or Research Analyst (RA) before making any investment decision.</p>
            <p className="mt-3 text-slate-400">IPOWeb shall not be responsible for any financial loss resulting from reliance on information available on this Website.</p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-black">18. SEBI Disclaimer</h2>
            <p className="mt-3 text-slate-400">IPOWeb is an independent financial information platform.</p>
            <p className="mt-3 text-slate-400">IPOWeb is NOT registered with the Securities and Exchange Board of India (SEBI) as a Research Analyst (RA) or Investment Adviser (IA).</p>
            <p className="mt-3 text-slate-400">All IPO analysis, ratings, GMP data, opinions, scores, research, and educational content published on IPOWEB.in are for informational and educational purposes only.</p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-black">19. Grey Market Premium (GMP) Disclaimer</h2>
            <p className="mt-3 text-slate-400">Grey Market Premium (GMP) displayed on IPOWEB.in is collected from publicly available market sources.</p>
            <p className="mt-3 text-slate-400">GMP is unofficial, unregulated, and may change at any time.</p>
            <p className="mt-3 text-slate-400">IPOWeb does not guarantee the accuracy, completeness, or reliability of GMP information.</p>
            <p className="mt-3 text-slate-400">Users should never make investment decisions solely based on GMP.</p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-black">20. Google Analytics &amp; Advertising</h2>
            <p className="mt-3 text-slate-400">IPOWeb may use Google Analytics, Google AdSense, and other third-party advertising services.</p>
            <p className="mt-3 text-slate-400">These services may use cookies and similar technologies to improve website performance and display personalized advertisements.</p>
            <p className="mt-3 text-slate-400">Users can manage cookie preferences through their browser settings.</p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-black">21. Data Deletion Request</h2>
            <p className="mt-3 text-slate-400">Users may request access, correction, or permanent deletion of their personal data by contacting:</p>
            <p className="mt-3 font-bold text-green-400">contact@ipoweb.in</p>
            <p className="mt-3 text-slate-400">Verified requests should be processed within a reasonable period in accordance with applicable laws.</p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-black">22. Applicable Law</h2>
            <p className="mt-3 text-slate-400">This Privacy Policy shall be governed by the laws of India.</p>
            <p className="mt-3 text-slate-400">Any disputes shall be subject to the exclusive jurisdiction of the courts located in Bhopal, Madhya Pradesh, India.</p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-black">23. Digital Personal Data Protection Act</h2>
            <p className="mt-3 text-slate-400">Where applicable, IPOWeb intends to comply with the Digital Personal Data Protection Act, 2023 (India).</p>
          </section>
        </article>
      </div>
    </main>
  );
}
