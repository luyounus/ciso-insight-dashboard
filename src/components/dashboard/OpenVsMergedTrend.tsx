"use client";

import { useMemo, useState } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, Tooltip, Legend } from "recharts";

const COLORS = {
  open: "#7C3AED",   // deep purple
  merged: "#60A5FA", // blue
};

export default function OpenVsMergedTrend({ points }:{ points: Array<{ month:string; open:number; merged:number }> }) {
  const [windowMonths, setWindowMonths] = useState<number>(6);

  const filtered = useMemo(() => {
    if (!points?.length) return points;
    const take = Math.max(1, windowMonths);
    return points.slice(-take);
  }, [points, windowMonths]);

  return (
    <div className="card card-3d p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="font-medium">Open vs merged PRs over time</p>
        <div className="inline-flex overflow-hidden rounded-md border border-gray-200">
          {([3,6,12] as const).map(m => (
            <button
              key={m}
              type="button"
              onClick={() => setWindowMonths(m)}
              className={`px-3 py-1 text-sm ${windowMonths===m?"bg-gray-100 font-medium":"bg-white hover:bg-gray-50"}`}
              aria-pressed={windowMonths===m}
            >
              {m}m
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={filtered}>
          <XAxis dataKey="month" />
          <Tooltip
            wrapperStyle={{ outline: "none", zIndex: 50 }}
            contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e5e7eb", borderRadius: 8, boxShadow: "0 6px 16px rgba(0,0,0,0.12)", color: "#111827" }}
            labelStyle={{ color: "#111827", fontWeight: 600 }}
            itemStyle={{ color: "#111827" }}
          />
          <Legend />
          <Line type="monotone" dataKey="open" stroke={COLORS.open} strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Open" />
          <Line type="monotone" dataKey="merged" stroke={COLORS.merged} strokeWidth={2.5} strokeDasharray="6 4" dot={{ r: 3 }} activeDot={{ r: 5 }} name="Merged" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}


