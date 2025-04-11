import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById, getManufacturers } from '../services/api';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Product {
  _id: string;
  name: string;
  manufacturer: string; // This will store the manufacturer ID
  category: string;
  price: number;
  description: string;
  images: string[];
  mainmaterial: string;
  os: string;
  varastossa: boolean;
  quantity: number;
  updated_at: string;
  user_id: string;
}

interface Manufacturer {
  _id: string;
  name: string;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [manufacturerName, setManufacturerName] = useState<string>('Loading...');

  useEffect(() => {
    // Fetch product details
    const fetchProduct = async () => {
      try {
        const productResponse = await getProductById(id ?? '');
        setProduct(productResponse.data);

        // Fetch manufacturers and map the manufacturer ID to its name
        const manufacturersResponse = await getManufacturers();
        const manufacturers: Manufacturer[] = manufacturersResponse.data;

        const manufacturer = manufacturers.find(
          (m) => m._id === productResponse.data.manufacturer
        );
        setManufacturerName(manufacturer ? manufacturer.name : 'Unknown');
      } catch (error) {
        console.error('There was an error fetching the product or manufacturers!', error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">{product.name}</h1>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Manufacturer: {manufacturerName}</h5>
          <img src={product.images[0]} alt={product.name} className="card-img-top" />
          <p className="card-text">ID: {product._id}</p>
          <p className="card-text">Category: {product.category}</p>
          <p className="card-text">Price: ${product.price}</p>
          <p className="card-text">Description: {product.description}</p>
          <p className="card-text">Main Material: {product.mainmaterial}</p>
          <p className="card-text">Operating System: {product.os}</p>
          <p className="card-text">In Stock: {product.varastossa ? 'Yes' : 'No'}</p>
          <p className="card-text">Quantity: {product.quantity}</p>
          <p className="card-text">Last Updated: {new Date(product.updated_at).toLocaleString()}</p>
        </div>
      </div>
      <button className="btn btn-primary mt-4" onClick={() => window.history.back()}>
        Back to Product List
      </button>
    </div>
  );
};

export default ProductDetail;