import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../services/api';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Product {
  _id: string;
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
  updated_at: string;
  user_id: string;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts().then(response => {
      setProducts(response.data);
    }).catch(error => {
      console.error('There was an error fetching the products!', error);
    });
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Product List</h1>
      <div className="table-responsive">
        <table className="table table-bordered table-striped table-hover">
          <thead className="thead-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Manufacturer</th>
              <th scope="col">Category</th>
              <th scope="col">Price</th>
              <th scope="col">In Stock</th>
              <th scope="col">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product._id}>
                <th scope="row">{index + 1}</th>
                <td><Link to={`/product/${product._id}`}>{product.name}</Link></td>
                <td>{product.manufacturer}</td>
                <td>{product.category}</td>
                <td>{product.price}</td>
                <td>{product.varastossa ? 'Yes' : 'No'}</td>
                <td>{product.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;