import { fakeCisoInsightApi } from "@/services/fakeCisoInsightApi";
import DashboardSummary from "@/components/dashboard/DashboardSummary";
import SeverityBar from "@/components/dashboard/SeverityBar";
import StatusBar from "@/components/dashboard/StatusBar";
import OpenVsMergedTrend from "@/components/dashboard/OpenVsMergedTrend";
import SeverityDonut from "@/components/dashboard/SeverityDonut";

export default async function Overview() {
  const [summary, repos, prs] = await Promise.all([
    fakeCisoInsightApi.fetchDashboardSummary(),
    fakeCisoInsightApi.fetchRepositories(),
    fakeCisoInsightApi.fetchPullRequests(),
  ]);

  const dist: Record<string, number> = { CRITICAL:0, HIGH:0, MEDIUM:0, LOW:0, INFO:0 };
  prs.forEach(p => { const s = (p.riskSummary?.overallSeverity ?? "INFO").toUpperCase(); if (dist[s] !== undefined) dist[s]++; });

  const statusCounts = {
    open: prs.filter(p => p.state.toLowerCase() === "open").length,
    merged: prs.filter(p => p.state.toLowerCase() === "merged").length,
    closed: prs.filter(p => p.state.toLowerCase() === "closed").length,
  };

  const byMonth = new Map<string, { month:string; open:number; merged:number }>();
  prs.forEach(p => {
    const m = new Date(p.createdAt).toISOString().slice(0,7);
    if (!byMonth.has(m)) byMonth.set(m, { month: m, open:0, merged:0 });
    byMonth.get(m)!.open++;
    if (p.mergedAt) byMonth.get(m)!.merged++;
  });
  const trend = Array.from(byMonth.values()).sort((a,b)=>a.month.localeCompare(b.month));

  const contributors = new Set(prs.map(p => p.author)).size;

  return (
    <main className="space-y-6">
      <DashboardSummary data={summary} repoCount={repos.length} contributorCount={contributors} />
      <div className="grid md:grid-cols-2 gap-6">
        <SeverityDonut dist={dist} />
        <StatusBar open={statusCounts.open} merged={statusCounts.merged} closed={statusCounts.closed} />
      </div>
      <OpenVsMergedTrend points={trend} />
    </main>
  );
}
