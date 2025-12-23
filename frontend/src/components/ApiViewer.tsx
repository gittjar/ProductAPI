import React, { useState, useEffect } from 'react';
import { getProducts } from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import { useToast } from '../contexts/ToastContext';

const ApiViewer: React.FC = () => {
  const [apiData, setApiData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    fetchApiData();
  }, []);

  const fetchApiData = async () => {
    try {
      setLoading(true);
      const response = await getProducts();
      setApiData(response.data);
    } catch (error) {
      console.error('Error fetching API data:', error);
      showError('Failed to fetch API data');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    const jsonString = JSON.stringify(apiData, null, 2);
    navigator.clipboard.writeText(jsonString).then(
      () => {
        setCopied(true);
        showSuccess('JSON data copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
      },
      (err) => {
        console.error('Failed to copy:', err);
        showError('Failed to copy to clipboard');
      }
    );
  };

  const refreshData = () => {
    fetchApiData();
    showSuccess('API data refreshed');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <div className="card shadow-lg">
            <div className="card-header" style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white'
            }}>
              <div className="d-flex justify-content-between align-items-center">
                <h2 className="mb-0">
                  <i className="bi bi-code-square me-2"></i>
                  API JSON Data Viewer
                </h2>
                <div>
                  <button
                    className="btn btn-light btn-sm me-2"
                    onClick={refreshData}
                    title="Refresh data"
                  >
                    <i className="bi bi-arrow-clockwise me-1"></i>
                    Refresh
                  </button>
                  <button
                    className="btn btn-light btn-sm"
                    onClick={copyToClipboard}
                    title="Copy JSON to clipboard"
                  >
                    <i className={`bi ${copied ? 'bi-check-circle-fill text-success' : 'bi-clipboard'} me-1`}></i>
                    {copied ? 'Copied!' : 'Copy JSON'}
                  </button>
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="bg-light border-bottom p-3">
                <div className="d-flex align-items-center justify-content-between flex-wrap">
                  <div className="mb-2 mb-md-0">
                    <strong>Endpoint:</strong>
                    <code className="ms-2 px-2 py-1 bg-white border rounded">
                      GET https://productapi-backend.onrender.com/products
                    </code>
                  </div>
                  <div>
                    <span className="badge bg-success">
                      {apiData ? apiData.length : 0} products
                    </span>
                  </div>
                </div>
              </div>
              
              <div style={{
                maxHeight: '70vh',
                overflowY: 'auto',
                backgroundColor: '#1e1e1e',
                color: '#d4d4d4'
              }}>
                <pre className="m-0 p-4" style={{
                  fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                  fontSize: '13px',
                  lineHeight: '1.5'
                }}>
                  <code style={{ color: '#d4d4d4' }}>
                    {JSON.stringify(apiData, null, 2)}
                  </code>
                </pre>
              </div>
            </div>
            <div className="card-footer bg-light">
              <small className="text-muted">
                <i className="bi bi-info-circle me-1"></i>
                This is the raw JSON response from the API. Use this data format when integrating with your web shop.
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiViewer;
