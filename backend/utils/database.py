from pymongo import MongoClient
from config import Config

# Use connect=False to delay connection until first operation
# Simple connection without custom SSL context - let pymongo handle it
client = MongoClient(
    Config.MONGO_URI,
    connect=False,
    serverSelectionTimeoutMS=10000,
    connectTimeoutMS=10000,
    socketTimeoutMS=10000
)
db = client.get_database("Webshop")
products_collection = db.get_collection("products")
users_collection = db.get_collection("users")
manufacturers_collection = db.get_collection("manufacturers")