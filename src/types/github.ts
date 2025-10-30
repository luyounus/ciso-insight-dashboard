export interface Repository {
  id: number | string;
  name: string;
  owner: string;
  description?: string;
  createdAt?: string;
}

export interface Comment {
  id: string | number;
  user: string;
  body: string;
  createdAt: string;
}

export interface PullRequest {
  id: string | number;
  number?: number;
  title: string;
  state: "open" | "closed" | "merged" | string;
  author: string;
  repoId?: string | number;
  repository?: Repository;
  createdAt: string;
  updatedAt?: string;
  mergedAt?: string | null;
  riskScore?: number;
  severity?: "low" | "medium" | "high" | "critical";
  comments?: Comment[];
}

export interface DashboardSummary {
  totalOpenPRs: number;
  totalClosedPRs: number;
  totalMergedPRs: number;
  // Optional extras if you want:
  highRiskPRs?: number;
  averageRiskScore?: number;
}

// Repository (top-level source of PRs)
export interface Repository {
    id: number | string;
    name: string;
    owner: string;
    description?: string;
    createdAt?: string;
}
  
// Comment thread model
export interface Comment {
    id: string | number;
    user: string;
    body: string;
    createdAt: string;
}
  
// Pull Request (with optional repo + comments)
export interface PullRequest {
    id: string | number;
    number?: number;
    title: string;
    state: "open" | "closed" | "merged" | string;
    author: string;
    repoId?: string | number;     // matches Repository.id
    repository?: Repository;      // optional expanded repo info
    createdAt: string;
    updatedAt?: string;
    mergedAt?: string | null;
    riskScore?: number;
    severity?: "low" | "medium" | "high" | "critical";
    comments?: Comment[];
}
  
// Dashboard summary metrics for top-level KPIs
export interface DashboardSummary {
    totalOpenPRs: number;
    totalClosedPRs: number;
    totalMergedPRs: number;
    highRiskPRs?: number;
    averageRiskScore?: number;
}  
