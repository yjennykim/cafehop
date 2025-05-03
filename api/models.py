import json
from bson import ObjectId
from pydantic import BaseModel, Field
from typing import Optional, List
from bson import json_util
from pyobjectID import PyObjectId


class CafeHopAttributes(BaseModel):
    wifi: bool
    outlets: bool
    neighborhood: str
    spacious_level: int
    comfort_level: int
    seating_level: int


class Cafe(BaseModel):
    id: ObjectId = Field(alias="_id")
    name: str = Optional[str]
    business_hours: List[dict] = Optional[List[dict]]
    display_phone: str = Optional[str]
    is_closed: bool = Optional[bool]
    address: Optional[str] = None
    rating: Optional[float] = None
    cafe_hop_attributes: Optional[CafeHopAttributes]

    class Config:
        json_encoders = {ObjectId: str}
        arbitrary_types_allowed = True
