import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addProduct } from '../services/api';
import 'bootstrap/dist/css/bootstrap.min.css';

const CreateProduct: React.FC = () => {
  const [product, setProduct] = useState({
    name: '',
    manufacturer: '',
    category: '',
    price: 0,
    description: '',
    images: [],
    mainmaterial: '',
    os: '',
    varastossa: false,
    quantity: 0,
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addProduct(product);
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

        <button type="submit" className="btn btn-primary mt-3">Create</button>
      </form>
    </div>
  );
};

export default CreateProduct;