from pydantic import BaseModel # validates the types of the fields
from typing import Optional, List
class CafeHopAttributes(BaseModel):
    wifi: bool
    outlets: bool
    neighborhood: str
    spacious_level: int
    comfort_level: int
    seating_level: int
class Cafe(BaseModel):
    id: Optional[str] = None
    business_hours: Optional[List[dict]]  # business hours as a list of dicts
    display_phone: Optional[str]
    is_closed: bool
    address: Optional[str]
    rating: Optional[float]
    yelp_url: Optional[str]
    cafe_hop_attributes: Optional[CafeHopAttributes]
    
class UpdateCafeHopAttributesDTO(BaseModel):
    wifi: Optional[bool] = None
    outlets: Optional[bool] = None
    neighborhood: Optional[str] = None
    spacious_level: Optional[int] = None
    comfort_level: Optional[int] = None
    seating_level: Optional[int] = None
    cafe_hop_attributes: Optional[CafeHopAttributes] = None
