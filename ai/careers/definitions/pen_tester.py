from registry import register_career
from models import Career


PEN_TESTER = register_career(
    Career(
        id = "pen-tester",
        title = "Penetration Tester",
        description = "Ethically hacks systems to find vulnerabilities before malicious actors do. Tests security defenses.",
        traits = ["security", "vulnerability-focused", "offensive", "creative", "breaking-things", "investigative"],
        categories = ["security", "offensive"],
        keywords = ["penetration", "hacking", "vulnerabilities", "testing", "offensive", "exploits", "red team"],
    )
)
