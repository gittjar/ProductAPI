import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProducts, deleteProduct } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { getCurrentUserId, isCurrentUserAdmin } from '../utils/auth';
import LoadingSpinner from './LoadingSpinner';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Product {
  _id: string;
  name: string;
  manufacturer?: {
    _id: string;
    name: string;
  };
  owner?: {
    _id: string;
    username: string;
  };
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { isLoggedIn } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const currentUserId = getCurrentUserId();
  const isAdmin = isCurrentUserAdmin();

  useEffect(() => {
    // Fetch products
    const fetchData = async () => {
      setLoading(true);
      try {
        const productsResponse = await getProducts();
        setProducts(productsResponse.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (productId: string) => {
    navigate(`/edit-product/${productId}`);
  };

  const handleDelete = async (productId: string, productName: string) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      try {
        await deleteProduct(productId);
        setProducts(products.filter(product => product._id !== productId));
        showSuccess(`Product "${productName}" deleted successfully!`);
      } catch (error) {
        console.error('Error deleting product:', error);
        const errorMsg = 'Failed to delete product';
        setError(errorMsg);
        showError(errorMsg);
      }
    }
  };

  const canUserModifyProduct = (product: Product): boolean => {
    if (!isLoggedIn || !currentUserId) return false;
    // User can modify if they own the product OR if they are an admin
    return product.user_id === currentUserId || isAdmin;
  };

  if (loading) {
    return <LoadingSpinner message="Loading products..." />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Product List</h1>
      
      {error && (
        <div className="alert alert-danger mb-4" role="alert">
          {error}
        </div>
      )}
      
      <div className="table-responsive">
        <table className="table table-bordered table-striped table-hover">
          <thead className="thead-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Image</th>
              <th scope="col">Name</th>
              <th scope="col">Manufacturer</th>
              <th scope="col">Category</th>
              <th scope="col">Price</th>
              <th scope="col">In Stock</th>
              <th scope="col">Quantity</th>
              <th scope="col">Owner</th>
              {isLoggedIn && <th scope="col">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => {
              // Filter out empty or invalid image URLs
              const validImages = product.images.filter((image) => image.trim() !== '');
              const canModify = canUserModifyProduct(product);

              return (
                <tr key={product._id}>
                  <th scope="row">{index + 1}</th>
                  <td>
                    {validImages.length > 0 ? (
                      <img
                        src={validImages[0]}
                        alt={product.name}
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                        onError={(event) => {
                          event.currentTarget.src = ''; // Fallback if image fails to load
                          event.currentTarget.alt = 'No Image';
                        }}
                      />
                    ) : (
                      'No Image'
                    )}
                  </td>
                  <td>
                    <Link to={`/product/${product._id}`}>{product.name}</Link>
                  </td>
                  <td>{product.manufacturer?.name || 'Unknown'}</td>
                  <td>{product.category}</td>
                  <td>${product.price}</td>
                  <td>{product.varastossa ? 'Yes' : 'No'}</td>
                  <td>{product.quantity}</td>
                  <td>
                    <span className="badge badge-secondary">
                      {product.owner?.username || 'Unknown'}
                    </span>
                    {product.user_id === currentUserId && (
                      <span className="text-success ms-2" title="You own this product">
                        <i className="fas fa-user-check"></i>
                      </span>
                    )}
                    {isAdmin && product.user_id !== currentUserId && (
                      <span className="text-warning ms-2" title="Admin access">
                        <i className="fas fa-crown"></i>
                      </span>
                    )}
                  </td>
                  {isLoggedIn && (
                    <td>
                      {canModify ? (
                        <div className="btn-group" role="group">
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => handleEdit(product._id)}
                            title={product.user_id === currentUserId ? "Edit your product" : "Edit as admin"}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(product._id, product.name)}
                            title={product.user_id === currentUserId ? "Delete your product" : "Delete as admin"}
                          >
                            Delete
                          </button>
                        </div>
                      ) : (
                        <span className="text-muted" title="Only the owner or admin can modify this product">
                          <i className="fas fa-lock"></i> Protected
                        </span>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;