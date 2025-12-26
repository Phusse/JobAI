from registry import register_career
from models import Career


CLOUD_ARCHITECT = register_career(
    Career(
        id = "cloud-architect",
        title = "Cloud Architect",
        description = "Designs and oversees cloud computing strategy. Works with AWS, Azure, or GCP to build scalable solutions.",
        traits = ["strategic", "systems-thinking", "scalable", "cost-optimization", "cloud-native"],
        categories = ["infrastructure", "cloud"],
        keywords = ["cloud", "AWS", "Azure", "GCP", "architecture", "scalable", "distributed"],
    )
)
