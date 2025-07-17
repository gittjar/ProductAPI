import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import CreateProduct from './components/CreateProduct';
import EditProduct from './components/EditProduct';
import Navbar from './components/Navbar';
import CreateManufacturer from './components/CreateManufacturer'; // Import CreateManufacturer
import EditManufacturer from './components/EditManufacturer'; // Import EditManufacturer
import ManufacturerList from './components/ManufacturerList'; // Import ManufacturerList

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreateProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-product/:id"
          element={
            <ProtectedRoute>
              <EditProduct />
            </ProtectedRoute>
          }
        />
        {/* Manufacturers Routes */}
        <Route
          path="/manufacturers"
          element={
            <ProtectedRoute>
              <ManufacturerList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manufacturers/create"
          element={
            <ProtectedRoute>
              <CreateManufacturer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manufacturers/edit/:id"
          element={
            <ProtectedRoute>
              <EditManufacturer />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;