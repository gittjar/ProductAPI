import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, getProducts, changePassword } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { getCurrentUserId } from '../utils/auth';
import LoadingSpinner from './LoadingSpinner';
import 'bootstrap/dist/css/bootstrap.min.css';

interface User {
  _id: string;
  username: string;
  role: string;
}

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  user_id: string;
  manufacturer?: {
    name: string;
  };
}

const MyPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userProducts, setUserProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const currentUserId = getCurrentUserId();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch user info
        const userResponse = await getCurrentUser();
        setUser(userResponse.data);

        // Fetch all products and filter by user
        const productsResponse = await getProducts();
        const myProducts = productsResponse.data.filter(
          (product: Product) => product.user_id === currentUserId
        );
        setUserProducts(myProducts);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isLoggedIn, navigate, currentUserId]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    // Validate password length
    if (newPassword.length < 5) {
      setPasswordError('Password must be at least 5 characters long');
      return;
    }

    // Confirm passwords match
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    setChangingPassword(true);
    try {
      await changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
      setPasswordSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setShowPasswordForm(false);
        setPasswordSuccess('');
      }, 2000);
    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordError(
        (error as any).response?.data?.message || 'Failed to change password'
      );
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading your profile..." />;
  }

  if (!user) {
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-danger">User not found</div>
      </div>
    );
  }

  return (
    <div
      className="min-vh-100"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '40px 20px',
      }}
    >
      <div className="container" style={{ maxWidth: '1200px' }}>
        {/* User Info Card */}
        <div className="card shadow-lg mb-4" style={{ borderRadius: '16px', border: 'none' }}>
          <div className="card-body p-4">
            <div className="d-flex align-items-center mb-4">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center me-3"
                style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
              >
                <i className="bi bi-person-fill text-white" style={{ fontSize: '2.5rem' }}></i>
              </div>
              <div>
                <h2 className="mb-1 fw-bold">{user.username}</h2>
                <span
                  className="badge"
                  style={{
                    background:
                      user.role === 'admin'
                        ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                        : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    fontSize: '0.9rem',
                    padding: '0.5rem 1rem',
                  }}
                >
                  <i className={`bi ${user.role === 'admin' ? 'bi-shield-fill' : 'bi-person-badge'} me-1`}></i>
                  {user.role === 'admin' ? 'Administrator' : 'User'}
                </span>
              </div>
            </div>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            {/* Password Change Section */}
            <div className="mt-4">
              {!showPasswordForm ? (
                <button
                  className="btn btn-outline-primary"
                  onClick={() => setShowPasswordForm(true)}
                >
                  <i className="bi bi-key me-2"></i>
                  Change Password
                </button>
              ) : (
                <div className="card bg-light" style={{ border: 'none' }}>
                  <div className="card-body">
                    <h5 className="card-title mb-3">
                      <i className="bi bi-key me-2"></i>
                      Change Password
                    </h5>

                    {passwordError && (
                      <div className="alert alert-danger alert-dismissible fade show" role="alert">
                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                        {passwordError}
                        <button
                          type="button"
                          className="btn-close"
                          onClick={() => setPasswordError('')}
                        ></button>
                      </div>
                    )}

                    {passwordSuccess && (
                      <div className="alert alert-success" role="alert">
                        <i className="bi bi-check-circle-fill me-2"></i>
                        {passwordSuccess}
                      </div>
                    )}

                    <form onSubmit={handlePasswordChange}>
                      <div className="mb-3">
                        <label className="form-label fw-semibold">Current Password</label>
                        <div className="input-group">
                          <span className="input-group-text bg-white">
                            <i className="bi bi-lock"></i>
                          </span>
                          <input
                            type="password"
                            className="form-control"
                            placeholder="Enter current password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                            disabled={changingPassword}
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-semibold">New Password</label>
                        <div className="input-group">
                          <span className="input-group-text bg-white">
                            <i className="bi bi-lock-fill"></i>
                          </span>
                          <input
                            type="password"
                            className="form-control"
                            placeholder="Enter new password (min 5 characters)"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            minLength={5}
                            disabled={changingPassword}
                          />
                        </div>
                        <small className="text-muted">
                          Password must be at least 5 characters long
                        </small>
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-semibold">Confirm New Password</label>
                        <div className="input-group">
                          <span className="input-group-text bg-white">
                            <i className="bi bi-check-circle"></i>
                          </span>
                          <input
                            type="password"
                            className="form-control"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            minLength={5}
                            disabled={changingPassword}
                          />
                        </div>
                      </div>

                      <div className="d-flex gap-2">
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={changingPassword}
                        >
                          {changingPassword ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2"></span>
                              Changing...
                            </>
                          ) : (
                            <>
                              <i className="bi bi-check-lg me-2"></i>
                              Change Password
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => {
                            setShowPasswordForm(false);
                            setPasswordError('');
                            setPasswordSuccess('');
                            setCurrentPassword('');
                            setNewPassword('');
                            setConfirmPassword('');
                          }}
                          disabled={changingPassword}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* User's Products Card */}
        <div className="card shadow-lg" style={{ borderRadius: '16px', border: 'none' }}>
          <div className="card-body p-4">
            <h3 className="mb-4 fw-bold">
              <i className="bi bi-box-seam me-2" style={{ color: '#667eea' }}></i>
              My Products
              <span className="badge bg-secondary ms-2">{userProducts.length}</span>
            </h3>

            {userProducts.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-inbox" style={{ fontSize: '4rem', color: '#ccc' }}></i>
                <p className="text-muted mt-3">You haven't added any products yet</p>
                <Link to="/create-product" className="btn btn-primary">
                  <i className="bi bi-plus-circle me-2"></i>
                  Add Your First Product
                </Link>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Product Name</th>
                      <th>Category</th>
                      <th>Manufacturer</th>
                      <th>Price</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userProducts.map((product) => (
                      <tr key={product._id}>
                        <td>
                          <Link
                            to={`/product/${product._id}`}
                            className="text-decoration-none fw-semibold"
                            style={{ color: '#667eea' }}
                          >
                            <i className="bi bi-box me-2"></i>
                            {product.name}
                          </Link>
                        </td>
                        <td>
                          <span className="badge bg-light text-dark">
                            {product.category}
                          </span>
                        </td>
                        <td>{product.manufacturer?.name || 'N/A'}</td>
                        <td className="fw-semibold">${Number(product.price).toFixed(2)}</td>
                        <td>
                          <Link
                            to={`/edit-product/${product._id}`}
                            className="btn btn-sm btn-outline-primary me-2"
                          >
                            <i className="bi bi-pencil"></i>
                          </Link>
                          <Link
                            to={`/product/${product._id}`}
                            className="btn btn-sm btn-outline-secondary"
                          >
                            <i className="bi bi-eye"></i>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
