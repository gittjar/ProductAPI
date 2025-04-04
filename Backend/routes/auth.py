from flask import Blueprint, request, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token
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
        'password': hashed_password
    }
    users_collection.insert_one(user)
    return jsonify({'message': 'User registered successfully'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    user = users_collection.find_one({'username': data['username']})
    if user and bcrypt.check_password_hash(user['password'], data['password']):
        access_token = create_access_token(identity=str(user['_id']))
        return jsonify({'message': 'Login successful', 'access_token': access_token}), 200
    return jsonify({'message': 'Invalid credentials'}), 401