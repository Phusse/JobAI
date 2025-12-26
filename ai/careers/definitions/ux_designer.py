from registry import register_career
from models import Career


UX_DESIGNER = register_career(
    Career(
        id = "ux-designer",
        title = "UX/UI Designer",
        description = "Designs intuitive and aesthetically pleasing user interfaces. Focuses on user research and experience.",
        traits = ["creative", "empathy", "visual", "user-centric", "research", "prototyping"],
        categories = ["design", "product"],
        keywords = ["UX", "UI", "design", "user experience", "interface", "Figma", "prototyping", "research"],
    )
)
