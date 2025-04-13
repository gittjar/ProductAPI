from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from utils.manufacturer_service import (
    get_all_manufacturers,
    get_manufacturer_by_id,
    create_manufacturer,
    update_manufacturer,
    delete_manufacturer
)

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
    data = request.get_json()
    if not data or 'name' not in data:
        return jsonify({'message': 'Name is required'}), 400

    manufacturer, error = create_manufacturer(data)
    if error:
        return jsonify({'message': error}), 400
    return jsonify(manufacturer), 201

@manufacturers_bp.route('/manufacturers/<manufacturer_id>', methods=['PUT'])
@jwt_required()
def update_existing_manufacturer(manufacturer_id):
    data = request.get_json()
    if not data:
        return jsonify({'message': 'Request body is required'}), 400

    updated_manufacturer, error = update_manufacturer(manufacturer_id, data)
    if error:
        return jsonify({'message': error}), 404
    return jsonify(updated_manufacturer), 200

@manufacturers_bp.route('/manufacturers/<manufacturer_id>', methods=['DELETE'])
@jwt_required()
def delete_existing_manufacturer(manufacturer_id):
    success, error = delete_manufacturer(manufacturer_id)
    if error:
        return jsonify({'message': error}), 404
    return jsonify({'message': 'Manufacturer deleted successfully'}), 200