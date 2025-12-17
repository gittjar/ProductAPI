import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await loginUser({ username, password });
      login(response.data.access_token, username);
      navigate('/');
    } catch (error) {
      console.error('There was an error logging in!', error);
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="d-flex justify-content-center align-items-center" 
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}
    >
      <div className="container" style={{ maxWidth: '450px' }}>
        <div 
          className="card shadow-lg"
          style={{
            borderRadius: '16px',
            border: 'none'
          }}
        >
          <div className="card-body p-4">
            {/* Header */}
            <div className="text-center mb-4">
              <div 
                className="d-inline-flex justify-content-center align-items-center rounded-circle mb-3"
                style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
              >
                <i className="bi bi-box-arrow-in-right text-white" style={{ fontSize: '2.5rem' }}></i>
              </div>
              <h2 className="fw-bold mb-2">Welcome Back</h2>
              <p className="text-muted">Sign in to your account to continue</p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="alert alert-danger alert-dismissible fade show" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error}
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setError('')}
                  aria-label="Close"
                ></button>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Username</label>
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <i className="bi bi-person"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    minLength={3}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <i className="bi bi-lock"></i>
                  </span>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    disabled={loading}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-lg w-100 text-white fw-semibold"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  height: '48px'
                }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Signing In...
                  </>
                ) : (
                  <>
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    Sign In
                  </>
                )}
              </button>
            </form>

            <hr className="my-3" />

            {/* Register Link */}
            <div className="text-center">
              <span className="text-muted">Don't have an account? </span>
              <Link 
                to="/register" 
                className="text-decoration-none fw-semibold"
                style={{ color: '#667eea' }}
              >
                Create Account
              </Link>
            </div>

            {/* Info Card */}
            <div 
              className="mt-3 p-3 rounded"
              style={{ background: '#f6f8fb' }}
            >
              <p className="mb-1 fw-semibold" style={{ color: '#667eea', fontSize: '0.9rem' }}>
                <i className="bi bi-shield-lock me-2"></i>
                Secure Login
              </p>
              <p className="mb-0 text-muted" style={{ fontSize: '0.85rem' }}>
                Your credentials are encrypted and secure. We never share your personal information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;