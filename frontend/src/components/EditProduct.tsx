import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, updateProduct } from '../services/api';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Product {
  name: string;
  manufacturer: string;
  category: string;
  price: number;
  description: string;
  images: string[];
  mainmaterial: string;
  os: string;
  varastossa: boolean;
  quantity: number;
}

const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product>({
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

  useEffect(() => {
    if (id) {
      getProductById(id).then(response => {
        setProduct(response.data);
      }).catch(error => {
        console.error('There was an error fetching the product!', error);
      });
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      try {
        await updateProduct(id, product);
        navigate('/');
      } catch (error) {
        console.error('There was an error updating the product!', error);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Edit Product</h1>
      <form onSubmit={handleSubmit}>
        {/* Add form fields for product properties */}
        <button type="submit" className="btn btn-primary mt-3">Update</button>
      </form>
    </div>
  );
};

export default EditProduct;