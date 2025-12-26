from registry import register_career
from models import Career


SECURITY_ENGINEER = register_career(
    Career(
        id = "security-engineer",
        title = "Security Engineer",
        description = "Builds secure systems and implements security controls. Develops security tools and policies.",
        traits = ["security", "systems-thinking", "compliance", "infrastructure", "automation", "defensive"],
        categories = ["security", "engineering"],
        keywords = ["security", "engineering", "controls", "policies", "encryption", "authentication"],
    )
)
