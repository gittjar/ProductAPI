from bson import ObjectId
from datetime import datetime
from utils.database import products_collection, manufacturers_collection


def get_all_products():
    products = products_collection.find()
    all_products = []
    for product in products:
        # Convert ObjectId to string
        product['_id'] = str(product['_id'])
        if 'manufacturer' in product and ObjectId.is_valid(product['manufacturer']):
            manufacturer = manufacturers_collection.find_one({"_id": ObjectId(product['manufacturer'])})
            if manufacturer:
                product['manufacturer'] = {
                    "_id": str(manufacturer['_id']),
                    "name": manufacturer['name']
                }
        all_products.append(product)
    return all_products


def get_product_by_id(product_id):
    product = products_collection.find_one({'_id': ObjectId(product_id)})
    if product:
        # Convert ObjectId to string
        product['_id'] = str(product['_id'])
        product.pop('user_id', None)  # Safely remove user_id from the response if it exists

        # Fetch manufacturer details
        if 'manufacturer' in product and ObjectId.is_valid(product['manufacturer']):
            manufacturer = manufacturers_collection.find_one({"_id": ObjectId(product['manufacturer'])})
            if manufacturer:
                product['manufacturer'] = {
                    "_id": str(manufacturer['_id']),
                    "name": manufacturer['name']
                }
        return product, None
    else:
        return None, 'Product not found'


def add_new_product(data, user_id):
    current_time = datetime.utcnow()
    product = {
        "name": data['name'],
        "manufacturer": data['manufacturer'],  # Expecting manufacturer as an ObjectId string
        "category": data['category'],
        "price": data['price'],
        "description": data['description'],
        "images": data['images'],
        "mainmaterial": data['mainmaterial'],
        "os": data['os'],
        "varastossa": data['varastossa'],
        "quantity": data['quantity'],
        "created_at": current_time,
        "updated_at": current_time,
        "user_id": user_id  # Store the user ID with the product
    }
    result = products_collection.insert_one(product)
    return str(result.inserted_id)


def update_existing_product(product_id, data, user_id):
    product = products_collection.find_one({"_id": ObjectId(product_id)})

    if not product:
        return None, 'Product not found'

    if product['user_id'] != user_id:
        return None, 'Unauthorized'

    updated_product = {
        "name": data.get('name', product['name']),
        "manufacturer": data.get('manufacturer', product['manufacturer']),  # Expecting manufacturer as an ObjectId string
        "category": data.get('category', product['category']),
        "price": data.get('price', product['price']),
        "description": data.get('description', product['description']),
        "images": data.get('images', product['images']),
        "mainmaterial": data.get('mainmaterial', product['mainmaterial']),
        "os": data.get('os', product['os']),
        "varastossa": data.get('varastossa', product['varastossa']),
        "quantity": data.get('quantity', product['quantity']),
        "updated_at": datetime.utcnow(),  # Update the timestamp to the current time
        "user_id": user_id  # Ensure the user ID remains the same
    }

    products_collection.update_one({"_id": ObjectId(product_id)}, {"$set": updated_product})
    return updated_product, None


def delete_existing_product(product_id, user_id):
    product = products_collection.find_one({"_id": ObjectId(product_id)})

    if not product:
        return 'Product not found'

    if product['user_id'] != user_id:
        return 'Unauthorized'

    products_collection.delete_one({"_id": ObjectId(product_id)})
    return None