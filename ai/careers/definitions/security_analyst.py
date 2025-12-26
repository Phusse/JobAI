from registry import register_career
from models import Career


SECURITY_ANALYST = register_career(
    Career(
        id = "security-analyst",
        title = "Cybersecurity Analyst",
        description = "Protects systems and networks from cyber threats. Monitors for attacks and responds to incidents.",
        traits = ["security", "risk-aware", "protective", "monitoring", "incident-response", "defensive"],
        categories = ["security", "operations"],
        keywords = ["security", "threats", "protection", "monitoring", "incidents", "defense", "cyber"],
    )
)
