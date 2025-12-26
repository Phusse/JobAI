from registry import register_career
from models import Career


FRONTEND_DEVELOPER = register_career(
    Career(
        id = "frontend-dev",
        title = "Frontend Developer",
        description = "Builds the visible parts of websites and apps that users interact with. Works with HTML, CSS, JavaScript, and modern frameworks like React or Vue.",
        traits = ["creative", "visual", "user-centric", "detail-oriented", "responsive", "aesthetic"],
        categories = ["development", "web"],
        keywords = ["UI", "user interface", "React", "CSS", "design", "visual", "interactive", "responsive"],
    )
)
