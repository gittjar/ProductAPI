# routes/products.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from utils.product_service import get_all_products, add_new_product, update_existing_product, delete_existing_product, get_product_by_id

products_bp = Blueprint('products', __name__)


@products_bp.route('/products', methods=['GET'])
def get_products():
    products = get_all_products()
    return jsonify(products)

@products_bp.route('/products/<product_id>', methods=['GET'])
def get_product(product_id):
    product, error = get_product_by_id(product_id)
    if error:
        return jsonify({'message': error}), 404
    return jsonify(product), 200

@products_bp.route('/products', methods=['POST'])
@jwt_required()
def add_product():
    data = request.json
    user_id = get_jwt_identity()
    product_id = add_new_product(data, user_id)
    return jsonify({'_id': product_id}), 201

@products_bp.route('/products/<product_id>', methods=['PUT'])
@jwt_required()
def update_product(product_id):
    data = request.json
    user_id = get_jwt_identity()
    updated_product, error = update_existing_product(product_id, data, user_id)

    if error:
        return jsonify({'message': error}), 404 if error == 'Product not found' else 403

    return jsonify({'message': 'Product updated successfully'}), 200

@products_bp.route('/products/<product_id>', methods=['DELETE'])
@jwt_required()
def delete_product(product_id):
    user_id = get_jwt_identity()
    error = delete_existing_product(product_id, user_id)

    if error:
        return jsonify({'message': error}), 404 if error == 'Product not found' else 403

    return jsonify({'message': 'Product deleted successfully'}), 200