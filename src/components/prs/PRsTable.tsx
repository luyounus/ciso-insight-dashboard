"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { fakeCisoInsightApi } from "@/services/fakeCisoInsightApi";
import type { PullRequest } from "@/types/github";

export default function PRsTable() {
  const [prs, setPRs] = useState<PullRequest[]>([]);
  const [severity, setSeverity] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => { fakeCisoInsightApi.fetchPullRequests().then(setPRs); }, []);

  // Initialize from query string if provided (e.g., ?severity=CRITICAL)
  useEffect(() => {
    const q = (searchParams.get("severity") || "").toUpperCase();
    if (q && q !== severity) setSeverity(q);
    const s = (searchParams.get("status") || "").toUpperCase();
    if (s && s !== status) setStatus(s);
  }, [searchParams]);

  const filtered = useMemo(() => {
    return prs.filter(p => {
      const sevOk = severity === "all" || (p.riskSummary?.overallSeverity ?? p.severity ?? "").toUpperCase() === severity.toUpperCase();
      const st = (p.state || "").toUpperCase();
      const stOk = status === "all" || st === status.toUpperCase();
      return sevOk && stOk;
    });
  }, [prs, severity, status]);

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Pull Requests</h2>
        <div className="flex items-center gap-2">
        <select className="border rounded-md px-2 py-1"
                value={severity} onChange={e => { setSeverity(e.target.value); const val = e.target.value; const url = val === "all" ? "/prs" : `/prs?severity=${encodeURIComponent(val)}`; router.replace(url); }}>
          <option value="all">All severities</option>
          <option value="CRITICAL">Critical</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
          <option value="INFO">Info</option>
        </select>
        <select className="border rounded-md px-2 py-1" value={status} onChange={e => { setStatus(e.target.value); const s = e.target.value; const params = new URLSearchParams(window.location.search); if (s === "all") { params.delete("status"); } else { params.set("status", s); } const url = `/prs${params.toString() ? `?${params.toString()}` : ""}`; router.replace(url); }}>
          <option value="all">All statuses</option>
          <option value="OPEN">Open</option>
          <option value="MERGED">Merged</option>
          <option value="CLOSED">Closed</option>
        </select>
        </div>
      </div>

      <table className="min-w-full text-sm">
        <thead className="border-b text-gray-500">
          <tr>
            <th className="text-left p-2">Title</th>
            <th className="text-left p-2">Status</th>
            <th className="text-left p-2">Severity</th>
            <th className="text-left p-2">Repo</th>
            <th className="text-left p-2">Author</th>
            <th className="text-left p-2">Updated</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(pr => (
            <tr key={pr.id} className="border-b hover:bg-gray-50">
              <td className="p-2">
                <div className="flex items-center gap-2">
                  <Link className="text-blue-600 hover:underline" href={`/prs/${pr.id}`}>
                    {pr.title}
                  </Link>
                  {pr.htmlUrl ? (
                    <a href={pr.htmlUrl} target="_blank" rel="noreferrer" title="Open on GitHub" className="text-gray-500 hover:text-blue-600">
                      ↗
                    </a>
                  ) : null}
                </div>
              </td>
              <td className="p-2">{(pr.state || "").toUpperCase()}</td>
              <td className="p-2">{pr.riskSummary?.overallSeverity ?? pr.severity ?? "—"}</td>
              <td className="p-2">{pr.repoId}</td>
              <td className="p-2">{pr.author}</td>
              <td className="p-2">{new Date(pr.updatedAt ?? pr.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


