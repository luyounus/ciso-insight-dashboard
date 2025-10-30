export interface Repository {
  id: number | string;
  name: string;
  owner: string;
  description?: string;
  createdAt?: string;
  default_branch?: string;
  html_url?: string;
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
