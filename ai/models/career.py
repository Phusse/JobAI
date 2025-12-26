from pydantic import BaseModel
from typing import List


class Career(BaseModel):
    id: str
    title: str
    description: str
    traits: List[str]
    categories: List[str]
    keywords: List[str]
