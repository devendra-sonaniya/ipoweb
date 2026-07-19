"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type IPO = {
  name: string;
  type: string;
  status: string;
  priceBand: string;
  gmp: string;
  listingGain: string;
  subscription: string;
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

function badgeColor(value: string) {
  const text = value.toUpperCase();

  if (text === "OPEN") {
    return "bg-green-500/15 text-green-400 border-green-500/30";
  }
  if (text === "CLOSED") {
    return "bg-red-500/15 text-red-400 border-red-500/30";
  }
  if (text === "LISTED") {
    return "bg-blue-500/15 text-blue-300 border-blue-500/30";
  }

  return "bg-yellow-500/15 text-yellow-300 border-yellow-500/30";
}

export default function MainboardIPOPage() {
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
              ipo.type?.toUpperCase() === "MAINBOARD"
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
      <div className="mx-auto max-w-[1450px]">

        <Link href="/" className="font-bold text-green-400">
          ← Back to Home
        </Link>

        <h1 className="mt-6 text-4xl font-black">
          Mainboard <span className="text-green-400">IPO</span>
        </h1>

        <p className="mt-3 text-slate-400">
          All mainboard IPOs listed on BSE / NSE.
        </p>

        {loading ? (
          <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
            Loading Mainboard IPOs...
          </div>
        ) : ipos.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center text-slate-400">
            No Mainboard IPOs available right now.
          </div>
        ) : (
          <div className="mt-8 overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1100px]">

                <thead className="bg-slate-950">
                  <tr className="border-b border-slate-700">
                    <th className="px-6 py-5 text-left text-xs font-black uppercase text-slate-500">IPO NAME</th>
                    <th className="px-6 py-5 text-left text-xs font-black uppercase text-slate-500">GMP</th>
                    <th className="px-6 py-5 text-left text-xs font-black uppercase text-slate-500">EST. GAIN</th>
                    <th className="px-6 py-5 text-left text-xs font-black uppercase text-slate-500">PRICE BAND</th>
                    <th className="px-6 py-5 text-left text-xs font-black uppercase text-slate-500">OPEN</th>
                    <th className="px-6 py-5 text-left text-xs font-black uppercase text-slate-500">CLOSE</th>
                    <th className="px-6 py-5 text-left text-xs font-black uppercase text-slate-500">STATUS</th>
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
                      <td className="px-6 py-6 font-black">{ipo.name}</td>
                      <td className="px-6 py-6 text-xl font-black text-green-400">{ipo.gmp || "--"}</td>
                      <td className="px-6 py-6 font-bold text-green-400">{ipo.listingGain || "--"}</td>
                      <td className="px-6 py-6 font-bold whitespace-nowrap">{ipo.priceBand}</td>
                      <td className="px-6 py-6 whitespace-nowrap">{ipo.openDate}</td>
                      <td className="px-6 py-6 whitespace-nowrap">{ipo.closeDate}</td>
                      <td className="px-6 py-6">
                        <span className={`rounded-full border px-3 py-2 text-xs font-black ${badgeColor(ipo.status)}`}>
                          {ipo.status}
                        </span>
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