from registry import register_career
from models import Career


ENTERPRISE_ARCHITECT = register_career(
    Career(
        id = "enterprise-architect",
        title = "Enterprise Architect",
        description = "Oversees organization-wide technology strategy. Ensures alignment between IT and business goals.",
        traits = ["strategic", "leadership", "governance", "long-term", "standardization", "holistic"],
        categories = ["architecture", "enterprise"],
        keywords = ["enterprise", "strategy", "governance", "standards", "organization", "alignment"],
    )
)
