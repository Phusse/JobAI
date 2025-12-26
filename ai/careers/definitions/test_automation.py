from registry import register_career
from models import Career


TEST_AUTOMATION = register_career(
    Career(
        id = "test-automation",
        title = "Test Automation Engineer",
        description = "Automates testing processes with code. Builds test frameworks and CI/CD integrations.",
        traits = ["testing", "automation", "systematic", "programming", "CI/CD", "frameworks"],
        categories = ["quality", "testing", "automation"],
        keywords = ["automation", "testing", "Selenium", "frameworks", "CI/CD", "scripting", "automated"],
    )
)
