from models import Career


CAREER_REGISTRY: dict[str, Career] = {}


def register_career(career: Career) -> Career:
    """
    Registers a Career in the registry.
    Raises an error if a career with the same id already exists.
    """
    if career.id in CAREER_REGISTRY:
        raise ValueError(f"Duplicate career ID detected: '{career.id}'. Each career must have a unique ID.")

    CAREER_REGISTRY[career.id] = career
    return career


def get_career_by_id(career_id: str) -> Career | None:
    """Retrieve a career by its ID."""
    return CAREER_REGISTRY.get(career_id)


def get_all_careers() -> list[Career]:
    """Return a list of all registered careers."""
    return list(CAREER_REGISTRY.values())


def get_career_by_trait(trait: str) -> list[Career]:
    """Retrieve all careers that have a specific trait."""
    return [career for career in CAREER_REGISTRY.values() if trait in career.traits]


def get_career_by_category(category: str) -> list[Career]:
    """Retrieve all careers that belong to a specific category."""
    return [career for career in CAREER_REGISTRY.values() if category in career.categories]


def career_to_embedding_text(career: Career, include_traits: bool = True, include_keywords: bool = True) -> str:
    """
    Generate a text representation of a Career for embeddings or semantic search.
    Combines the career's title, description, and optionally traits and keywords.

    Args:
        career (Career): The Career object to convert.
        include_traits (bool): Whether to include traits in the output.
        include_keywords (bool): Whether to include keywords in the output.

    Returns:
        str: A concatenated text suitable for embeddings or search.
    """
    parts = [career.title, career.description]

    if include_traits and career.traits:
        parts.append("Traits: " + ", ".join(career.traits))

    if include_keywords and career.keywords:
        parts.append("Keywords: " + ", ".join(career.keywords))

    return ". ".join(parts)
