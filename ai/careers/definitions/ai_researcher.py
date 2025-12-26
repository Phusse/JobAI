from registry import register_career
from models import Career


AI_RESEARCHER = register_career(
    Career(
        id = "ai-researcher",
        title = "AI Researcher",
        description = "Advances the field of artificial intelligence through research. Publishes papers and develops new algorithms.",
        traits = ["investigative", "mathematical", "innovative", "experimental", "theoretical", "curious"],
        categories = ["AI", "research"],
        keywords = ["research", "AI", "algorithms", "papers", "innovation", "breakthrough", "theory"],
    )
)
