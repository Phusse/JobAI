from registry import register_career
from models import Career


SRE = register_career(
    Career(
        id = "sre",
        title = "Site Reliability Engineer",
        description = "Ensures systems are reliable, scalable, and efficient. Focuses on uptime, incident response, and automation.",
        traits = ["reliable", "monitoring", "incident-response", "automation", "performance", "on-call"],
        categories = ["infrastructure", "operations"],
        keywords = ["reliability", "uptime", "SLA", "monitoring", "incidents", "on-call", "automation"],
    )
)
