from registry import register_career
from models import Career


FULLSTACK_DEVELOPER = register_career(
    Career(
        id = "fullstack-dev",
        title = "Full Stack Developer",
        description = "Versatile developer capable of working on both frontend and backend. Understands the entire application stack.",
        traits = ["adaptable", "versatile", "learning-agile", "holistic", "flexible", "broad-knowledge"],
        categories = ["development", "fullstack"],
        keywords = ["full stack", "versatile", "both", "end-to-end", "complete", "all-rounder"],
    )
)
