from registry import register_career
from models import Career


DATA_SCIENTIST = register_career(
    Career(
        id = "data-scientist",
        title = "Data Scientist",
        description = "Analyzes complex data to extract insights and build predictive models. Uses statistics, machine learning, and visualization.",
        traits = ["analytical", "mathematical", "pattern-recognition", "investigative", "data-driven"],
        categories = ["data", "analytics"],
        keywords = ["data", "analysis", "statistics", "machine learning", "patterns", "insights", "prediction"],
    )
)
