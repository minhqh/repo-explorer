from pydantic import BaseModel
from typing import Optional, List

class RepoInfo(BaseModel):
    owner: str
    name: str 
    description: Optional[str] = None
    stars: int
    forks: int
    language: Optional[str] = None
    topics: List[str] = []
    default_branch: str

class RepoTreeItem(BaseModel):
    path: str
    type: str # tree cho folder va blob cho file
    size: Optional[int] = None

class AnalyzeRequest(BaseModel):
    url: str

class DependenciesData(BaseModel):
    frontend: List[str] = []
    backend: List[str] = []

class RepositoryData(BaseModel):
    info: RepoInfo
    readme: str
    tree: List[RepoTreeItem]
    languages: dict
    dependencies: DependenciesData