from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
from utils.manufacturer_service import (
    get_all_manufacturers,
    get_manufacturer_by_id,
    create_manufacturer,
    update_manufacturer,
    delete_manufacturer
)
from utils.database import manufacturers_collection  # MongoDB collection

manufacturers_bp = Blueprint('manufacturers', __name__)

@manufacturers_bp.route('/manufacturers', methods=['GET'])
def get_manufacturers():
    manufacturers = get_all_manufacturers()
    return jsonify(manufacturers), 200

@manufacturers_bp.route('/manufacturers/<manufacturer_id>', methods=['GET'])
def get_manufacturer(manufacturer_id):
    manufacturer, error = get_manufacturer_by_id(manufacturer_id)
    if error:
        return jsonify({'message': error}), 404
    return jsonify(manufacturer), 200

@manufacturers_bp.route('/manufacturers', methods=['POST'])
@jwt_required()
def create_new_manufacturer():
    data = request.json

    # Check if a manufacturer with the same name (case-insensitive) already exists
    existing_manufacturer = manufacturers_collection.find_one({
        'name': {'$regex': f'^{data["name"]}$', '$options': 'i'}  # Case-insensitive match
    })
    if existing_manufacturer:
        return jsonify({'message': 'Manufacturer with this name already exists.'}), 400

    # Create the new manufacturer
    manufacturer, error = create_manufacturer(data)
    if error:
        return jsonify({'message': error}), 400
    return jsonify(manufacturer), 201

@manufacturers_bp.route('/manufacturers/<manufacturer_id>', methods=['PUT'])
@jwt_required()
def update_existing_manufacturer(manufacturer_id):
    data = request.json

    # Check if the manufacturer exists
    manufacturer = manufacturers_collection.find_one({'_id': ObjectId(manufacturer_id)})
    if not manufacturer:
        return jsonify({'message': 'Manufacturer not found.'}), 404

    # Check if a different manufacturer with the same name (case-insensitive) already exists
    existing_manufacturer = manufacturers_collection.find_one({
        'name': {'$regex': f'^{data["name"]}$', '$options': 'i'},  # Case-insensitive match
        '_id': {'$ne': ObjectId(manufacturer_id)}  # Exclude the current manufacturer
    })
    if existing_manufacturer:
        return jsonify({'message': 'Manufacturer with this name already exists.'}), 400

    # Update the manufacturer
    updated_manufacturer, error = update_manufacturer(manufacturer_id, data)
    if error:
        return jsonify({'message': error}), 400
    return jsonify(updated_manufacturer), 200

@manufacturers_bp.route('/manufacturers/<manufacturer_id>', methods=['DELETE'])
@jwt_required()
def delete_existing_manufacturer(manufacturer_id):
    success, error = delete_manufacturer(manufacturer_id)
    if error:
        return jsonify({'message': error}), 404
    return jsonify({'message': 'Manufacturer deleted successfully'}), 200