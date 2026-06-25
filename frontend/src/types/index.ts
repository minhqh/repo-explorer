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
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}
