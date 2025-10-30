import KpiCard from "../common/KpiCard";

export default function DashboardSummary({ data, repoCount, contributorCount }:{
  data: { totalOpenPRs: number; totalClosedPRs: number; totalMergedPRs: number };
  repoCount: number;
  contributorCount: number;
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <KpiCard label="Repositories" value={repoCount ?? 0} href="/repos" />
      <KpiCard label="Open PRs" value={data?.totalOpenPRs ?? 0} href="/prs?status=OPEN" />
      <KpiCard label="Merged PRs" value={data?.totalMergedPRs ?? 0} href="/prs?status=MERGED" />
      <KpiCard label="Contributors" value={contributorCount ?? 0} href="/contributors" />
    </div>
  );
}


