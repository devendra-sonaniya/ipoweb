"use client";

import { useEffect, useState } from "react";
import { getRegistrarLink } from "@/lib/registrarLinks";
import { formatIPODate } from "@/lib/formatIPODate";

type IPO = {
  name: string;
  allotmentDate: string;
  registrar: string;
};

export default function IPOAllotmentStatusPage() {
  const [ipos, setIpos] = useState<IPO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/ipos", {
          cache: "no-store",
        });

        const data = await res.json();
        setIpos(Array.isArray(data) ? data : []);
      } catch {
        setIpos([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Loading...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-10 max-sm:px-4 max-sm:py-8">

        <h1 className="text-4xl font-black text-green-400 max-sm:text-3xl">
          IPO Allotment Status
        </h1>

        <p className="mt-3 text-slate-400">
          Check the latest IPO allotment status, allotment dates,
          registrar links and listing schedule.
        </p>

        <div className="mobile-table-scroll mt-8 overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left">
            <thead className="bg-slate-900">
              <tr>
                <th className="px-5 py-4">IPO Name</th>
                <th className="px-5 py-4">Allotment Date</th>
                <th className="px-5 py-4">Registrar</th>
                <th className="px-5 py-4">Check Status</th>
              </tr>
            </thead>

            <tbody>
              {ipos.map((ipo) => (
                <tr
                  key={ipo.name}
                  className="border-t border-slate-800"
                >
                  <td className="px-5 py-4 font-semibold">
                    {ipo.name}
                  </td>

                  <td className="px-5 py-4">
                    {formatIPODate(ipo.allotmentDate)}
                  </td>

                  <td className="px-5 py-4">
                    {ipo.registrar}
                  </td>

                  <td className="px-5 py-4">
                    <a
                      href={getRegistrarLink(ipo.registrar)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-700"
                    >
                      Check Allotment
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </main>
  );
}
