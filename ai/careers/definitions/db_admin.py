from registry import register_career
from models import Career


DB_ADMIN = register_career(
    Career(
        id = "dba",
        title = "Database Administrator",
        description = "Manages databases to ensure data is stored securely and efficiently. Handles backups, optimization, and access.",
        traits = ["organized", "reliable", "security", "performance", "backup", "optimization"],
        categories = ["infrastructure", "database"],
        keywords = ["database", "SQL", "backup", "optimization", "storage", "queries", "administration"],
    )
)
