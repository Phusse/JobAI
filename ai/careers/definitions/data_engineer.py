from registry import register_career
from models import Career


DATA_ENGINEER = register_career(
    Career(
        id = "data-engineer",
        title = "Data Engineer",
        description = "Builds and maintains data pipelines and infrastructure. Ensures data is collected, stored, and accessible.",
        traits = ["systems-thinking", "infrastructure", "pipeline", "scalable", "reliable", "ETL"],
        categories = ["data", "engineering"],
        keywords = ["pipeline", "ETL", "data warehouse", "infrastructure", "big data", "streaming"],
    )
)
