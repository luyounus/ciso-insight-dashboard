import data from "@/data/seed.json";
import type { DashboardSummary, PullRequest, Repository, GithubPullRequest, Contributor } from "@/types/github";

// Helpers to tolerate slight schema differences & id types
const repositories: Repository[] = (data as any).repositories ?? (data as any).repos ?? [];
const contributors: Contributor[] = (data as any).contributors ?? [];

function isGithubPR(x: any): x is GithubPullRequest {
  return x && typeof x === "object" && "created_at" in x && "user" in x && "number" in x;
}

function normalizePR(x: any): PullRequest {
  if (isGithubPR(x)) {
    const merged = Boolean((x as any).merged) || x.merged_at != null;
    const state = merged ? "merged" : x.state;
    return {
      id: x.id,
      number: x.number,
      title: x.title,
      state,
      author: x.user?.login ?? "unknown",
      repoId: x.base?.repo?.id ?? x.head?.repo?.id ?? "unknown",
      createdAt: x.created_at,
      updatedAt: x.updated_at,
      mergedAt: x.merged_at,
      additions: x.additions,
      deletions: x.deletions,
      changedFiles: x.changed_files,
      htmlUrl: (x as any).html_url,
      riskSummary: (x as any).riskSummary,
      findings: (x as any).findings,
      comments: (x as any).comments,
      severity: (x as any).severity,
    };
  }
  return {
    id: x.id,
    number: x.number,
    title: x.title,
    state: x.state,
    author: x.author,
    repoId: x.repoId ?? x.repository?.id ?? "unknown",
    createdAt: x.createdAt,
    updatedAt: x.updatedAt,
    mergedAt: x.mergedAt ?? null,
    additions: x.additions,
    deletions: x.deletions,
    changedFiles: x.changedFiles,
    htmlUrl: x.htmlUrl,
    riskSummary: x.riskSummary,
    findings: x.findings,
    comments: x.comments,
    severity: x.severity,
  };
}

const pullRequests: PullRequest[] = ((data as any).pullRequests ?? []).map(normalizePR);

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

export async function fetchContributors(): Promise<Contributor[]> {
  return contributors;
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

  const averageRiskScore = pullRequests.length
    ? Math.round(
        pullRequests.reduce((sum, pr) => sum + (pr.riskSummary?.score ?? (pr as any).riskScore ?? 0), 0) /
        pullRequests.length
      )
    : 0;

  const highRiskPRs = pullRequests.filter((p) => {
    const sev = (p.riskSummary?.overallSeverity ?? (p as any).severity ?? "").toString().toUpperCase();
    return sev.includes("HIGH") || sev.includes("CRITICAL");
  }).length;

  return {
    totalOpenPRs,
    totalClosedPRs,
    totalMergedPRs,
    averageRiskScore,
    highRiskPRs,
  };
}

// Unified export
export const fakeCisoInsightApi = {
  fetchRepositories,
  fetchContributors,
  fetchPullRequests,
  fetchPullRequestById,
  fetchDashboardSummary,
} as const;

export default fakeCisoInsightApi;