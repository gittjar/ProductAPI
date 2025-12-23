import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { isLoggedIn, username, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link className="navbar-brand ml-4" to="/">MyApp</Link>
      <button
        className="navbar-toggler mx-4"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav mr-auto ml-4">
          <li className="nav-item">
            <Link className="nav-link" to="/">Home</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/products">All Products</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/api-viewer">
              <i className="bi bi-code-square me-1"></i>
              API Data
            </Link>
          </li>
          {isLoggedIn && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/create">Create Product</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/my-page">
                  <i className="bi bi-person-circle me-1"></i>
                  My Page
                </Link>
              </li>
              {/* Manufacturers Dropdown */}
              <li className="nav-item dropdown">
                <Link
                  className="nav-link dropdown-toggle"
                  to="#"
                  id="manufacturersDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Manufacturers
                </Link>
                <div className="dropdown-menu" aria-labelledby="manufacturersDropdown">
                  <Link className="dropdown-item" to="/manufacturers">List of Manufacturers</Link>
                  <Link className="dropdown-item" to="/manufacturers/create">Create Manufacturer</Link>
                </div>
              </li>
              {username && (
                <li className="nav-item">
                  <span className="nav-link">Hello, {username}</span>
                </li>
              )}
              <li className="nav-item">
                <button className="btn btn-link nav-link" onClick={handleLogout}>Logout</button>
              </li>
            </>
          )}
          {!isLoggedIn && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/register">Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;