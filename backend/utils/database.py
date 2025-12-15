from pymongo import MongoClient
from config import Config
import certifi
import ssl

# Use connect=False to delay connection until first operation
# Create SSL context that's more permissive for cloud environments
ssl_context = ssl.create_default_context(cafile=certifi.where())
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_NONE

client = MongoClient(
    Config.MONGO_URI,
    connect=False,  # Lazy connection
    tls=True,
    tlsAllowInvalidCertificates=True,
    tlsAllowInvalidHostnames=True,
    serverSelectionTimeoutMS=10000,
    connectTimeoutMS=10000,
    socketTimeoutMS=10000
)
db = client.get_database("Webshop")
products_collection = db.get_collection("products")
users_collection = db.get_collection("users")
manufacturers_collection = db.get_collection("manufacturers")