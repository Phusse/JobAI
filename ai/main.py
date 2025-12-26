from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from typing import List, Dict, Any, Optional
from datetime import datetime
import json
from pathlib import Path

load_dotenv()

app = FastAPI(
    title="JobMatch AI Service",
    description="Career recommendation engine with 50+ careers across 12 industries",
    version="2.0.0"
)

# CORS middleware to allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import local matching engine
from matching_engine import get_engine
from trait_scorer import get_careers, get_categories, get_questions, reload_data

# Feedback storage
FEEDBACK_FILE = Path(__file__).parent / "data" / "feedback.json"


class TraitRequest(BaseModel):
    answers: List[Any]  # List of {question, answer}


class FeedbackRequest(BaseModel):
    session_id: Optional[str] = None
    recommended_career: str
    was_accurate: bool
    user_chosen_career: Optional[str] = None
    comments: Optional[str] = None


class CompareRequest(BaseModel):
    career_ids: List[str]  # List of career IDs to compare


@app.get("/")
def read_root():
    careers = get_careers()
    categories = get_categories()
    return {
        "message": "JobMatch AI Service v2.0",
        "total_careers": len(careers),
        "total_categories": len(categories),
        "features": ["confidence_indicators", "skills_gap", "alternative_paths", "trait_visualization"]
    }


@app.get("/health")
def health_check():
    try:
        careers = get_careers()
        return {
            "status": "healthy",
            "engine": "local",
            "careers_loaded": len(careers)
        }
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}


@app.get("/careers")
def list_careers():
    """Get all available careers grouped by category."""
    careers = get_careers()
    categories = get_categories()
    
    # Group by category
    grouped = {}
    for career in careers:
        cat_id = career.get("category", "other")
        cat_info = categories.get(cat_id, {"name": "Other", "icon": "📌"})
        
        if cat_id not in grouped:
            grouped[cat_id] = {
                "category_id": cat_id,
                "category_name": cat_info.get("name", "Other"),
                "category_icon": cat_info.get("icon", "📌"),
                "careers": []
            }
        
        grouped[cat_id]["careers"].append({
            "id": career["id"],
            "title": career["title"],
            "description": career.get("description", ""),
            "salary_range": career.get("salary_range", ""),
            "growth_outlook": career.get("growth_outlook", "")
        })
    
    return {"categories": list(grouped.values())}


@app.get("/careers/{career_id}")
def get_career_details(career_id: str):
    """Get detailed info about a specific career."""
    careers = get_careers()
    categories = get_categories()
    
    career = next((c for c in careers if c["id"] == career_id), None)
    if not career:
        raise HTTPException(status_code=404, detail=f"Career '{career_id}' not found")
    
    cat_info = categories.get(career.get("category", ""), {})
    
    return {
        **career,
        "category_name": cat_info.get("name", ""),
        "category_icon": cat_info.get("icon", "")
    }

import random
from collections import defaultdict

@app.get("/questions")
def list_questions(all: bool = False):
    """
    Get assessment questions.
    By default, returns 20 randomly shuffled questions with balanced archetype coverage.
    Use ?all=true to get the full question bank (for admin/debugging).
    """
    questions = get_questions()
    
    if all:
        return {
            "total": len(questions),
            "shuffled": False,
            "questions": questions
        }
    
    # Stratified random selection: ensure all archetypes are covered
    QUESTIONS_PER_SESSION = 20
    archetypes = ["architect", "creator", "detective", "optimizer", "conductor", "pioneer"]
    
    # Group questions by archetype
    by_archetype = defaultdict(list)
    for q in questions:
        archetype = q.get("archetype", "unknown")
        by_archetype[archetype].append(q)
    
    # Select questions: at least 3 from each archetype, then fill randomly
    selected = []
    min_per_archetype = 3
    
    for archetype in archetypes:
        pool = by_archetype.get(archetype, [])
        if pool:
            # Random sample from this archetype
            count = min(min_per_archetype, len(pool))
            selected.extend(random.sample(pool, count))
    
    # Fill remaining slots with random picks from unused questions
    remaining_slots = QUESTIONS_PER_SESSION - len(selected)
    if remaining_slots > 0:
        selected_ids = {q["id"] for q in selected}
        remaining_questions = [q for q in questions if q["id"] not in selected_ids]
        if remaining_questions:
            extra = random.sample(remaining_questions, min(remaining_slots, len(remaining_questions)))
            selected.extend(extra)
    
    # Shuffle final order
    random.shuffle(selected)
    
    return {
        "total": len(selected),
        "shuffled": True,
        "questions": selected
    }


@app.post("/recommend-careers")
async def recommend_careers(request: TraitRequest):
    """
    Get career recommendations based on user answers.
    Returns top 3 matches with confidence, skills gap, and alternatives.
    """
    try:
        engine = get_engine()
        result = engine.recommend(request.answers, top_k=3)
        
        print(f"[AI Service] Generated {len(result['recommendations'])} recommendations")
        return result

    except Exception as e:
        print(f"[AI Service] Error: {e}")
        raise HTTPException(status_code=500, detail=f"Recommendation failed: {str(e)}")


@app.post("/compare-careers")
async def compare_careers(request: CompareRequest):
    """Compare multiple careers side by side."""
    careers = get_careers()
    categories = get_categories()
    
    results = []
    for career_id in request.career_ids[:5]:  # Max 5 comparisons
        career = next((c for c in careers if c["id"] == career_id), None)
        if career:
            cat_info = categories.get(career.get("category", ""), {})
            results.append({
                "id": career["id"],
                "title": career["title"],
                "category": cat_info.get("name", ""),
                "description": career.get("description", ""),
                "traits_required": list(career.get("traits", {}).keys()),
                "skills": career.get("skills", []),
                "salary_range": career.get("salary_range", ""),
                "growth_outlook": career.get("growth_outlook", "")
            })
    
    return {"careers": results}


@app.post("/feedback")
async def submit_feedback(request: FeedbackRequest):
    """Submit feedback on recommendation accuracy."""
    try:
        # Load existing feedback
        feedback_list = []
        if FEEDBACK_FILE.exists():
            with open(FEEDBACK_FILE, "r") as f:
                feedback_list = json.load(f)
        
        # Add new feedback
        feedback_list.append({
            "timestamp": datetime.now().isoformat(),
            "session_id": request.session_id,
            "recommended_career": request.recommended_career,
            "was_accurate": request.was_accurate,
            "user_chosen_career": request.user_chosen_career,
            "comments": request.comments
        })
        
        # Save
        with open(FEEDBACK_FILE, "w") as f:
            json.dump(feedback_list, f, indent=2)
        
        return {"status": "success", "message": "Feedback recorded"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save feedback: {str(e)}")


@app.get("/feedback/stats")
def get_feedback_stats():
    """Get feedback statistics."""
    if not FEEDBACK_FILE.exists():
        return {"total": 0, "accuracy_rate": None}
    
    with open(FEEDBACK_FILE, "r") as f:
        feedback_list = json.load(f)
    
    total = len(feedback_list)
    accurate = sum(1 for f in feedback_list if f.get("was_accurate"))
    
    return {
        "total": total,
        "accurate": accurate,
        "accuracy_rate": round(accurate / total * 100, 1) if total > 0 else None
    }


@app.post("/admin/reload")
async def reload_data_endpoint():
    """Reload careers and questions from JSON files."""
    try:
        reload_data()
        careers = get_careers()
        categories = get_categories()
        return {
            "status": "success",
            "careers_loaded": len(careers),
            "categories_loaded": len(categories)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Reload failed: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


