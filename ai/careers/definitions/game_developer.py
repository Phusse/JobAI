from registry import register_career
from models import Career


GAME_DEVELOPER = register_career(
    Career(
        id = "game-dev",
        title = "Game Developer",
        description = "Creates video games for computers, consoles, and mobile devices. Combines programming with creative storytelling.",
        traits = ["creative", "visual", "storytelling", "physics", "interactive", "immersive"],
        categories = ["development", "game"],
        keywords = ["game", "gaming", "Unity", "Unreal", "3D", "graphics", "interactive", "entertainment"],
    )
)
