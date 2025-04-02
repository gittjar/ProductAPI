from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from pymongo import MongoClient
from dotenv import load_dotenv
import os
from datetime import timedelta

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
bcrypt = Bcrypt(app)
app.config['JWT_SECRET_KEY'] = os.getenv("JWT_SECRET_KEY")
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)
jwt = JWTManager(app)

# Connect to MongoDB using the connection string from the .env file
client = MongoClient(os.getenv("MONGO_URI"))
db = client.get_database("Webshop")  # Replace "Webshop" with your actual database name
products_collection = db.get_collection("products")
users_collection = db.get_collection("users")

@app.route('/')
def home():
    return "Welcome to the Webshop API!"

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    if users_collection.find_one({'username': data['username']}):
        return jsonify({'message': 'User already exists'}), 400
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    user = {
        'username': data['username'],
        'password': hashed_password
    }
    users_collection.insert_one(user)
    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = users_collection.find_one({'username': data['username']})
    if user and bcrypt.check_password_hash(user['password'], data['password']):
        access_token = create_access_token(identity=str(user['_id']))
        return jsonify({'message': 'Login successful', 'access_token': access_token}), 200
    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/products', methods=['GET'])
def get_products():
    products = list(products_collection.find())
    for product in products:
        product['_id'] = str(product['_id'])
        product.pop('user_id', None)  # Safely remove user_id from the response if it exists
    return jsonify(products)

@app.route('/products', methods=['POST'])
@jwt_required()
def add_product():
    data = request.json
    user_id = get_jwt_identity()
    product = {
        "name": data['name'],
        "manufacturer": data['manufacturer'],
        "category": data['category'],
        "price": data['price'],
        "description": data['description'],
        "images": data['images'],
        "mainmaterial": data['mainmaterial'],
        "os": data['os'],
        "varastossa": data['varastossa'],
        "quantity": data['quantity'],
        "updated_at": data['updated_at'],
        "user_id": user_id  # Store the user ID with the product
    }
    result = products_collection.insert_one(product)
    return jsonify({'_id': str(result.inserted_id)}), 201

if __name__ == '__main__':
    app.run(debug=True)