from registry import register_career
from models import Career


BACKEND_DEVELOPER = register_career(
    Career(
        id = "backend-dev",
        title = "Backend Developer",
        description = "Builds server-side logic, databases, and APIs that power applications. Works with languages like Python, Node.js, Java, or Go.",
        traits = ["logical", "systems-thinking", "performance", "database", "API", "scalable"],
        categories = ["development", "server"],
        keywords = ["server", "API", "database", "logic", "performance", "scalable", "architecture"],
    )
)
