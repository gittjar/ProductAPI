import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, getManufacturers } from '../services/api';
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

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [manufacturerMap, setManufacturerMap] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    // Fetch products and manufacturers
    const fetchData = async () => {
      try {
        // Fetch products
        const productsResponse = await getProducts();
        setProducts(productsResponse.data);

        // Fetch manufacturers
        const manufacturersResponse = await getManufacturers();
        const manufacturers: Manufacturer[] = manufacturersResponse.data;

        // Create a mapping of manufacturer IDs to names
        const map: { [key: string]: string } = {};
        manufacturers.forEach((manufacturer) => {
          map[manufacturer._id] = manufacturer.name;
        });
        setManufacturerMap(map);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
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
                <td>{manufacturerMap[product.manufacturer] || 'Unknown'}</td>
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