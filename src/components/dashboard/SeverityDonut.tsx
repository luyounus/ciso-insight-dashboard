"use client";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

type Dist = Record<string, number>;

const PALETTE: Record<string, string> = {
  CRITICAL: "#7C3AED", // deep purple
  HIGH: "#A78BFA",     // light purple
  MEDIUM: "#60A5FA",   // blue
  LOW: "#34D399",      // green
  INFO: "#93C5FD",     // pale blue
  DEFAULT: "#E5E7EB",  // gray fallback
};

export default function SeverityDonut({ dist }:{ dist: Dist }) {
  const data = Object.entries(dist)
    .map(([sev, count]) => ({ name: sev, value: count }))
    .filter(d => d.value > 0);

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <p className="font-medium mb-2">Severity distribution</p>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
          >
            {data.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={PALETTE[entry.name] ?? PALETTE.DEFAULT} />
            ))}
          </Pie>
          <Tooltip formatter={(v:any, n:any) => [`${v}`, n]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <div className="text-center text-sm text-gray-500 mt-1">Total: {total}</div>
    </div>
  );
}


