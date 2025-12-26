from registry import register_career
from models import Career


SOLUTIONS_ARCHITECT = register_career(
    Career(
        id = "solutions-architect",
        title = "Solutions Architect",
        description = "Designs complex technical solutions to meet business needs. Bridges technical and business requirements.",
        traits = ["strategic", "systems-thinking", "communication", "stakeholder-management", "holistic"],
        categories = ["architecture", "solutions"],
        keywords = ["architecture", "solutions", "design", "enterprise", "integration", "requirements"],
    )
)
