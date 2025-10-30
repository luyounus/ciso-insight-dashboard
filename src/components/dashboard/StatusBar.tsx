"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Legend } from "recharts";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Purple/blue palette to match reference image
const COLORS = {
  open: "#7C3AED",   // deep purple
  merged: "#A78BFA", // light purple
  closed: "#60A5FA", // blue
};

export default function StatusBar({ open, merged, closed }:{ open:number; merged:number; closed:number }) {
  const router = useRouter();
  const [vals, setVals] = useState({ open, merged, closed });
  useEffect(() => setVals({ open, merged, closed }), [open, merged, closed]);
  useEffect(() => {
    const id = setInterval(() => {
      setVals(prev => {
        const keys = ["open", "merged", "closed"] as const;
        const k = keys[Math.floor(Math.random() * keys.length)];
        const delta = Math.random() < 0.65 ? 1 : -1;
        return { ...prev, [k]: Math.max(0, (prev as any)[k] + delta) } as typeof prev;
      });
    }, 10000);
    return () => clearInterval(id);
  }, []);
  const data = [{ name: "Status", ...vals }];
  return (
    <div className="card card-3d p-4">
      <p className="font-medium mb-2">PRs by status</p>
      <ResponsiveContainer width="100%" height={140}>
        <BarChart data={data}>
          <XAxis dataKey="name" tick={false} />
          <Tooltip
            cursor={false}
            // Solid card-style tooltip with high stacking so it sits above the chart
            wrapperStyle={{ outline: "none", zIndex: 50 }}
            contentStyle={{
              backgroundColor: "#111827", // slate-900
              borderColor: "#111827",
              borderRadius: 10,
              boxShadow: "0 10px 24px rgba(0,0,0,0.2)",
              color: "#F9FAFB", // gray-50
              opacity: 1,
              padding: "10px 14px",
            }}
            labelStyle={{ color: "#F9FAFB", fontWeight: 600 }}
            itemStyle={{ color: "#E5E7EB", marginTop: 4, lineHeight: 1.4 }}
          />
          <Legend />
          <Bar dataKey="open" fill={COLORS.open} name="Open" isAnimationActive animationDuration={600}
               onClick={() => router.push("/prs?status=OPEN")} style={{ cursor: "pointer" }} />
          <Bar dataKey="merged" fill={COLORS.merged} name="Merged" isAnimationActive animationDuration={600}
               onClick={() => router.push("/prs?status=MERGED")} style={{ cursor: "pointer" }} />
          <Bar dataKey="closed" fill={COLORS.closed} name="Closed" isAnimationActive animationDuration={600}
               onClick={() => router.push("/prs?status=CLOSED")} style={{ cursor: "pointer" }} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}


