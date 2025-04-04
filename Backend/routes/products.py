from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from utils.database import products_collection

products_bp = Blueprint('products', __name__)

@products_bp.route('/products', methods=['GET'])
def get_products():
    products = list(products_collection.find())
    for product in products:
        product['_id'] = str(product['_id'])
        product.pop('user_id', None)  # Safely remove user_id from the response if it exists
    return jsonify(products)

@products_bp.route('/products', methods=['POST'])
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