import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, deleteProduct } from '../services/api';
import ConfirmationDeleteProduct from '../modals/ConfirmationDeleteProduct';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Product {
  _id: string;
  name: string;
  manufacturer?: {
    _id: string;
    name: string;
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

  const placeholderImage = 'https://placehold.co/600x400/white/gray?text=No+Image+uploaded';

  // Check if the user is authenticated
  const isAuthenticated = !!localStorage.getItem('token');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productResponse = await getProductById(id ?? '');
        setProduct(productResponse.data);
        setSelectedImage(productResponse.data.images[0] || placeholderImage);
      } catch (error) {
        console.error('There was an error fetching the product!', error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return <div>Loading...</div>;
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
      alert('Failed to delete the product. Please try again.');
    }
  };

  const handleClose = () => {
    setShowDeleteModal(false);
  };

  return (
    <div className="container d-flex justify-content-center align-items-center mb-4" style={{ marginTop: '100px' }}>
      <div className={`card ${product.varastossa && product.quantity > 0 ? 'border-success' : 'border-danger'} rounded`} style={{ maxWidth: '600px', width: '100%' }}>
        {selectedImage ? (
          <div style={{ height: '400px', overflow: 'hidden' }}>
            <img
              src={selectedImage}
              className="card-img-top"
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(event) => {
                event.currentTarget.src = placeholderImage;
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
          <p className="card-text mb-1 border-bottom" style={{ margin: '0 10px' }}>
            <strong>Manufacturer:</strong> {product.manufacturer?.name || 'Unknown'}
          </p>
          <p className="card-text mb-1" style={{ margin: '0 10px' }}>
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
        </div>
        <div className="card-footer" style={{ padding: '0', textAlign: 'center' }}>
          <small className="text-body-secondary" style={{ display: 'block', margin: '10px 0' }}>
            Last Updated: {new Date(product.updated_at).toLocaleString()}
          </small>
        </div>
        <div className="d-flex justify-content-center mb-2">
          {isAuthenticated && (
            <>
              <button
                className="btn btn-primary mt-2 mx-2"
                onClick={() => navigate(`/edit-product/${product._id}`)}
              >
                Edit Product
              </button>
              <button
                className="btn btn-danger mt-2 mx-2"
                onClick={handleDelete}
              >
                Delete Product
              </button>
            </>
          )}
          <button
            className="btn btn-secondary mt-2 mx-2"
            onClick={() => window.history.back()}
          >
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