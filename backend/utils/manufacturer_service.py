from bson import ObjectId
from datetime import datetime
from utils.database import manufacturers_collection

def get_all_manufacturers():
    manufacturers = list(manufacturers_collection.find())
    for manufacturer in manufacturers:
        manufacturer['_id'] = str(manufacturer['_id'])
        manufacturer.pop('user_id', None)  # Safely remove user_id from the response if it exists
    return manufacturers

def get_manufacturer_by_id(manufacturer_id):
    try:
        manufacturer = manufacturers_collection.find_one({'_id': ObjectId(manufacturer_id)})
        if manufacturer:
            manufacturer['_id'] = str(manufacturer['_id'])
            manufacturer.pop('user_id', None)  # Safely remove user_id from the response if it exists
            return manufacturer, None
        else:
            return None, 'Manufacturer not found'
    except Exception:
        return None, 'Invalid manufacturer ID'

def create_manufacturer(data):
    try:
        new_manufacturer = {
            'name': data['name'],
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        result = manufacturers_collection.insert_one(new_manufacturer)
        new_manufacturer['_id'] = str(result.inserted_id)
        return new_manufacturer, None
    except Exception as e:
        return None, str(e)

def update_manufacturer(manufacturer_id, data):
    try:
        update_data = {
            'updated_at': datetime.utcnow()
        }
        if 'name' in data:
            update_data['name'] = data['name']

        result = manufacturers_collection.update_one(
            {'_id': ObjectId(manufacturer_id)},
            {'$set': update_data}
        )
        if result.matched_count == 0:
            return None, 'Manufacturer not found'

        updated_manufacturer = manufacturers_collection.find_one({'_id': ObjectId(manufacturer_id)})
        updated_manufacturer['_id'] = str(updated_manufacturer['_id'])
        updated_manufacturer.pop('user_id', None)  # Safely remove user_id from the response if it exists
        return updated_manufacturer, None
    except Exception:
        return None, 'Invalid manufacturer ID'

def delete_manufacturer(manufacturer_id):
    try:
        result = manufacturers_collection.delete_one({'_id': ObjectId(manufacturer_id)})
        if result.deleted_count == 0:
            return False, 'Manufacturer not found'
        return True, None
    except Exception:
        return False, 'Invalid manufacturer ID'