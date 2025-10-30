"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

function randomMs(minSec: number, maxSec: number) {
  const min = Math.ceil(minSec * 1000);
  const max = Math.floor(maxSec * 1000);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function LivePulse() {
  const [visible, setVisible] = useState(false);
  const [at, setAt] = useState<string>("");
  const timer = useRef<NodeJS.Timeout | null>(null);

  const nextDelay = useMemo(() => randomMs(10, 20), [visible]);

  useEffect(() => {
    const schedule = () => {
      timer.current = setTimeout(() => {
        setAt(new Date().toLocaleTimeString());
        setVisible(true);
        // hide after a short display
        setTimeout(() => setVisible(false), 2800);
        // re-schedule with a fresh delay
      }, nextDelay);
    };
    schedule();
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [nextDelay]);

  return (
    <div
      aria-live="polite"
      className={`pointer-events-auto fixed bottom-4 right-4 z-50 transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
    >
      <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-lg">
        <span className="relative inline-flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
        </span>
        <div className="text-sm text-gray-800">
          <span className="font-medium">New PR detected</span>
          {at ? <span className="ml-1 text-gray-500">· {at}</span> : null}
        </div>
        <Link href="/prs" className="ml-2 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100">
          View
        </Link>
      </div>
    </div>
  );
}


