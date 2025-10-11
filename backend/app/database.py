from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

db_client: AsyncIOMotorClient = None
database = None

async def init_db():
    global db_client, database
    db_client = AsyncIOMotorClient(settings.MONGODB_URI)
    database = db_client[settings.DB_NAME]
    print(f"Connected to MongoDB: {settings.DB_NAME}")

async def close_db():
    global db_client
    if db_client:
        db_client.close()
        print("MongoDB connection closed")

def get_database():
    return database