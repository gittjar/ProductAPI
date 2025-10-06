import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, deleteProduct } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { getCurrentUserId, isCurrentUserAdmin } from '../utils/auth';
import ConfirmationDeleteProduct from '../modals/ConfirmationDeleteProduct';
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

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { isLoggedIn } = useAuth();
  const currentUserId = getCurrentUserId();
  const isAdmin = isCurrentUserAdmin();

  const placeholderImage = 'https://placehold.co/600x400/white/gray?text=No+Image+uploaded';

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const productResponse = await getProductById(id ?? '');
        setProduct(productResponse.data);
        setSelectedImage(productResponse.data.images[0] || placeholderImage);
      } catch (error) {
        console.error('There was an error fetching the product!', error);
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, placeholderImage]);

  const canUserModifyProduct = (): boolean => {
    if (!isLoggedIn || !currentUserId || !product) return false;
    // User can modify if they own the product OR if they are an admin
    return product.user_id === currentUserId || isAdmin;
  };

  if (loading) {
    return (
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="alert alert-warning" role="alert">
          Product not found
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!product) return;

    try {
      await deleteProduct(product._id);
      console.log(`Product ${product.name} deleted successfully`);
      setShowDeleteModal(false);
      navigate('/products');
    } catch (error) {
      console.error('Error deleting the product:', error);
      setShowDeleteModal(false);
      
      // Handle specific error messages
      if ((error as any).response?.status === 403) {
        setError('You are not authorized to delete this product. Only the owner or admin can delete it.');
      } else if ((error as any).response?.status === 401) {
        setError('Your session has expired. Please log in again.');
      } else if ((error as any).response?.data?.message) {
        setError((error as any).response.data.message);
      } else {
        setError('Failed to delete the product. Please try again.');
      }
    }
  };

  const handleClose = () => {
    setShowDeleteModal(false);
  };

  return (
    <div className="container d-flex justify-content-center align-items-center mb-4" style={{ marginTop: '100px' }}>
    <div className={`card ${product.varastossa && product.quantity > 0 ? 'border-success' : 'border-danger'} rounded`} style={{ maxWidth: '600px', width: '100%' }}>
      
      {error && (
        <div className="alert alert-danger m-3 mb-0" role="alert">
          {error}
        </div>
      )}
      
      {selectedImage ? (
        <div style={{ height: '400px', overflow: 'hidden' }}>
          <img
            src={selectedImage}
            className="card-img-top"
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(event) => {
              event.currentTarget.src = placeholderImage; // Replace main image with placeholder
            }}
          />
        </div>
      ) : (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{
            height: '400px',
            backgroundColor: '#f8f9fa',
            color: '#6c757d',
            fontSize: '18px',
            fontStyle: 'italic',
          }}
        >
          No image available
        </div>
      )}
      <div className="card-body" style={{ padding: '0' }}>
        <h5 className="card-title mb-4 mt-4 text-center" style={{ margin: '10px 0' }}>{product.name}</h5>
        {product.images.filter((image) => image.trim() !== '').length > 0 ? (
          <div className="d-flex flex-wrap justify-content-center mb-2">
            {product.images
              .filter((image) => image.trim() !== '') // Filter out empty strings
              .map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className={`img-thumbnail ${selectedImage === image ? 'border-primary' : ''}`}
                  style={{
                    width: '80px',
                    height: '80px',
                    cursor: 'pointer',
                    objectFit: 'cover',
                    margin: '2px',
                  }}
                  onClick={() => setSelectedImage(image)}
                  onError={(event) => {
                    event.currentTarget.style.display = 'none'; // Hide broken thumbnail
                  }}
                />
              ))}
          </div>
        ) : (
          <p className="text-muted text-center rounded border border-danger m-2 p-2">No images available, please update product and add images.</p>
        )}
        <p className="card-text mb-1 border-bottom" style={{ margin: '0 10px' }}>
          <strong>Manufacturer:</strong> {product.manufacturer?.name || 'Unknown'}
        </p>
        <p className="card-text mb-1 list-group-item" style={{ margin: '0 10px' }}>
          <strong>Category:</strong> {product.category}
        </p>
          
          <p className="card-text mb-1" style={{ margin: '0 10px' }}>
            <strong>Price:</strong> ${product.price}
          </p>
          <p className="card-text mb-1" style={{ margin: '0 10px' }}>
          <strong>Description:</strong> {product.description || 'No description available'}
        </p>
        <p className="card-text mb-1" style={{ margin: '0 10px' }}>
          <strong>Main Material:</strong> {product.mainmaterial || 'Not specified'}
        </p>
        <p className="card-text mb-1" style={{ margin: '0 10px' }}>
          <strong>Operating System:</strong> {product.os}
        </p>
        <p className="card-text mb-1" style={{ margin: '0 10px' }}>
          <strong>In Stock:</strong> {product.varastossa ? 'Yes' : 'No'}
        </p>
        <p className="card-text mb-1" style={{ margin: '0 10px' }}>
          <strong>Quantity:</strong> {product.quantity}
        </p>
        <p className="card-text mb-1 border-top pt-2" style={{ margin: '0 10px' }}>
          <strong>Product Owner:</strong>{' '}
          <span className="badge badge-secondary">
            {product.owner?.username || 'Unknown'}
          </span>
          {product.user_id === currentUserId && (
            <span className="text-success ms-2" title="You own this product">
              <i className="fas fa-user-check"></i> Your Product
            </span>
          )}
          {isAdmin && product.user_id !== currentUserId && (
            <span className="text-warning ms-2" title="Admin access">
              <i className="fas fa-crown"></i> Admin Access
            </span>
          )}
        </p>
        </div>
        <div className="card-footer" style={{ padding: '0', textAlign: 'center' }}>
          <small className="text-body-secondary" style={{ display: 'block', margin: '10px 0' }}>
            Last Updated: {new Date(product.updated_at).toLocaleString()}
          </small>
        </div>
        <div className="d-flex justify-content-center">
          {isLoggedIn && canUserModifyProduct() && (
            <>
              <button
                className="btn btn-primary mt-4 mx-2 mb-4"
                onClick={() => navigate(`/edit-product/${product._id}`)}
                title={product.user_id === currentUserId ? "Edit your product" : "Edit as admin"}
              >
                <i className="fas fa-edit me-1"></i>
                Edit Product
              </button>
              <button
                className="btn btn-danger mt-4 mx-2 mb-4"
                onClick={handleDelete}
                title={product.user_id === currentUserId ? "Delete your product" : "Delete as admin"}
              >
                <i className="fas fa-trash me-1"></i>
                Delete Product
              </button>
            </>
          )}
          {isLoggedIn && !canUserModifyProduct() && (
            <div className="mt-4 mx-2 mb-4">
              <span className="text-muted" title="Only the owner or admin can modify this product">
                <i className="fas fa-lock me-1"></i>
                This product is protected - only the owner or admin can modify it
              </span>
            </div>
          )}
          <button
            className="btn btn-secondary mt-4 mx-2 mb-4"
            onClick={() => window.history.back()}
          >
            <i className="fas fa-arrow-left me-1"></i>
            Back to Product List
          </button>
        </div>
        <ConfirmationDeleteProduct
          show={showDeleteModal}
          onClose={handleClose}
          onConfirm={handleConfirmDelete}
          productName={product.name}
        />
      </div>
    </div>
  );
};

export default ProductDetail;