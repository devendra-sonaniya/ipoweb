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

type Props = {
  revenueFY2024: string;
  revenueFY2025: string;
  revenueFY2026: string;
  profitFY2024: string;
  profitFY2025: string;
  profitFY2026: string;
};

export default function FinancialChart({
  revenueFY2024,
  revenueFY2025,
  revenueFY2026,
  profitFY2024,
  profitFY2025,
  profitFY2026,
}: Props) {
  const data = [
    {
      year: "FY2024",
      Revenue: Number(revenueFY2024 || 0),
      Profit: Number(profitFY2024 || 0),
    },
    {
      year: "FY2025",
      Revenue: Number(revenueFY2025 || 0),
      Profit: Number(profitFY2025 || 0),
    },
    {
      year: "FY2026",
      Revenue: Number(revenueFY2026 || 0),
      Profit: Number(profitFY2026 || 0),
    },
  ];

  return (
    <div className="mt-8 h-[420px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />

          <Bar dataKey="Revenue" fill="#3b82f6" radius={[6, 6, 0, 0]}>
            <LabelList dataKey="Revenue" position="top" />
          </Bar>

          <Bar dataKey="Profit" fill="#22c55e" radius={[6, 6, 0, 0]}>
            <LabelList dataKey="Profit" position="top" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}