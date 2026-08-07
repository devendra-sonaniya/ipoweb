"use client";

import type { ReactNode } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type FinancialValue = string | number | null | undefined;

type Props = {
  revenueFY2024: FinancialValue;
  revenueFY2025: FinancialValue;
  revenueFY2026: FinancialValue;
  profitFY2024: FinancialValue;
  profitFY2025: FinancialValue;
  profitFY2026: FinancialValue;
  totalAssetsFY2024?: FinancialValue;
  totalAssetsFY2025?: FinancialValue;
  totalAssetsFY2026?: FinancialValue;
};

type FinancialDatum = {
  year: string;
  revenue: number | null;
  pat: number | null;
  totalAssets: number | null;
};

type TooltipEntry = {
  dataKey?: string | number;
  value?: number | string | ReadonlyArray<number | string>;
};

const series = [
  {
    key: "revenue",
    label: "Revenue",
    color: "#38BDF8",
    gradient: "revenueGradient",
    shadow: "drop-shadow(0 5px 7px rgb(37 99 235 / 0.22))",
  },
  {
    key: "pat",
    label: "PAT",
    color: "#22C55E",
    gradient: "patGradient",
    shadow: "drop-shadow(0 5px 7px rgb(21 128 61 / 0.22))",
  },
  {
    key: "totalAssets",
    label: "Total Assets",
    color: "#FACC15",
    gradient: "assetsGradient",
    shadow: "drop-shadow(0 5px 7px rgb(245 158 11 / 0.22))",
  },
] as const;

function parseFinancialValue(value: FinancialValue): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value !== "string" || value.trim() === "") {
    return null;
  }

  const normalized = value.replace(/,/g, "").match(/-?\d+(?:\.\d+)?/);
  if (!normalized) return null;

  const parsed = Number(normalized[0]);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatCrores(value: unknown) {
  if (typeof value !== "number" || !Number.isFinite(value)) return "--";

  return `₹${value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} Cr`;
}

function calculateGrowth(previous: number | null, current: number | null) {
  if (previous === null || current === null || previous === 0) return null;
  return ((current - previous) / Math.abs(previous)) * 100;
}

function FinancialTooltip({
  active,
  label,
  payload,
}: {
  active?: boolean;
  label?: ReactNode;
  payload?: readonly TooltipEntry[];
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="min-w-48 rounded-xl border border-slate-700 bg-slate-950/95 p-4 shadow-2xl backdrop-blur-sm transition-opacity duration-200">
      <p className="mb-3 font-black text-white">{label}</p>
      <div className="space-y-3">
        {series.map((item) => {
          const entry = payload.find((value) => value.dataKey === item.key);
          const value = Array.isArray(entry?.value)
            ? entry?.value[0]
            : entry?.value;

          return (
            <div key={item.key}>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                {item.label}
              </div>
              <p className="mt-1 text-base font-black text-white">
                {formatCrores(typeof value === "number" ? value : null)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function KPICard({
  label,
  value,
  growth,
  color,
}: {
  label: string;
  value: number | null;
  growth: number | null;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 shadow-lg">
      <div className="flex items-center gap-2">
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: color }}
        />
        <p className="text-sm font-bold text-slate-300">{label}</p>
      </div>
      <p className="mt-3 text-xs font-bold uppercase tracking-wide text-slate-500">
        FY2026
      </p>
      <p className="mt-1 text-xl font-black" style={{ color }}>
        {formatCrores(value)}
      </p>
      <p
        className={`mt-2 text-xs font-bold ${
          growth === null
            ? "text-slate-500"
            : growth >= 0
              ? "text-emerald-400"
              : "text-rose-400"
        }`}
      >
        {growth === null
          ? "Growth unavailable"
          : `${growth >= 0 ? "+" : ""}${growth.toFixed(2)}% vs FY2025`}
      </p>
    </div>
  );
}

export default function FinancialChart({
  revenueFY2024,
  revenueFY2025,
  revenueFY2026,
  profitFY2024,
  profitFY2025,
  profitFY2026,
  totalAssetsFY2024,
  totalAssetsFY2025,
  totalAssetsFY2026,
}: Props) {
  const data: FinancialDatum[] = [
    {
      year: "FY2024",
      revenue: parseFinancialValue(revenueFY2024),
      pat: parseFinancialValue(profitFY2024),
      totalAssets: parseFinancialValue(totalAssetsFY2024),
    },
    {
      year: "FY2025",
      revenue: parseFinancialValue(revenueFY2025),
      pat: parseFinancialValue(profitFY2025),
      totalAssets: parseFinancialValue(totalAssetsFY2025),
    },
    {
      year: "FY2026",
      revenue: parseFinancialValue(revenueFY2026),
      pat: parseFinancialValue(profitFY2026),
      totalAssets: parseFinancialValue(totalAssetsFY2026),
    },
  ];
  const hasData = data.some((item) =>
    [item.revenue, item.pat, item.totalAssets].some((value) => value !== null)
  );
  const latest = data[2];
  const previous = data[1];

  return (
    <div className="mt-6">
      <div
        className="flex flex-wrap gap-x-6 gap-y-3"
        aria-label="Financial chart legend"
      >
        {series.map((item) => (
          <div key={item.key} className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm font-bold text-slate-300">
              {item.label}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <KPICard
          label="Revenue"
          value={latest.revenue}
          growth={calculateGrowth(previous.revenue, latest.revenue)}
          color="#38BDF8"
        />
        <KPICard
          label="PAT"
          value={latest.pat}
          growth={calculateGrowth(previous.pat, latest.pat)}
          color="#22C55E"
        />
        <KPICard
          label="Total Assets"
          value={latest.totalAssets}
          growth={calculateGrowth(previous.totalAssets, latest.totalAssets)}
          color="#FACC15"
        />
      </div>

      <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950/70 px-2 pb-2 pt-5 shadow-xl sm:px-4">
        {hasData ? (
          <div className="h-[430px] w-full max-sm:h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                barCategoryGap="28%"
                barGap={4}
                margin={{ top: 44, right: 10, left: 0, bottom: 4 }}
              >
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38BDF8" />
                    <stop offset="100%" stopColor="#2563EB" />
                  </linearGradient>
                  <linearGradient id="patGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22C55E" />
                    <stop offset="100%" stopColor="#15803D" />
                  </linearGradient>
                  <linearGradient id="assetsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FACC15" />
                    <stop offset="100%" stopColor="#F59E0B" />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  vertical={false}
                  stroke="rgba(148, 163, 184, 0.12)"
                  strokeDasharray="4 6"
                />
                <XAxis
                  dataKey="year"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#CBD5E1", fontSize: 13, fontWeight: 700 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  width={52}
                  tick={{ fill: "#64748B", fontSize: 11 }}
                  tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip
                  cursor={{ fill: "rgba(148, 163, 184, 0.06)" }}
                  content={<FinancialTooltip />}
                  animationDuration={180}
                />

                {series.map((item) => (
                  <Bar
                    key={item.key}
                    dataKey={item.key}
                    name={item.label}
                    fill={`url(#${item.gradient})`}
                    radius={[8, 8, 0, 0]}
                    maxBarSize={44}
                    isAnimationActive
                    animationBegin={120}
                    animationDuration={900}
                    animationEasing="ease-out"
                    style={{ filter: item.shadow }}
                  >
                    <LabelList
                      dataKey={item.key}
                      position="top"
                      formatter={formatCrores}
                      fill={item.color}
                      fontSize={10}
                      fontWeight={800}
                    />
                  </Bar>
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex h-[360px] items-center justify-center text-slate-400">
            No Data Available
          </div>
        )}
      </div>
    </div>
  );
}
