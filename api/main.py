from fastapi import FastAPI, HTTPException
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from motor.motor_asyncio import AsyncIOMotorClient
from contextlib import asynccontextmanager
from pydantic import BaseModel 
import os
from dotenv import load_dotenv

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