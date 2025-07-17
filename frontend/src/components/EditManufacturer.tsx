import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getManufacturerById, updateManufacturer } from '../services/api';

const EditManufacturer: React.FC = () => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchManufacturer = async () => {
      try {
        if (id) {
          const response = await getManufacturerById(id);
          setName(response.data.name);
        }
      } catch (err) {
        setError('Failed to load manufacturer data.');
      } finally {
        setLoading(false);
      }
    };

    fetchManufacturer();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Manufacturer name is required.');
      return;
    }

    try {
      if (id) {
        await updateManufacturer(id, { name });
        navigate('/manufacturers'); // Redirect to the manufacturers list page
      }
    } catch (err) {
      if ((err as any).response && (err as any).response.data && (err as any).response.data.message) {
        // Use the error message from the backend
        setError((err as any).response.data.message);
      } else {
        setError('Failed to update manufacturer. Please try again.');
      }
    }
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

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: '400px' }}>
        <h1 className="text-center mb-4">Edit Manufacturer</h1>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Manufacturer Name
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
          <div className="d-flex justify-content-between">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => navigate('/manufacturers')}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditManufacturer;
