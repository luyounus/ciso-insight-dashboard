"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from "recharts";

export default function SeverityBar({ dist }:{ dist: Record<string, number> }) {
  const data = Object.entries(dist).map(([sev, count]) => ({ sev, count }));
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <p className="font-medium mb-2">PRs by severity</p>
      <ResponsiveContainer width="100%" height={120}>
        <BarChart data={data}>
          <XAxis dataKey="sev" />
          <Tooltip />
          <Bar dataKey="count" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}


