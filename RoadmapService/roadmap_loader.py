import json
from pathlib import Path
from typing import Dict, List, Optional
from schemas import Roadmap, RoadmapSummary


class RoadmapLoader:
    """Loads and caches roadmaps from JSON files."""
    
    def __init__(self):
        self.data_dir = Path(__file__).parent / "data" / "roadmaps"
        self._cache: Dict[str, Roadmap] = {}
        self._load_all()
    
    def _load_all(self):
        """Load all roadmap JSON files into memory."""
        if not self.data_dir.exists():
            self.data_dir.mkdir(parents=True, exist_ok=True)
            return
        
        for file_path in self.data_dir.glob("*.json"):
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    roadmap = Roadmap(**data)
                    self._cache[roadmap.career_id] = roadmap
            except Exception as e:
                print(f"Error loading {file_path}: {e}")
    
    def get_roadmap(self, career_id: str) -> Optional[Roadmap]:
        """Get a specific roadmap by career ID."""
        return self._cache.get(career_id)
    
    def list_roadmaps(self) -> List[RoadmapSummary]:
        """List all available roadmaps."""
        return [
            RoadmapSummary(
                career_id=r.career_id,
                title=r.title,
                description=r.description,
                category=r.category,
                icon=r.icon,
                node_count=len(r.nodes),
                is_role=r.is_role
            )
            for r in self._cache.values()
        ]
    
    def search_roadmaps(self, query: str) -> List[RoadmapSummary]:
        """Search roadmaps by title or description."""
        query = query.lower()
        results = []
        for r in self._cache.values():
            if query in r.title.lower() or query in r.description.lower():
                results.append(RoadmapSummary(
                    career_id=r.career_id,
                    title=r.title,
                    description=r.description,
                    category=r.category,
                    icon=r.icon,
                    node_count=len(r.nodes),
                    is_role=r.is_role
                ))
        return results
    
    def reload(self):
        """Reload all roadmaps from disk."""
        self._cache.clear()
        self._load_all()


# Singleton instance
_loader: Optional[RoadmapLoader] = None


def get_loader() -> RoadmapLoader:
    """Get the singleton roadmap loader."""
    global _loader
    if _loader is None:
        _loader = RoadmapLoader()
    return _loader
