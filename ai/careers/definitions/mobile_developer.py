from registry import register_career
from models import Career


MOBILE_DEVELOPER = register_career(
    Career(
        id = "mobile-dev",
        title = "Mobile App Developer",
        description = "Develops applications for iOS and Android devices. Works with Swift, Kotlin, React Native, or Flutter.",
        traits = ["mobile-first", "user-centric", "touch-interfaces", "performance", "cross-platform"],
        categories = ["development", "mobile"],
        keywords = ["mobile", "iOS", "Android", "app", "phone", "tablet", "native", "responsive"],
    )
)
