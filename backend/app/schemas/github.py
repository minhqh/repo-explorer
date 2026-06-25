from pydantic import BaseModel
from typing import Optional, List, Dict


class RepoInfo(BaseModel):
    owner: str
    name: str
    description: Optional[str] = None
    stars: int
    forks: int
    language: Optional[str] = None
    topics: List[str] = []
    default_branch: str


class TreeNode(BaseModel):
    name: str
    type: str
    size: Optional[int] = None
    children: Dict[str, "TreeNode"] = {}


class AnalyzeRequest(BaseModel):
    url: str


class DependenciesData(BaseModel):
    frontend: List[str] = []
    backend: List[str] = []


class LanguageStat(BaseModel):
    name: str
    value: int
    percent: float
    color: str


class ContributorStat(BaseModel):
    author: str
    commits: int
    percentage: float


class CommitActivity(BaseModel):
    date: str
    count: int

class CommitDetail(BaseModel):
    sha: str
    message: str
    author: str
    date: str

class GitStats(BaseModel):
    total_commits: int
    unique_contributors: int
    top_contributors: List[ContributorStat]
    commit_timeline: List[CommitActivity]
    recent_commits: List[CommitDetail]


class RepositoryData(BaseModel):
    info: RepoInfo
    readme: str
    tree: Dict[str, TreeNode]
    languages: List[LanguageStat]
    dependencies: DependenciesData
    git_stats: Optional[GitStats] = None
    markdown_files: Dict[str, str] = {}
    health: list[dict] = []
