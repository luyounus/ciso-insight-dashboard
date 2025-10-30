"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Legend } from "recharts";

// Purple/blue palette to match reference image
const COLORS = {
  open: "#7C3AED",   // deep purple
  merged: "#A78BFA", // light purple
  closed: "#60A5FA", // blue
};

export default function StatusBar({ open, merged, closed }:{ open:number; merged:number; closed:number }) {
  const data = [{ name: "Status", open, merged, closed }];
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <p className="font-medium mb-2">PRs by status</p>
      <ResponsiveContainer width="100%" height={140}>
        <BarChart data={data}>
          <XAxis dataKey="name" tick={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="open" fill={COLORS.open} name="Open" />
          <Bar dataKey="merged" fill={COLORS.merged} name="Merged" />
          <Bar dataKey="closed" fill={COLORS.closed} name="Closed" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}


