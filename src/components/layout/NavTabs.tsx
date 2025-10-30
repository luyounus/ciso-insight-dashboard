"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { name: "Overview", href: "/" },
  { name: "PRs", href: "/prs" },
  { name: "Repositories", href: "/repos" },
  { name: "Contributors", href: "/contributors" },
];

export default function NavTabs() {
  const pathname = usePathname();
  return (
    <div className="card card-3d mb-6 p-2">
      <nav className="border-b border-gray-200 flex gap-6">
        {tabs.map((t) => {
          const active = pathname === t.href;
          return (
            <Link
              key={t.name}
              href={t.href}
              className={`pb-2 -mb-px border-b-2 ${active ? "border-blue-600 text-blue-600 font-medium" : "border-transparent text-gray-500 hover:text-blue-600"}`}
            >
              {t.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}


