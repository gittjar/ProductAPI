import os
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get MongoDB URI and connect to the database
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client['YOUR_CLUSTER_NAME']  # Replace with your database name if different

# Collections
products_collection = db['products']
manufacturers_collection = db['manufacturers']

# Ensure a default manufacturer exists
default_manufacturer = manufacturers_collection.find_one({"name": "Unknown Manufacturer"})
if not default_manufacturer:
    default_manufacturer_id = manufacturers_collection.insert_one({
        "name": "Unknown Manufacturer"
    }).inserted_id
else:
    default_manufacturer_id = default_manufacturer['_id']

# Update all products to ensure they have a manufacturer field
for product in products_collection.find():
    if 'manufacturer' not in product or not product['manufacturer']:
        products_collection.update_one(
            {"_id": product['_id']},
            {"$set": {"manufacturer": ObjectId(default_manufacturer_id)}}
        )

print("Database updated successfully!")