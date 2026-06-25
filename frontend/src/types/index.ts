export interface RepoInfo {
  owner: string;
  name: string;
  description: string | null;
  stars: number;
  forks: number;
  language: string | null;
  topics: string[];
  default_branch: string;
}

export interface LanguageStat {
  name: string;
  value: number;
  percent: number;
  color: string;
}

export interface TreeNode {
  name: string;
  type: string;
  size: number | null;
  children: Record<string, TreeNode>;
}

export interface DependenciesData {
  frontend: string[];
  backend: string[];
}

export interface RepositoryData {
  info: RepoInfo;
  readme: string;
  tree: Record<string, TreeNode>;
  languages: LanguageStat[];
  dependencies: DependenciesData;
  git_stats?: GitStats;
  markdown_files?: Record<string, string>;
  health?: RepoHealthIssue[];
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface ContributorStat {
  author: string;
  commits: number;
  percentage: number;
}

export interface CommitActivity {
  date: string;
  count: number;
}

export interface CommitDetail {
  sha: string;
  message: string;
  author: string;
  date: string;
}

export interface GitStats {
  total_commits: number;
  unique_contributors: number;
  top_contributors: ContributorStat[];
  commit_timeline: CommitActivity[];
  recent_commits: CommitDetail[];
}

export interface RepoHealthIssue {
  file: string;
  severity: "critical" | "important" | "low";
  impact: "high" | "medium" | "low";
}