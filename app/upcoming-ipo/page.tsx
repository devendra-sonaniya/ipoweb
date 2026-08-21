import Link from "next/link";
import { getIPOsCollection } from "@/lib/ipoRepository";
import { formatIPODate } from "@/lib/formatIPODate";

type IPO = {
  name: string;
  slug: string;
  type: string;
  status: string;
  priceBand: string;
  gmp?: string;
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

function typeBadgeColor(type: string) {
  return type.toUpperCase() === "MAINBOARD"
    ? "border-blue-700 bg-blue-950 text-blue-200"
    : "border-yellow-500/30 bg-yellow-500/15 text-yellow-300";
}

async function getUpcomingIPOs(): Promise<IPO[]> {
  try {
    const collection = await getIPOsCollection();

    return await collection
      .find(
        { status: "UPCOMING" },
        {
          projection: {
            _id: 0,
            name: 1,
            slug: 1,
            type: 1,
            status: 1,
            openDate: 1,
            closeDate: 1,
            priceBand: 1,
            gmp: 1,
          },
        }
      )
      .sort({ _id: -1 })
      .toArray() as unknown as IPO[];
  } catch (error) {
    console.error("Unable to load upcoming IPOs.", error);
    return [];
  }
}

export default async function UpcomingIPOPage() {
  const ipos = await getUpcomingIPOs();

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-12 text-white max-sm:px-4 max-sm:py-8">
      <div className="mx-auto max-w-[1200px]">
        <Link href="/" className="font-bold text-green-400">
          ← Back to Home
        </Link>

        <h1 className="mt-6 text-4xl font-black max-sm:text-3xl">
          Upcoming <span className="text-green-400">IPO</span>
        </h1>

        <p className="mt-3 text-slate-400">IPOs expected to open soon.</p>

        {ipos.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center text-slate-400">
            No Upcoming IPOs available right now.
          </div>
        ) : (
          <div className="mt-8 overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
            <div className="mobile-table-scroll overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-slate-950">
                  <tr className="border-b border-slate-700">
                    <th className="px-6 py-5 text-left text-xs font-black uppercase text-slate-500">
                      IPO Name
                    </th>
                    <th className="px-6 py-5 text-left text-xs font-black uppercase text-slate-500">
                      Type
                    </th>
                    <th className="px-6 py-5 text-left text-xs font-black uppercase text-slate-500">
                      Open Date
                    </th>
                    <th className="px-6 py-5 text-left text-xs font-black uppercase text-slate-500">
                      Close Date
                    </th>
                    <th className="px-6 py-5 text-left text-xs font-black uppercase text-slate-500">
                      Price Band
                    </th>
                    <th className="px-6 py-5 text-left text-xs font-black uppercase text-slate-500">
                      GMP
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {ipos.map((ipo) => (
                    <tr
                      key={ipo.name}
                      className="border-b border-slate-800 transition hover:bg-slate-800/70"
                    >
                      <td className="px-6 py-6 font-black">
                        <Link
                          href={`/ipo/${ipo.slug || createSlug(ipo.name)}`}
                          className="transition hover:text-green-400"
                        >
                          {ipo.name}
                        </Link>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap">
                        <span
                          className={`rounded-full border px-3 py-2 text-xs font-black ${typeBadgeColor(ipo.type)}`}
                        >
                          {ipo.type}
                        </span>
                      </td>
                      <td className="px-6 py-6 font-bold whitespace-nowrap text-green-400">
                        {formatIPODate(ipo.openDate)}
                      </td>
                      <td className="px-6 py-6 font-bold whitespace-nowrap text-green-400">
                        {formatIPODate(ipo.closeDate)}
                      </td>
                      <td className="px-6 py-6 font-bold whitespace-nowrap">
                        {ipo.priceBand || "-"}
                      </td>
                      <td className="px-6 py-6 font-bold whitespace-nowrap">
                        {ipo.gmp || "-"}
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
