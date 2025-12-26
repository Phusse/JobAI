from registry import register_career
from models import Career


ML_ENGINEER = register_career(
    Career(
        id = "ml-engineer",
        title = "Machine Learning Engineer",
        description = "Deploys and scales machine learning models in production. Bridges data science and software engineering.",
        traits = ["mathematical", "systems-thinking", "optimization", "scalable", "production", "MLOps"],
        categories = ["data", "engineering", "AI"],
        keywords = ["ML", "machine learning", "models", "deployment", "training", "AI", "neural networks"],
    )
)
