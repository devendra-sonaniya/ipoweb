"use client";

import IPOFAQ from "../components/IPOFAQ";

export default function IPOFAQPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-10 max-sm:px-4 max-sm:py-8">
        <h1 className="text-4xl font-black text-green-400 max-sm:text-3xl">
          IPO FAQs & How to Apply
        </h1>
        <p className="mt-3 text-slate-400">
          Learn everything about IPOs, IPO application, allotment,
          listing, GMP, UPI mandate and more.
        </p>
        <IPOFAQ />
      </div>
    </main>
  );
}
