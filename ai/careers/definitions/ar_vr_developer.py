from registry import register_career
from models import Career


AR_VR_DEVELOPER = register_career(
    Career(
        id = "ar-vr-dev",
        title = "AR/VR Developer",
        description = "Creates immersive augmented and virtual reality experiences. Combines 3D graphics with spatial computing.",
        traits = ["creative", "visual", "3D", "immersive", "innovative", "spatial"],
        categories = ["emerging", "AR/VR", "development"],
        keywords = ["AR", "VR", "augmented reality", "virtual reality", "3D", "immersive", "spatial", "metaverse"],
    )
)
