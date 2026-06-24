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

export interface RepoTreeItem {
  path: string;
  type: string;
  size: number | null;
}

export interface DependenciesData {
  frontend: string[];
  backend: string[];
}

export interface RepositoryData {
  info: RepoInfo;
  readme: string;
  tree: RepoTreeItem[];
  languages: Record<string, number>;
  dependencies: DependenciesData;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}