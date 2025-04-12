import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById } from '../services/api';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Product {
  _id: string;
  name: string;
  manufacturer: {
    _id: string;
    name: string;
  }; // Updated to store manufacturer object
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

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    // Fetch product details
    const fetchProduct = async () => {
      try {
        const productResponse = await getProductById(id ?? '');
        setProduct(productResponse.data);
      } catch (error) {
        console.error('There was an error fetching the product!', error);
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
          <h5 className="card-title">Manufacturer: {product.manufacturer?.name || 'Unknown'}</h5>
          {product.images.length > 0 && (
            <img src={product.images[0]} alt={product.name} className="card-img-top" />
          )}
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