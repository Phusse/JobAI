from registry import register_career
from models import Career


TECH_WRITER = register_career(
    Career(
        id = "tech-writer",
        title = "Technical Writer",
        description = "Creates documentation, guides, and tutorials. Makes complex technical concepts accessible.",
        traits = ["communication", "explaining", "documentation", "detail-oriented", "clarity", "organized"],
        categories = ["product", "documentation"],
        keywords = ["documentation", "writing", "guides", "tutorials", "API docs", "technical", "communication"],
    )
)
