"use client";

import { ResponsiveContainer, LineChart, Line, XAxis, Tooltip, Legend } from "recharts";

export default function OpenVsMergedTrend({ points }:{ points: Array<{ month:string; open:number; merged:number }> }) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <p className="font-medium mb-2">Open vs merged PRs over time</p>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={points}>
          <XAxis dataKey="month" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="open" />
          <Line type="monotone" dataKey="merged" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}


