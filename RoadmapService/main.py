from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional

from schemas import Roadmap, RoadmapSummary
from roadmap_loader import get_loader

app = FastAPI(
    title="Career Roadmap Service",
    description="Provides detailed learning roadmaps for career paths",
    version="1.0.0"
)

# CORS - allow frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    """Root endpoint."""
    return {
        "service": "Career Roadmap Service",
        "version": "1.0.0",
        "endpoints": {
            "list": "/roadmaps",
            "search": "/roadmaps/search?q=query",
            "get": "/roadmap/{career_id}",
            "health": "/health"
        }
    }


@app.get("/health")
def health_check():
    """Health check endpoint."""
    loader = get_loader()
    return {
        "status": "healthy",
        "roadmaps_loaded": len(loader.list_roadmaps())
    }


@app.get("/roadmaps", response_model=List[RoadmapSummary])
def list_roadmaps():
    """List all available roadmaps."""
    loader = get_loader()
    return loader.list_roadmaps()


@app.get("/roadmaps/search", response_model=List[RoadmapSummary])
def search_roadmaps(q: str):
    """Search roadmaps by title or description."""
    loader = get_loader()
    return loader.search_roadmaps(q)


@app.get("/roadmap/{career_id}", response_model=Roadmap)
def get_roadmap(career_id: str):
    """Get a specific roadmap by career ID."""
    loader = get_loader()
    roadmap = loader.get_roadmap(career_id)
    if not roadmap:
        raise HTTPException(status_code=404, detail=f"Roadmap not found: {career_id}")
    return roadmap


@app.post("/roadmaps/reload")
def reload_roadmaps():
    """Reload roadmaps from disk (admin endpoint)."""
    loader = get_loader()
    loader.reload()
    return {"status": "reloaded", "count": len(loader.list_roadmaps())}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
