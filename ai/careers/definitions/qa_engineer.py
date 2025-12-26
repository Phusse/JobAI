from registry import register_career
from models import Career


QA_ENGINEER = register_career(
    Career(
        id = "qa-engineer",
        title = "QA Engineer",
        description = "Tests software to ensure quality and find bugs. Creates test plans and performs manual testing.",
        traits = ["testing", "quality-focused", "detail-oriented", "systematic", "breaking-things", "patient"],
        categories = ["quality", "testing"],
        keywords = ["QA", "testing", "quality", "bugs", "test cases", "regression", "manual testing"],
    )
)
