from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from motor.motor_asyncio import AsyncIOMotorClient
from contextlib import asynccontextmanager
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from models import Cafe, UpdateCafeHopAttributesDTO, CafeHopAttributes
from bson import ObjectId
from typing import List
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
    description="API for discovering work-friendly cafes in Seattle",
    version="1.0.0",
    contact={"name": "Jenny Kim", "email": "jennykimcode@gmail.com"},
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


@app.get("/v1/get-cafe/{id}", response_model=Cafe)
async def get_cafe_by_id(id: str):
    cafe = await app.mongodb["cafes"].find_one({"_id": ObjectId(id)})
    if cafe is None:
        raise HTTPException(status_code=404, detail="Cafe not found")
    return cafe


@app.put("/v1/update-cafe/{id}", response_model=Cafe)
async def update_cafe(id: str, cafe_update: UpdateCafeHopAttributesDTO):
    updated_result = await app.mongodb["cafes"].update_one(
        {"_id": ObjectId(id)},
        {
            "$set": cafe_update.dict(exclude_unset=True)
        },  # convert to dict, excluding fields that were not provided
    )

    if updated_result.modified_count == 0:
        raise HTTPException(
            status_code=404, detail="Cafe not found or no update was needed"
        )

    updated_cafe = await app.mongodb["cafes"].find_one({"_id": ObjectId(id)})
    return updated_cafe


@app.get("/v1/get-cafes", response_model=List[Cafe])
async def get_cafes(
    hasWifi: bool = Query(
        None, description="Filter by wifi availability", example=True
    ),
    hasOutlets: bool = Query(
        None, description="Filter by outlets availability", example=True
    ),
    neighborhood: str = Query(
        None, description="Filter by neighborhood", example="Capitol Hlil"
    ),
    spacious_level: int = Query(
        None, description="Spaciousness level at least (1-5)", example="4"
    ),
    comfort_level: int = Query(
        None, description="Comfort level at least (1-5)", example="4"
    ),
    seating_level: int = Query(
        None, description="Spaciousness level at least (1-5)", example="4"
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


@app.post("/v1/create-cafe", response_model=Cafe)
async def create_cafe(yelp_id: str, cafe_hop_attributes: CafeHopAttributes):
    print("Custom attributes", cafe_hop_attributes)

    yelp_data = await get_cafe_by_yelp_id(yelp_id)
    print("Yelp data fetched", yelp_data)

    cafe = Cafe(
        yelp_id=yelp_id,
        name=yelp_data["name"],
        address=", ".join(yelp_data["location"]["display_address"]),
        rating=yelp_data.get("rating", 0),
        display_phone=yelp_data.get("display_phone", ""),
        business_hours=yelp_data.get("hours", []),
        is_closed=yelp_data.get("is_closed", False),
        yelp_url=yelp_data.get("url", ""),
        cafe_hop_attributes=cafe_hop_attributes,
    )

    print("Inserting cafe", cafe)
    response = await app.mongodb["cafes"].insert_one(cafe.dict(by_alias=True))
    cafe.id = str(response.inserted_id)
    return cafe


@app.get("/v1/get-yelp-cafes/{search}")
@limiter.limit("5/hour")
async def search_yelp_for_cafes(request: Request, search: str):
    yelp_url = "https://api.yelp.com/v3/businesses/search"
    yelp_headers = {
        "Authorization": f"Bearer {os.getenv("YELP_API_KEY")}",
        "accept": "application/json",
    }
    yelp_search_params = {
        "term": search,
        "location": "Seattle",
        "sort_by": "best_match",
        "limit": 10,
    }

    response = requests.get(yelp_url, headers=yelp_headers, params=yelp_search_params)
    if response.status_code != 200:
        print(
            f"GET request failed with status code: {response.status_code}",
            response.text,
        )
        return response.json()

    data = response.json()
    print("Yelp search for businesses response", data)

    return data


@app.get("/v1/get-yelp-cafe/{id}")
@limiter.limit("10/hour")
async def get_cafe_by_yelp_id(request: Request, id: str):
    yelp_url = f"https://api.yelp.com/v3/businesses/{id}"
    yelp_headers = {
        "Authorization": f"Bearer {os.getenv("YELP_API_KEY")}",
        "accept": "application/json",
    }

    response = requests.get(yelp_url, headers=yelp_headers)
    if response.status_code != 200:
        print(
            f"GET request failed with status code: {response.status_code}",
            response.text,
        )
        return response.json()

    data = response.json()
    print("Yelp search business by ID response", data)

    return data
