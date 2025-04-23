import React from 'react';

interface FeedbackModalProps {
  show: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type: 'success' | 'warning'; // Determines the modal style
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ show, onClose, title, message, type }) => {
  if (!show) return null;

  const modalHeaderClass = type === 'success' ? 'bg-success text-white' : 'bg-warning text-dark';

  return (
    <div className="modal fade show d-block" tabIndex={-1} role="dialog" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className={`modal-header ${modalHeaderClass}`}>
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p>{message}</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;