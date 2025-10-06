from flask import Blueprint, request, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from bson import ObjectId
from utils.database import users_collection

auth_bp = Blueprint('auth', __name__)
bcrypt = Bcrypt()

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    if users_collection.find_one({'username': data['username']}):
        return jsonify({'message': 'User already exists'}), 400
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    user = {
        'username': data['username'],
        'password': hashed_password,
        'role': 'user'  # Default role is 'user', can be 'admin' for admin users
    }
    users_collection.insert_one(user)
    return jsonify({'message': 'User registered successfully'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    user = users_collection.find_one({'username': data['username']})
    if user and bcrypt.check_password_hash(user['password'], data['password']):
        # Include user role in the token claims
        additional_claims = {
            'role': user.get('role', 'user'),
            'username': user['username']
        }
        access_token = create_access_token(
            identity=str(user['_id']), 
            additional_claims=additional_claims
        )
        return jsonify({'message': 'Login successful', 'access_token': access_token}), 200
    return jsonify({'message': 'Invalid credentials'}), 401

@auth_bp.route('/user/<user_id>', methods=['GET'])
def get_user(user_id):
    try:
        user = users_collection.find_one({'_id': ObjectId(user_id)})
        if user:
            # Remove password from response
            user.pop('password', None)
            user['_id'] = str(user['_id'])
            return jsonify(user), 200
        return jsonify({'message': 'User not found'}), 404
    except Exception as e:
        return jsonify({'message': 'Invalid user ID'}), 400

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    try:
        user_id = get_jwt_identity()
        user = users_collection.find_one({'_id': ObjectId(user_id)})
        if user:
            # Remove password from response
            user.pop('password', None)
            user['_id'] = str(user['_id'])
            return jsonify(user), 200
        return jsonify({'message': 'User not found'}), 404
    except Exception as e:
        return jsonify({'message': 'Error fetching user data'}), 500