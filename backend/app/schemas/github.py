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

class RepositoryData(BaseModel):
    info: RepoInfo
    readme: str
    tree: Dict[str, TreeNode]
    languages: List[LanguageStat]
    dependencies: DependenciesData