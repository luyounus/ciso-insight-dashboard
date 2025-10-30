export interface Repository {
  id: number | string;
  name: string;
  owner: string;
  description?: string;
  createdAt?: string;
  default_branch?: string;
  html_url?: string;
  language?: string;
  topics?: string[];
  stargazersCount?: number;
  forksCount?: number;
  openIssuesCount?: number;
}

export interface CommentUser {
  login: string;
  type?: "User" | "Bot";
  id?: number;
  avatar_url?: string;
}

export interface Comment {
  id: string | number;
  user: CommentUser;
  body: string;
  createdAt: string;
  in_reply_to_id?: string | number;
  metadata?: { severity?: string; vulnerabilityTypes?: string[] };
}

export interface Finding {
  id: string;
  type: "SECRET_EXPOSURE" | "INJECTION" | "AUTHORIZATION" | "DEPENDENCY";
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO";
  message: string;
  file_path: string;
  line: number;
}

export interface RiskSummary {
  overallSeverity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO";
  score: number;
  countsBySeverity?: Record<string, number>;
  categories?: Record<string, number>;
  mttr_days?: number;
}

export interface PullRequest {
  id: string | number;
  number?: number;
  title: string;
  state: "open" | "closed" | "merged" | string;
  author: string;
  repoId: string | number;
  createdAt: string;
  updatedAt?: string;
  mergedAt?: string | null;
  additions?: number;
  deletions?: number;
  changedFiles?: number;
  severity?: "low" | "medium" | "high" | "critical";
  riskSummary?: RiskSummary;
  findings?: Finding[];
  comments?: Comment[];
  htmlUrl?: string; // maps from GitHub html_url when available
}

export interface DashboardSummary {
  totalOpenPRs: number;
  totalClosedPRs: number;
  totalMergedPRs: number;
  highRiskPRs?: number;
  averageRiskScore?: number;
}

export interface Contributor {
  id: string | number;
  login: string;
  avatar_url?: string;
}

// GitHub-native shapes (subset) to keep parity with REST API responses
// https://docs.github.com/en/rest/pulls/pulls?apiVersion=2022-11-28
export interface GithubUser {
  login: string;
  id: number;
  avatar_url?: string;
  type?: "User" | "Bot";
}

export interface GithubRepoRef {
  id: number;
  name: string;
  full_name?: string;
  owner?: GithubUser;
  html_url?: string;
  default_branch?: string;
  created_at?: string;
  description?: string | null;
  language?: string | null;
  topics?: string[];
  stargazers_count?: number;
  forks_count?: number;
  open_issues_count?: number;
}

export interface GithubContributor {
  id: number;
  login: string;
  avatar_url?: string;
  html_url?: string;
  contributions?: number;
}

export interface GithubPullRequest {
  id: number;
  number: number;
  title: string;
  state: "open" | "closed"; // merged PRs are closed + merged=true
  user: GithubUser;
  created_at: string;
  updated_at: string;
  merged_at: string | null;
  merged?: boolean;
  additions?: number;
  deletions?: number;
  changed_files?: number;
  base?: { repo?: GithubRepoRef };
  head?: { repo?: GithubRepoRef };
}
