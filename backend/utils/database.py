from pymongo import MongoClient
from config import Config

# Use connect=False to delay connection until first operation
client = MongoClient(
    Config.MONGO_URI,
    connect=False,  # Lazy connection
    serverSelectionTimeoutMS=5000,
    connectTimeoutMS=5000,
    socketTimeoutMS=5000
)
db = client.get_database("Webshop")
products_collection = db.get_collection("products")
users_collection = db.get_collection("users")
manufacturers_collection = db.get_collection("manufacturers")