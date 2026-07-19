"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type IPO = {
  name: string;
  type: string;
  status: string;
  priceBand: string;
  issueSize: string;
  openDate: string;
  closeDate: string;
};

function createSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function UpcomingIPOPage() {
  const [ipos, setIpos] = useState<IPO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/ipos", {
          cache: "no-store",
        });

        const data = await res.json();

        const list = Array.isArray(data) ? data : [];

        setIpos(
          list.filter(
            (ipo: IPO) =>
              ipo.status?.toUpperCase() === "UPCOMING"
          )
        );
      } catch {
        setIpos([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-12 text-white">
      <div className="mx-auto max-w-[1200px]">

        <Link href="/" className="font-bold text-green-400">
          ← Back to Home
        </Link>

        <h1 className="mt-6 text-4xl font-black">
          Upcoming <span className="text-green-400">IPO</span>
        </h1>

        <p className="mt-3 text-slate-400">
          IPOs expected to open soon.
        </p>

        {loading ? (
          <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
            Loading Upcoming IPOs...
          </div>
        ) : ipos.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center text-slate-400">
            No Upcoming IPOs available right now.
          </div>
        ) : (
          <div className="mt-8 overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">

            <div className="overflow-x-auto">

              <table className="w-full min-w-[800px]">

                <thead className="bg-slate-950">
                  <tr className="border-b border-slate-700">
                    <th className="px-6 py-5 text-left text-xs font-black uppercase text-slate-500">
                      IPO NAME
                    </th>
                    <th className="px-6 py-5 text-left text-xs font-black uppercase text-slate-500">
                      DATE
                    </th>
                    <th className="px-6 py-5 text-left text-xs font-black uppercase text-slate-500">
                      ISSUE SIZE
                    </th>
                    <th className="px-6 py-5 text-left text-xs font-black uppercase text-slate-500">
                      PRICE BAND
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {ipos.map((ipo) => (
                    <tr
                      key={ipo.name}
                      onClick={() => {
                        window.location.href = `/ipo/${createSlug(ipo.name)}`;
                      }}
                      className="cursor-pointer border-b border-slate-800 transition hover:bg-slate-800/70"
                    >
                      <td className="px-6 py-6 font-black">
                        {ipo.name}
                      </td>

                      <td className="px-6 py-6 font-bold whitespace-nowrap text-green-400">
                        {ipo.openDate && ipo.closeDate
                          ? `${ipo.openDate} - ${ipo.closeDate}`
                          : "Date TBA"}
                      </td>

                      <td className="px-6 py-6 font-bold whitespace-nowrap">
                        {ipo.issueSize || "--"}
                      </td>

                      <td className="px-6 py-6 font-bold whitespace-nowrap">
                        {ipo.priceBand || "--"}
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>

            </div>

          </div>
        )}

      </div>
    </main>
  );
}