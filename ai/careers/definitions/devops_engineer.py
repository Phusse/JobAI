from registry import register_career
from models import Career


DEVOPS_ENGINEER = register_career(
    Career(
        id = "devops-engineer",
        title = "DevOps Engineer",
        description = "Bridges development and operations. Automates deployment, scaling, and infrastructure management.",
        traits = ["automation", "infrastructure", "CI/CD", "monitoring", "reliable", "efficient"],
        categories = ["infrastructure", "operations"],
        keywords = ["DevOps", "CI/CD", "deployment", "automation", "infrastructure", "containers", "Kubernetes"],
    )
)
