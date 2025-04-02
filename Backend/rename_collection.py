from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Connect to MongoDB using the connection string from the .env file
client = MongoClient(os.getenv("MONGO_URI"))
db = client.get_database("Webshop")  # Replace "Webshop" with your actual database name

# Rename the collection
db.Products.rename("products")

print("Collection renamed from 'Products' to 'products'")