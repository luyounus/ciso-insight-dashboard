"use client";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

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
  const router = useRouter();
  const initial = useMemo(() => Object.entries(dist).map(([sev, count]) => ({ name: sev, value: count })), [dist]);
  const [data, setData] = useState(() => initial.filter(d => d.value > 0));
  const timer = useRef<NodeJS.Timeout | null>(null);

  // Simulate incoming PRs every ~10s by nudging one slice
  useEffect(() => {
    setData(initial.filter(d => d.value > 0));
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => {
      setData(prev => {
        if (prev.length === 0) return prev;
        const idx = Math.floor(Math.random() * prev.length);
        const delta = Math.random() < 0.6 ? 1 : -1; // most of the time increase
        return prev.map((d, i) => (
          i === idx ? { ...d, value: Math.max(0, d.value + delta) } : d
        ));
      });
    }, 10000);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [initial]);

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="card card-3d p-4">
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
            isAnimationActive={true}
            animationDuration={600}
            animationEasing="ease-out"
            onClick={(entry) => {
              const sev = (entry?.name ?? "").toString().toUpperCase();
              if (sev) router.push(`/prs?severity=${encodeURIComponent(sev)}`);
            }}
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


