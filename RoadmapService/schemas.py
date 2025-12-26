from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class Resource(BaseModel):
    """A learning resource linked to a roadmap node."""
    title: str
    url: str
    type: str  # "video", "course", "article", "docs"
    platform: str  # "YouTube", "Udemy", "FreeCodeCamp", "MDN", etc.
    duration: Optional[str] = None  # e.g., "2h 30m"
    free: bool = True


class RoadmapNode(BaseModel):
    """A single node in the roadmap graph."""
    id: str
    label: str
    description: str
    estimatedTime: Optional[str] = None  # e.g., "2-4 weeks"
    resources: List[Resource] = []


class RoadmapEdge(BaseModel):
    """An edge connecting two nodes."""
    source: str
    target: str


class RoleRequirements(BaseModel):
    """Requirements for role-based career paths (senior roles)."""
    experience_years: Optional[str] = None
    prerequisite_paths: List[str] = []
    soft_skills: List[str] = []
    technical_foundation: Optional[str] = None


class Roadmap(BaseModel):
    """Complete roadmap for a career path."""
    career_id: str
    title: str
    description: str
    category: str
    icon: Optional[str] = None
    context: Optional[str] = None  # Detailed explanation about the career
    career_type: Optional[str] = None  # e.g., "Technical Research", "Infrastructure"
    is_role: bool = False  # True if this is a senior role vs entry-level path
    role_requirements: Optional[RoleRequirements] = None
    nodes: List[RoadmapNode]
    edges: List[RoadmapEdge]


class RoadmapSummary(BaseModel):
    """Summary for listing roadmaps."""
    career_id: str
    title: str
    description: str
    category: str
    icon: Optional[str] = None
    node_count: int
    is_role: bool = False

