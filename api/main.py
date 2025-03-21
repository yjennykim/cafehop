from fastapi import FastAPI, HTTPException
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from motor.motor_asyncio import AsyncIOMotorClient
from contextlib import asynccontextmanager
from pydantic import BaseModel 
import os
from dotenv import load_dotenv
from models import Cafe, UpdateCafeDTO
from bson import ObjectId

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
        await app.mongodb_client.admin.command('ping')
        print("MongoDB connected.")
    except Exception as e:
        print(f"MongoDB connection failed: {e}")


# close the database connection
async def shutdown_db_client(app):
    app.mongodb_client.close()
    print("Database disconnected.")

app = FastAPI(lifespan=lifespan)

# hello world endpoint
@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/v1/get-cafe/{id}", response_model=Cafe)
async def get_cafe_by_id(id: str):
    cafe = await app.mongodb["cafes"].find_one({
        "_id": ObjectId(id)
    })
    if cafe is None:
        raise HTTPException(status_code=404, detail="Cafe not found")
    return cafe

@app.put("/v1/update-cafe/{id}", response_model=Cafe)
async def update_cafe(id: str, cafe_update: UpdateCafeDTO):
    updated_result = await app.mongodb["cafes"].update_one(
        {"_id": ObjectId(id)}, 
        {"$set": cafe_update.dict(exclude_unset=True, exclude={"name"})} # convert to dict, excluding fields that were not provided 
    )

    if updated_result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Cafe not found or no update was needed")
    
    updated_cafe = await app.mongodb["cafes"].find_one({"_id": ObjectId(id)})
    return updated_cafe

