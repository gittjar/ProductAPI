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

@auth_bp.route('/change-password', methods=['PUT'])
@jwt_required()
def change_password():
    try:
        user_id = get_jwt_identity()
        data = request.json
        
        # Validate input
        if not data.get('current_password') or not data.get('new_password'):
            return jsonify({'message': 'Current password and new password are required'}), 400
        
        # Validate password length (minimum 5 characters)
        if len(data['new_password']) < 5:
            return jsonify({'message': 'Password must be at least 5 characters long'}), 400
        
        # Get user from database
        user = users_collection.find_one({'_id': ObjectId(user_id)})
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        # Verify current password
        if not bcrypt.check_password_hash(user['password'], data['current_password']):
            return jsonify({'message': 'Current password is incorrect'}), 401
        
        # Hash new password and update
        hashed_password = bcrypt.generate_password_hash(data['new_password']).decode('utf-8')
        users_collection.update_one(
            {'_id': ObjectId(user_id)},
            {'$set': {'password': hashed_password}}
        )
        
        return jsonify({'message': 'Password changed successfully'}), 200
    except Exception as e:
        return jsonify({'message': 'Error changing password'}), 500