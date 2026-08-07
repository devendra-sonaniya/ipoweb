"use client";

import { useEffect, useState } from "react";
import {
  getAllotmentButtonState,
  type AllotmentButtonIPO,
} from "@/lib/allotmentButtonState";

type IPO = AllotmentButtonIPO & {
  name: string;
  listingGain?: string;
  allotmentDate?: string;
  listingDate?: string;
  registrar?: string;
};

const monthIndexes: Record<string, number> = {
  JAN: 0,
  FEB: 1,
  MAR: 2,
  APR: 3,
  MAY: 4,
  JUN: 5,
  JUL: 6,
  AUG: 7,
  SEP: 8,
  OCT: 9,
  NOV: 10,
  DEC: 11,
};

function listingDateValue(listingDate?: string) {
  const match = listingDate
    ?.trim()
    .toUpperCase()
    .match(/^(\d{1,2})\s+([A-Z]{3})(?:\s+(\d{4}))?$/);

  if (!match || monthIndexes[match[2]] === undefined) {
    return Number.MAX_SAFE_INTEGER;
  }

  return Date.UTC(
    Number(match[3] || new Date().getFullYear()),
    monthIndexes[match[2]],
    Number(match[1])
  );
}

export default function AllotmentStatusPage() {
  const [ipos, setIpos] = useState<IPO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadIPOs() {
      try {
        const response = await fetch("/api/ipos", { cache: "no-store" });
        const data = await response.json();

        if (!response.ok || !Array.isArray(data)) {
          throw new Error(data?.message || "Unable to load IPO allotment data.");
        }

        setIpos(
          data
            .map((ipo: IPO, index: number) => ({ ipo, index }))
            .sort(
              (first: { ipo: IPO; index: number }, second: { ipo: IPO; index: number }) =>
                listingDateValue(first.ipo.listingDate) -
                  listingDateValue(second.ipo.listingDate) ||
                first.index - second.index
            )
            .map(({ ipo }: { ipo: IPO }) => ipo)
        );
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load IPO allotment data."
        );
      } finally {
        setLoading(false);
      }
    }

    loadIPOs();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="border-b border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950">
        <div className="mx-auto max-w-[1500px] px-5 py-12 max-sm:px-4 max-sm:py-8">
          <p className="font-bold uppercase tracking-wider text-green-400">
            IPOWEB.IN
          </p>
          <h1 className="mt-2 text-4xl font-black uppercase sm:text-5xl">
            IPO Allotment Status
          </h1>
          <p className="mt-4 max-w-2xl text-slate-300">
            Check IPO allotment details directly with the official registrar.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-5 py-10 max-sm:px-4 max-sm:py-8">
        {loading ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
            Loading allotment status...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-10 text-center text-red-200">
            {error}
          </div>
        ) : ipos.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center text-slate-400">
            No IPOs are available right now.
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
            <div className="mobile-table-scroll overflow-x-auto">
              <table className="min-w-[760px] w-full text-left">
                <thead className="bg-slate-950">
                  <tr className="border-b border-slate-700">
                    <th className="px-6 py-5 text-xs font-black uppercase text-slate-500">
                      IPO Name
                    </th>
                    <th className="px-6 py-5 text-xs font-black uppercase text-slate-500">
                      Est. Listing Gain
                    </th>
                    <th className="px-6 py-5 text-xs font-black uppercase text-slate-500">
                      Listing Date
                    </th>
                    <th className="px-6 py-5 text-xs font-black uppercase text-slate-500">
                      Allotment Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ipos.map((ipo) => {
                    const allotmentButton = getAllotmentButtonState(ipo);

                    return (
                      <tr
                        key={ipo.name}
                        className="border-b border-slate-800 last:border-b-0 hover:bg-slate-800/70"
                      >
                        <td className="px-6 py-5 text-lg font-black text-white">
                          {ipo.name}
                        </td>
                        <td className="px-6 py-5 font-bold text-green-400">
                          {ipo.listingGain || "--"}
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-slate-300">
                          {ipo.listingDate || "--"}
                        </td>
                        <td className="px-6 py-5">
                          {allotmentButton.kind === "available" ? (
                            <a
                              href={allotmentButton.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex rounded-lg bg-green-500 px-4 py-2.5 text-sm font-black text-slate-950 transition hover:bg-green-400"
                            >
                              Allotment Status
                            </a>
                          ) : allotmentButton.kind === "soon" ? (
                            <button
                              type="button"
                              disabled
                              className="inline-flex rounded-lg bg-yellow-400 px-4 py-2.5 text-sm font-black text-black transition disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              Allotment Soon
                            </button>
                          ) : null}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
