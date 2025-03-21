from pydantic import BaseModel # validates the types of the fields
from typing import Optional

class Cafe(BaseModel):
    name: str
    wifi: bool
    outlets: bool
    neighborhood: str
    spacious_level: int
    comfort_level: int
    seating_level: int

class UpdateCafeDTO(BaseModel):
    wifi: Optional[bool] = None
    outlets: Optional[bool] = None
    neighborhood: Optional[str] = None
    spacious_level: Optional[int] = None
    comfort_level: Optional[int] = None
    seating_level: Optional[int] = None
    