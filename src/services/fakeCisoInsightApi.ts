import data from "@/data/seed.json";
import type { DashboardSummary, PullRequest, Repository } from "@/types/github";

// Helpers to tolerate slight schema differences & id types
const repositories: Repository[] = (data as any).repositories ?? (data as any).repos ?? [];
const pullRequests: PullRequest[] = (data as any).pullRequests ?? [];

function isMerged(state: string) {
  return state.toLowerCase() === "merged";
}
function isClosed(state: string) {
  return state.toLowerCase() === "closed";
}
function isOpen(state: string) {
  return state.toLowerCase() === "open";
}

// Fetch all repositories
export async function fetchRepositories(): Promise<Repository[]> {
  return repositories;
}

// Fetch all PRs across repos
export async function fetchPullRequests(): Promise<PullRequest[]> {
  return pullRequests;
}

// Fetch PR by ID (robust compare across string/number ids)
export async function fetchPullRequestById(id: string | number): Promise<PullRequest | null> {
  const pr = pullRequests.find(p => String(p.id) === String(id)) ?? null;
  return pr;
}

// Dashboard summary (aggregated analytics aligned to your type)
export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  const totalOpenPRs   = pullRequests.filter(pr => pr.state && isOpen(pr.state)).length;
  const totalClosedPRs = pullRequests.filter(pr => pr.state && isClosed(pr.state)).length;
  const totalMergedPRs = pullRequests.filter(pr => pr.state && isMerged(pr.state)).length;

  // If you kept optional fields in DashboardSummary, you can compute them too:
  // const highRiskPRs = pullRequests.filter(pr => pr.severity === "high" || pr.severity === "critical").length;
  // const avgRisk = pullRequests.length
  //   ? Math.round(pullRequests.reduce((s, p) => s + (p.riskScore ?? 0), 0) / pullRequests.length)
  //   : 0;

  return {
    totalOpenPRs,
    totalClosedPRs,
    totalMergedPRs,
    // highRiskPRs,
    // averageRiskScore: avgRisk,
  };
}

// Unified export
export const fakeCisoInsightApi = {
  fetchRepositories,
  fetchPullRequests,
  fetchPullRequestById,
  fetchDashboardSummary,
} as const;

export default fakeCisoInsightApi;