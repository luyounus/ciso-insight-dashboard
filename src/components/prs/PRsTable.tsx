"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { fakeCisoInsightApi } from "@/services/fakeCisoInsightApi";
import type { PullRequest } from "@/types/github";

export default function PRsTable() {
  const [prs, setPRs] = useState<PullRequest[]>([]);
  const [severity, setSeverity] = useState<string>("all");

  useEffect(() => { fakeCisoInsightApi.fetchPullRequests().then(setPRs); }, []);

  const filtered = useMemo(() => {
    if (severity === "all") return prs;
    return prs.filter(p => (p.riskSummary?.overallSeverity ?? p.severity ?? "").toUpperCase() === severity.toUpperCase());
  }, [prs, severity]);

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Pull Requests</h2>
        <select className="border rounded-md px-2 py-1"
                value={severity} onChange={e => setSeverity(e.target.value)}>
          <option value="all">All severities</option>
          <option value="CRITICAL">Critical</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
          <option value="INFO">Info</option>
        </select>
      </div>

      <table className="min-w-full text-sm">
        <thead className="border-b text-gray-500">
          <tr>
            <th className="text-left p-2">Title</th>
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
                <Link className="text-blue-600 hover:underline" href={`/prs/${pr.id}`}>
                  {pr.title}
                </Link>
              </td>
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


