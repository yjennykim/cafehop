from fastapi import Body, FastAPI, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from motor.motor_asyncio import AsyncIOMotorClient
from contextlib import asynccontextmanager
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from models import Cafe, CafeHopAttributes
from bson import ObjectId
from typing import List, Optional
import requests
import json
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Start the database connection
    await startup_db_client(app)
    yield
    # Close the database connection
    await shutdown_db_client(app)


# start the MongoDb Connection
async def startup_db_client(app):
    uri = os.getenv("MONGODB_URI")
    if uri is None:
        print("MongoDB URI not found in environment variables.")
        return

    app.mongodb_client = AsyncIOMotorClient(uri)
    app.mongodb = app.mongodb_client.get_database("cafe-hop")

    try:
        await app.mongodb_client.admin.command("ping")
        print("MongoDB connected.")
    except Exception as e:
        print(f"MongoDB connection failed: {e}")


# close the database connection
async def shutdown_db_client(app):
    app.mongodb_client.close()
    print("Database disconnected.")


limiter = Limiter(key_func=get_remote_address)
app = FastAPI(
    title="Cafe Hop API",
    description="API for discovering work-friendly cafes in the city",
    version="1.0.0",
    contact={"name": "Jenny Kim", "email": "jennykimcode+cafe-hop@gmail.com"},
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


# hello world endpoint
@app.get("/")
def read_root():
    return {"Hello": "World"}


# get a cafe by Id
@app.get("/v1/get-cafe/{id}", response_model=Cafe)
@limiter.limit("5/minute")
async def get_cafe_by_id(request: Request, id: str):
    cafe = await app.mongodb["cafes"].find_one({"_id": ObjectId(id)})
    if cafe is None:
        raise HTTPException(status_code=404, detail="Cafe not found")
    return cafe


# get list of cafes
@app.get("/v1/get-cafes", response_model=List[Cafe])
@limiter.limit("5/minute")
async def get_cafes(
    request: Request,
    hasWifi: Optional[bool] = Query(None, description="Filter by wifi availability"),
    hasOutlets: Optional[bool] = Query(
        None, description="Filter by outlets availability"
    ),
    neighborhood: Optional[str] = Query(None, description="Filter by neighborhood"),
    spacious_level: Optional[int] = Query(
        None, ge=1, le=5, description="Spaciousness level at least (1-5)"
    ),
    comfort_level: Optional[int] = Query(
        None, ge=1, le=5, description="Comfort level at least (1-5)"
    ),
    seating_level: Optional[int] = Query(
        None, ge=1, le=5, description="Seating level at least (1-5)"
    ),
):
    filters = {}

    if hasWifi is not None:
        filters["cafe_hop_attributes.wifi"] = hasWifi

    if hasOutlets is not None:
        filters["cafe_hop_attributes.outlets"] = hasOutlets

    if neighborhood:
        filters["cafe_hop_attributes.neighborhood"] = neighborhood

    if spacious_level is not None:
        filters["cafe_hop_attributes.spacious_level"] = spacious_level

    if seating_level is not None:
        filters["cafe_hop_attributes.seating_level"] = seating_level

    if comfort_level is not None:
        filters["cafe_hop_attributes.comfort_level"] = comfort_level

    cafes = await app.mongodb["cafes"].find(filters).to_list(100)

    return cafes


# create a new cafe
@app.post("/v1/create-cafe", response_model=Cafe)
@limiter.limit("5/minute")
async def create_cafe(
    request: Request,
    name: str = Body(..., description="Name of the cafe"),
    address: str = Body(..., description="Address of the cafe"),
    display_phone: Optional[str] = Body(None, description="Phone number of the cafe"),
    business_hours: Optional[List[dict]] = Body(None, description="Business hours"),
    is_closed: bool = Body(False, description="If the cafe is closed"),
    cafe_hop_attributes: Optional[CafeHopAttributes] = Body(
        None, description="Additional cafe attributes"
    ),
):
    cafe = Cafe(
        name=name,
        address=address,
        display_phone=display_phone,
        business_hours=business_hours,
        is_closed=is_closed,
        cafe_hop_attributes=cafe_hop_attributes,
    )

    response = await app.mongodb["cafes"].insert_one(
        cafe.dict(by_alias=True, exclude={"id"})
    )
    cafe.id = str(response.inserted_id)
    print(f"Response from mongodb {response}")

    return cafe
