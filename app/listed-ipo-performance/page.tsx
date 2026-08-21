"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  calculateListingGain,
  parseIPOAmount,
} from "@/lib/listingPerformance";
import { formatIPODate } from "@/lib/formatIPODate";

type IPO = {
  name: string;
  type: string;
  status: string;
  priceBand: string;
  listingPrice?: string;
  listingDate?: string;
};

function formatAmount(value?: string) {
  const amount = parseIPOAmount(value);
  return amount === null ? "--" : `₹${amount.toLocaleString("en-IN")}`;
}

function typeBadgeColor(type: string) {
  return type.toUpperCase().includes("MAINBOARD")
    ? "border-sky-500/30 bg-sky-500/15 text-sky-400"
    : "border-yellow-500/30 bg-yellow-500/15 text-yellow-400";
}

export default function ListedIPOPerformancePage() {
  const [ipos, setIpos] = useState<IPO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadIPOs() {
      try {
        const response = await fetch("/api/ipos", { cache: "no-store" });
        const data = await response.json();
        const list = Array.isArray(data) ? (data as IPO[]) : [];

        setIpos(
          list.filter((ipo) => ipo.status?.trim().toUpperCase() === "LISTED")
        );
      } catch {
        setIpos([]);
      } finally {
        setLoading(false);
      }
    }

    loadIPOs();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-12 text-white max-sm:px-4 max-sm:py-8">
      <div className="mx-auto max-w-[1450px]">
        <Link href="/" className="font-bold text-green-400">
          ← Back to Home
        </Link>

        <h1 className="mt-6 text-4xl font-black max-sm:text-3xl">
          Listed IPO <span className="text-green-400">Performance</span>
        </h1>

        <p className="mt-3 text-slate-400">
          Compare issue prices, listing prices and actual listing gains.
        </p>

        {loading ? (
          <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
            Loading Listed IPOs...
          </div>
        ) : ipos.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center text-slate-400">
            No listed IPOs available right now.
          </div>
        ) : (
          <div className="mt-8 overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
            <div className="mobile-table-scroll overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left">
                <thead className="bg-slate-950">
                  <tr className="border-b border-slate-700">
                    {[
                      "IPO Name",
                      "Type",
                      "Price Band",
                      "Issue Price",
                      "Listing Price",
                      "Listing Gain %",
                      "Listing Date",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-6 py-5 text-xs font-black uppercase text-slate-500"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {ipos.map((ipo) => {
                    const listingGain = calculateListingGain(
                      ipo.priceBand,
                      ipo.listingPrice
                    );

                    return (
                      <tr
                        key={ipo.name}
                        className="border-b border-slate-800 transition hover:bg-slate-800/70"
                      >
                        <td className="px-6 py-6 font-black">{ipo.name}</td>
                        <td className="px-6 py-6">
                          <span
                            className={`rounded-full border px-3 py-2 text-xs font-black ${typeBadgeColor(ipo.type)}`}
                          >
                            {ipo.type}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-6 font-bold">
                          {ipo.priceBand || "--"}
                        </td>
                        <td className="whitespace-nowrap px-6 py-6 font-bold">
                          {formatAmount(ipo.priceBand)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-6 font-black text-green-400">
                          {formatAmount(ipo.listingPrice)}
                        </td>
                        <td
                          className={`whitespace-nowrap px-6 py-6 text-xl font-black ${
                            listingGain !== null && listingGain < 0
                              ? "text-red-400"
                              : "text-green-400"
                          }`}
                        >
                          {listingGain === null
                            ? "--"
                            : `${listingGain >= 0 ? "+" : ""}${listingGain.toFixed(2)}%`}
                        </td>
                        <td className="whitespace-nowrap px-6 py-6 font-semibold">
                          {formatIPODate(ipo.listingDate, "--")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
