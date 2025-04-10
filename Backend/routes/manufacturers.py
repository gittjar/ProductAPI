from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from utils.manufacturer_service import get_all_manufacturers, get_manufacturer_by_id

manufacturers_bp = Blueprint('manufacturers', __name__)

@manufacturers_bp.route('/manufacturers', methods=['GET'])
def get_manufacturers():
    manufacturers = get_all_manufacturers()
    return jsonify(manufacturers), 200

@manufacturers_bp.route('/manufacturers/<manufacturer_id>', methods=['GET'])
def get_manufacturer(manufacturer_id):  # Fixed indentation here
    manufacturer, error = get_manufacturer_by_id(manufacturer_id)
    if error:
        return jsonify({'message': error}), 404
    return jsonify(manufacturer), 200