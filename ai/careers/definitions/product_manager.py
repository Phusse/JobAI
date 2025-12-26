from registry import register_career
from models import Career


PRODUCT_MANAGER = register_career(
    Career(
        id = "product-manager",
        title = "Product Manager",
        description = "Leads product strategy, defines roadmaps, and prioritizes features. Organizes cross-functional teams including engineering, design, and business stakeholders. Makes data-driven decisions about what to build next.",
        traits = ["leadership", "strategic", "stakeholder-management", "data-driven", "communication", "organizing", "decision-making", "business-minded", "prioritization", "team-lead"],
        categories = ["product", "management"],
        keywords = ["product", "strategy", "roadmap", "stakeholders", "prioritization", "features", "business", "leadership", "team", "organize", "lead", "cross-functional", "decisions", "revenue", "market fit"],
    )
)
