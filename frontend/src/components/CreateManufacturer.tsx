import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addManufacturer } from '../services/api';

const CreateManufacturer: React.FC = () => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Manufacturer name is required.');
      return;
    }

    try {
      await addManufacturer({ name });
      navigate('/manufacturers'); // Redirect to the manufacturers list page
    } catch (err) {
      if ((err as any).response && (err as any).response.data && (err as any).response.data.message) {
        // Use the error message from the backend
        setError((err as any).response.data.message);
      } else {
        setError('Failed to create manufacturer. Please try again.');
      }
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: '400px' }}>
        <h1 className="text-center mb-4">Create new manufacturer</h1>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Set manufacturer name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
              placeholder="Type manufacturer name"
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateManufacturer;