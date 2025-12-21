import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'danger' | 'warning' | 'info';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  type = 'danger',
}) => {
  if (!isOpen) return null;

  const getIconAndColor = () => {
    switch (type) {
      case 'danger':
        return { icon: 'bi-trash-fill', color: '#dc3545', gradient: 'linear-gradient(135deg, #dc3545 0%, #e83e8c 100%)' };
      case 'warning':
        return { icon: 'bi-exclamation-triangle-fill', color: '#ffc107', gradient: 'linear-gradient(135deg, #ffc107 0%, #fd7e14 100%)' };
      case 'info':
        return { icon: 'bi-info-circle-fill', color: '#17a2b8', gradient: 'linear-gradient(135deg, #17a2b8 0%, #6f42c1 100%)' };
      default:
        return { icon: 'bi-trash-fill', color: '#dc3545', gradient: 'linear-gradient(135deg, #dc3545 0%, #e83e8c 100%)' };
    }
  };

  const { icon, color, gradient } = getIconAndColor();

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onCancel}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1040,
          animation: 'fadeIn 0.2s ease-out',
        }}
      ></div>

      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1050,
          width: '90%',
          maxWidth: '500px',
          animation: 'scaleIn 0.3s ease-out',
        }}
      >
        <div
          className="card shadow-lg"
          style={{
            border: 'none',
            borderRadius: '16px',
            overflow: 'hidden',
          }}
        >
          {/* Header with gradient */}
          <div
            style={{
              background: gradient,
              padding: '1.5rem',
              textAlign: 'center',
            }}
          >
            <div
              className="d-inline-flex align-items-center justify-content-center rounded-circle mb-2"
              style={{
                width: '80px',
                height: '80px',
                background: 'rgba(255, 255, 255, 0.2)',
              }}
            >
              <i
                className={`bi ${icon} text-white`}
                style={{ fontSize: '2.5rem' }}
              ></i>
            </div>
            <h4 className="text-white fw-bold mb-0">{title}</h4>
          </div>

          {/* Body */}
          <div className="card-body p-4">
            <p
              className="text-center mb-4"
              style={{
                fontSize: '1.1rem',
                color: '#495057',
              }}
            >
              {message}
            </p>

            {/* Action Buttons */}
            <div className="d-flex gap-2">
              <button
                onClick={onCancel}
                className="btn btn-light flex-fill"
                style={{
                  height: '48px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  borderRadius: '8px',
                  border: '2px solid #e9ecef',
                }}
              >
                <i className="bi bi-x-circle me-2"></i>
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                className="btn text-white flex-fill"
                style={{
                  height: '48px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  borderRadius: '8px',
                  border: 'none',
                  background: gradient,
                }}
              >
                <i className={`bi ${icon} me-2`}></i>
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes scaleIn {
            from {
              transform: translate(-50%, -50%) scale(0.7);
              opacity: 0;
            }
            to {
              transform: translate(-50%, -50%) scale(1);
              opacity: 1;
            }
          }

          @media (max-width: 576px) {
            .modal-card {
              width: 95% !important;
            }
          }
        `}
      </style>
    </>
  );
};

export default ConfirmationModal;
