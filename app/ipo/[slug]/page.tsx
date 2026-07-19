import { calculateIPOIntelligence } from "../../ipoIntelligence";
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
  closeDate: string;
  score: string;
  recommendation?: string;
  listingGainView?: string;
  riskLevel?: string;
  verdictReason?: string;
  qibSubscription?: string;
niiSubscription?: string;
retailSubscription?: string;
revenueGrowth?: string;
patGrowth?: string;
debtRisk?: string;
valuation?: string;
businessRisk?: string;
  overview?: string;
  financials?: string;
  strengths?: string;
  risks?: string;
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
    const response = await fetch(
      "http://localhost:3000/api/ipos",
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
const intelligence = calculateIPOIntelligence({
  priceBand: ipo.priceBand,
  gmp: ipo.gmp,
  subscription: ipo.subscription,
 qibSubscription: ipo.qibSubscription ?? "",
niiSubscription: ipo.niiSubscription ?? "",
retailSubscription: ipo.retailSubscription ?? "",
  gmpHistory: history,
  revenueGrowth: ipo.revenueGrowth,
  patGrowth: ipo.patGrowth,
  debtRisk: ipo.debtRisk,
  valuation: ipo.valuation,
  businessRisk: ipo.businessRisk,
});
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

          <p className="mt-3 text-xl text-slate-300">
            Price Band: {ipo.priceBand}
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {[
              ["GMP", `₹${latestGMP}`],
              ["EST. LISTING GAIN", ipo.listingGain],
              ["SUBSCRIPTION", ipo.subscription],
              ["OPPORTUNITY SCORE", `${ipo.score}/10`],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-2xl border border-slate-800 bg-slate-950 p-6"
              >
                <p className="text-sm font-bold text-slate-500">
                  {label}
                </p>

                <p className="mt-3 text-3xl font-black text-green-400">
                  {value}
                </p>
              </div>
            ))}
          </div>

          <section className="mt-10 rounded-3xl border border-blue-500/40 bg-blue-500/10 p-7">
            <h2 className="text-3xl font-black text-blue-400">
              GMP Based Listing Estimate
            </h2>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-slate-950 p-5">
                <p className="text-slate-500">
                  Upper Issue Price
                </p>

                <p className="mt-3 text-3xl font-black">
                  ₹{upperPrice}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-950 p-5">
                <p className="text-slate-500">
                  Estimated Listing Price
                </p>

                <p className="mt-3 text-3xl font-black text-green-400">
                  ₹{estimatedListingPrice.toFixed(2)}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-950 p-5">
                <p className="text-slate-500">
                  Estimated Gain
                </p>

                <p className="mt-3 text-3xl font-black text-green-400">
                  {formatPercent(estimatedGain)}
                </p>
              </div>
            </div>

            <p className="mt-5 text-sm text-blue-200/70">
              Calculation: Upper issue price + latest GMP.
              GMP is unofficial and can change before listing.
            </p>
          </section>

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

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-slate-900 p-5">
                <p className="text-slate-500">
                  Overall GMP Change
                </p>

                <p className="mt-3 text-3xl font-black text-green-400">
                  {formatChange(overallChange)}
                </p>

                <p className="text-lg font-black text-green-400">
                  {formatPercent(overallPercent)}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-900 p-5">
                <p className="text-slate-500">
                  Latest GMP Change
                </p>

                <p className="mt-3 text-3xl font-black text-green-400">
                  {formatChange(latestChange)}
                </p>

                <p className="text-lg font-black text-green-400">
                  {formatPercent(latestPercent)}
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

          <section className="mt-10 rounded-3xl border border-green-500/40 bg-green-500/10 p-7">
            <p className="text-sm font-black uppercase text-green-400">
              IPOweb Final Verdict
            </p>

            <h2 className="mt-4 text-4xl font-black">
              {intelligence.recommendation}
            </h2>

            <p className="mt-4 text-lg text-slate-300">
              Listing View: {intelligence.listingGainView}
              {" • "}
              Risk: {intelligence.riskLevel}
            </p>

            <p className="mt-5 whitespace-pre-line text-slate-300">
              {intelligence.verdictReason}
            </p>
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