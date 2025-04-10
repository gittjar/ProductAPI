# utils/manufacturer_service.py
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
    manufacturer = manufacturers_collection.find_one({'_id': ObjectId(manufacturer_id)})
    if manufacturer:
        manufacturer['_id'] = str(manufacturer['_id'])
        manufacturer.pop('user_id', None)  # Safely remove user_id from the response if it exists
        return manufacturer, None
    else:
        return None, 'Manufacturer not found'