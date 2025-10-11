import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import certifi

load_dotenv()  # Load .env file

MONGO_URL = os.getenv("MONGO_URL")  # read the value
client = AsyncIOMotorClient(MONGO_URL,tls=True,tlsAllowInvalidCertificates=True,tlsCAFile=certifi.where())
db = client["db"]
goal_collection = db["goals"]
print(db.list_collection_names())