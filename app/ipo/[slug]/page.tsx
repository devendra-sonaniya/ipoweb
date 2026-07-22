"use client";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
} from "recharts";
import FinancialChart from "./FinancialChart";
type GMPHistoryItem = {
  date: string;
  value: string;
};

type IPO = {
  name: string;
  type: string;
  status: string;
  priceBand: string;
  gmp: string;
  listingGain: string;
  subscription: string;
  score: string;
  openDate?: string;
  closeDate?: string;
  allotmentDate?: string;
  listingDate?: string;
  lotSize?: string;
  minimumInvestment?: string;
  faceValue?: string;
  qibSubscription?: string;
  niiSubscription?: string;
  retailSubscription?: string;
  employeeSubscription?: string;
  shareholderSubscription?: string;
  retailMinLot: string;
  retailMinShares: string;
  retailMinAmount: string;

  retailMaxLot: string;
  retailMaxShares: string;
  retailMaxAmount: string;

  sHniLot: string;
  sHniShares: string;
  sHniAmount: string;

  bHniLot: string;
  bHniShares: string;
  bHniAmount: string;
  issueSize?: string;
  exchange?: string;
  registrar?: string;
  drhp: string;
  rhp: string;
  
  listingGainView?: string;
  riskLevel?: string;
  prePromoterHolding: string;
  postPromoterHolding: string;
  revenueFY2024: string;
  revenueFY2025: string;
  revenueFY2026: string;

  profitFY2024: string;
  profitFY2025: string;
  profitFY2026: string;
  marketCapPostIPO: string;
  bookValue: string;
  eps: string;
  dilutedEPS: string;
  peRatio: string;
  pbRatio: string;
  industryPE: string;
  debtToEquity: string;
  totalAssets: string;
  ipoValuation: string;
  peerRevenue: string;
peerPAT: string;
peerEPS: string;
peerPE: string;
peerMarketCap: string;
peerROE: string;
peerDebtEquity: string;

peer1Name: string;
peer1Revenue: string;
peer1PAT: string;
peer1EPS: string;
peer1PE: string;
peer1MarketCap: string;
peer1ROE: string;
peer1DebtEquity: string;

peer2Name: string;
peer2Revenue: string;
peer2PAT: string;
peer2EPS: string;
peer2PE: string;
peer2MarketCap: string;
peer2ROE: string;
peer2DebtEquity: string;

peer3Name: string;
peer3Revenue: string;
peer3PAT: string;
peer3EPS: string;
peer3PE: string;
peer3MarketCap: string;
peer3ROE: string;
peer3DebtEquity: string;
  anchorAllocation: string;
  anchorDetails: string;
  revenueGrowth?: string;
  patGrowth?: string;
  debtRisk?: string;
  valuation?: string;
  qibReservation: string;
  niiReservation: string;
  retailReservation: string;
  employeeReservation: string;
  shareholderReservation: string;
  overview?: string;
  financials?: string;
  strengths?: string;
  risks?: string;
  companyOverview?: string;
  businessModel?: string;
  objectsOfIssue?: string;
  gmpHistory?: GMPHistoryItem[];
};

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

function createSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getNumber(value: string) {
  const number = Number(value.replace(/[^\d.-]/g, ""));
  return Number.isFinite(number) ? number : 0;
}

function getUpperPrice(priceBand: string) {
  const numbers = priceBand.match(/\d+(?:\.\d+)?/g);

  if (!numbers || numbers.length === 0) {
    return 0;
  }

  return Number(numbers[numbers.length - 1]) || 0;
}

function formatChange(value: number) {
  if (value > 0) return `+₹${value}`;
  if (value < 0) return `-₹${Math.abs(value)}`;
  return "₹0";
}

function formatPercent(value: number) {
  if (!Number.isFinite(value)) return "0.0%";
  if (value > 0) return `+${value.toFixed(1)}%`;
  return `${value.toFixed(1)}%`;
}

async function getIPOs(): Promise<IPO[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const response = await fetch(
      `${baseUrl}/api/ipos`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();

    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export default async function IPOPage({ params }: Props) {
  const { slug } = await params;

  const ipos = await getIPOs();

  const ipo = ipos.find(
    (item) => createSlug(item.name) === slug
  );

  if (!ipo) {
    return (
      <main className="min-h-screen bg-slate-950 p-10 text-white">
        <h1 className="text-4xl font-black text-red-500">
          IPO Not Found
        </h1>

        <a
          href="/"
          className="mt-8 inline-block text-green-400"
        >
          ← Back to Home
        </a>
      </main>
    );
  }

  const history = Array.isArray(ipo.gmpHistory)
    ? ipo.gmpHistory
    : [];

  const values = history.map((item) =>
    getNumber(item.value)
  );

  const firstGMP =
    values.length > 0 ? values[0] : 0;

  const latestGMP =
    values.length > 0
      ? values[values.length - 1]
      : getNumber(ipo.gmp || "");

  const previousGMP =
    values.length >= 2
      ? values[values.length - 2]
      : latestGMP;

  const overallChange = latestGMP - firstGMP;

  const overallPercent =
    firstGMP !== 0
      ? (overallChange / Math.abs(firstGMP)) * 100
      : 0;

  const latestChange = latestGMP - previousGMP;

  const latestPercent =
    previousGMP !== 0
      ? (latestChange / Math.abs(previousGMP)) * 100
      : 0;

  const momentum =
    values.length < 2
      ? "TRACKING"
      : latestGMP > firstGMP
        ? "RISING"
        : latestGMP < firstGMP
          ? "FALLING"
          : "STABLE";

  const upperPrice = getUpperPrice(ipo.priceBand || "");

  const estimatedListingPrice =
    upperPrice > 0 ? upperPrice + latestGMP : 0;

  const estimatedGain =
    upperPrice > 0
      ? (latestGMP / upperPrice) * 100
      : 0;

  const maxGMP =
    values.length > 0
      ? Math.max(...values, 1)
      : 1;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-7xl px-6 py-12">
        <a
          href="/"
          className="font-bold text-green-400"
        >
          ← Back to Home
        </a>

        <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-8">
          <div className="flex justify-between">
            <span className="font-black text-green-400">
              {ipo.status}
            </span>

            <span className="font-bold text-slate-400">
              {ipo.type}
            </span>
          </div>

          <h1 className="mt-6 text-5xl font-black">
            {ipo.name}
          </h1>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
    <p className="text-sm font-bold uppercase tracking-wide text-slate-500">
      Minimum Investment
    </p>

    <p className="mt-2 text-3xl font-black text-green-400">
      ₹{ipo.minimumInvestment || "N/A"}
    </p>
  </div>

  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
    <p className="text-sm font-bold uppercase tracking-wide text-slate-500">
      Lot Size
    </p>

    <p className="mt-2 text-3xl font-black text-green-400">
      {ipo.lotSize || "N/A"} Shares
    </p>
  </div>
</div>
          
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">

  {/* IPO Dates */}

  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
    <h3 className="text-lg font-black text-green-400">
      IPO DATES
    </h3>

    <div className="mt-5 space-y-3 text-sm">

      <div className="flex justify-between">
        <span>Open Date</span>
        <span>{ipo.openDate || "-"}</span>
      </div>

      <div className="flex justify-between">
        <span>Close Date</span>
        <span>{ipo.closeDate || "-"}</span>
      </div>

      <div className="flex justify-between">
        <span>Allotment</span>
        <span>{ipo.allotmentDate || "-"}</span>
      </div>

      <div className="flex justify-between">
        <span>Listing Date</span>
        <span>{ipo.listingDate || "-"}</span>
      </div>

    </div>
  </div>

  {/* Price Band */}

  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">

    <h3 className="text-lg font-black text-green-400">
      PRICE BAND
    </h3>

    <div className="mt-5 space-y-3 text-sm">

      <div className="flex justify-between">
        <span>Price Band</span>
        <span>{ipo.priceBand}</span>
      </div>

      <div className="flex justify-between">
        <span>Face Value</span>
        <span>{ipo.faceValue || "-"}</span>
      </div>

      <div className="flex justify-between">
        <span>Lot Size</span>
        <span>{ipo.lotSize}</span>
      </div>

      <div className="flex justify-between">
        <span>Minimum Investment</span>
        <span>₹{ipo.minimumInvestment}</span>
      </div>

    </div>

  </div>

  {/* Subscription */}

  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">

    <h3 className="text-lg font-black text-green-400">
      SUBSCRIPTION
    </h3>

    <div className="mt-5 space-y-3 text-sm">

      <div className="flex justify-between">
        <span>QIB</span>
        <span>{ipo.qibSubscription || "-"}</span>
      </div>

      <div className="flex justify-between">
        <span>HNI</span>
        <span>{ipo.niiSubscription || "-"}</span>
      </div>

      <div className="flex justify-between">
        <span>Retail</span>
        <span>{ipo.retailSubscription || "-"}</span>
      </div>

      <div className="flex justify-between">
        <span>Employee</span>
        <span>{ipo.employeeSubscription || "-"}</span>
      </div>

      <div className="flex justify-between">
        <span>Shareholder</span>
        <span>{ipo.shareholderSubscription || "-"}</span>
      </div>

      <div className="flex justify-between font-black">
        <span>Total</span>
        <span>{ipo.subscription}</span>
      </div>

    </div>

  </div>

  {/* GMP */}

  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">

    <h3 className="text-lg font-black text-green-400">
      GMP
    </h3>

    <div className="mt-5 space-y-3 text-sm">

      <div className="flex justify-between">
        <span>GMP</span>
        <span>₹{latestGMP}</span>
      </div>

      <div className="flex justify-between">
        <span>Est. Listing Price</span>
        <span>₹{estimatedListingPrice.toFixed(2)}</span>
      </div>

      <div className="flex justify-between font-black text-green-400">
        <span>Est. Gain</span>
        <span>{formatPercent(estimatedGain)}</span>
      </div>

    </div>

  </div>

</div>

          <section className="mt-10 rounded-3xl border border-slate-800 bg-slate-950 p-7">
            <div className="flex flex-wrap justify-between gap-4">
              <div>
                <h2 className="text-3xl font-black">
                  GMP History & Momentum
                </h2>

                <p className="mt-2 text-slate-400">
                  Date-wise grey market premium movement.
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  GMP Momentum
                </p>

                <p className="text-2xl font-black text-green-400">
                  {momentum}
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">

  <div className="rounded-2xl bg-slate-900 p-5">
    <p className="text-slate-500">GMP</p>
    <p className="mt-3 text-3xl font-black text-green-400">
      ₹{latestGMP}
    </p>
  </div>

  <div className="rounded-2xl bg-slate-900 p-5">
    <p className="text-slate-500">Upper Price</p>
    <p className="mt-3 text-3xl font-black">
      ₹{upperPrice}
    </p>
  </div>

  <div className="rounded-2xl bg-slate-900 p-5">
    <p className="text-slate-500">Est. Listing Price</p>
    <p className="mt-3 text-3xl font-black text-green-400">
      ₹{estimatedListingPrice.toFixed(2)}
    </p>
  </div>

  <div className="rounded-2xl bg-slate-900 p-5">
    <p className="text-slate-500">Est. Gain %</p>
    <p className="mt-3 text-3xl font-black text-green-400">
      {formatPercent(estimatedGain)}
    </p>
  </div>

</div>

            {history.length > 0 && (
              <div className="mt-6 flex h-72 items-end gap-3 rounded-2xl bg-slate-900 p-5">
                {history.map((item, index) => {
                  const value = getNumber(item.value);

                  const height = Math.max(
                    (value / maxGMP) * 100,
                    8
                  );

                  return (
                    <div
                      key={`${item.date}-${index}`}
                      className="flex h-full flex-1 flex-col justify-end"
                    >
                      <p className="mb-2 text-center font-black text-green-400">
                        {item.value}
                      </p>

                      <div
                        className="w-full rounded-t-xl bg-green-500"
                        style={{
                          height: `${height}%`,
                        }}
                      />

                      <p className="mt-3 text-center text-xs text-slate-500">
                        {item.date}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

             {/* Financial Performance */}
<section className="rounded-2xl border border-gray-800 bg-[#0f172a] p-6 mt-8">
  <h2 className="text-2xl font-bold text-white mb-6">
    Financial Performance
  </h2>

  <div className="overflow-x-auto">
    <table className="w-full border-collapse">
      <thead>
        <tr className="border-b border-gray-700">
          <th className="py-3 px-4 text-left text-gray-300">Particulars</th>
          <th className="py-3 px-4 text-center text-gray-300">FY2024</th>
          <th className="py-3 px-4 text-center text-gray-300">FY2025</th>
          <th className="py-3 px-4 text-center text-gray-300">FY2026</th>
        </tr>
      </thead>

      <tbody>

        <tr className="border-b border-gray-800">
          <td className="py-4 px-4 text-white font-semibold">
            Revenue (₹ Cr)
          </td>
          <td className="py-4 px-4 text-center">{ipo.revenueFY2024}</td>
          <td className="py-4 px-4 text-center">{ipo.revenueFY2025}</td>
          <td className="py-4 px-4 text-center">{ipo.revenueFY2026}</td>
        </tr>

        <tr>
          <td className="py-4 px-4 text-white font-semibold">
            Net Profit (₹ Cr)
          </td>
          <td className="py-4 px-4 text-center">{ipo.profitFY2024}</td>
          <td className="py-4 px-4 text-center">{ipo.profitFY2025}</td>
          <td className="py-4 px-4 text-center">{ipo.profitFY2026}</td>
        </tr>

      </tbody>
    </table>
  </div>
     <FinancialChart
  revenueFY2024={ipo.revenueFY2024}
  revenueFY2025={ipo.revenueFY2025}
  revenueFY2026={ipo.revenueFY2026}
  profitFY2024={ipo.profitFY2024}
  profitFY2025={ipo.profitFY2025}
  profitFY2026={ipo.profitFY2026}
/>

</section>
          

{/* IPO Market Lot */}
<section className="rounded-2xl border border-gray-800 bg-[#0f172a] p-6 mt-8">
  <h2 className="text-2xl font-bold text-white mb-6">
    IPO Market Lot
  </h2>

  <div className="overflow-x-auto">
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="border-b border-gray-700">
          <th className="py-3 px-4 text-gray-300">Category</th>
          <th className="py-3 px-4 text-gray-300">Lots</th>
          <th className="py-3 px-4 text-gray-300">Shares</th>
          <th className="py-3 px-4 text-gray-300">Investment</th>
        </tr>
      </thead>

      <tbody>

        <tr className="border-b border-gray-800">
          <td className="py-3 px-4 text-white">Retail Minimum</td>
          <td className="py-3 px-4">{ipo.retailMinLot}</td>
          <td className="py-3 px-4">{ipo.retailMinShares}</td>
          <td className="py-3 px-4 font-semibold text-green-400">
            {ipo.retailMinAmount}
          </td>
        </tr>

        <tr className="border-b border-gray-800">
          <td className="py-3 px-4 text-white">Retail Maximum</td>
          <td className="py-3 px-4">{ipo.retailMaxLot}</td>
          <td className="py-3 px-4">{ipo.retailMaxShares}</td>
          <td className="py-3 px-4 font-semibold text-green-400">
            {ipo.retailMaxAmount}
          </td>
        </tr>

        <tr className="border-b border-gray-800">
          <td className="py-3 px-4 text-white">Small HNI</td>
          <td className="py-3 px-4">{ipo.sHniLot}</td>
          <td className="py-3 px-4">{ipo.sHniShares}</td>
          <td className="py-3 px-4 font-semibold text-green-400">
            {ipo.sHniAmount}
          </td>
        </tr>

        <tr>
          <td className="py-3 px-4 text-white">Big HNI</td>
          <td className="py-3 px-4">{ipo.bHniLot}</td>
          <td className="py-3 px-4">{ipo.bHniShares}</td>
          <td className="py-3 px-4 font-semibold text-green-400">
            {ipo.bHniAmount}
          </td>
        </tr>

      </tbody>
    </table>
  </div>

  <p className="mt-4 text-sm text-gray-400">
    * Retail investors can apply for shares worth up to ₹2,00,000 as per current IPO regulations.
  </p>
</section>
      
           {/* IPO Reservation */}
<section className="rounded-2xl border border-gray-800 bg-[#0f172a] p-6 mt-8">
  <h2 className="text-2xl font-bold text-white mb-6">
    IPO Reservation
  </h2>

  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

    <div className="rounded-xl bg-gray-900 p-4">
      <p className="text-gray-400 text-sm">QIB</p>
      <p className="text-xl font-bold text-white">
        {ipo.qibReservation}
      </p>
    </div>

    <div className="rounded-xl bg-gray-900 p-4">
      <p className="text-gray-400 text-sm">NII / HNI</p>
      <p className="text-xl font-bold text-white">
        {ipo.niiReservation}
      </p>
    </div>

    <div className="rounded-xl bg-gray-900 p-4">
      <p className="text-gray-400 text-sm">Retail</p>
      <p className="text-xl font-bold text-white">
        {ipo.retailReservation}
      </p>
    </div>

    <div className="rounded-xl bg-gray-900 p-4">
      <p className="text-gray-400 text-sm">Employee</p>
      <p className="text-xl font-bold text-white">
        {ipo.employeeReservation}
      </p>
    </div>

    <div className="rounded-xl bg-gray-900 p-4">
      <p className="text-gray-400 text-sm">Shareholder</p>
      <p className="text-xl font-bold text-white">
        {ipo.shareholderReservation}
      </p>
    </div>

  </div>
</section>

           {/* Promoter Holding */}
<section className="rounded-2xl border border-gray-800 bg-[#0f172a] p-6 mt-8">
  <h2 className="text-2xl font-bold text-white mb-6">
    Promoter Holding
  </h2>

  <div className="grid gap-4 md:grid-cols-2">

    <div className="rounded-xl bg-gray-900 p-5">
      <p className="text-gray-400">Pre IPO Holding</p>
      <p className="mt-2 text-2xl font-bold text-green-400">
        {ipo.prePromoterHolding || "-"}
      </p>
    </div>

    <div className="rounded-xl bg-gray-900 p-5">
      <p className="text-gray-400">Post IPO Holding</p>
      <p className="mt-2 text-2xl font-bold text-green-400">
        {ipo.postPromoterHolding || "-"}
      </p>
    </div>

  </div>
</section>

           {/* Anchor Investors */}
<section className="rounded-2xl border border-gray-800 bg-[#0f172a] p-6 mt-8">
  <h2 className="text-2xl font-bold text-white mb-6">
    Anchor Investors
  </h2>

  <div className="grid gap-4">

    <div className="rounded-xl bg-gray-900 p-5">
      <p className="text-gray-400">Anchor Allocation</p>
      <p className="mt-2 text-xl font-bold text-green-400">
        {ipo.anchorAllocation || "-"}
      </p>
    </div>

    <div className="rounded-xl bg-gray-900 p-5">
      <p className="text-gray-400 mb-2">Anchor Details</p>
      <p className="leading-7">
        {ipo.anchorDetails || "-"}
      </p>
    </div>

  </div>
</section>


            {/* DRHP & RHP */}
<section className="rounded-2xl border border-gray-800 bg-[#0f172a] p-6 mt-8">
  <h2 className="text-2xl font-bold text-white mb-6">
    IPO Documents
  </h2>

  <div className="flex flex-wrap gap-4">

    {ipo.drhp && (
      <a
        href={ipo.drhp}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-xl bg-green-600 px-6 py-3 font-bold text-white hover:bg-green-700 transition"
      >
        📄 Download DRHP
      </a>
    )}

    {ipo.rhp && (
      <a
        href={ipo.rhp}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700 transition"
      >
        📘 Download RHP
      </a>
    )}

  </div>
</section>
  
           {/* Promoter Holding & Anchor Investors */}
<section className="rounded-2xl border border-gray-800 bg-[#0f172a] p-6 mt-8">
  <h2 className="text-2xl font-bold text-white mb-6">
    Promoter Holding & Anchor Investors
  </h2>

  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

    <div className="rounded-xl bg-gray-900 p-4">
      <p className="text-gray-400 text-sm">Pre IPO Holding</p>
      <p className="text-xl font-bold text-white">
        {ipo.prePromoterHolding}
      </p>
    </div>

    <div className="rounded-xl bg-gray-900 p-4">
      <p className="text-gray-400 text-sm">Post IPO Holding</p>
      <p className="text-xl font-bold text-white">
        {ipo.postPromoterHolding}
      </p>
    </div>

    <div className="rounded-xl bg-gray-900 p-4">
      <p className="text-gray-400 text-sm">Anchor Allocation</p>
      <p className="text-xl font-bold text-white">
        {ipo.anchorAllocation}
      </p>
    </div>

    <div className="rounded-xl bg-gray-900 p-4">
      <p className="text-gray-400 text-sm">Anchor Investors</p>
      <p className="text-white">
        {ipo.anchorDetails}
      </p>
    </div>

  </div>
</section>

         

           {/* IPO Fundamentals */}
<section className="rounded-2xl border border-gray-800 bg-[#0f172a] p-6 mt-8">
  <h2 className="text-2xl font-bold text-white mb-6">
    IPO Fundamentals
  </h2>

  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

    <div className="rounded-xl bg-gray-900 p-4">
      <p className="text-gray-400 text-sm">Market Cap</p>
      <p className="text-white font-bold">{ipo.marketCapPostIPO}</p>
    </div>

    <div className="rounded-xl bg-gray-900 p-4">
      <p className="text-gray-400 text-sm">Face Value</p>
      <p className="text-white font-bold">{ipo.faceValue}</p>
    </div>

    <div className="rounded-xl bg-gray-900 p-4">
      <p className="text-gray-400 text-sm">Book Value</p>
      <p className="text-white font-bold">{ipo.bookValue}</p>
    </div>

    <div className="rounded-xl bg-gray-900 p-4">
      <p className="text-gray-400 text-sm">EPS</p>
      <p className="text-white font-bold">{ipo.eps}</p>
    </div>

    <div className="rounded-xl bg-gray-900 p-4">
      <p className="text-gray-400 text-sm">Diluted EPS</p>
      <p className="text-white font-bold">{ipo.dilutedEPS}</p>
    </div>

    <div className="rounded-xl bg-gray-900 p-4">
      <p className="text-gray-400 text-sm">P/E Ratio</p>
      <p className="text-white font-bold">{ipo.peRatio}</p>
    </div>

    <div className="rounded-xl bg-gray-900 p-4">
      <p className="text-gray-400 text-sm">P/B Ratio</p>
      <p className="text-white font-bold">{ipo.pbRatio}</p>
    </div>

    <div className="rounded-xl bg-gray-900 p-4">
      <p className="text-gray-400 text-sm">Industry P/E</p>
      <p className="text-white font-bold">{ipo.industryPE}</p>
    </div>

    <div className="rounded-xl bg-gray-900 p-4">
      <p className="text-gray-400 text-sm">Debt to Equity</p>
      <p className="text-white font-bold">{ipo.debtToEquity}</p>
    </div>

    <div className="rounded-xl bg-gray-900 p-4">
      <p className="text-gray-400 text-sm">Total Assets</p>
      <p className="text-white font-bold">{ipo.totalAssets}</p>
    </div>

    <div className="rounded-xl bg-gray-900 p-4">
      <p className="text-gray-400 text-sm">IPO Valuation</p>
      <p className="text-white font-bold">{ipo.ipoValuation}</p>
    </div>

  </div>
</section>

          {/* Peer Comparison */}
<section className="rounded-2xl border border-gray-800 bg-[#0f172a] p-6 mt-8">
  <h2 className="text-2xl font-bold text-white mb-6">
    Peer Comparison
  </h2>

  <div className="overflow-x-auto">
    <table className="w-full border-collapse">
      <thead>
        <tr className="border-b border-gray-700">
          <th className="py-3 px-4 text-left text-gray-300">Company</th>
          <th className="py-3 px-4 text-center text-gray-300">Revenue</th>
          <th className="py-3 px-4 text-center text-gray-300">PAT</th>
          <th className="py-3 px-4 text-center text-gray-300">EPS</th>
          <th className="py-3 px-4 text-center text-gray-300">P/E</th>
          <th className="py-3 px-4 text-center text-gray-300">Market Cap</th>
          <th className="py-3 px-4 text-center text-gray-300">ROE</th>
          <th className="py-3 px-4 text-center text-gray-300">Debt/Equity</th>
        </tr>
      </thead>

      <tbody>

        <tr className="border-b border-gray-800 bg-green-950/30">
          <td className="py-3 px-4 font-semibold text-green-400">
            {ipo.name}
          </td>
          <td className="py-3 px-4 text-center">
            {ipo.peerRevenue}
          </td>
          <td className="py-3 px-4 text-center">
            {ipo.peerPAT}
          </td>
          <td className="py-3 px-4 text-center">
            {ipo.peerEPS}
          </td>
          <td className="py-3 px-4 text-center">
            {ipo.peerPE}
          </td>
          <td className="py-3 px-4 text-center">
            {ipo.peerMarketCap}
          </td>
          <td className="py-3 px-4 text-center">
            {ipo.peerROE}
          </td>
          <td className="py-3 px-4 text-center">
            {ipo.peerDebtEquity}
          </td>
        </tr>

        <tr className="border-b border-gray-800">
          <td className="py-3 px-4">{ipo.peer1Name}</td>
          <td className="py-3 px-4 text-center">{ipo.peer1Revenue}</td>
          <td className="py-3 px-4 text-center">{ipo.peer1PAT}</td>
          <td className="py-3 px-4 text-center">{ipo.peer1EPS}</td>
          <td className="py-3 px-4 text-center">{ipo.peer1PE}</td>
          <td className="py-3 px-4 text-center">{ipo.peer1MarketCap}</td>
          <td className="py-3 px-4 text-center">{ipo.peer1ROE}</td>
          <td className="py-3 px-4 text-center">{ipo.peer1DebtEquity}</td>
        </tr>

        <tr className="border-b border-gray-800">
          <td className="py-3 px-4">{ipo.peer2Name}</td>
          <td className="py-3 px-4 text-center">{ipo.peer2Revenue}</td>
          <td className="py-3 px-4 text-center">{ipo.peer2PAT}</td>
          <td className="py-3 px-4 text-center">{ipo.peer2EPS}</td>
          <td className="py-3 px-4 text-center">{ipo.peer2PE}</td>
          <td className="py-3 px-4 text-center">{ipo.peer2MarketCap}</td>
          <td className="py-3 px-4 text-center">{ipo.peer2ROE}</td>
          <td className="py-3 px-4 text-center">{ipo.peer2DebtEquity}</td>
        </tr>

        <tr>
          <td className="py-3 px-4">{ipo.peer3Name}</td>
          <td className="py-3 px-4 text-center">{ipo.peer3Revenue}</td>
          <td className="py-3 px-4 text-center">{ipo.peer3PAT}</td>
          <td className="py-3 px-4 text-center">{ipo.peer3EPS}</td>
          <td className="py-3 px-4 text-center">{ipo.peer3PE}</td>
          <td className="py-3 px-4 text-center">{ipo.peer3MarketCap}</td>
          <td className="py-3 px-4 text-center">{ipo.peer3ROE}</td>
          <td className="py-3 px-4 text-center">{ipo.peer3DebtEquity}</td>
        </tr>

      </tbody>
    </table>
  </div>
</section>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {[
              ["Company Overview", ipo.overview],
              ["Financial Performance", ipo.financials],
              ["Strengths", ipo.strengths],
              ["Risks", ipo.risks],
            ].map(([title, content]) => (
              <div
                key={title}
                className="rounded-2xl border border-slate-800 bg-slate-950 p-7"
              >
                <h2 className="text-2xl font-black text-green-400">
                  {title}
                </h2>

                <p className="mt-4 whitespace-pre-line leading-7 text-slate-400">
                  {content || "Analysis is currently being prepared."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
    </main>
  );
}