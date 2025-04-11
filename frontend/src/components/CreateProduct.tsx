import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addProduct, getManufacturers } from '../services/api';
import 'bootstrap/dist/css/bootstrap.min.css';

const CreateProduct: React.FC = () => {
  const [product, setProduct] = useState({
    name: '',
    manufacturer: '', // Stores the manufacturer ID
    category: '',
    price: 0,
    description: '',
    images: [],
    mainmaterial: '',
    os: '',
    varastossa: false,
    quantity: 0,
  });
  const [manufacturers, setManufacturers] = useState<{ _id: string; name: string }[]>([]);
  const [selectedManufacturerName, setSelectedManufacturerName] = useState<string>(''); // Stores the manufacturer name for display
  const navigate = useNavigate();

  // Fetch manufacturers from the API
  useEffect(() => {
    const fetchManufacturers = async () => {
      try {
        const response = await getManufacturers();
        setManufacturers(response.data); // Ensure response.data is an array of objects with _id and name
      } catch (error) {
        console.error('Error fetching manufacturers:', error);
      }
    };

    fetchManufacturers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Update manufacturer name when manufacturer ID is selected
    if (name === 'manufacturer') {
      const selectedManufacturer = manufacturers.find((m) => m._id === value);
      setSelectedManufacturerName(selectedManufacturer ? selectedManufacturer.name : '');
    }

    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addProduct(product); // Send the product object with manufacturer ID to the API
      navigate('/');
    } catch (error) {
      console.error('There was an error creating the product!', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Create Product</h1>
      <form onSubmit={handleSubmit}>

        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={product.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Manufacturer</label>
          <select
            className="form-control"
            name="manufacturer"
            value={product.manufacturer}
            onChange={handleChange}
          >
            <option value="">Select Manufacturer</option>
            {manufacturers.map((manufacturer) => (
              <option key={manufacturer._id} value={manufacturer._id}>
                {manufacturer.name}
              </option>
            ))}
          </select>
          {selectedManufacturerName && (
            <small className="form-text text-muted">Selected: {selectedManufacturerName}</small>
          )}
        </div>

        <button type="submit" className="btn btn-primary mt-3">Create</button>
      </form>
    </div>
  );
};

export default CreateProduct;