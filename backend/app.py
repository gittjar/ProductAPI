from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from routes.auth import auth_bp
from routes.products import products_bp
from routes.manufacturers import manufacturers_bp

app = Flask(__name__)
app.config.from_object(Config)
# Allow CORS from both localhost and production frontend
CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "https://productapi-frontend-7ogm.onrender.com"]}})

jwt = JWTManager(app)

app.register_blueprint(auth_bp)
app.register_blueprint(products_bp)
app.register_blueprint(manufacturers_bp)

@app.route('/')
def home():
    return "Welcome to the Webshop API!"

if __name__ == '__main__':
    app.run(debug=True)