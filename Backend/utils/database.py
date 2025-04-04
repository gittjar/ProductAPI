from pymongo import MongoClient
from config import Config

client = MongoClient(Config.MONGO_URI)
db = client.get_database("Webshop")  # Replace "Webshop" with your actual database name
products_collection = db.get_collection("products")
users_collection = db.get_collection("users")