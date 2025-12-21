import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 4000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'bi-check-circle-fill';
      case 'error':
        return 'bi-exclamation-circle-fill';
      case 'warning':
        return 'bi-exclamation-triangle-fill';
      case 'info':
        return 'bi-info-circle-fill';
      default:
        return 'bi-info-circle-fill';
    }
  };

  const getColor = () => {
    switch (type) {
      case 'success':
        return '#28a745';
      case 'error':
        return '#dc3545';
      case 'warning':
        return '#ffc107';
      case 'info':
        return '#17a2b8';
      default:
        return '#17a2b8';
    }
  };

  const getBackgroundGradient = () => {
    switch (type) {
      case 'success':
        return 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
      case 'error':
        return 'linear-gradient(135deg, #dc3545 0%, #e83e8c 100%)';
      case 'warning':
        return 'linear-gradient(135deg, #ffc107 0%, #fd7e14 100%)';
      case 'info':
        return 'linear-gradient(135deg, #17a2b8 0%, #6f42c1 100%)';
      default:
        return 'linear-gradient(135deg, #17a2b8 0%, #6f42c1 100%)';
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        minWidth: '300px',
        maxWidth: '90vw',
        animation: 'slideInRight 0.3s ease-out',
      }}
    >
      <div
        className="card shadow-lg"
        style={{
          border: 'none',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            background: getBackgroundGradient(),
            padding: '1rem',
            color: 'white',
          }}
        >
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center flex-grow-1">
              <i
                className={`bi ${getIcon()} me-3`}
                style={{ fontSize: '1.5rem' }}
              ></i>
              <span style={{ fontSize: '1rem', fontWeight: '500' }}>
                {message}
              </span>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                fontSize: '1.5rem',
                cursor: 'pointer',
                padding: '0',
                marginLeft: '1rem',
                lineHeight: '1',
              }}
              aria-label="Close"
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
        </div>
        {/* Progress bar */}
        <div
          style={{
            height: '4px',
            background: 'rgba(255, 255, 255, 0.3)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              background: 'white',
              animation: `shrink ${duration}ms linear`,
            }}
          ></div>
        </div>
      </div>

      <style>
        {`
          @keyframes slideInRight {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }

          @keyframes shrink {
            from {
              width: 100%;
            }
            to {
              width: 0%;
            }
          }

          @media (max-width: 576px) {
            .toast-container {
              right: 10px !important;
              left: 10px !important;
              min-width: auto !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Toast;
