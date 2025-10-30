"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function RouteTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [key, setKey] = useState(pathname);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // quick micro-loading bar and fade transition on route change
    setLoading(true);
    setKey(pathname + "-" + Date.now());
    const t = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(t);
  }, [pathname]);

  return (
    <>
      {loading ? (
        <div className="fixed left-0 right-0 top-0 z-50 h-0.5 overflow-hidden">
          <div className="progress-bar" />
        </div>
      ) : null}
      <div key={key} className="page-fade">
        {children}
      </div>
    </>
  );
}


